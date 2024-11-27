

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
    if(!user || !user?.user ){
        res.status(401).json({
            message: "failed"
        })
        return
    }
    if(!user?.user){
        return
    }
    if(user?.user.role !== "operator") {
        res.status(401).json({
            message: "failed"
        })
        return 
    }
    await db.collection("Jobs").updateOne({
        _id: new ObjectId(req.body.id)
    }, {
        $set: {
            teacherResponse:
                 req.body.response
        }
    })
    res.status(200).json({
        message: "updated"
    })


}
