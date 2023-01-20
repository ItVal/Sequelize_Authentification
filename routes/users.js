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




module.exports = router;
