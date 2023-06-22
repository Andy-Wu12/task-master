import { useState, useEffect } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
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

    /// TODO: Move to custom hook
    const fetchUserTasks = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/graphql`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/graphql'
        },
        body: queryBody
      });

      const json = await response.json();
      setTasks(json.tasksForUser)
    }

    fetchUserTasks();
  }, []);

  return (
    <>

    </>
  )
}

