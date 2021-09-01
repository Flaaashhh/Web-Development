//jshint esversion:6
// require modules
require ('dotenv').config() ;
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs") ;
const mongoose = require("mongoose") ;
const _ = require("lodash") ;
const encrypt = require("mongoose-encryption") ;

// pre
const app = express();

app.set('view engine', 'ejs'); // EJS
app.use(bodyParser.urlencoded({extended: true})); //body-parser
app.use(express.static("public")); // specifies static folders(css, images)

// Connect DataBase
mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true }) ;




// creating Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
}) ;

// Secret (Encryption)

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// model
const User = new mongoose.model("User", userSchema) ;





app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});


// Creating new user(Register)
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  }) ;

  newUser.save(function(err){
    if(!err){
      res.render("secrets") ;
    } else{
      console.log(err) ;
    }
  }) ;
}) ;

// Validating old user
app.post("/login", function(req, res){
  const username = req.body.username ;
  const password = req.body.password ;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err)
    } else{
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets") ;
        } else {
          res.send("Wrong password !")
        }
      }
    }
  })
}) ;



app.listen(3000,function(req, res){
  console.log("Server started on port 3000") ;
}) ;
