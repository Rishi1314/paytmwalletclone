import express from "express"
import { JWT_SECRET } from "../config.js"; 
import jwt from "jsonwebtoken"
import zod from "zod"
import {User} from "../db.js"

const signupBody=zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
})


const userRouter=express.Router();

userRouter.post("/signup",async(req,res)=>{
    const {success}=signupBody.safeParse(req.body);
    if(!success){
        return res.statusCode(411).json({
            message:"Email already taken/ Incorrect inputs."
        })
    }

    const existingUser= await User.findOne({
        username:req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message:"Email already taken/ Incorrect inputs."

        })
    }

    const user= await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
    })

    const uid=user._id

    const token=jwt.sign({
        uid
    },JWT_SECRET)

    res.json({
        message:"User created successfully",
        token:token
    })


})

const signinBody=zod.object({
    username:zod.string().email(),
    password:zod.string()
})

userRouter.post("/signin",async(req,res)=>{
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(user){
        const token=jwt.sign({
            uid:user._id
        },JWT_SECRET)
        res.json({
            token:token,
        })
        return
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})


export default userRouter