
const taskType = /* GraphQL */ `
  type Query {
    tasks: [Task!]!,
    tasksForUser(username: String!, filter: String): [Task!]!
  }

  type Mutation {
    createTask(
      title: String!,
      description: String!,
      dueDate: String!,
      creatorName: String!
    ): Task,
    updateTask(newData: TaskUpdateInput!): Task,
    deleteTask(id: ID!): Task
  }

  input TaskUpdateInput {
    id: Int!,
    title: String,
    description: String,
    status: String,
    dueDate: String,
  }

  type Task {
    id: Int!,
    title: String!,
    description: String!,
    status: TaskStatus!,
    dueDate: String!,
    creatorId: Int!
  }

  enum TaskStatus {
    IN_PROGRESS,
    COMPLETED
  }
`

export default taskType;
