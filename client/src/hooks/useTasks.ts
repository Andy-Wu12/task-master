import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/authContext';

import { queryGraphQL } from './requests';

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

export default function useTasks() {
  // Reduce code duplication by figuring out way to share type defs between client / server codebases
  const [userTasks, setTasks] = useState<Task[]>([]);

  const authContext = useContext(AuthContext);
  const username = authContext.user?.username;

  useEffect(() => {
    fetchUserTasks();
  }, []);

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
  }, []);

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
    console.log(json);
  }, []);

  return {
    userTasks,
    createTask,
    fetchUserTasks,
  }
}

export {
  TaskStatus
}

export type {
  Task
}