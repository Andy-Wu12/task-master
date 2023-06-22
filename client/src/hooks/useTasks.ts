import { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    const username = JSON.parse(sessionStorage.getItem('user')!).username;

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

    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/graphql`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/graphql'
      },
      body: queryBody
    });

    const json = await response.json();
    setTasks(json.data.tasksForUser);
  }

  return {
    userTasks,
    fetchUserTasks
  }
}

export {
  TaskStatus
}

export type {
  Task
}