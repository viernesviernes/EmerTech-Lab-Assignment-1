const typeDefs = `#graphql
  type Student {
    id: ID!
    studentNumber: Int!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    address: String!
    city: String!
    phoneNumber: String!
    program: String!
    yearOfStudy: Int!
    gpa: Float!
  }

  type Course {
    id: ID!
    code: Int!
    name: String!
    section: Int!
    semester: Int!
    students: [Student]
  }

  type Query {
    students: [Student]
    courses: [Course]
  }

  type Mutation {
    addStudent(
      studentNumber: Int!,
      firstName: String!,
      lastName: String!,
      username: String!,
      password: String!,
      email: String!,
      address: String!,
      city: String!,
      phoneNumber: String!,
      program: String!,
      yearOfStudy: Int!,
      gpa: Float!
    ): Student

    addCourse(
      code: Int!,
      name: String!,
      section: Int!,
      semester: Int!
    ): Course

    editStudent(
      id: ID!,
      studentNumber: Int,
      firstName: String,
      lastName: String,
      username: String,
      email: String,
      address: String,
      city: String,
      phoneNumber: String,
      program: String,
      yearOfStudy: Int,
      gpa: Float
    ): Student

    deleteStudent(id: ID!): Boolean

    editCourse(
      id: ID!,
      code: Int,
      name: String,
      section: Int,
      semester: Int
    ): Course

    deleteCourse(id: ID!): Boolean
  }
`;

module.exports = typeDefs;