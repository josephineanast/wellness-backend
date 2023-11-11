const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils/utils.js");

const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: "Incorrect email or password" });
    }

    if (password === user.password) {
      const userWithoutPassword = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return done(null, userWithoutPassword);
    } else {
      return done(null, false, { message: "Incorrect email or password" });
    }
  } catch (err) {
    return done(err, null);
  }
};

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = new User(payload);
    await user.save();
    return res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({
        error: 1,
        message: info.message || "Email or Password incorrect",
      });
    }

    const token = jwt.sign(user, config.secretkey);

    await User.findByIdAndUpdate(user._id, { $push: { token: token } });

    return res.json({
      message: "Login Successful",
      user: user,
      token,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  const token = getToken(req);

  try {
    const user = await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token } },
      { useFindAndModify: false }
    );

    if (!user) {
      return res.json({
        error: 1,
        message: "No User Found!",
      });
    }

    return res.json({
      error: 0,
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};

const me = (req, res, next) => {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You're not logged in or your token has expired`,
    });
  }

  return res.json(req.user);
};

module.exports = {
  localStrategy,
  register,
  login,
  logout,
  me,
};
