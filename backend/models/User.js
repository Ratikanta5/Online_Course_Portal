const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        required: true,
    },
    otp:{
        type: Number,
        requried: true,
    },
    bio:{
        type: String,
    },
    profileImage:{
        url: String,
        filename: String,
    },
    role:{
        type: String,
        required: true,
        enum: ["admin", "manager", "user"]
    },
},{
    timestamps: true,
})


const User = mongoose.Schema("User",userSchema);

module.exports = User;