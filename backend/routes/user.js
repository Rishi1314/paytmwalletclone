import express from "express"
import { JWT_SECRET } from "../config.js"; 
import jwt from "jsonwebtoken"
import zod from "zod"
import {Account, User} from "../db.js"
import { authMiddleware } from "../middleware.js";

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

    const userId=user._id

    await Account.create({
        userId,
        balance:1+Math.random()*10000
    })
    
    const token=jwt.sign({
        userId
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
            userId:user._id
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

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})
userRouter.put("/",authMiddleware,async(req,res)=>{
    const success=updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({
        id:req.userId
    })
    res.json({
        message:"User updated successfully"
    })
})

userRouter.get("/bulk",async(req,res)=>{
    //query is after / in the url
    const filter=req.query.filet||"";
    const users=await User.find({
        //The $or operator performs a logical OR operation on an array of one or more <expressions> and selects the documents that satisfy at least one of the <expressions> .

        $or:[{
            firstName:{
                "$reqex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }
    ]
    })

    res.json({
        user:users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

export default userRouter