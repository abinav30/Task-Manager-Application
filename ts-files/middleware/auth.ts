import jwt from 'jsonwebtoken'
import User from "../models/User"
import express from "express"
export interface credential extends express.Request{
    user?:any,
    tok?:any,

}
const auth:any = async (req:credential,res:express.Response,next:any)=>{
    try{

       let token = req.header('Authorization')
        //console.log(token)
        if(token){
            token = token.replace("Bearer",'').trim()

            const decoded =await  jwt.verify(token,'thisismyapp')
            //@ts-ignore
            //console.log(decoded)
            //@ts-ignore

            const user =await User.findOne({_id:decoded._id,'tokens.token':token})
            if(!user){
                throw new Error();
            }
            req.user =user;
            req.tok = token;

            next()

        }
       // console.log(token)

    }catch(e){
        res.sendStatus(403)

    }
    console.log('auth');

}
export default auth;