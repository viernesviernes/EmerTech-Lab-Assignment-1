const Student = require('../models/student');
const Course = require('../models/course');
const Admin = require('../models/admin');

const resolvers = {
  Query: {
    students: async () => await Student.find(),
    courses: async () => await Course.find().populate('students'),
    studentCourses: async (_, { studentId }) => {
      return await Course.find({ students: studentId }).select('-students').lean();
    },
  },
  Student: {
    id: (parent) => parent._id?.toString() ?? parent.id,
    _id: (parent) => parent._id?.toString() ?? parent._id,
  },
  Course: {
    id: (parent) => parent._id?.toString() ?? parent.id,
    _id: (parent) => parent._id?.toString() ?? parent._id,
  },
  Mutation: {
    signInAdmin: async (_, { username, password }) => {
      const admin = await Admin.findOne({ username });
      if (!admin || !admin.authenticate(password)) {
        throw new Error('Invalid admin credentials');
      }
      return { _id: admin._id.toString(), username: admin.username };
    },
    signInStudent: async (_, { username, password }) => {
      const student = await Student.findOne({ username });
      if (!student || !student.authenticate(password)) {
        throw new Error('Invalid student credentials');
      }
      const obj = student.toObject();
      delete obj.password;
      obj._id = obj._id.toString();
      return obj;
    },
    addStudent: async (_, args) => {
      const student = new Student(args);
      return await student.save();
    },
    addCourse: async (_, args) => {
      const course = new Course(args);
      return await course.save();
    },
    editStudent: async (_, { id, ...updates }) => {
      return await Student.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteStudent: async (_, { id }) => {
      const result = await Student.findByIdAndDelete(id);
      return !!result;
    },
    editCourse: async (_, { id, ...updates }) => {
      return await Course.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteCourse: async (_, { id }) => {
      const result = await Course.findByIdAndDelete(id);
      return !!result;
    },
    enrollCourse: async (_, { studentId, code, section }) => {
      const course = await Course.findOne({ code, section });
      if (!course) throw new Error('Course not found');
      if (course.students.some((s) => s.toString() === studentId)) return course;
      course.students.push(studentId);
      await course.save();
      return course;
    },
    changeSection: async (_, { studentId, courseCode, section }) => {
      const current = await Course.findOne({ code: courseCode, students: studentId });
      if (!current) throw new Error('Not enrolled in that course');
      const target = await Course.findOne({ code: courseCode, section: Number(section) });
      if (!target) throw new Error('Section not found');
      current.students = current.students.filter((s) => s.toString() !== studentId);
      await current.save();
      if (!target.students.some((s) => s.toString() === studentId)) {
        target.students.push(studentId);
        await target.save();
      }
      return target;
    },
    dropCourse: async (_, { studentId, code, section }) => {
      const course = await Course.findOne({ code, section });
      if (!course) throw new Error('Course not found');
      course.students = course.students.filter((s) => s.toString() !== studentId);
      await course.save();
      return course;
    },
  },
};

module.exports = resolvers;