const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const OrderModel = require("../models/OrderModel");
const MenuModel = require("../models/MenuModel");
const Mongoose = require("mongoose");
const axios = require("axios");
const MAIL_SERVER_ENDPOINT =
  "https://email-sender-java-api.herokuapp.com/sendemail"
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let cart = req.body.cart;
  console.log(req.body, cart);

  UserModel.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.redirect("/login");
    }
    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        if (user.isAdmin) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/admin/");
          });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.fullName = user.fullName;

        return req.session.save((err) => {
          console.log(err);
          console.log(req.session.user.fullName);
          if (!(cart == "")) {
            cart = cart.split(",");
            console.log(cart);

            cart.forEach((c) => {
              MenuModel.findById(new Mongoose.Types.ObjectId(c))
                .then((product) => {
                  return req.session.user.addToCart(product);
                })
                .then((ok) => {
                  next();
                });
            });
          }

          res.redirect("/");
        });
      }
      res.redirect("/signup");
    });
  });
};

module.exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.postSignUp = async (req, res, next) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.confirmPassword;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword || email === "") {
    res.render("public/signup", {
      title: "Sign up",
      isLoggedIn: req.session.isLoggedIn,
      fullName: "",
    });
  }
  //Same emails aren't allowed
  UserModel.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const User = new UserModel({
          name,
          surname,
          email,
          password: hashedPassword,
        });
        User.save().then((user) => {
          if (user) {
            console.log(user);

            res.render("public/login", {
              title: "Kycu",
              isLoggedIn: req.session.isLoggedIn,
              fullName: "",
            });
          }
        });
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

//test for contributor

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;

      res.render("user/cart", {
        title: "Your Cart",
        products: products,
        isLoggedIn: req.session.isLoggedIn,
        fullName: req.session.fullName,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.id;
  MenuModel.findById(id)
    .then((menu) => {
      return req.user.addToCart(menu);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new OrderModel({
        user: {
          name: req.user.fullName,
          email: req.user.email,
          userId: req.user._id,
        },
        products: products.map((p) => {
          return {
            quantity: p.quantity,
            product: {
              title: p.product.name,
              description: p.product.description,
              price: p.product.price,
              url: p.product.url,
            },
          };
        }),
      });
      return order.save();
    })
    .then((result) => {




      var total = 0;
      result.products.forEach(item => {
        total += (item.product.price * item.quantity);
      })

      var string = '';
      result.products.forEach(item => {
        string += item.product.title + ": " + (item.product.price * item.quantity) + "$, sasia: " + item.quantity + "\n";
      })


      console.log('--------------------------------------------------------------------------')

      return axios.post(MAIL_SERVER_ENDPOINT, {

        to: result.user.email,
        subject: 'Porosia',
        message: string,
        name: result.user.name,
        total
      });
    })
    .then((data) => {
      // if (data == "true") {
      //   return req.user.clearCart();
      // } else {
      //   throw new Error("Email not good");
      // }
      console.log(data);
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orderComplete");
    })
    .catch((err) => {
      console.log(err);

      res.redirect("/");
    });
};

exports.getOrderComplete = (req, res, next) => {
  res.render("user/orderComplete", {
    title: "Info rreth porosisë",
    isLoggedIn: req.session.isLoggedIn,
    fullName: req.session.fullName,
  });
};

exports.getVideo = (req, res, next) => {
  res.render("user/video", {
    title: "Video Sesioni",
    isLoggedIn: req.session.isLoggedIn,
    fullName: req.session.fullName,
  });
};
