const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentNumber: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: {
    type: String,
    validate: [
      (password) => password && password.length > 6,
      'Password should be longer',
    ],
    required: true,
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: {
    type: String,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: true,
    unique: true,
  },
  program: { type: String, required: true },
  yearOfStudy: { type: Number, required: true },
  gpa: { type: Number, required: true },
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
