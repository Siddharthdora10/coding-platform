const express=require('express');
const submitRouter=express.Router();
const usermiddleware=require('../middleware/usermiddleware');
const {submitCode,runCode}=require('../controllers/userSubmission');

submitRouter.post("/submit/:_id",usermiddleware,submitCode);
submitRouter.post("/run/:_id",usermiddleware,runCode);

module.exports=submitRouter;