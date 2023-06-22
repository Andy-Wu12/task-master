import mongoose from 'mongoose';

interface Task {
  id: number,
  title: string,
  description: string,
  status: TaskStatus,
  dueDate: string,
  creatorId: number
}

enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
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
    default: TaskStatus.IN_PROGRESS,
    enum: Object.values(TaskStatus),
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

export {
  TaskStatus
}

export type {
  Task,
}