const express = require("express");
const zod = require("zod");
const bcrypt = require("bcrypt");
const JWT_SECRET = require("../config");
const { User } = require("../db");
const router = express.Router();
const jwt = require("jsonwebtoken");


router.get("/", (req, res) => {
  res.send("good to go");
});


//signup

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
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


//update user

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
});


//find user on basis of substring of userfield

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});






module.exports = router;
