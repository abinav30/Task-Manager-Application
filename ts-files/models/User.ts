import mongoose,{Schema,Model} from 'mongoose';
import validator from 'validator';
import  { IUser } from'./IUser'
import jwt from 'jsonwebtoken'
const charValidator= (str:string)=>{
    return new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g).test(str);

}


import bcryptjs from "bcryptjs"
const UserSchema:Schema=new Schema({
    name:{
        type:String,
        required:true,
        trim :true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate:(value:string):any=>{
            if(!validator.isEmail(value)){
                throw new Error("not a valid email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate:(value:string):any=>{
            if(validator.isLowercase(value) || (validator.isAlphanumeric(value) && !charValidator(value)) || value.length<=6|| validator.isUppercase(value) || value.toLowerCase().includes('password')){
                throw new Error('Password is invalid! must contain at least one uppercase character, one lowercase character,must be \n at least 7 characters long and must atleast contain a number or a symbol\n and must nbot contain the word password');

            }

        }

    },
    age:{
        type:Number,
        validate:(value:number):any=>{
            if(value<0){
                throw new Error('Age must be a posititve')
            }
        }

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});

//hashes password before saving
UserSchema.pre<IUser>('save',async function(next){
   let  user=this;



    if(user.isModified('password')){
        user.password = await bcryptjs.hash(user.password,8);


    }
    console.log('just before save');
    next()
} );

//Verifies is a user is present by credentials
UserSchema.statics.findByCredentials=async (email:string,password:string)=>{

    const user = await User.findOne({email:email}).exec();


    if(!user){
        throw new Error('UNABLE TO LOGIN!');
    }

   // console.log(user[password])

    const isMatch= await bcryptjs.compare(password,user.password);
   // console.log(isMatch)
    if(!isMatch){
        throw new Error("Unable to login")
    }
    return user;
}

//Login token generator
UserSchema.methods.generateAuthToken=async function(user:any){

    if(!user){
        return
    }


    const id=user._id.toString()
    const token = await jwt.sign({_id:id},'thisismyapp',{expiresIn:"7 days"})
        user.tokens = user.tokens.concat({token})
    await user.save()
        return token;
}
UserSchema.methods.toJSON = function(){
    const user=this;
    const userObject = user.toObject()
    delete userObject.password;
    delete userObject.tokens;
    return userObject;

}
UserSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'

})


interface IUserModel extends Model<IUser>{
     findByCredentials(email:string,password:string):any
}

const User = mongoose.model<IUser,IUserModel>('User',UserSchema);


export default User;