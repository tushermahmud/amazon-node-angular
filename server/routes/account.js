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
    User.findOne({_id:req.decoded.user._id},(err,user)=>{
        res.json({
            success:true,
            user:user,
            message:'successful!'
        });
    });
});
router.post('/profile',checkJWT,(req,res,next)=>{
    User.findOne({_id:req.decoded.user._id},(err,user)=>{
        if(err) res.json({
            error:err
        });
        next();
        if(req.body.name) user.name=req.body.name;
        if(req.body.email) user.email=req.body.email;
        if(req.body.password) user.password=req.body.password;
        user.isSeller=req.body.isSeller;
        user.save();
        res.json({
            success:true,
            message:"user profile has been updated!"
        });
    });
});
router.get('/address',checkJWT,(req,res,next)=>{
    User.findOne({_id:req.decoded.user._id},(err,address)=>{
        res.json({
            success:true,
            address:address.address,
            message:'successful!'
        });
    });
});
router.post('/address',checkJWT,(req,res,next)=>{
    User.findOne({_id:req.decoded.user._id},(err,address)=>{
        if(err) res.json({
            error:err
        });
        next();
        if(req.body.address1) address.address.address1=req.body.address1;
        if(req.body.address2) address.address.address2=req.body.address2;
        if(req.body.city) address.address.city=req.body.city;
        if(req.body.state) address.address.state=req.body.state;
        if(req.body.country) address.address.country=req.body.country;
        if(req.body.postCode) address.address.postCode=req.body.postcode;

        address.save();
        res.json({
            success:true,
            message:"User address has been updated!"
        });
    });
});
module.exports=router;

