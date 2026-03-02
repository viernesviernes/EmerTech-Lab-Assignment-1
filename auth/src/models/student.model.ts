import type { Document } from 'mongoose';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    studentNumber: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username:  { type: String, required: true },
    password: { 
        type: String, 
        validate: [
			(password: string) => password && password.length > 6,
			'Password should be longer'
		],
        required: true 
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { 
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid email address"], 
        required: true, 
        unique: true 
    },
    program: { type: String, required: true },
    yearOfStudy: { type: Number, required: true },
    gpa: { type: Number, required: true },

});

StudentSchema.pre('save', function(this: any, next: () => void){
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

StudentSchema.methods.authenticate = function(this: any, password: string) {
	return bcrypt.compareSync(password, this.password);
};

StudentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

export interface IStudent {
    studentNumber: number;
    firstName: string;
    lastName: string;
    password: string;
    username: String;
    address: string;
    city: string;
    phoneNumber: string;
    email: string;
    program: string;
    yearOfStudy: number;
    gpa: number;
    authenticate(password: string): boolean;
}

export type StudentDocument = IStudent & Document;

mongoose.model('Student', StudentSchema);