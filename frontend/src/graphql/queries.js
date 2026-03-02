import { gql } from '@apollo/client';

// --- Admin: Students ---
export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      _id
      studentNumber
      firstName
      lastName
      username
      address
      city
      phoneNumber
      email
      program
      yearOfStudy
      gpa
    }
  }
`;

export const ADD_STUDENT = gql`
  mutation AddStudent($studentNumber: Int!, $firstName: String!, $lastName: String!, $username: String!, $password: String!, $email: String!, $address: String!, $city: String!, $phoneNumber: String!, $program: String!, $yearOfStudy: Int!, $gpa: Float!) {
    addStudent(studentNumber: $studentNumber, firstName: $firstName, lastName: $lastName, username: $username, password: $password, email: $email, address: $address, city: $city, phoneNumber: $phoneNumber, program: $program, yearOfStudy: $yearOfStudy, gpa: $gpa) {
      _id
      studentNumber
      firstName
      lastName
      username
      address
      city
      phoneNumber
      email
      program
      yearOfStudy
      gpa
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation EditStudent($id: ID!, $studentNumber: Int, $firstName: String, $lastName: String, $username: String, $email: String, $address: String, $city: String, $phoneNumber: String, $program: String, $yearOfStudy: Int, $gpa: Float) {
    editStudent(id: $id, studentNumber: $studentNumber, firstName: $firstName, lastName: $lastName, username: $username, email: $email, address: $address, city: $city, phoneNumber: $phoneNumber, program: $program, yearOfStudy: $yearOfStudy, gpa: $gpa) {
      _id
      studentNumber
      firstName
      lastName
      username
      address
      city
      phoneNumber
      email
      program
      yearOfStudy
      gpa
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;

// --- Admin: Courses ---
export const GET_COURSES = gql`
  query GetCourses {
    courses {
      _id
      id
      code
      name
      section
      semester
      students {
        _id
        studentNumber
        firstName
        lastName
        email
      }
    }
  }
`;

export const ADD_COURSE = gql`
  mutation AddCourse($code: Int!, $name: String!, $section: Int!, $semester: Int!) {
    addCourse(code: $code, name: $name, section: $section, semester: $semester) {
      _id
      id
      code
      name
      section
      semester
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation EditCourse($id: ID!, $code: Int, $name: String, $section: Int, $semester: Int) {
    editCourse(id: $id, code: $code, name: $name, section: $section, semester: $semester) {
      _id
      id
      code
      name
      section
      semester
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

// --- Student: My courses ---
export const GET_STUDENT_COURSES = gql`
  query GetStudentCourses($studentId: ID!) {
    studentCourses(studentId: $studentId) {
      id
      code
      name
      section
      semester
    }
  }
`;

export const ENROLL_COURSE = gql`
  mutation EnrollCourse($studentId: ID!, $code: Int!, $section: Int!) {
    enrollCourse(studentId: $studentId, code: $code, section: $section) {
      id
      code
      name
      section
      semester
    }
  }
`;

export const CHANGE_SECTION = gql`
  mutation ChangeSection($studentId: ID!, $courseCode: Int!, $section: Int!) {
    changeSection(studentId: $studentId, courseCode: $courseCode, section: $section) {
      id
      code
      name
      section
      semester
    }
  }
`;

export const DROP_COURSE = gql`
  mutation DropCourse($studentId: ID!, $code: Int!, $section: Int!) {
    dropCourse(studentId: $studentId, code: $code, section: $section) {
      id
      code
    }
  }
`;

// --- Auth ---
export const SIGN_IN_ADMIN = gql`
  mutation SignInAdmin($username: String!, $password: String!) {
    signInAdmin(username: $username, password: $password) {
      _id
      username
    }
  }
`;

export const SIGN_IN_STUDENT = gql`
  mutation SignInStudent($username: String!, $password: String!) {
    signInStudent(username: $username, password: $password) {
      _id
      username
      studentNumber
    }
  }
`;
