

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
    let jobs = db.collection("Jobs").find({
        userId: user.user.id
    }, {
        sort: {
            date: -1
        }
    })
    res.status(200).json(jobs)
}
