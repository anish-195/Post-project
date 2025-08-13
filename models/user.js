const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/loginform");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    name: String,
    age: Number,
    password: String
});

module.exports =  mongoose.model("user" , userSchema);