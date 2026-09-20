const joi = require('joi');

const validsignup=(req,res,next)=>{
    const schema = joi.object({
        name:joi.string().min(3).required(),
        email:joi.string().email().required(),
        password:joi.string().min(4).max(100).required()
    });

    const {error} = schema.validate(req.body);

    if(error){
        return res.status(500).json({
            message:error.message
        });
    }
    next();
}


const validlogin=(req,res,next)=>{
    const schema = joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(4).max(100).required()
    });

    const {error} = schema.validate(req.body);

    if(error){
        return res.status(500).json({
            message:error.message
        });
    }
    next();
}

module.exports={
    validsignup,
    validlogin
};