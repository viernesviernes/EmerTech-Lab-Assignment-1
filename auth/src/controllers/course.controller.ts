import type { Model } from 'mongoose';
const mongoose = require('mongoose') as typeof import('mongoose');
import type { Request, Response } from 'express';
import { CourseDocument } from '../models/course.model';

function getCourseModel(): Model<CourseDocument> {
    return mongoose.model<CourseDocument>('Course');
}

async function listAllCourses (req: Request, res: Response){
    const Course = getCourseModel();
    try {
        const courses = await Course.find({}).exec();
        return res.status(200).json({ data: courses });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function listAllStudentsInCourse (req: Request, res: Response){
    const Course = getCourseModel();
    const courseCode = Number(req.params.code);
    try {
        const course = await Course.findOne({ code: courseCode })
            .populate('students')
            .exec();
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({ data: course.students });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function getCourseDetails(req: Request, res: Response) {
    const Course = getCourseModel();
    const code = Number(req.query.code);
    const section = Number(req.query.section);
    if (!code || !section) {
        return res.status(400).json({ message: "Course code and section are required" });
    }
    try {
        const course = await Course.findOne({ code, section })
            .populate({ path: 'students', select: 'studentNumber firstName lastName email' })
            .lean()
            .exec();
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const { students, ...courseInfo } = course;
        return res.status(200).json({
            data: {
                course: courseInfo,
                students: students || [],
            },
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}


async function createCourse (req: Request, res: Response){
    const Course = getCourseModel();
    const course: CourseDocument = new Course(req.body);
    
    await course.save()
    .then((savedCourse: CourseDocument) => {
        return res.status(201).json({data: savedCourse});
    })
    .catch((err: any) => {
        return res.status(500).json({message: err.message})
    })
}

async function updateCourse (req: Request, res: Response){
    const Course = getCourseModel();
    const courseCode = Number(req.params.code); 

    const updateData = { ...req.body };
    delete updateData.code;
    delete updateData.students;

    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { code: courseCode },
            updateData,
            { new: true, runValidators: true }
        ).exec();

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({ data: updatedCourse });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

async function deleteCourse (req: Request, res: Response){
    const Course = getCourseModel();
    const courseCode = Number(req.params.code);

    try {
        const deletedCourse = await Course.findOneAndDelete({ code: courseCode }).exec();

        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({ data: deletedCourse });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports = {
    listAllCourses,
    listAllStudentsInCourse,
    getCourseDetails,
    createCourse,
    updateCourse,
    deleteCourse,
};