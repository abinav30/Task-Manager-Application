import { Document} from 'mongoose';
export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    age:number,
    tokens:[{token:string}],
   // findByCredentials(email:string,password:string):any,
    generateAuthToken(user:any):any,
    toJSON():any
    [key:string]:any

}