import expess from "express";
import userRouter from "./user.js"
import accountRouter from "./account.js";

const rootRouter=expess.Router()

rootRouter.use("/user",userRouter)
rootRouter.use("/account",accountRouter)

export default rootRouter