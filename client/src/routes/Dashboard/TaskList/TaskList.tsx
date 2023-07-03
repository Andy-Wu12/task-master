import { useState } from 'react';
import type { FormEventHandler, MouseEvent } from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import useTasks, { TaskStatus } from "../../../hooks/useTasks"
import type { SortOptions, Task } from '../../../hooks/useTasks';

import './TaskList.css';
import TaskSortOption from './SortButton';
import EditTaskModal from '../EditTask/EditTaskModal';

export default function TaskList() {
  const {
    userTasks,
    sortTasksByProperty,
    updateTask,
    deleteTask
  } = useTasks();

  function sortOnChange(event: React.ChangeEvent<HTMLSelectElement>) {
    sortTasksByProperty(event.currentTarget.value as SortOptions);
  }

  return (
    <>
      <TaskSortOption onChange={sortOnChange} />
      <div className='taskList'>
        {userTasks.map((task: Task) => {
          return (
            <div key={task.id}> 
              <TaskListItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
            </div>
          )
        })}
      </div>
    </>
  )
}

interface TaskListItemProps {
  task: Task,
  updateTask: FormEventHandler,
  deleteTask: (taskId: number) => Promise<void>
}

function TaskListItem({task, updateTask, deleteTask}: TaskListItemProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    id,
    title,
    description,
    status,
    dueDate,
    // creatorId
  } = task;

  const handleDeleteClick = async (_: MouseEvent<HTMLButtonElement>) => {
    await deleteTask(id);
  }

  const handleEditClick = () => {
    setShowModal(true);
  }

  const handleHideModal = () => {
    setShowModal(false);
  }

  return (
    <div className='taskListItem'>
      <Card bg='dark' style={{width: '50vw'}}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <Card.Text>Due {dueDate}</Card.Text>
          <input id={`checkbox-${id}`} type='checkbox' checked={status === TaskStatus.COMPLETED} readOnly /> &nbsp;
          <label htmlFor={`checkbox-${id}`}>{status}</label>
        </Card.Body>
        <Button variant='info' onClick={handleEditClick}>Edit</Button>
        <Button variant='danger' onClick={handleDeleteClick}>Delete</Button>
      </Card>

      <EditTaskModal show={showModal} onHide={handleHideModal} task={task} updateTask={updateTask} />
    </div>
  )
}
