import express from "express"
import User from "../models/User";
import auth, {credential} from "../middleware/auth"

const router1= express.Router();


router1.get('/users/me',auth, async (req:credential, res:express.Response)=>{
    try{
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send('Internal error')
    }



});

router1.post('/users',async  (req:express.Request, res:express.Response)=>{

    const user=new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken(user)

        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }


});
router1.post('/users/login',async (req:express.Request,res:express.Response)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken(user);



        res.send({user,token})
    }catch(e){
        res.status(400).send({"Unable to login":400})
    }
})

router1.post('/users/logout',auth, async (req:credential,res:express.Response)=>{
    try{
        req.user.tokens =  req.user.tokens.filter((token:any)=>{
           return  token.token !== req.tok;

        })
        await req.user.save()
        res.send(200)

    }catch(e){
        res.sendStatus(500)

    }
})

router1.post('/users/logoutAll',auth, async (req:credential,res:express.Response)=>{
    try{
        req.user.tokens =  [];
        await req.user.save()
        res.send(200)

    }catch(e){
        res.sendStatus(500)

    }
})

router1.patch('/users/me',auth,async (req:credential, res:express.Response)=>{
    const updates=Object.keys(req.body);

    const allowedUpdates=['name','email','password','age'];
    //calls function for every element of the array
    const isValid = updates.every((update)=>allowedUpdates.includes(update));
    if(!isValid){
        return  res.sendStatus(400).send()
    }
    try{
        console.log(req.body)
        //This operation is used to  update an existing entry on the mongoDB database
        //We pass the id passed by the params object in the request
        //we send the request body
        //we set up an options object that says get the new updated document as true and
        //run validators on the updated object as true
        const user=req.user
        if(!user){
            return res.status(404).send()
        }

            updates.forEach((update)=>{

                    user[update]=req.body[update];



            })
        await user.save({validateBeforeSave:true});


        res.send(user)

    }catch(e){
        res.sendStatus(400).send(e)

    }

});
router1.delete('/users/me', auth, async(req:credential, res:express.Response)=>{

    try{
        const user=await User.findByIdAndDelete(req.user._id);

        if(!user) return;

        await user.remove()
        res.send(req.user)

    }catch(e){
        res.sendStatus(500).send()
    }
});
export {router1};