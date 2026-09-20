const ensureautheticated = require('../middleware/Auth');

const express = require('express');
const router = express.Router();

router.get('/',ensureautheticated,(req,res)=>{
    res.status(200).json({
        name:"Mobile",
        price:10000
    })
});

router.get('/profile', ensureautheticated, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports=router;
