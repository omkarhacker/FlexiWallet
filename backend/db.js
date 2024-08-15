const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm");


const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        require:true,
        minLength:6
    },
    firstName: {
        type:String,
        require:true,
        trim:true,
        maxLength:50
    },
    lastName: {
        type:String,
        require:true,
        trim:true,
        maxLength:50
    }
});

const User=mongoose.model("User",userSchema);

module.exports={
    User
}