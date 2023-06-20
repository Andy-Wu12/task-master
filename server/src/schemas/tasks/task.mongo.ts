import mongoose from 'mongoose';

interface Task {
  id: number,
  title: string,
  description: string,
  status: string,
  dueDate: string,
  creatorId: number
}

const taskSchema = new mongoose.Schema<Task>({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    default: new Date().toISOString(),
    required: true
  },
  creatorId: {
    type: Number,
    required: true
  },
});

const Tasks = mongoose.model<Task>('task', taskSchema);

export default Tasks;

export type {
  Task
}