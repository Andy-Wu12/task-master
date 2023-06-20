
const userType = /* GraphQL */ `
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    signup(username: String!, password: String!): AuthResult!
    login(username: String!, password: String!): AuthResult!
    deleteUser(id: ID!): User
  }
  
  type User {
    id: ID!,
    username: String!,
  }

  type UserError {
    error: AuthFormError!
  }

  type AuthFormError {
    username: String,
    password: String
  }

  type UserToken {
    token: String,
    user: User
  }

  union AuthResult = User | UserToken | UserError
`

export default userType;