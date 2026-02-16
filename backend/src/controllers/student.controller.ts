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
    const code = Number(req.body.code);
    const section = Number(req.body.section);
    try {
        const course = await Course.findOne({ code, section }).exec();
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

/** Move student from current (code, section) to same code, new section. */
async function updateCourse(req: Request, res: Response) {
    const Course = getCourseModel();
    const userId = (req as any).userId;
    const code = Number(req.params.code);
    const newSection = Number(req.body.section);
    try {
        const fromCourse = await Course.findOne({ code, students: userId }).exec();
        if (!fromCourse) return res.status(404).json({ message: "Not enrolled in this course" });
        fromCourse.students = fromCourse.students.filter((id: any) => id.toString() !== userId);
        await fromCourse.save();

        const toCourse = await Course.findOne({ code, section: newSection }).exec();
        if (!toCourse) return res.status(404).json({ message: "Course section not found" });
        if (toCourse.students.some((id: any) => id.toString() === userId)) {
            return res.status(400).json({ message: "Already in that section" });
        }
        toCourse.students.push(userId);
        await toCourse.save();
        return res.status(200).json({ data: toCourse });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function dropCourse(req: Request, res: Response) {
    const Course = getCourseModel();
    const userId = (req as any).userId;
    const code = Number(req.body.code);
    const section = Number(req.body.section);
    try {
        const course = await Course.findOne({ code, section }).exec();
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
