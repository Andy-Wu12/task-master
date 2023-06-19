import userType from "./user.graphql";
import userResolvers from "./user.resolver";

const UserModule = {
  typeDef: userType,
  resolvers: userResolvers
}

export default UserModule;
