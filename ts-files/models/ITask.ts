import mongoose,{Schema} from 'mongoose'
export interface ITask extends mongoose.Document{
    description:string,
    completed:boolean,
    owner:Schema.Types.ObjectId,
    [key:string]:any//Index signature that says for a key of type string i may have any value associated to it

}