import type { FormEventHandler } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import EditTaskForm from './EditTaskForm';
import type { Task } from '../../../hooks/useTasks';

interface ModalProps {
  show: boolean,
  onHide: () => void,
  task: Task,
  updateTask: FormEventHandler
}

export default function EditTaskModal({show, onHide, task, updateTask}: ModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Edit Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditTaskForm task={task} updateTask={updateTask}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
