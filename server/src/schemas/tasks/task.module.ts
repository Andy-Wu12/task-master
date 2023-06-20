import taskResolvers from "./task.resolver";
import taskType from "./task.graphql";

const taskModule = {
  typeDef: taskType,
  resolvers: taskResolvers
}

export default taskModule;
