const Student = require("../models/student");
const nodemailer = require("nodemailer");
const config_mail = {
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user:'demo_email@gmail.com',
      pass: 'xmhlnmbplydgzvpy'
  }
};
const transport = nodemailer.createTransport(config_mail);
exports.get = async function(req,res){
    try{
        const auth = req.session.auth;
        const ls1 = await Student.find({});
       // const ls2 = await Student.find({name:"Nam"});
        res.render("student/list",{
            items: ls1,
            auth: auth
        });
    }catch(err){
        res.send(err);
    }

}
exports.createForm = (req,res)=>{
    res.render("student/form");
};
exports.save = async (req,res)=>{
    let s = req.body;
    const file = req.file;
    if(file)
        s.avatar = "/uploads/student/"+file.filename;
    let newStudent = new Student(s);
    try {
        await newStudent.save();
        // send email
        transport.sendMail({
            from:'Demo NodeJS T2203E',
            to: 'quanghoa@gmail.com,quang@gmail.com',
            cc: '',
            subject:"Test Send Mail function",
            html: '<p>Mail Send from Demo</p>'
        });
        // end
        res.redirect("/students");
    }catch (err){
        res.send(err);
    }

};
exports.editForm = (req,res)=>{
    let id = req.params.id;
    Student.findById(id).then(rs=>{
        res.render("student/edit",{
            data: rs
        });
    }).catch(err=>{
        res.send(err);
    })
};
exports.update = (req,res)=>{
    let id = req.params.id;
    const files = req.files;
    let data = req.body;
    Student.findByIdAndUpdate(id,data)
        .then(rs=>res.redirect("/students"))
        .catch(err=>res.send(err));
};
exports.delete = (req,res)=>{
    let id = req.params.id;
    Student.findByIdAndDelete(id)
        .then(rs=>res.redirect("/students"))
        .catch(err=>res.send(err));
};