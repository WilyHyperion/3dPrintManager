// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { auth } from "@/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Formidable } from "formidable";
import { Job } from "@/types/types";

const fs = require('fs')
export const config = {
    api: {
      bodyParser: false,
    },
  };
  import db, { bucket } from "@/lib/db";
import calculateMetrics, { backendCalculateMetrics } from "@/lib/calculateCost";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    let session = await auth(req, res)
    if(!session){
        return
    }
    if(!session?.user){
        return
    }
    const form = new Formidable();
     await form.parse(req, async (err: any, fields: any, files) => {
      if(!(files.file) ||! (files.file[0])){
        console.log("No file attached")
        return {
          error: "No file attached"
        }
      }
      let printtme= ''
      let cost = ''
      const setPrintTime = (time: string) => {
        printtme = time 
      }
      const setCost = (costt: string) => {
        cost = costt
      }
      const file = files.file[0] as formidable.File;
      let filedata = fs.readFileSync(file.filepath);
      //convert to arraybuffer
      const arraybuffer = filedata.buffer.slice(filedata.byteOffset, filedata.byteOffset + filedata.byteLength);
      await backendCalculateMetrics(arraybuffer, ()=> {}, fields.inFillPercentage[0], setPrintTime, setCost, ()=> {})
      console.log(printtme, cost, "print time and cost")
      let name = fields.name[0];
        if(!session?.user || !files){
            return
        }
        let userid = session.user.id;
        let object = await db.collection("Jobs").insertOne({
          userId: userid,
          status: "submited",
          name: name,
          date: new Date(),
          inFillPercentage: fields.inFillPercentage[0],
          color: fields.color[0],
          printer: fields.printer[0],
          notes: fields.notes[0],
          printTime: printtme,
          cost: cost,
        } as Job)
        let id = object.insertedId;
        const readableStream = fs.createReadStream(files.file[0].filepath.toString());
         readableStream.pipe(bucket.openUploadStream(id + ".stl"))
    });
    res.writeHead(302, { Location: '/logged/home' }).end()
}
