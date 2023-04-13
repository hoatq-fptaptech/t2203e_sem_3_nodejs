require("dotenv").config();
const express = require("express");
const session = require('express-session');
// connect mongodb
const database = require("./src/database");
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Server is running...");
})
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: {
        maxAge: 60000 ,// miliseconds
        secure: true
    }}));

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const studentRouter = require("./src/routes/student.route");
const authRouter = require("./src/routes/auth.route");
app.use("/students",studentRouter);
app.use("/auth",authRouter);

app.get("/",function (req,res){
    req.session.User = {
        name: 'An',
        email: 'an@gmail.com'
    }
    // if(req.session.User){
//     return res.status(200).
    //     json({status: 'success', session: req.session.User})
    // }

    // req.session.destroy(function(err) {
    //     return res.status(200).json({status: 'success', session: 'cannot access session here'})
    // })

    res.send("Hello world!");
});
