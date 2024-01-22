import expess from "express";
import userRouter from "./user.js"

const rootRouter=expess.Router()

rootRouter.use("/user",userRouter)

export default rootRouter