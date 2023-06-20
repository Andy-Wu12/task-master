import Users from '../users/users.mongo';
import Tasks from './task.mongo';

import type { Task } from './task.mongo'

const DEFAULT_LATEST_TASK_ID = -1;

async function getLatestTaskNumber(): Promise<number> {
  const latestTask = await Tasks.findOne().sort('-id');

  if(!latestTask) {
    return DEFAULT_LATEST_TASK_ID;
  }

  return latestTask.id;
}

async function saveTask(task: Task): Promise<Task | null> {
  return await Tasks.findOneAndUpdate({
    id: task.id
  }, task, {
    upsert: true
  })
}

async function createTask(title: string, description: string, dueDate: string, creatorId: number): Promise<Task | null> {
  const user = await Users.findOne({id: creatorId});

  if(!user) {
    return null;
  }
  
  const newTask: Task = {
    id: await getLatestTaskNumber() + 1,
    title: title,
    description: description,
    dueDate: dueDate,
    creatorId: creatorId,
    status: 'In-Progress'
  }

  try {
    await saveTask(newTask);
  } catch(e: any) {
    console.log('error creating task');
    return null;
  }

  return newTask;
}

async function getTasksByUser(userId: number, filter: string | null = null): Promise<Task[]> {
  return await Tasks.find({creatorId: userId}).sort(filter);
}

async function deleteTask(id: number): Promise<Task | null> {
  return await Tasks.findOneAndDelete({id: id})
}

async function editTask(task: Task): Promise<Task | null> {
  return await saveTask(task);

}

const TaskModel = {
  getTasksByUser,
  createTask,
  deleteTask,
  editTask,
}

export default TaskModel;
