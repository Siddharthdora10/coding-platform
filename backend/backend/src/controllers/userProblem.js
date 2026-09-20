const {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility");
const Problem=require("../models/problem");
const User = require("../models/user");
const submission = require("../models/submission");

const createProblem=async(req,res)=>{
    const{
        title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution, problemCreator
    }=req.body;
    try{
      for(const {language,completeCode} of referenceSolution){
    
    //source_code:
    //language_id:
    //stdin:
    //expectedOutput:
     const languageId=getLanguageById(language);
 
      const submissions=visibleTestCases.map((testCase)=>({
        source_code:completeCode,
        language_id:languageId,
       stdin: testCase.input,
      expected_output: testCase.output

      }));

      const submitResult=await submitBatch(submissions);


      const resultToken=submitResult.map((value)=>value.token);

      let finalResult;

 while (true) {

    const result = await submitToken(resultToken);

    const isResultObtained = result.submissions.every(
        (r) => r.status.id > 2
    );

    if (isResultObtained) {
        finalResult = result.submissions;
        break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
}

for (const test of finalResult) {
     console.log(
        "JUDGE0 FINAL RESULT:",
        JSON.stringify(test, null, 2)
    );

    if (test.status.id !== 3) {
        return res.status(400).json({
            message: "Reference solution failed."
        });
    }
}
    }
    const userProblem =await Problem.create({
      ...req.body,
      problemCreator:req.result._id
    });

    res.status(201).send("Problem Saved Successfully");

    
    }
   catch(err){
    console.error("CREATE PROBLEM ERROR:", err);
    res.status(400).send("Error: " + err.message);

   }
}

const updateProblem=async(req,res)=>{

 const{id}=req.params
const{
        title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution, problemCreator
    }=req.body;

    
    try{
     if(!id){
    return res.status(400).send("missing id field");
     }
     const DsaProblem = await Problem. findById(id);
 if( !DsaProblem)
  return res.status(404) .send("Id is not persent in server");  

      for(const {language,completeCode} of referenceSolution){
    
    //source_code:
    //language_id:
    //stdin:
    //expectedOutput:
     const languageId=getLanguageById(language);
 
      const submissions=visibleTestCases.map((testCase)=>({
        source_code:completeCode,
        language_id:languageId,
       stdin: testCase.input,
      expected_output: testCase.output

      }));

      const submitResult=await submitBatch(submissions);


      const resultToken=submitResult.map((value)=>value.token);

      let finalResult;

 while (true) {

    const result = await submitToken(resultToken);

    const isResultObtained = result.submissions.every(
        (r) => r.status.id > 2
    );

    if (isResultObtained) {
        finalResult = result.submissions;
        break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
}

for (const test of finalResult) {
    
    if (test.status.id !== 3) {
        return res.status(400).json({
            message: "Reference solution failed."
        });
    }
}
    }
  const newProblem= await Problem. findByIdAndUpdate( id,{...req.body}, {runValidators:true, new: true});
  res.status(200).send(newProblem)

    }
    catch(err){
       res.status(404).send("Error"+err);
    }

}

const deleteProblem=async(req,res)=>{
    try{
    const {id}= req.params;
    if(!id)
 return res.status(400).send("ID is Missing");
const deletedProblem = await Problem. findByIdAndDelete(id);

if( !deletedProblem)
return res.status(404).send("problem is Missing");
res.status(200).send("successfully Deleted");
}

catch(err){
  res.status(500).send("Error"+err);
}
}

const getProblemById=async(req,res)=>{
    try{
    const {id}= req.params;
    if(!id)
 return res.status(400).send("ID is Missing");
const getProblem = await Problem. findById( id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

if( !getProblem)
return res.status(404).send("problem is Missing");
res.status(200).send(getProblem);
}

catch(err){
  res.status(500).send("Error"+err);
}
}

const getAllProblem=async(req,res)=>{
    try{
    
 
const getProblem = await Problem. find({}).select('_id title difficulty tags ');

if( getProblem.length===0)
return res.status(200).send([]);
res.status(200).send(getProblem);
}

catch(err){
  res.status(500).send("Error"+err);
}
}

const solvedAllProblemByUser=async(req,res)=>{
   try{
  const userId=req.result.id;
  const user=await User.findById(userId).populate({
    path:"problemSolved",
    select:"_id title difficulty tags"
  });
  res.status(200).send(user.problemSolved);
   }
   catch(err){
     res.status(500).send('sever error occured '+err);
   }
}


const sumittedProblem=async(req,res)=>{
    try{
    const userId=req.result.id;
    const problemId=req.params.pid;
  const ans=await submission.find({userId,problemId});

    return res.status(200).send(ans);

    }
    catch(err){
     res.status(500).send("internal server error"+err);
    }
}


module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,sumittedProblem};
