const UserModel = require('../model/UserModels');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function LoginUser(req,res)
{   
    try{

        const {name,email,password} = req.body;
        
        const usersExists = await UserModel.findOne({ email });

        if(!usersExists)
        {
            return res.status(500).json({
                message:'User does not exist Please register'
            });
        }

        const isequal = await bcrypt.compare(password,usersExists.password);

        if(!isequal){
            return res.status(500).json({
                message:'password is incorrect'
            });
        }

        usersExists.lastLoginAt = new Date();
        await usersExists.save();

        const jwtToken = jwt.sign({email:usersExists.email,name:usersExists.name},
            process.env.JWT_SECRET,
            {'expiresIn':'24h'}
        );

        return res.status(200).json({
            message:'User Succesfully Login in',
            accesstoken: jwtToken
        });
    } 
    catch(err)
    {
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports = LoginUser;
