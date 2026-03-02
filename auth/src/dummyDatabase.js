const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON
app.use(express.json());

// Middleware to simulate authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.split('-')[4]; // Extract user ID from the fake token

  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user; // Attach user to the request object
  next();
};

// Define the Student class
class Student {
  constructor(studentNumber, password, firstName, lastName, address, city, phoneNumber, email, program, favoriteTopic, strongestSkill) {
    this.studentNumber = studentNumber;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.program = program;
    this.favoriteTopic = favoriteTopic;
    this.strongestSkill = strongestSkill;
  }
}

// Updated students array
let students = [
  new Student('S001', 'pass123', 'John', 'Doe', '123 Main St', 'Springfield', '123-456-7890', 'john.doe@example.com', 'Computer Science', 'Artificial Intelligence', 'JavaScript'),
  new Student('S002', 'pass456', 'Jane', 'Smith', '456 Elm St', 'Shelbyville', '987-654-3210', 'jane.smith@example.com', 'Information Technology', 'Databases', 'Python')
];

// Dummy user database
const users = [
  { id: 1, username: 'admin', password: 'password123' },
  { id: 2, username: 'user1', password: 'password456' },
];

// Course class
class Course {
  constructor(courseCode, courseName, section, semester, students) {
    this.courseCode = courseCode;
    this.courseName = courseName;
    this.section = section;
    this.semester = semester;
    this.students = students; // Array of student numbers
  }
}

// Updated courses array
let courses = [
  new Course('CS101', 'Introduction to Computer Science', 'A', 'Fall 2025', ['S001']),
  new Course('CS102', 'Data Structures', 'B', 'Spring 2026', ['S001']),
  new Course('IT201', 'Networking Basics', 'A', 'Fall 2025', ['S002']),
  new Course('IT202', 'Database Management', 'B', 'Spring 2026', ['S002']),
  new Course('CS103', 'Algorithms', 'A', 'Fall 2025', ['S001', 'S002']),
];

// Create a new student
app.post('/students', (req, res) => {
  const { studentNumber, password, firstName, lastName, address, city, phoneNumber, email, program, favoriteTopic, strongestSkill } = req.body;

  // Validate input
  if (!studentNumber || !password || !firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newStudent = new Student(studentNumber, password, firstName, lastName, address, city, phoneNumber, email, program, favoriteTopic, strongestSkill);
  students.push(newStudent);
  res.status(201).json({ message: 'Student created successfully', student: newStudent });
});

// Edit an existing student
app.put('/students/:studentNumber', (req, res) => {
  const { studentNumber } = req.params;
  const student = students.find((s) => s.studentNumber === studentNumber);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const { password, firstName, lastName, address, city, phoneNumber, email, program, favoriteTopic, strongestSkill } = req.body;

  // Update student fields
  if (password) student.password = password;
  if (firstName) student.firstName = firstName;
  if (lastName) student.lastName = lastName;
  if (address) student.address = address;
  if (city) student.city = city;
  if (phoneNumber) student.phoneNumber = phoneNumber;
  if (email) student.email = email;
  if (program) student.program = program;
  if (favoriteTopic) student.favoriteTopic = favoriteTopic;
  if (strongestSkill) student.strongestSkill = strongestSkill;

  res.json({ message: 'Student updated successfully', student });
});

// Delete a student
app.delete('/students/:studentNumber', (req, res) => {
  const { studentNumber } = req.params;
  const studentIndex = students.findIndex((s) => s.studentNumber === studentNumber);

  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const deletedStudent = students.splice(studentIndex, 1);
  res.json({ message: 'Student deleted successfully', student: deletedStudent[0] });
});

// Read all students
app.get('/students', (req, res) => {
  res.json(students);
});

// Read a single student by ID
app.get('/students/:id', (req, res) => {
  const student = students.find((s) => s.studentNumber === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

// Update a student by ID
app.put('/students/:id', (req, res) => {
  const student = students.find((s) => s.studentNumber === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  Object.assign(student, req.body);
  res.json(student);
});

// Delete a student by ID
app.delete('/students/:id', (req, res) => {
  const studentIndex = students.findIndex((s) => s.id === parseInt(req.params.id));
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const deletedStudent = students.splice(studentIndex, 1);
  res.json(deletedStudent);
});

// Login route for students
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const student = students.find((s) => s.studentNumber === username && s.password === password);

  if (!student) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    student: {
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      address: student.address,
      city: student.city,
      phoneNumber: student.phoneNumber,
      email: student.email,
      program: student.program,
      customField1: student.customField1,
      customField2: student.customField2
    }
  });
});

// ...existing code...

// Alias route to match AdminLogin
app.post('/signin/admin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user });
});

// ...existing code...

// Protected route example
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!`, user: req.user });
});

// Route to list all courses for a specific student
app.get('/students/:studentNumber/courses', (req, res) => {
  const { studentNumber } = req.params;
  const studentCourses = courses.filter((course) => course.students.includes(studentNumber));

  if (studentCourses.length === 0) {
    return res.status(404).json({ error: 'No courses found for this student' });
  }

  res.json(studentCourses);
});

// Get all courses
app.get('/courses', (req, res) => {
  res.json(courses);
});

// Route to add a new course
app.post('/courses', (req, res) => {
  const { courseCode, courseName, section, semester, students } = req.body;

  // Validate the input
  if (!courseCode || !courseName || !section || !semester || !Array.isArray(students)) {
    return res.status(400).json({ error: 'Invalid course data' });
  }

  // Create a new course
  const newCourse = new Course(courseCode, courseName, section, semester, students);
  courses.push(newCourse);

  res.status(201).json({ message: 'Course added successfully', course: newCourse });
});

// Edit a course by course code
app.put('/courses/:courseCode', (req, res) => {
  const { courseCode } = req.params;
  const { courseName, section, semester, students } = req.body;

  // Find the course by courseCode
  const course = courses.find((c) => c.courseCode === courseCode);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Update the course details
  if (courseName) course.courseName = courseName;
  if (section) course.section = section;
  if (semester) course.semester = semester;
  if (students) course.students = students;

  res.status(200).json({ message: 'Course updated successfully', course });
});

// Delete a course by course code
app.delete('/courses/:courseCode', (req, res) => {
  const { courseCode } = req.params;

  // Find the index of the course by courseCode
  const courseIndex = courses.findIndex((c) => c.courseCode === courseCode);

  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Remove the course from the array
  const deletedCourse = courses.splice(courseIndex, 1);

  res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse[0] });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});