import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import type { MouseEvent, MouseEventHandler } from 'react';

import './Nav.css';

export default function Navbar() {
  return (
    <>
      <div className="navbarContainer">
        <CreateTaskButton />
        <ReadTasksButton />
      </div>
    </>
  )
}

type NavButtonProps = {
  text: string,
  onClick: MouseEventHandler,
  type: 'button' | 'submit' | 'reset'
}

function NavButton(props: NavButtonProps) {
  const { text, onClick, type } = props;

  return (
    <Button variant='primary' type={type} onClick={onClick} className='navButton'>
      {text}
    </Button>
  )
}

function CreateTaskButton() {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('create-task');
  };

  return (
    <NavButton type='button' onClick={handleClick} text={"Create task"} />
  )
}

// Update and delete buttons should be on this route for each individual task
function ReadTasksButton() {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('tasks');
  };

  return (
    <NavButton type='button' onClick={handleClick} text={"My tasks"} />
  ) 
}