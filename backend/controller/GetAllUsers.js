const UserModel = require('../model/UserModels');

async function Getallusers(req,res)
{
    try{
        const getdata = await UserModel.find()
            .select('name email lastLoginAt createdAt')
            .sort({ lastLoginAt: -1, createdAt: -1 });

        if(!getdata){
            return res.status(500).json({
                message:"user data will not exists"
            });
        }

        return res.status(200).json({
            customers: getdata
        });
    }
    catch(err)
    {
        return res.status(500).json({
            message:err.message
        });
    }
}   

module.exports = Getallusers;
