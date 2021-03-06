const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      age: req.body.age,
      full_name: req.body.full_name,
      bugs: req.body.bugs,
    });

    User.findOne({ email: { $eq: req.body.email } })
      .then((user1) => {
        if (user1) {
          return res.status(401).json({
            message: "User Already Exist",
          });
        }

        user.save().then((result) => {
          if (!result) {
            return res.status(500).json({
              message: "Error Creating USer",
            });
          }
          res.status(201).json({
            message: "User created!",
            result: result,
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: { $eq: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed no such user",
        });
      }
      // console.log("USER",user);
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed inccorect password",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((e) => {
      console.error(e);
    });
});

router.get("", (req, res, next) => {
  User.find()
    .then((prof) => {
      if (prof) {
        res.status(200).json(prof);
      } else {
        res.status(404).json({ message: "Profiles not found!" });
      }
    })
    .catch((e) => {
      console.error(e);
    });
});
module.exports = router;
