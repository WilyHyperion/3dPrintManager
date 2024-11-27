

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/types";
import { auth } from "@/auth";
import db from "@/lib/db";
import { ObjectId } from "mongodb";


export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Job>,
) {
    let user = await auth(req, res)
    if(!user){
        return
    }
    if(!user?.user){
        return
    }
    console.log(req.body, "b")
    let jobs = await db.collection("Jobs").findOne({
        _id: new ObjectId(req.body.id)
    })
    console.log(jobs)
    jobs.id = jobs._id
    let id = new ObjectId(jobs.userId)
    let u = await db.collection("users").findOne({ _id: id })
    jobs.user = u
    res.status(200).json(jobs)

}
