const express=require('express')
const app=express()
require('dotenv').config();
const main=require('./config/db')
const CookieParser= require('cookie-parser');
const authRouter=require("./routes/userauth")
const redisClient=require('./config/redis')
const problemRouter=require("./routes/problemCreator")
const submitRouter=require('./routes/submit')
const aiRouter=require("./routes/AiChat");
const cors=require('cors')

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
app.use(express.json());
app.use(CookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);

const InitalizeConnection=async()=>{
    try{
     await Promise.all([main(),redisClient.connect()]);
     console.log("db connected");
      app.listen(process.env.PORT,()=>{
   console.log("server listening at port number:"+ process.env.PORT);
        })
    }
    catch(err){
         console.log("Error"+err);
    }
}
  InitalizeConnection();



