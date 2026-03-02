const Student = require('../models/student');
const Course = require('../models/course');
const Admin = require('../models/admin');
const { setTokenCookie, requireAdmin, requireStudent } = require('./auth');

const resolvers = {
  Query: {
    students: async (_, __, context) => {
      requireAdmin(context);
      return await Student.find();
    },
    courses: async (_, __, context) => {
      requireAdmin(context);
      return await Course.find().populate('students');
    },
    studentCourses: async (_, { studentId }, context) => {
      requireStudent(context);
      const id = context.user.id;
      return await Course.find({ students: id }).select('-students').lean();
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
    signInAdmin: async (_, { username, password }, context) => {
      const admin = await Admin.findOne({ username });
      if (!admin || !admin.authenticate(password)) {
        throw new Error('Invalid admin credentials');
      }
      setTokenCookie(context.res, { id: admin._id.toString(), role: 'admin' });
      return { _id: admin._id.toString(), username: admin.username };
    },
    signInStudent: async (_, { username, password }, context) => {
      const student = await Student.findOne({ username });
      if (!student || !student.authenticate(password)) {
        throw new Error('Invalid student credentials');
      }
      setTokenCookie(context.res, { id: student._id.toString(), role: 'student' });
      const obj = student.toObject();
      delete obj.password;
      obj._id = obj._id.toString();
      return obj;
    },
    addStudent: async (_, args, context) => {
      requireAdmin(context);
      const student = new Student(args);
      return await student.save();
    },
    addCourse: async (_, args, context) => {
      requireAdmin(context);
      const course = new Course(args);
      return await course.save();
    },
    editStudent: async (_, { id, ...updates }, context) => {
      requireAdmin(context);
      return await Student.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteStudent: async (_, { id }, context) => {
      requireAdmin(context);
      const result = await Student.findByIdAndDelete(id);
      return !!result;
    },
    editCourse: async (_, { id, ...updates }, context) => {
      requireAdmin(context);
      return await Course.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteCourse: async (_, { id }, context) => {
      requireAdmin(context);
      const result = await Course.findByIdAndDelete(id);
      return !!result;
    },
    enrollCourse: async (_, { studentId, code, section }, context) => {
      requireStudent(context);
      const id = context.user.id;
      const course = await Course.findOne({ code, section });
      if (!course) throw new Error('Course not found');
      if (course.students.some((s) => s.toString() === id)) return course;
      course.students.push(id);
      await course.save();
      return course;
    },
    changeSection: async (_, { studentId, courseCode, section }, context) => {
      requireStudent(context);
      const id = context.user.id;
      const current = await Course.findOne({ code: courseCode, students: id });
      if (!current) throw new Error('Not enrolled in that course');
      const target = await Course.findOne({ code: courseCode, section: Number(section) });
      if (!target) throw new Error('Section not found');
      current.students = current.students.filter((s) => s.toString() !== id);
      await current.save();
      if (!target.students.some((s) => s.toString() === id)) {
        target.students.push(id);
        await target.save();
      }
      return target;
    },
    dropCourse: async (_, { studentId, code, section }, context) => {
      requireStudent(context);
      const id = context.user.id;
      const course = await Course.findOne({ code, section });
      if (!course) throw new Error('Course not found');
      course.students = course.students.filter((s) => s.toString() !== id);
      await course.save();
      return course;
    },
  },
};

module.exports = resolvers;