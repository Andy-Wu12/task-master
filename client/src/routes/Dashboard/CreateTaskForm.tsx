import type { FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function CreateTaskForm() {
  const submitTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <>
    <div className='pageCenterContainer'>
      <Form aria-label='form' noValidate onSubmit={submitTask}> 
        <h2> Create Task </h2>
        <Form.Group className='mb-3' controlId='formTitle'>
          <Form.Label>Title</Form.Label>
          <Form.Control type='text' name='title' required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Description</Form.Label>
          <Form.Control type='text' name='description' />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Due Date</Form.Label>
          <Form.Control type='date' name='dueDate' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
    </>
  )  
}