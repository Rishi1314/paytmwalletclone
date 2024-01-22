import express from "express"
import mongoose from "mongoose"
import rootRooter from "./routes/index.js"
import cors from "cors"
import bodyParser from "body-parser"
import { MONGODB } from "./config.js"
// import from "jsonwebtoken"


const app=express();
app.use(cors())
app.use(bodyParser)
app.use("/api/v1",rootRooter )
// console.log(process.env);
mongoose.connect(MONGODB).then(()=>{
    console.log("Connected to MONGODB");
}).catch((err)=>{
    console.log(err);
})

app.listen(3000,()=>{
    console.log("Listening on Port 3000");
})