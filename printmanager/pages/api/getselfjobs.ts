

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/types";
import { auth } from "@/auth";
import db from "@/lib/db";
import { ObjectId } from "mongodb";


export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Job[] | {error: string}>,
) { 
    let user = await auth(req, res)
    if(!user){
        res.status(401).json({ error: "Not authorized" })
        return
    }
    if(!user?.user){            
        res.status(401).json({ error: "Not authorized" })
        return
    }
    let jobs = await db.collection("Jobs").find({
        userId: user.user.id
    }, {
        sort: {
            date: -1
        }
    })
    jobs = await jobs.toArray()
    if(jobs.length == 0){
        res.status(200).json([])
        return
    }
    let jobuser = await db.collection("users").findOne({  
            _id: new ObjectId(jobs[0].userId)
    })
    for(let job of jobs)
    {
        job.id = job._id
        job.user = jobuser
    }
    res.status(200).json(jobs)
}
