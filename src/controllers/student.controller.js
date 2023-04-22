const Student = require("../models/student");
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
exports.save = (req,res)=>{
    let s = req.body;
    const file = req.file;
    if(file)
        s.avatar = "/uploads/student/"+file.filename;
    let newStudent = new Student(s);
    newStudent.save().then(rs=>{
        res.redirect("/students");
    }).catch(err=>{
        res.send(err);
    })
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