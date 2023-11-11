const router = require("express").Router();
const authController = require("./controller");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getToken } = require("../../utils/utils");

passport.use(
  new LocalStrategy({ usernameField: "email" }, authController.localStrategy)
);

router.post("/register", authController.register);
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = getToken(user);

    res.json({
      user,
      token,
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  res.json({ message: "User logged out" });
});

router.get("/me", (req, res) => {
  res.json(req.user);
});

module.exports = router;
