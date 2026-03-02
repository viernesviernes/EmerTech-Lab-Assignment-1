const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    validate: [
      (password) => password && password.length > 6,
      'Password should be longer',
    ],
    required: true,
  },
  email: {
    type: String,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: true,
    unique: true,
  },
});

AdminSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

AdminSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
};

AdminSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
