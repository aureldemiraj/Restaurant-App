const MenuModel = require("../models/MenuModel");
const mongoose = require("mongoose");
const paths = {
  index: "/",
  addMenu: "add-menu",
  menus: "menus",
  edit: "/admin/edit",
};

module.exports.getIndex = (req, res, next) => {
  res.render("admin/index", {
    title: "Dashboard",
    paths: paths,
  });
};

module.exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

module.exports.getAddMenu = (req, res, next) => {
  res.render("admin/add-menu", {
    title: "Add Menu",
    paths: paths,
  });
};

module.exports.getMenus = (req, res, next) => {
  getAllMenus().then((docs) => {
    res.render("admin/menus", {
      title: "All menus",
      paths: paths,

      menus: docs,
    });
  });
};

module.exports.getEditMenu = (req, res, next) => {
  const id = req.query.id;
  MenuModel.findById({ _id: new mongoose.Types.ObjectId(id) }).then((doc) => {
    if (doc) {
      console.log(doc);

      res.render("admin/edit-menu", {
        title: "Edit Menu",
        menu: doc,
        paths: paths,
      });
    }
  });
};

module.exports.postEditMenu = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const imageurl = req.body.imageurl;
  const content = req.body.content;
  const category = req.body.category;
  const id = req.body.id;

  MenuModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
    name: name,
    price: price,
    description: description,
    url: imageurl,
    content: content,
    catergory: category,
  }).then((doc) => {
    if (doc) {
      res.redirect("/admin/menus");
      return;
    }
  });
};
module.exports.deleteMenu = (req, res, next) => {
  const id = req.body.id;
  MenuModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) }).then(
    (doc) => {
      if (doc) {
        res.redirect("/admin/menus");
        return;
      }
    }
  );
};

//POST ROUTES

module.exports.postAddMenu = (req, res, next) => {
  //   const { name, description, price, category, content, imageurl } = req.body;
  let menu = objectFromForm(req);
  menu.save().then((newMenu) => {
    if (newMenu) {
      console.log(newMenu);
      res.redirect("/admin/menus");
    }
  });
};

//functions
function getAllMenus() {
  return MenuModel.find({}, function (err, docs) {
    return docs;
  });
}

function objectFromForm(req) {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const imageurl = req.body.imageurl;
  const content = req.body.content;
  const category = req.body.category;
  const menu = new MenuModel({
    name: name,
    price: price,
    description: description,
    url: imageurl,
    content: content,
    category: category,
  });
  return menu;
}
