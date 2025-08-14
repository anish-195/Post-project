const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/loginform");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    username: String,
    password: String
});

module.exports =  mongoose.model("user" , userSchema);