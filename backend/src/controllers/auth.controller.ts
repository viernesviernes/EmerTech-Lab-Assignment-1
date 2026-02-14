import type { Model } from 'mongoose';
const mongoose = require('mongoose') as typeof import('mongoose');
import type { StudentDocument } from '../models/student.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import { AdminDocument } from '../models/admin.model';

const jwtKey: string = process.env.sessionSecret!;

function getUserModel(): Model<StudentDocument> {
    return mongoose.model<StudentDocument>('Student');
}

function getAdminModel(): Model<AdminDocument>{
    return mongoose.model<AdminDocument>('Admin')
}



function signInHandler(isAdmin: boolean){
    return async function signIn(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        console.log("This user is a admin?: ", isAdmin)

        let user: AdminDocument | StudentDocument | null;
        if (isAdmin) {
            user = await getAdminModel().findOne({ email }).exec();
        } else {
            user = await getUserModel().findOne({ email }).exec();
        }

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email/password!!!",
                data: null
            });
        }

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, email: user.email, role: isAdmin ? "admin" : "student" },
                jwtKey,
                { algorithm: 'HS256', expiresIn: 300 }
            );

            res.cookie('token', token, { maxAge: 300 * 1000, httpOnly: true });
            res.status(200).send({ screen: user.email });

            return next();
        } else {
            res.json({
                status: "error",
                message: "Invalid email/password!!!",
                data: null
            });
        }
    } catch (error) {
        return next(error);
    }
}
}


function signout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "signed out" });
}


function isLoggedIn (req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        return res.send({ screen: 'auth' }).end();
    }

    var payload: any;
    try {
        payload = jwt.verify(token, jwtKey);
        (req as any).userId = payload.id;
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }
        return res.status(400).end();
    }

    next();
}

function isAdmin (req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    const payload: any = jwt.verify(token, jwtKey);
    
    if (payload.role != "admin") return res.status(400).json("User is not admin");

    next();
}

module.exports = {
    signInHandler,
    signout,
    isLoggedIn,
    isAdmin
};
