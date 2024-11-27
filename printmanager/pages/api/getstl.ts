

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/types";
import { auth } from "@/auth";
import db, { bucket } from "@/lib/db";
import { ObjectId } from "mongodb";
const mongodb =  require("mongodb");
export const config = {
    api: {
      responseLimit: false,
    },
  }
export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    let id = req.body.id
    let user = await auth(req, res)
    if(!user){
        return
    }
    if(!user?.user){
        return
    }
    console.log(id)
    const file = await bucket.find({ filename: id.toString()}).toArray();
    if(!file){
        return res.status(404)
    }
    console.log(file)
    const downloadStream = bucket.openDownloadStream(file[0]._id)
    downloadStream.pipe(res)
    res.status(200)
}
