const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/UserController");
const auth = require("../middleware/auth");
userRouter.post("/login", UserController.postLogin);
userRouter.post("/signup", UserController.postSignUp);
userRouter.get("/logout", UserController.postLogOut);

userRouter.post("/cart-delete-item", UserController.postCartDeleteProduct);
userRouter.post("/create-order", UserController.postOrder);

userRouter.post("/shto", auth, UserController.postCart);
userRouter.get("/cart", auth, UserController.getCart);
userRouter.post("/porosit", auth, UserController.postOrder);
userRouter.get("/orderComplete", auth, UserController.getOrderComplete);
userRouter.get("/video", auth, UserController.getVideo);
module.exports = userRouter;
