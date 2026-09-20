const express=require('express')
const authRouter= express.Router();
const {register,login,logout,adminregister,deleteProfile}=require('../controllers/userauthenticate');
const usermiddleware=require("../middleware/usermiddleware")
const adminmiddleware=require('../middleware/adminmiddleware')

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',usermiddleware,logout)
authRouter.post('/admin/register',adminmiddleware,adminregister)
authRouter.delete('/profile', usermiddleware, deleteProfile);
authRouter.get('/check',usermiddleware,(req,res)=>{
    const reply = {
firstName: req.result.firstName,
emailId: req.result.emailId,
 Id: req.result._id,
 role: req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"valid user"
    })

})




module.exports=authRouter;
