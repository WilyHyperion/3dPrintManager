import { NextApiRequest, NextApiResponse } from 'next';
import {addUser} from '../../lib/credentiallogins'
import { auth, signIn } from '@/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        var t = await addUser(req.body.email, req.body.password,  req.body.name)   
    } catch (error) {
        console.log(error, 'error')
        return
    }
    if(!t){

        res.status(500).json({ error: "Error adding user" })
        return
    }
    res.status(200).json({ success: true })
}