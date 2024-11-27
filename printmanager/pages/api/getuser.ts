

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/types";
import { auth } from "@/auth";
import db from "@/lib/db";
import { ObjectId } from "mongodb";


export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    let user = await auth(req, res)
    if(!user){
        return
    }
    if(!user?.user){
        return
    }
    if(user.user.role !== "admin" && user.user.role !== "operator"){
        res.status(401).json({ error: "Not authorized" })
        return
    }
    console.log(req.body, "b")
    let userget = await db.collection("users").findOne({
        _id: new ObjectId(req.body.id)
    })
    if(!userget){
        res.status(404).json({ error: "User not found" })
        return
    }
    let jobs = await db.collection("Jobs").find({
        userId: req.body.id
    }).toArray()
    for(let i = 0; i < jobs.length; i++){
        jobs[i].id = jobs[i]._id
        jobs[i].user = userget
        delete jobs[i]._id
    }
    delete userget.password
    res.status(200).json({
        user: userget,
        jobs: jobs
    })

}
