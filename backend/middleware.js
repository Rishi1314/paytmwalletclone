import {JWT_SECRET} from "./config.js"
import jwt from "jsonwebtoken"
const authMiddleware=(req,res,next)=>{
    //Look in to headers, you find cookeis and stufff
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer')){
        return res.status(403).json({})
    }

    const token=authHeader.split(' ')[1];
    try{
        
        //deencrypt your token to verify
        const decoded=jwt.verify(token,JWT_SECRET)
        req.userId=decoded.userId;
        next();
    }catch(err){
        return res.status(403).json({})
    }
}

export {authMiddleware}