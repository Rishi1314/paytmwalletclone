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

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,//Reference to user model
        ref:'User',
        required:true,
    },
    balance:{
        type:Number,
        required:true
    }
})

const Account=mongoose.model("Account",accountSchema)


const User= mongoose.model("User",userSchema);

export {User,Account}