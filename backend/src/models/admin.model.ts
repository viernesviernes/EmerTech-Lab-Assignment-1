import type { Document } from 'mongoose';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        validate: [
			(password: string) => password && password.length > 6,
			'Password should be longer'
		],
        required: true 
    },
    email: { 
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid email address"], 
        required: true, 
        unique: true 
    },

});

AdminSchema.pre('save', function(this: any, next: () => void){
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

AdminSchema.methods.authenticate = function(this: any, password: string) {
	return bcrypt.compareSync(password, this.password);
};

AdminSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

export interface IAdmin {
    username: String;
    email: string;
    password: string;
    authenticate(password: string): boolean;
}

export type AdminDocument = IAdmin & Document;

mongoose.model('Admin', AdminSchema);