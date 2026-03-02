const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

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

StudentSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

StudentSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
};

StudentSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
