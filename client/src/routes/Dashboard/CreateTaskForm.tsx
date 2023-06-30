
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useTasks from '../../hooks/useTasks';

export default function CreateTaskForm() {
  const {
    validator,
    createTask
  } = useTasks();

  return (
    <>
    <div className='pageCenterContainer'>
      <Form aria-label='form' noValidate validated={validator.validated} onSubmit={createTask}> 
        <h2> Create Task </h2>
        <Form.Group className='mb-3' controlId='formTitle'>
          <Form.Label>Title</Form.Label>
          <Form.Control type='text' name='title' required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Description</Form.Label>
          <Form.Control type='text' name='description' required />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formDescription'>
          <Form.Label>Due Date</Form.Label>
          <Form.Control type='date' name='dueDate' required />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
    </>
  )  
}