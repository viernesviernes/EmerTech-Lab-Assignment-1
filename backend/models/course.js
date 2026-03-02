const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  code: { type: Number, required: true },
  name: { type: String, required: true },
  section: { type: Number, required: true },
  semester: { type: Number, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
});

CourseSchema.index({ code: 1, section: 1 }, { unique: true });

CourseSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;