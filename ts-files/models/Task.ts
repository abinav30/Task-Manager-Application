import mongoose,{Schema} from 'mongoose';
import{ITask}from "./ITask";
const TaskSchema:Schema = new Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'//Creates a reference from this field to another model

    }
},{ //This field is for schema options like timestamps or so

        timestamps:true,

})


const Task= mongoose.model<ITask>('Task',TaskSchema);
export default Task