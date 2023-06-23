import type { FormEventHandler } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { TaskStatus } from '../../../hooks/useTasks';
import type { Task } from '../../../hooks/useTasks';

interface EditTaskProps {
  task: Task,
  updateTask: FormEventHandler
}

export default function EditTaskForm({task, updateTask}: EditTaskProps) {

  return (
    <>
      <Form aria-label='form' noValidate validated={true} onSubmit={updateTask}> 
        <Form.Group className='mb-3' controlId='formTitle'>
          <Form.Label>Title</Form.Label>
          <Form.Control type='text' name='title' defaultValue={task.title} required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Description</Form.Label>
          <Form.Control type='text' name='description' defaultValue={task.description} required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Due Date</Form.Label>
          <Form.Control type='date' name='dueDate' defaultValue={task.dueDate} required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='form'>
          <p>Task is currently <span style={{fontWeight: 'bolder'}}>{task.status}</span></p>
          Is it still completed? <label htmlFor={`checkbox-input-${task.id}`}></label>
          <input name='status' id={`checkbox-input-${task.id}`} type='checkbox' defaultChecked={task.status === TaskStatus.COMPLETED} /> &nbsp;
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </>
  )  
}