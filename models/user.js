const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.DB_URL);

const userSchema = mongoose.Schema({
    name: {
        typeof:String
    },
    email: String,
    age: Number,
    username: String,
    password: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId, ref: "post" }]
    
        
});

module.exports =  mongoose.model("user" , userSchema);