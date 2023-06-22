import TaskModel from "./task.model";

import type { Task } from "./task.mongo";
import type { TaskUpdateArgs } from "./task.model";
import UserModel from "../users/user.model";

type CreateTaskArgs = {
  title: string,
  description: string,
  dueDate: string,
  creatorName: string
}

const taskResolvers = {
  Query: {
    tasks: async () => {
      return await TaskModel.getAllTasks();
    },
    
    tasksForUser: async (_: unknown, args: { username: string, filter: string | null }) => {
      const { username, filter } = args;

      return await TaskModel.getTasksByUsername(username, filter);
    }
  },

  Mutation: {
    createTask: async (_: unknown, args: CreateTaskArgs) => {
      const { title, description, dueDate, creatorName } = args;

      const response = await TaskModel.createTask(title, description, dueDate, creatorName);

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