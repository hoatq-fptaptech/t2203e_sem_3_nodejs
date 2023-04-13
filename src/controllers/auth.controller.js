const User = require("../models/user");
const bcrypt = require("bcryptjs");
exports.register = async (req,res)=>{
    const existedUser = await User.findOne({email:req.body.email});
    if(existedUser) res.status(422).send("Email is exist");
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(req.body.password,salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPwd
    })
    user.save().then(rs=>res.send("done")).catch(err=>res.send(err));
}
exports.login = async (request, response) => {
    const user = await User.findOne({email: request.body.email});
    if (!user) return response.status(422).send('Email or Password is not correct');

    const checkPassword = await bcrypt.compare(request.body.password, user.password);

    if (!checkPassword) return response.status(422).send('Email or Password is not correct');

    return response.send(`User ${user.name} has logged in`);
}