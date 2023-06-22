import Card from 'react-bootstrap/Card';

import useTasks, { TaskStatus } from "../../../hooks/useTasks"
import type { Task } from '../../../hooks/useTasks';

import './TaskList.css';

export default function TaskList() {
  const {
    userTasks
  } = useTasks();

  return (
    <>
      <div className='taskList'>
        {userTasks.map((task: Task) => {
          return <TaskListItem key={task.id} task={task} />
        })}
      </div>
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
    <div className='taskListItem'>
      <Card bg='dark' style={{width: '50vw'}}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <input id={`checkbox-${id}`} type='checkbox' checked={status === TaskStatus.COMPLETED} readOnly /> &nbsp;
          <label htmlFor={`checkbox-${id}`}>{status}</label>
        </Card.Body>
      </Card>
    </div>
  )
}
