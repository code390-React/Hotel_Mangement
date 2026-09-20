const express = require('express');
const router = express.Router();

const {validsignup,validlogin} = require('../middleware/Authorization');

const Postuser = require('../controller/PostUser');
const LoginUser = require('../controller/LoginUser');
const Getallusers = require('../controller/GetAllUsers');

router.post('/user',validsignup,Postuser);
router.post('/login',validlogin,LoginUser);

router.get('/get',Getallusers);
router.get('/customers',Getallusers);

module.exports=router;
