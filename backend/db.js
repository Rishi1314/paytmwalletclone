import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        trim:true,
        maxLength:50,
        required:true
    },
    username:{
        type:String,
        trim:true,
        maxLength:50,
        required:true
    }
})

const User= mongoose.model("User",userSchema);

export {User}