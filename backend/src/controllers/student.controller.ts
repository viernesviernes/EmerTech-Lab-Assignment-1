import type { Model } from 'mongoose';
const mongoose = require('mongoose') as typeof import('mongoose');
import type { StudentDocument } from '../models/student.model';
import type { Request, Response } from 'express';
import type { CourseDocument } from '../models/course.model';

function getUserModel(): Model<StudentDocument> {
    return mongoose.model<StudentDocument>('Student');
}

function getCourseModel(): Model<CourseDocument> {
    return mongoose.model<CourseDocument>('Course');
}

async function addCourse(req: Request, res: Response) {
    const Course = getCourseModel();
    const userId = (req as any).userId;
    const courseCode = Number(req.body.code);
    try {
        const course = await Course.findOne({ code: courseCode }).exec();
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (course.students.some((id: any) => id.toString() === userId)) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
        course.students.push(userId);
        await course.save();
        return res.status(200).json({ data: course });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function updateCourse(req: Request, res: Response) {
    const Course = getCourseModel();
    const courseCode = Number(req.params.code);
    const { section } = req.body;
    try {
        const course = await Course.findOneAndUpdate(
            { code: courseCode },
            { section },
            { new: true, runValidators: true }
        ).exec();
        if (!course) return res.status(404).json({ message: "Course not found" });
        return res.status(200).json({ data: course });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function dropCourse(req: Request, res: Response) {
    const Course = getCourseModel();
    const userId = (req as any).userId;
    const courseCode = Number(req.body.code);
    try {
        const course = await Course.findOne({ code: courseCode }).exec();
        if (!course) return res.status(404).json({ message: "Course not found" });
        course.students = course.students.filter((id: any) => id.toString() !== userId);
        await course.save();
        return res.status(200).json({ data: course });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function listUserCourses(req: Request, res: Response) {
    const Course = getCourseModel();
    const userId = (req as any).userId;
    try {
        const courses = await Course.find({ students: userId }).select('-students').exec();
        return res.status(200).json({ data: courses });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function getUserInfo(req: Request, res: Response){
    const User = getUserModel();
    const userId = (req as any).userId;

    try{
        const user = await User.findById(userId).select("-password");

        if(!user) return res.status(404).json({message: "User not found"});

        res.status(200).json({data: user});
    }catch(err: any){
        res.status(500).json({message: err.message})
    }
};


function testRoute (req: Request, res: Response){
    const userId = (req as any).userId;
    res.status(200).send({message: `This route is protected, your id is: ${userId}`, })
} 

module.exports = {
    addCourse,
    updateCourse,
    dropCourse,
    listUserCourses,
    getUserInfo,
    testRoute,
};
