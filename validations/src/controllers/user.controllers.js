const express = require("express");

const { body, validationResult } = require("express-validator");

const router = express.Router();

const User = require("../models/user.models");

router.post(
  "",
  body("firstName").not().isEmpty(),
  body("email").not().isEmpty().isEmail(),
  body("pincode").not().isEmpty().isLength({ min: 5 }),
  body("age")
    .not()
    .isEmpty()
    .custom((value) => {
      if (value < 1 || value > 100) {
        throw new Error("Age is not valid to register");
      }
      return true;
    }),
  body("gender")
    .not()
    .isEmpty()
    .custom((gen) => {
      if (gen == "Male" || gen == "Female" || gen == "Others") {
        return true;
      }
    }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.create(req.body);
      return res.status(201).send({ user: user });
    } catch (error) {
      return res.status(500).send({ messge: error.messge });
    }
  }
);

router.get("", async (req, res) => {
  try {
    const user = await User.find().lean().exec();
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;
