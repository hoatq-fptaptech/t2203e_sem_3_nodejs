const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const config_mail = {
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user:'quanghoa@gmail.com',
        pass: 'hemqnnrhvxyzpofx'
    }
};
const transport = nodemailer.createTransport(config_mail);
exports.register = (req,res)=>{
    res.render("auth/register");
};
exports.create = async (req,res)=>{
    // kiem tra email da co hay chua
    let existUser = await User.findOne({email: req.body.email});
    if(existUser) res.status(422).send("Email is exist");
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    // save to db
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    user.save().then(rs=>res.send("done")).catch(err=>res.send(err));
}
exports.login =  (req,res)=>{
    res.render("auth/login");
}
exports.loginUser = async (req,res)=>{
    let existUser = await User.findOne({email: req.body.email});
    if(!existUser) return res.status(401).send("Email or password is not correct");
    const checkPassword = await bcrypt.compare(req.body.password,existUser.password);
    if(!checkPassword) return res.status(401).send("Email or password is not correct");
    // console.log(existUser);
    req.session.auth = {
        _id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        permissions: existUser.permissions
    }
    res.redirect("/students");
}
exports.changePassForm = (req,res)=>{
    res.render("auth/changePasswordForm");
}
exports.updatePass = async (req,res)=>{
    if(req.body.new_password !== req.body.confirm_password){
        return res.redirect("/auth/change-password");
    }
    const current_password = req.body.current_password;
    const auth = req.session.auth;
    let existUser = await User.findById(auth._id);
    if(!existUser){
        req.session.auth = null;
        return res.redirect("/auth/login");
    }
    const checkPassword = await bcrypt.compare(current_password,existUser.password);
    if(!checkPassword) return res.redirect("/auth/change-password");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.new_password,salt);
    User.findByIdAndUpdate(auth._id,{
        password: hashPassword
    }).then(rs=>{
        // logout ra -> login
        req.session.auth = null;
        res.redirect("/auth/login");
    }).catch(err=>{
        res.status(401).send("Error");
    })
}

exports.forgotPassword = async (req,res)=>{
    const email = req.body.email;
    const existUser = User.findOne({email: email});
    if(!existUser) return res.status(422).send("Email not found");
    const code = "abcxyz123"//Date.now()+existUser._id+Date.now();
    req.session.resetPassword = {
        code: code,
        user_id: existUser._id
    }
    const link = `http://localhost:3000/auth/reset-password?code=${code}`;
    transport.sendMail({
        from:'Demo NodeJS T2203E',
        to: existUser.email,
        cc: '',
        subject:"Test Send Mail function",
        html: `<p>Click <a href="${link}">here</a> to reset password</p>`
    });
    res.send("done");

}

exports.resetPasswordForm = (req,res)=>{
    const code = req.query.code;
    const code_session = req.session.resetPassword.code;
    if(code != code_session) return res.status(404).send("404 not found");
    res.send("update pass...");
}