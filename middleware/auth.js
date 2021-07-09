const UserModel = require("../models/UserModel");
module.exports = (req, res, next) => {
  console.log(req.session.isLoggedIn);

  if (!req.session.isLoggedIn) {
    res.redirect("/login");
  }
  if (req.session && req.session.user._id) {
    UserModel.findById(req.session.user._id, function (err, user) {
      if (!err && user) {
        req.user = user;
        next();
      } else {
        next(new Error("Could not restore User from Session."));
      }
    });
  } else {
    next();
  }
};
