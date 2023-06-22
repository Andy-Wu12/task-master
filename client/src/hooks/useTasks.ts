import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/authContext';

import { queryGraphQL } from './requests';

// Reduce code duplication by figuring out way to share type defs between client / server codebases
interface Task {
  id: number,
  title: string,
  description: string,
  status: TaskStatus,
  dueDate: string,
  creatorId: number
}

enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

type SortOptions = "title" | "status" | "dueDate";

export default function useTasks() {
  const [userTasks, setTasks] = useState<Task[]>([]);
  
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const username = authContext.user?.username;

  const fetchUserTasks = useCallback(async () => {
    const queryBody = `query {
      tasksForUser(username: "${username}") {
        id
        title
        description
        status
        dueDate
        creatorId
      }
    }`

    const response = await queryGraphQL(queryBody);

    const json = await response.json();
    setTasks(json.data.tasksForUser);
  }, [username]);

  // Initial fetching of tasks
  useEffect(() => {
    fetchUserTasks();
  }, [username, fetchUserTasks]);

  // Re-render when tasks updated (usually by sort function)
  useEffect(() => {

  }, [userTasks]);

  const createTask = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const data = new FormData(event.currentTarget);
    const title = data.get('title');
    const desc = data.get('description');
    const dueDate = data.get('dueDate');

    const queryBody = `mutation {
      createTask(
        title: "${title}",
        description: "${desc}",
        dueDate: "${dueDate}",
        creatorName: "${username}"
      ) {
        title
        description
        status
        dueDate
        creatorId
      }
    }`;

    const response = await queryGraphQL(queryBody);
    const json = await response.json();

  }, [username]);

  const sortTasksByProperty = useCallback((property: SortOptions) => {
    console.log(`sorting with key ${property}`);
    const compareFn = (task1: Task, task2: Task) => {
      if(task1[property] > task2[property]) {
        return 1;
      } else if(task1[property] < task2[property]) {
        return -1;
      } 
      return 0;
    };

    setTasks(userTasks.sort(compareFn));
    navigate('/dashboard/tasks');
    
  }, [userTasks]);

  return {
    userTasks,
    createTask,
    fetchUserTasks,
    sortTasksByProperty
  }
}

export {
  TaskStatus
}

export type {
  Task,
  SortOptions
}