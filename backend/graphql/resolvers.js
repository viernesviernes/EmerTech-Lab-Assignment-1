const Student = require('../models/student');
const Course = require('../models/course');

const resolvers = {
  Query: {
    students: async () => await Student.find(),
    courses: async () => await Course.find().populate('students'),
  },
  Mutation: {
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
  },
};

module.exports = resolvers;