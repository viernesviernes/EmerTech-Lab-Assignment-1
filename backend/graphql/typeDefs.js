const typeDefs = `#graphql
  type Admin {
    _id: ID!
    username: String!
  }

  type Student {
    _id: ID
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
    _id: ID
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
    studentCourses(studentId: ID!): [Course]
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

    signInAdmin(username: String!, password: String!): Admin
    signInStudent(username: String!, password: String!): Student

    enrollCourse(studentId: ID!, code: Int!, section: Int!): Course
    changeSection(studentId: ID!, courseCode: Int!, section: Int!): Course
    dropCourse(studentId: ID!, code: Int!, section: Int!): Course
  }
`;

module.exports = typeDefs;