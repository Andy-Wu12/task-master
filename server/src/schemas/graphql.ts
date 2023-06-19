import { createSchema } from "graphql-yoga";

import UserModule from "./users/user.module";

const schema = createSchema({
  typeDefs: [
    UserModule.typeDef,
  ],
  resolvers: [
    UserModule.resolvers,
  ]
});

export {
  schema
}