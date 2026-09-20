const jwt = require('jsonwebtoken');

const ensureautheticated = (req,res,next)=>{
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : authorization;

    if(!token){
        return res.status(403).json({
            message:'unauthorized jwt token was expired'
        })
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;

        next();

    }catch(err)
    {
        return res.status(401).json({
            message:err.message
        });
    }
}

module.exports=ensureautheticated;
