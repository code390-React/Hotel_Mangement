const UserModel = require('../model/UserModels');

require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function Postuser(req,res)
{
    try{

        const insertdata = await new UserModel(req.body);
        const {email} = insertdata;

        const userExists = await UserModel.findOne({email});

        if(userExists){
            return res.status(500).json({
                message:'User already exists'
            });
        }

        insertdata.password = await bcrypt.hash(insertdata.password,10);
        const savedata = await insertdata.save();

        const accesstoken = jwt.sign(
            {email:insertdata.email,name:insertdata.name},
            process.env.JWT_SECRET,
            {'expiresIn':'24h'}
        );


        return res.status(200).json({
            message:'user created succesfully',
            accesstoken
        });
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports = Postuser;