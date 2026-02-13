import type { Model } from 'mongoose';
const mongoose = require('mongoose') as typeof import('mongoose');
import type { UserDocument } from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';

const jwtKey: string = process.env.sessionSecret!;

// Lazy model getter - gets User model only when needed (after schema is registered)
function getUserModel(): Model<UserDocument> {
    return mongoose.model<UserDocument>('User');
}

function CreateUser(req: any, res: any, next: any) {
    const User = getUserModel();
    const user: UserDocument = new User(req.body);

    user.save()
        .then((savedUser: UserDocument) => {
            res.json(savedUser);
        })
        .catch((err: any) => {
            return next(err);
        });
}

async function updateUser(req: Request, res: Response){
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

async function deleteUser(req: Request, res: Response){
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


async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        const User = getUserModel();
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.json({
                status: "error",
                message: "Invalid email/password!!!",
                data: null
            });
        }

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, email: user.email },
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

function signout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.status(200).json({ message: "signed out" });
}

function isSignedIn(req: Request, res: Response) {
    const token = req.cookies.token;

    if (!token) {
        return res.send({ screen: 'auth' }).end();
    }

    var payload: any;
    try {
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }
        return res.status(400).end();
    }

    res.status(200).send({ screen: payload.email || payload.username || '' });
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

function testRoute (req: Request, res: Response){
    const userId = (req as any).userId;
    res.status(200).send({message: `This route is protected, your id is: ${userId}`, })
} 

module.exports = {
    CreateUser,
    authenticate,
    signout,
    isSignedIn,
    isLoggedIn,
    getUserInfo,
    updateUser,
    deleteUser,
    testRoute
};
