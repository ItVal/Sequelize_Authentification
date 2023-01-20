var express = require('express');
var router = express.Router();

const Models = require('./../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
const User = Models.User;
// dotenv.config();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//create user
router.post('/', async(req, res, next)=>{
  //res.status(201).json(req.body);
  //add new user and return 201
  const salt = await bcrypt.genSalt(10);
  var usr = {
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    password : await bcrypt.hash(req.body.password, salt)
  };
  //code responsible for adding the user record in the MySQL database
  created_user = await User.create(usr);
  res.status(201).json(created_user);
});

//login user
router.post('/login',async(req,res,next)=>{
  const user = await User.findOne({ where : {email : req.body.email }});
  if(user){
     const password_valid = await bcrypt.compare(req.body.password,user.password);
     if(password_valid){
         token = jwt.sign({ "id" : user.id,"email" : user.email,"first_name":user.first_name },process.env.SECRET);
         res.status(200).json({ token : token });
     } else {
       res.status(400).json({ error : "Password Incorrect" });
     }
   
   }else{
     res.status(404).json({ error : "User does not exist" });
   }
   
   });

//Securing a route using middleware and JWT verification
router.get('/me',
 async(req,res,next)=>{
  try {
    let token = req.headers['authorization'].split(" ")[1];
    let decoded = jwt.verify(token,process.env.SECRET);
    req.user = decoded;
    next();
  } catch(err){
    res.status(401).json({"msg":"Couldnt Authenticate"});
  }
  },
  async(req,res,next)=>{
    let user = await User.findOne({where:{id : req.user.id},attributes:{exclude:["password"]}});
    if(user === null){
      res.status(404).json({'msg':"User not found"});
    }
    res.status(200).json(user);
 }); 


module.exports = router;
