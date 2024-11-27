import { auth } from "@/auth";
import db from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req :NextApiRequest, res : NextApiResponse) {
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
    let users = await db.collection("users").find({}).toArray()
    for(let i = 0; i < users.length; i++){
        delete users[i].password
    }

    res.status(200).json(users)
}