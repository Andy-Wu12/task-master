import { createSchema } from "graphql-yoga";

import UserModule from "./users/user.module";
import TaskModule from "./tasks/task.module";

const schema = createSchema({
  typeDefs: [
    UserModule.typeDef,
    TaskModule.typeDef
  ],
  resolvers: [
    UserModule.resolvers,
    TaskModule.resolvers
  ]
});

export {
  schema
}