

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
        console.log("failed")
        return
    }
    if(!user?.user){
        console.log("failed")
        return
    }
    if(user?.user.role !== "operator") {
        console.log("failede")
        return 
    }
    console.log(req.body)
    let job = await db.collection("Jobs").updateOne({
        _id: new ObjectId(req.body.id)   
    }, {
        $set: {
            status: 
                 req.body.status   
        }
    })
    res.status(200).json({
        message: "updated"
    })


}
