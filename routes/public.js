const express = require("express");
const router = express.Router();
const publicController = require("../controllers/PublicController");

router.get("/", publicController.getIndex);

router.get("/login", publicController.getLogin);

router.get("/signup", publicController.getSignUp);
router.get("/menu", publicController.getMenu);
router.get("/video", publicController.getVideo);
router.get("*", publicController.get404);
module.exports = router;
