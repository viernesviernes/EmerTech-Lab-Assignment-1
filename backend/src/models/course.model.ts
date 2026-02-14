import type { Document } from 'mongoose';
const mongoose = require('mongoose');
import type { Types } from 'mongoose';

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    code: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    section: { type: Number, required: true},
    semester: { type: Number, required: true},
    students: [{  type: Schema.Types.ObjectId, ref: 'Student' }]
});


CourseSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

export interface ICourse {
    code: number;
    name: string;
    section: number;
    semester: number;
    students: Types.ObjectId[];
}

export type CourseDocument = ICourse & Document;

mongoose.model('Course', CourseSchema);