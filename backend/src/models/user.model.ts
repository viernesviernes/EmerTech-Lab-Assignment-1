import type { Document } from 'mongoose';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    studentNumber: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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

UserSchema.pre('save', function(this: any, next: () => void){
	//hash the password before saving it
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

UserSchema.methods.authenticate = function(this: any, password: string) {
	//compare the hashed password of the database 
	//with the hashed version of the password the user enters
	return bcrypt.compareSync(password, this.password);
};

UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// ---- Type definitions for TypeScript ----
// Basic fields that match the schema, plus the instance method authenticate
export interface IUser {
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

// A Mongoose document that has both Document properties and IUser fields/methods
export type UserDocument = IUser & Document;

mongoose.model('User', UserSchema);