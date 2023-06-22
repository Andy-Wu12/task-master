import Users from '../users/users.mongo';
import Tasks from './task.mongo';

import { Task, TaskStatus } from './task.mongo'

const DEFAULT_LATEST_TASK_ID = -1;

type TaskUpdateArgs = {
  id: number,
  title?: string,
  description?: string,
  status?: TaskStatus,
  dueDate?: string,
}

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

async function createTask(title: string, description: string, dueDate: string, creatorName: string): Promise<Task | null> {
  const user = await Users.findOne({username: creatorName});

  if(!user) {
    return null;
  }
  
  const newTask: Task = {
    id: await getLatestTaskNumber() + 1,
    title: title,
    description: description,
    dueDate: dueDate,
    creatorId: user.id,
    status: TaskStatus.IN_PROGRESS
  }

  try {
    await saveTask(newTask);
  } catch(e: any) {
    console.log('error creating task');
    return null;
  }

  return newTask;
}

async function getAllTasks(): Promise<Task[]> {
  return await Tasks.find({}).lean();
}

async function getTaskById(id: number): Promise<Task | null> {
  return await Tasks.findOne({id: id}).lean();
}

async function getTasksByUserId(userId: number, filter: string | null = null): Promise<Task[]> {
  return await Tasks.find({creatorId: userId}).lean().sort(filter);
}

async function getTasksByUsername(username: string, filter: string | null = null): Promise<Task[]> {
  const user = await Users.findOne({username: username});
  if(user) {
    return await getTasksByUserId(user.id);
  }

  return [];
}

async function deleteTask(id: number): Promise<Task | null> {
  return await Tasks.findOneAndDelete({id: id})
}

async function editTask(task: TaskUpdateArgs): Promise<Task | null> {
  let taskData: Task | null = await TaskModel.getTaskById(task.id);
  
  if(!taskData) {
    return null;
  }

  taskData = {...taskData, ...task};
  await saveTask(taskData);

  return taskData;
}

const TaskModel = {
  getAllTasks,
  getTaskById,
  getTasksByUserId,
  getTasksByUsername,
  createTask,
  deleteTask,
  editTask,
}

export default TaskModel;

export type {
  TaskUpdateArgs
}