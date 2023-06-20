import TaskModel from "./task.model";

import type { Task } from "./task.mongo";
import type { TaskUpdateArgs } from "./task.model";

type CreateTaskArgs = {
  title: string,
  description: string,
  dueDate: string,
  creatorId: number
}

const taskResolvers = {
  Query: {
    tasks: async () => {
      return await TaskModel.getAllTasks();
    },
    
    tasksForUser: async (_: unknown, args: { userId: number, filter: string | null }) => {
      const { userId, filter } = args;
      return await TaskModel.getTasksByUser(userId, filter);
    }
  },

  Mutation: {
    createTask: async (_: unknown, args: CreateTaskArgs) => {
      const { title, description, dueDate, creatorId } = args;

      const response = await TaskModel.createTask(title, description, dueDate, creatorId);

      return response;
    },

    updateTask: async (_: unknown, args: { newData: TaskUpdateArgs }) => {
      const { newData } = args;
      return await TaskModel.editTask(newData);
    },

    deleteTask: async (_: unknown, args: { id: number }) => {
      const { id } = args;
      return await TaskModel.deleteTask(id);
    }
  }
}

export default taskResolvers;