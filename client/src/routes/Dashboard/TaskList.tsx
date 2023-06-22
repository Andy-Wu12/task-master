import useTasks, { TaskStatus } from "../../hooks/useTasks"

import type { Task } from '../../hooks/useTasks';

import Checkbox from 'react-bootstrap/FormCheck';

export default function TaskList() {
  const {
    userTasks
  } = useTasks();

  return (
    <>
      {userTasks.map((task: Task) => {
        return <ol key={task.id}> <TaskListItem task={task} /> <br/> </ol>
      })}
    </>
  )
}

interface TaskListItemProps {
  task: Task
}

function TaskListItem({task}: TaskListItemProps) {
  const {
    id,
    title,
    description,
    status,
    dueDate,
    creatorId
  } = task;

  return (
    <>
      <div className='task-list-item'>
        <h2>{title}</h2>
        <h3>{description}</h3>
        <Checkbox label={status} checked={status === TaskStatus.COMPLETED} readOnly/>
      </div>
    </>
  )
}
