const MenuModel = require("../models/MenuModel");
const UserModel = require("../models/UserModel");
const obj = (req, cart) => {
  return {
    isLoggedIn: req.session ? req.session.isLoggedIn : false,
    fullName: req.session && req.session.user ? req.session.fullName : "",
  };
};

exports.getIndex = (req, res, next) => {
  if (req.session.isLoggedIn) {
    if (req.session.user.isAdmin) {
      return res.redirect("/admin");
    }
  }
  console.log(obj(req));

  MenuModel.find({})
    .limit(3)
    .exec(function (err, products) {
      console.log(obj(req));

      return res.render("index", {
        title: "Homepage",
        products: products,
        ...obj(req),
      });
    });
};

exports.getSignUp = (req, res, next) => {
  isLoggedIn: req.session.isLoggedIn,
    res.render("public/signup", {
      title: "Regjistrohu",
      ...obj(req),
    });
};

exports.getLogin = (req, res, next) => {
  res.render("public/login", {
    title: "Kyçja në Llogari",
    ...obj(req),
  });
};

exports.getMenu = (req, res, next) => {
  MenuModel.find({}).exec(function (err, products) {
    return res.render("menu", {
      title: "Menyja e Plote",
      products: products,
      ...obj(req),
    });
  });
};

exports.getVideo = (req, res, next) => {
  res.render("public/video", {
    title: "404-Faqja nuk ekziston",
    ...obj(req),
  });
};

exports.get404 = (req, res, next) => {
  res.render("public/404", {
    title: "404-Faqja nuk ekziston",
    ...obj(req),
  });
};
