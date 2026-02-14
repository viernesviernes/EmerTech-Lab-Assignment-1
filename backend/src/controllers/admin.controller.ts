import type { Model } from 'mongoose';
const mongoose = require('mongoose') as typeof import('mongoose');
import type { StudentDocument } from '../models/student.model';
import type { Request, Response } from 'express';
import { AdminDocument } from '../models/admin.model';

function getUserModel(): Model<StudentDocument> {
    return mongoose.model<StudentDocument>('Student');
}

function getAdminModel(): Model<AdminDocument>{
    return mongoose.model<AdminDocument>('Admin')
}


async function listAllStudents (req: Request, res: Response){
    const User = getUserModel();
    try {
        const students = await User.find({}).select('-password').exec();
        return res.status(200).json({ data: students });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}


function createStudentAccount(req: any, res: any, next: any) {
    const User = getUserModel();
    const user: StudentDocument = new User(req.body);

    user.save()
        .then((savedUser: StudentDocument) => {
            res.json(savedUser);
        })
        .catch((err: any) => {
            return next(err);
        });
}

async function updateStudentAccount(req: Request, res: Response){
    const User = getUserModel();
    const userId = (req as any).userId;

    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,{
                new: true,
                runValidators: true
            }
        ).select("-password");

        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({data: updatedUser});
    }catch (err: any){
        res.status(500).json({message: err.message})
    }
};

async function deleteStudentAccount(req: Request, res: Response){
    const User = getUserModel();
    const userId = (req as any).userId;
    try{
        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser) return res.status(404).json({message: "User not found"});

        res.status(200).json({data: deletedUser});
    }catch(err: any){
        res.status(500).json({message: err.message})
    }
};

function testRoute (req: Request, res: Response){
    const userId = (req as any).userId;
    res.status(200).send({message: `This route is protected, your id is: ${userId}`, })
} 

module.exports = {
    listAllStudents,
    createStudentAccount,
    updateStudentAccount,
    deleteStudentAccount,
    testRoute,
};
