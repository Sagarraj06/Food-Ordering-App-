import User from '../model/user.js'
import jwt from 'jsonwebtoken'
import tryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from '../middlewares/isAuth.js';



export const  loginUser = tryCatch(async (req,res)=>{
    const {email,name,picture,image}= req.body;
        let user= await User.findOne({email});
        if(!user){
            user = await User.create({
                name,
                email,
                image: picture || image
            })
        }
        const token = jwt.sign({user},process.env.JWT_SECRET as string,{
            expiresIn: "15d",
        });

        res.status(200).json({
            message: "Logged in successfully",
            token,
            user
        });
});

const allowedRoles=["customer", "rider", "seller"] as const;
type Role= (typeof allowedRoles)[number];

export const addUserRole= tryCatch(async(req:AuthenticatedRequest,res)=>{
    if(!req.user?._id){
        return res.status(401).json({
            message:"Unauthorized",
        });
    }
    
    const {role}= req.body as {role: Role};
    if(!allowedRoles.includes(role)){
        return res.status(400).json({
            message:"Invalid role",
        });
    }
    
    const user = await User.findByIdAndUpdate(req.user._id,{ role: role},{new:true});
    if(!user){
        return res.status(404).json({
            message: "User Not found",
        });
    }
    
    const token = jwt.sign({user},process.env.JWT_SECRET as string,{
        expiresIn:"15d",
    });
    return res.status(200).json({
        message: "Role added successfully",
        token,
        user
    });
})

export const myProfile = tryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user;
    res.json(user);
})