import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/authContext';

import { queryGraphQL } from './requests';
import useFormValidator from './useFormValidator';

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
  const validator = useFormValidator();

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

  const createTask = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = validator.validateForm(event);

    if(form === null) {
      return;
    }

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
      }
    }`;

    await queryGraphQL(queryBody);
    // const json = await response.json();
    navigate('/dashboard/tasks');

  }, [username, navigate]);

  const updateTask = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = validator.validateForm(event);

    if(form === null) {
      return;
    }
    
    const data = new FormData(event.currentTarget);
    const id = data.get('id');
    const title = data.get('title');
    const desc = data.get('description');
    const dueDate = data.get('dueDate');
    const status = data.get('status');
    
    const queryBody = `mutation {
      updateTask(newData: {
        id: ${id}
        title: "${title}"
        description: "${desc}"
        status: "${status === 'on' ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS }"
        dueDate: "${dueDate}" 
      }) {
        title
        description
        status
        dueDate
      }
    }`;

    await queryGraphQL(queryBody);
    await fetchUserTasks();
    
  }, []);

  const deleteTask = useCallback(async (taskId: number) => {
    const queryBody = `mutation {
      deleteTask(id: ${taskId}) {
        title
        description
        status
        dueDate
        creatorId
      }
    }`;

    await queryGraphQL(queryBody);
    await fetchUserTasks();
    
  }, [fetchUserTasks]);

  const sortTasksByProperty = useCallback((property: SortOptions) => {
    const compareString = (task1: Task, task2: Task) => {
      if(task1[property] > task2[property]) {
        return 1;
      } else if(task1[property] < task2[property]) {
        return -1;
      } 
      return 0;
    }

    // Scalable alternative for this function could just be to group by status instead of defining a sort order
    const compareStatus = (task1: Task, task2: Task) => {
      if(task1.status === task2.status) {
        return 0;
      } else if(task1.status === TaskStatus.COMPLETED) {
        // Completed tasks come AFTER all in-progress ones
        return 1
      }
      return -1;
    }

    const compareDueDate = (task1: Task, task2: Task) => {
      const date1 = Date.parse(task1.dueDate);
      const date2 = Date.parse(task2.dueDate);

      if(date1 > date2) {
        return 1;
      } else if(date1 < date2) {
        return -1;
      }
      return 0;
    }

    const compareFunctions = {
      "title": compareString,
      "status": compareStatus,
      "dueDate": compareDueDate,
    }

    setTasks(userTasks.sort(compareFunctions[property]));
    navigate('/dashboard/tasks');
    
  }, [userTasks, navigate]);

  return {
    validator,
    userTasks,
    createTask,
    fetchUserTasks,
    updateTask,
    deleteTask,
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