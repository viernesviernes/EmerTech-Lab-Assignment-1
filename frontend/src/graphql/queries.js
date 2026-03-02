import { gql } from '@apollo/client';

// Queries
export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      _id
      name
      email
      courses {
        code
        name
      }
    }
  }
`;

export const GET_COURSES = gql`
  query GetCourses {
    courses {
      code
      name
      section
      semester
    }
  }
`;

// Mutations
export const ADD_STUDENT = gql`
  mutation AddStudent($input: StudentInput!) {
    addStudent(input: $input) {
      _id
      name
      email
    }
  }
`;

export const EDIT_STUDENT = gql`
  mutation EditStudent($id: ID!, $input: StudentInput!) {
    editStudent(id: $id, input: $input) {
      _id
      name
      email
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      _id
    }
  }
`;

export const ADD_COURSE = gql`
  mutation AddCourse($input: CourseInput!) {
    addCourse(input: $input) {
      code
      name
    }
  }
`;

export const EDIT_COURSE = gql`
  mutation EditCourse($code: Int!, $input: CourseInput!) {
    editCourse(code: $code, input: $input) {
      code
      name
    }
  }
`;