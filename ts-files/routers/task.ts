import express from "express";
import Task from "../models/Task";
import auth ,{credential}from "../middleware/auth"
const taskRouter = express.Router();


taskRouter.post('/tasks',auth, async (req:credential, res:express.Response)=>{

    //Resource creation endpoint where we parse a json object to create a task user
    //We sen 201 on successfull creation or a 400 bad request error with the neccesary warnings
    const task = new Task({...req.body,owner:req.user._id});


    try{
        await task.save();
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }


});

taskRouter.get('/tasks', auth, async (req:credential,res:express.Response)=>{
    //This is a overall task fetching endpoint through which we can fetch a user by id
    //We find by the user id and if not found we s encounter a server error(500)
    //The query completer here sees if a certain key called completed is passed in the url and its match is set accordingly
    const match:any ={};
    const sort:any = {};
    if(req.query.completed){
        match.completed=req.query.completed==='true'

    };
    if(req.query.sortBy){
        const str = req.query.sortBy.split(':')
       //const key = str[0]
        if(str[1]==='asc'){
            sort[str[0]]=1
        }else if(str[1]==='desc'){
            sort[str[0]]= -1
        }
    }
    try{

       // const tasks = await Task.find({'owner':req.user._id});
        //The options object helps us to paginate data
        //The limit value limits number of tasks returned by the top number of tasks as given here
        //
        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort


            },

        }).execPopulate()
       // console.log(typeof(tasks));
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }


});



taskRouter.get('/tasks/:id', auth, async (req:credential,res:express.Response)=>{
    //This is a specific task fetching endpoint through which we can fetch a user by id
    //We find by the user id and if not found we send a 404 or we send a success unless we encounter a server error(500)
    const _id = req.params.id;
    console.log(_id);
    try{
        const task = await Task.findOne({_id,owner:req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }




});




taskRouter.patch("/tasks/:id", auth,async (req:credential,res:express.Response)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates=['completed','description'];
    const isValid=updates.every((update)=>allowedUpdates.includes(update));
    if(!isValid){
        return  res.sendStatus(400).send("Invalid Update!")
    }
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id});
         if(!task){
            return res.sendStatus(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save({validateBeforeSave:true})




        res.send(task)
    }catch (e) {
        res.sendStatus(400).send(e)

    }


});
//Dont forget the:before id as it will cause an error in the working of node


taskRouter.delete('/tasks/:id', auth,async(req:credential,res:express.Response)=>{
    const _id =req.params.id.trim();
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        console.log(req.params.id);
        if(!task){
            return res.send(404).send()

        }
        res.send(task)

    }catch(e){
        res.sendStatus(500).send()
    }
});
export {taskRouter};