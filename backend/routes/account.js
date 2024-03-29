import express from "express"
import {User, Account } from "../db.js"
import mongoose from "mongoose";
import {authMiddleware} from "../middleware.js"
const accountRouter=express.Router();

accountRouter.get("/balance",authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    })

    res.json({
        balance:account.balance
    })

})

accountRouter.post("/transfer",authMiddleware,async(req,res)=>{
    const { amount, to } = req.body;

    const account = await Account.findOne({
        userId: req.userId
    });

    if (account.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    })

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    })

    res.json({
        message: "Transfer successful"
    })
})


export default accountRouter