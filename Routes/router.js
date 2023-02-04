const express = require("express");
const router = express.Router();
const userController=require("../Controllers/userControllers");
const upload = require("../multerConfig/storageConfig");


//routes
router.post("/user/register",upload.single("user_profile"),userController.userpost)
router.get("/user/details",userController.userget)
router.get("/user/:id", userController.singleuserget)
router.patch("/user/edit/:id",upload.single("user_profile"),userController.useredit);
router.delete("/user/delete/:id",userController.userDelete);
router.put("/user/status/:id",userController.userStatus);
router.get("/userexports",userController.userExport);


module.exports = router;