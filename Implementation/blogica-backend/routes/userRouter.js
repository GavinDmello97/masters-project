var express = require("express");
const bodyParser = require("body-parser");
var passport = require("passport");
var path = require("path");
const Article = require("../models/articles");
const User = require("../models/users");
const authenticate = require("../config/authenticate");
const cors = require("../config/cors");
const UserPropUpdate = require("../components/UserPropUpdate");
const UploadFile = require("../components/UploadFile");

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.options("*", cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

/* GET users listing. */
userRouter.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

userRouter.get(
  "/userDetails",
  cors.cors,
  authenticate.verifyUser,
  (req, res, next) => {
    User.findById(req.user._id)
      .populate(
        req.query.hasToken && req.query.hasToken == "true"
          ? [
              {
                path: `published.articles`,
              },
              {
                path: `recents.articles`,
              },
              {
                path: `saved.articles`,
              },
              {
                path: "badges.badge",
              },
            ]
          : [
              {
                path: `published.articles`,
              },
            ]
      )
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          const {
            published,
            recents,
            favorites,
            saved,
            _id,
            firstname,
            lastname,
            fullname,
            bio,
            image_url,
            username,
            badges,
          } = user;

          var userDetails =
            req.query.hasToken && req.query.hasToken == "true"
              ? {
                  _id,
                  firstname,
                  lastname,
                  fullname,
                  bio,
                  image_url,
                  username,
                  badges,
                  published,
                  recents,
                  favorites,
                  saved,
                }
              : {
                  _id,
                  firstname,
                  lastname,
                  fullname,
                  bio,
                  image_url,
                  username,
                  badges,
                  published,
                };

          res.json(userDetails);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

userRouter.post(
  "/signup",
  cors.corsWithOptions,
  UploadFile.multerConfig().single("image"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(401).json({ error: "Please provide an image" });
    }
    var image_url = await UploadFile.uploadPhoto(req.file, "users", 720, 720);

    // register is a passport method
    User.register(
      new User({
        username: req.body.username,
      }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
        } else {
          user.firstname = req.body.firstname;
          user.lastname = req.body.lastname;
          user.fullname = req.body.firstname + " " + req.body.lastname;
          user.email = req.body.email;
          user.image_url = image_url;
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.json({ err: err });
              return;
            }
            passport.authenticate("local")(req, res, () => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          });
        }
      }
    );
  }
);

userRouter.post("/login", cors.corsWithOptions, (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({
        success: false,
        status: "Login Unsuccessful!",
        err: info,
      });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        return res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!",
        });
      }

      var token = authenticate.getToken({ _id: req.user._id });
      User.findById(req.user._id)
        // .populate(["published.articles"])
        .then(
          (user) => {
            const {
              published,
              saved,
              favorites,
              _id,
              firstname,
              lastname,
              fullname,
              bio,
              image_url,
              username,
            } = user;
            var userDetails = {
              _id,
              firstname,
              lastname,
              fullname,
              bio,
              image_url,
              username,
              badges,
              published,
              saved,
              favorites,
            };
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: true,
              status: "Login Successful!",
              token: token,
              user: userDetails,
            });
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });
  })(req, res, next);
});

userRouter.post("/usernameCheck", cors.corsWithOptions, (req, res, next) => {
  User.find({}, "username", (err, docs) => {
    if (err) {
      return next(err);
    }
    var tempData = docs.map((doc) => doc.username);
    if (tempData.includes(req.body.username)) {
      statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "failed", message: "Username already taken!" });
    } else {
      statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "success", message: "Username available!" });
    }
  });
});

userRouter.get("/checkJWTtoken", cors.corsWithOptions, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
    }
  })(req, res);
});

var categories = ["favorites", "saved", "recents", "published"];
var properties = ["articles"];

userRouter
  .route("/category")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    if (req.query.property == "articles") {
      UserPropUpdate.getArticlesByProperty(req, res, next);
    }
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.query.category == "favorites" && req.query.property == "articles") {
      Article.findById(req.body.id).then((article) => {
        article.numberOfLikes += 1;
        article.save();
      });
    }
    if (req.query.property == "articles") {
      UserPropUpdate.addArticleToUser(req, res, next);
    }
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported on /users/category");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (
      categories.includes(req.query.category) &&
      properties.includes(req.query.property)
    ) {
      if (
        req.query.category == "favorites" &&
        req.query.property == "articles"
      ) {
        Article.findById(req.body.id).then((article) => {
          article.numberOfLikes -= 1;
          article.save();
        });
      }
      if (req.query.property == "articles") {
        UserPropUpdate.deleteArticlesFromUser(req, res, next);
      }
    } else {
      err = new Error(
        "Information about the category or the property does not exist in the system"
      );
      err.status = 404;
      return next(err);
    }
  });

module.exports = userRouter;
