const router = require('express').Router();
const jwt =require('jsonwebtoken');
const User=require('../models/user');
const checkJWT = require('../middlewares/check-jwt');
const config = require('../config');
router.post('/signup',(req,res,next)=>{
    let user=new User();
    user.name=req.body.name;
    user.email=req.body.email;
    user.password=req.body.password;
    user.token=req.body.token;
    user.picture=user.gravatar();
    user.isSeller=req.body.isSeller;

    User.findOne({email:req.body.email},(err,existUser)=>{
       if(existUser){
           res.json({
                success:false,
                message:"the email is aleady exists"
           });
       }
       else{
           user.save();
           var token=jwt.sign({
               user:user
           },config.secret,{
               expiresIn:  '7d'
           });
           res.json({
               success:true,
               message: "enjoy your token" ,
               token:token
           });
       }

    });
});
router.post('/login',(req,res,next)=>{
    User.findOne({email:req.body.email},(err,user)=>{
        if(err) throw err;
        if(!user){
            res.json({
               success:false,
                message:'authentication Failed.USer not found!'
            });
        }
        else if(user){
            var validPassWord = user.comparePassword(req.body.password);
            if(!validPassWord){
                res.json({
                    success:false,
                    message:'username or password does not match!'
                });
            }
            else{
                var token=jwt.sign({
                    user:user
                },config.secret,{
                    expiresIn:  '7d'
                });
                res.json({
                    success:true,
                    message:'enjoy your token',
                    token:token
                });
            }
        }
    });
});
router.get('/profile',checkJWT,(req,res,next)=>{
    console.log("tusher");
    User.findOne({_id:req.decoded.user._id},(err,user)=>{
        res.json({
            success:true,
            user:user,
            message:'successful!'
        });
    });
});
module.exports=router;

