const express = require('express');
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');


const app  =  express();

app.set("view engine" , "ejs");
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const saltRounds = 10;

app.get("/" , (req , res) => {
    res.render("index")
});


app.post("/registration", async (req, res)=>{
    let {name, email, age, username, password} = req.body;
    // let user = await userModel.findOne({email})
    // if(user) return res.status(500).send("You are already LogIn")
    
    bcrypt.genSalt(saltRounds, (err,salt)=>{
        bcrypt.hash(password,salt,(error,hash) =>{
             userModel.create({name,email,age,username,password:hash})
        })

        let token = jwt.sign({email: email , username: username}, "ddsdsss");
        res.cookie("token" , token);
        res.send("Registered");
    })
        
})



app.listen(3000, () => {
    console.log("http://localhost:3000");
});