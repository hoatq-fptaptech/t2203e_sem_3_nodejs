const permission = "student";
const express = require("express");
const multer = require("multer");
// chon thu muc muon luu anh
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'public/uploads/student');
    },
    filename: function (req,file,cb){
        cb(null,Date.now()+"-"+file.originalname);
    }
});
const upload = multer({storage:storage});

let router = express.Router();
let studentController = require("../controllers/student.controller");
const middleware = require("./../middlewares/student.middleware");
router.use(middleware.can_view);
router.use("/create-student",middleware.can_action);
router.use("/edit-student/:id",middleware.can_action);
router.use("/delete-student/:id",middleware.can_action);

router.get("/",studentController.get);
router.get("/create-student",studentController.createForm);
router.post("/create-student",upload.single("avatar"),studentController.save);
router.get("/edit-student/:id",studentController.editForm);
router.post("/edit-student/:id",upload.array("images"),studentController.update);
router.post("/delete-student/:id",studentController.delete);

module.exports = router;