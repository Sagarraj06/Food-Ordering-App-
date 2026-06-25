import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import tryCatch from "../middlewares/trycatch.js";
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken"

export const addRestrant = tryCatch(async(req:AuthenticatedRequest, res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    }

    const existingRestaurant = await Restaurant.findOne({
        ownerId:user._id,
    })

    if(existingRestaurant){
        return res.status(400).json({
            message:"Restaurant already exists",
        })
    }
    const {name , description , phone, latitude, longitude, formattedAddress} = req.body

    if(!name || !description || !longitude){
        return res.status(400).json({
            message:"Missing required fields",
        });
    }


    const file = req.file;
    if(!file){
        return res.status(400).json({
            message:"Please provide Image",
        });
    }


    const FileBuffer = getBuffer(file)

    if(!FileBuffer?.content){
        return res.status(500).json({
            message: "Failed to create file buffer",

        });

    }


    const {data: uplodeResult}= await axios.post(`${process.env.UTILS_SERVICE}/api/uplode`,{
        buffer: FileBuffer.content,
    }
    );

    const restaurant= await Restaurant.create({
        name, description,
        phone,
        image:uplodeResult.url,
        ownerId:user._id,
        autoLocation:{
            type:"Point",
            coordinates: [Number(longitude), Number(latitude)],
            formattedAddress,
        },
        isVerified: false,
        
    });

    return res.status(201).json({
        message:"Restaurant created successfully",
        restaurant,
    }) 
    
})

export const fetchMyRestaurant=tryCatch(async(req:AuthenticatedRequest,res)=>{
if(!req.user){
    return res.status(401).json({
        message:"Please Login"
    });

}

const restaurant = await Restaurant.findOne({ownerId: req.user._id})

if(!restaurant){
    return res.status(400).json({
        message:"No Restaurant Found",
    })
}
if(!req.user.restaurantId){
    const token = jwt.sign({
        user: {
            ...req.user,
            restaurantId: restaurant._id
        }
       
    }, process.env.JWT_SECRET as string,{expiresIn: "15d"})


    return res.status(200).json({
        restaurant,
        token,
    })
}

res.json({restaurant});
})


