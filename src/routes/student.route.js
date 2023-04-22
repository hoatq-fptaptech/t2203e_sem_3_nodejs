const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+file.originalname )
    }
})

const upload = multer({ storage: storage })

let router = express.Router();
let studentController = require("../controllers/student.controller");
router.get("/",studentController.get);
router.get("/create-student",studentController.createForm);
router.post("/create-student",upload.single("avatar"),studentController.save);
router.get("/edit-student/:id",studentController.editForm);
router.post("/edit-student/:id",studentController.update);
router.post("/delete-student/:id",studentController.delete);

module.exports = router;