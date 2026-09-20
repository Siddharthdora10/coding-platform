const User=require("../models/user")
const validate=require('../utils/validator');
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")
const redisClient=require('../config/redis')
const  submission=require('../models/submission');


const register=async(req,res)=>{
try{
    //validate the data
    validate(req.body);
    
 const {firstName,emailId,password}=req.body;

 req.body.password=await bcrypt.hash(password,10);
 req.body.role='user'

 const user=await User.create(req.body);

 const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
 const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        Id:user._id,
        role:user.role
    }
 res.cookie('token',token,{maxAge:60*60*1000, httpOnly:true, sameSite:'lax'});
 res.status(201).json({
    user:reply,
    message:"logged In successfully"
})
}
catch(err){
    console.log("REGISTER ERROR:", err);
  res.status(400).json({
  message: err.message
});
}
}

const login=async(req,res)=>{ 
    try{
        const {emailId,password}=req.body;

        if(!emailId)
            throw new Error("Invalid credential");
        if(!password)
            throw new Error ("Invalid credential");
       const user= await User.findOne({emailId});
       if(!user)
        throw new Error("Invalid Credentials");
    const match=await bcrypt.compare(password,user.password);

    if(!match)
        throw new Error("Invalid Credentials");

    const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        Id:user._id,
        role:user.role
    }
    
    const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
res.cookie('token',token,{maxAge:60*60*1000, httpOnly:true, sameSite:'lax'})
res.status(201).json({
    user:reply,
    message:"logged In successfully"
})
    }
    catch(err){
       res.status(401).send("Error"+err);
    }
}

const logout=async(req,res)=>{
    try{
 //validate the token(usermiddleware)
   const{token}=req.cookies;
   const payload=jwt.decode(token);

   await redisClient.set(`token:${token}`,"Blocked");
   await redisClient.expireAt(`token:${token}`,payload.exp);
 

 res.cookie("token",null,{expires:new Date(Date.now())});
 res.send("logged out scucessfully");
    }
    catch(err){
        res.status(503).send("Error"+err);
    }
}

const adminregister=async(req,res)=>{
    
    try{
    //validate the data
    validate(req.body);
    
 const {firstName,emailId,password}=req.body;

 req.body.password=await bcrypt.hash(password,10);
 

 const user=await User.create(req.body);

 const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
 res.cookie('token',token,{maxAge:60*60*1000, httpOnly:true, sameSite:'lax'});
 res.status(201).send("admin Registered successfully");
}
catch(err){
   res.status(400).send("Error:"+err);
}
}

const deleteProfile= async(req, res)=>{
    try{
      const userId=req.result.id;
      // userSchema delete
      await User.findByIdAndDelete(userId);
      
      // await submission.deleteMany({userId});
       res.status(200).send("deleted Successfully");
    }
   catch(err){
   res.status(500).send('Internal Server Error'+err);
   }
}


module.exports={register,login,logout,adminregister,deleteProfile};
