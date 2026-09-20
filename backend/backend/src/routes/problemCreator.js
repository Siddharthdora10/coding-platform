const express=require('express')
const problemRouter= express.Router();
const adminmiddleware=require("../middleware/adminmiddleware")
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,sumittedProblem}=require("../controllers/userProblem")
const usermiddleware=require("../middleware/usermiddleware")

//admin
problemRouter.post("/create",adminmiddleware,createProblem);
problemRouter.put("/update/:id",adminmiddleware,updateProblem);
 problemRouter.delete("/delete/:id",adminmiddleware,deleteProblem);


 problemRouter.get("/problemById/:id",getProblemById);
 problemRouter.get("/getAllProblem/",getAllProblem);
 problemRouter.get("/problemSolvedByUser",usermiddleware,solvedAllProblemByUser);
problemRouter.get("/sumittedProblem/:pid",usermiddleware,sumittedProblem);

module.exports=problemRouter;
