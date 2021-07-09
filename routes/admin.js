const express = require("express");

const adminRouter = express.Router();
const auth = require("../middleware/auth");

const adminController = require("../controllers/AdminController");
adminRouter.get("/", auth, adminController.getIndex);
adminRouter.get("/add-menu", auth, adminController.getAddMenu);
adminRouter.post("/add-menu", auth, adminController.postAddMenu);
adminRouter.get("/menus", auth, adminController.getMenus);

adminRouter.get("/edit", auth, adminController.getEditMenu);
adminRouter.post("/edit", auth, adminController.postEditMenu);
adminRouter.post("/menu/delete", auth, adminController.deleteMenu);

adminRouter.get("/logout", auth, adminController.postLogOut);

module.exports = adminRouter;
