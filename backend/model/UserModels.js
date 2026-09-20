const mongoose = require('mongoose');

const newschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    lastLoginAt:{
        type:Date,
        default:null
    }
},{ timestamps:true });

module.exports = mongoose.model("users",newschema);
