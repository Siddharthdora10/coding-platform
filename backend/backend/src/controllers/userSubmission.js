const Problem=require('../models/problem');
const submission=require('../models/submission');
const {getLanguageById,submitBatch,submitToken}=require('../utils/problemUtility');


const submitCode=async(req,res)=>{
try{
     const userId=req.result._id;
     const problemId=req.params._id;

     const{code,language}=req.body;

  


     if(!userId||!code||!problemId||!language)
        return res.status(400).send("some field is missing ");

     
     const problem=await Problem.findById(problemId);
     if (!problem) return res.status(404).send("problem is Missing");

    
    const submittedResult=await submission.create({
       userId,
       problemId,
       code,
       language,
       status:'pending',
       testCasesTotal:problem.hiddenTestCases.length
    })

    
  const languageId=getLanguageById(language);
  const submissions=problem.hiddenTestCases.map((testCase)=>({
        source_code:code,
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


let testcasesPassed=0;
let runtime=0;
let memory=0;
let status='accepted';
let errorMessage=null;
  for(const test of finalResult){
  if(test.status.id==3){
testcasesPassed++;
runtime =runtime+parseFloat(test.time)
memory = Math.max(memory, test.memory) ;
  }else{
    if(test.status.id==4){
        status='error';
        errorMessage=test.stderr
    }else{
        status='wrong';
        errorMessage=test.stderr;
    }

  }
  }

 

  submittedResult.status=status;
  submittedResult.testCasesPassed=testcasesPassed;
  submittedResult.errorMessage=errorMessage;
  submittedResult.runtime=runtime;
  submittedResult.memory=memory;

  await submittedResult.save();

if(status === 'accepted' && !req.result.problemSolved.some((id) => id.toString() === problemId)){
  req.result.problemSolved.push(problemId);
  await req.result.save();
}
  const accepted=(status=='accepted')
  res.status(201).json({
    accepted,
    testCasesTotal:submittedResult.testCasesTotal,
    passedTestcases:testcasesPassed,
    runtime,
    memory
  });
}
catch(err){
    console.error("SUBMIT ERROR:", err);
    res.status(500).send(err.message);
}


}

const runCode=async(req,res)=>{
  try{
     const userId=req.result._id;
     const problemId=req.params._id;

     const{code,language}=req.body;

  


     if(!userId||!code||!problemId||!language)
        return res.status(400).send("some field is missing ");

     
     const problem=await Problem.findById(problemId);
     if (!problem) return res.status(404).send("problem is Missing");

     

    
  const languageId=getLanguageById(language);
  const submissions=problem.visibleTestCases.map((testCase)=>({
        source_code:code,
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

  
  

  res.status(201).send(finalResult);
}
catch(err){
    console.error("SUBMIT ERROR:", err);
    res.status(500).send(err.message);
}
}


module.exports={submitCode,runCode};
