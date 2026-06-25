import {Request, Response, NextFunction } from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
// import  User,{IUser} from '../model/user.js'
export interface IUser {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    restaurantId: string;
}




export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async(req:AuthenticatedRequest,res:Response,next:NextFunction):
Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            res.status(401).json({
                message:"Please Login- No auth Header",
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        if(!token){
            res.status(401).json({
                message:"Invalid token",
            });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if(!decoded){
            res.status(401).json({
                message:"Invalid Token",
            });
            return;
        }
        req.user = decoded.user;
        next();
} catch (error:any) {
        res.status(500).json({
            message:"Please Login- JWT Error"
        });
        return;
    }
};



export const isSeller = async(req:AuthenticatedRequest,res:Response,next:NextFunction):
Promise<void> =>{
    const user = req.user;
    if(user && user.role !== "seller"){
        res.status(403).json({
            message: "Only Sellers can create restaurants",
        });
        return;
    }
    next();
}