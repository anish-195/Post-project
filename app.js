const express = require("express");
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const saltRounds = 10;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/loggedout", isLoggedin, (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/profile", isLoggedin, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");  // ✅ populate posts so you get actual post objects

  res.render("profile", { user });
});



app.post("/profile", isLoggedin, async (req, res) => {
  let { content, title } = req.body;
  let post = await postModel.create({
    content,
    title
  });

  let user = await userModel.findOne({ email: req.user.email });
  user.posts.push(post);
  await user.save();

  res.redirect("/profile");
});

// registration
app.post("/registration", async (req, res) => {
  let { name, email, age, username, password } = req.body;

  if (!name || !email || !age || !username || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).redirect("/login");

    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return res.status(500).send("Error generating salt");

      bcrypt.hash(password, salt, async (error, hash) => {
        if (error) return res.status(500).send("Error hashing password");

        let newUser = await userModel.create({
          name,
          email,
          age,
          username,
          password: hash,
        });

        let token = jwt.sign(
          { email: newUser.email, username: newUser.username },
          process.env.JWT_SECRET
        );

        res.cookie("token", token);
        res.status(201).send("Registered successfully");
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// login

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("Samething wrong ");

  let match = await bcrypt.compare(password, user.password);
  let token = jwt.sign(
    { email: user.email, username: user.username },
    process.env.JWT_SECRET
  );

  res.cookie("token", token);

  if (match) return res.status(200).redirect("/profile");
});

function isLoggedin(req, res, next) {
  let token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Unauthorized");
    req.user = decoded;
    next();
  });
}

app.listen(process.env.PORT, () => {
  console.log("http://localhost:5000");
});
