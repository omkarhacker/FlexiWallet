const express = require("express");
const zod = require("zod");
const bcrypt = require("bcrypt");
const JWT_SECRET = require("../config");
const { User } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.get("/", (req, res) => {
  res.send("good to go");
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "email already taken",
    });
  }
  const user = User.findOne({
    username: body.username,
  });

  if (user._id) {
    return res.json({
      message: "email already taken",
    });
  }
  const { username, firstName, lastName, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hashSync(password, salt);
  const newUser = await User.create({
    username,
    firstName,
    lastName,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    JWT_SECRET
  );

  res.json({
    message: "user crated successfully",
    token: token,
  });
});

module.exports = router;
