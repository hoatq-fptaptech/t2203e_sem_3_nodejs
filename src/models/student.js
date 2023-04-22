let mongoose = require("mongoose");
let student = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        minLength:[6,'Tên phải có độ dài tối thiểu là 6'],
        maxLength:255
    },
    email: {
        type:String,
        required:  true,
        unique: [true,'Email vừa nhập đã tồn tại'],
        minLength:6,
        maxLength:255,
        validate: {
            validator: (v)=>{
                const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                return v.match(emailFormat);
            },
            message: (t)=> `${t.value} không phải email`
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    tel: {
        type:String,
        required:true,
        validate: {
            validator: (v)=>{
                const regExp = /^(\([0-9]{3}\) |[0-9]{3})[0-9]{3}[0-9]{4}/;
                return v.match(regExp) && v.startsWith('0');
            },
            message: t => `${t.value} không phải là số điện thoại`
        }
    },
    avatar: String
});
module.exports = mongoose.model("Student",student);