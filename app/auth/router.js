const router = require("express").Router();
const authController = require("./controller");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getToken } = require("../../utils/utils");

passport.use(
  new LocalStrategy({ usernameField: "email" }, authController.localStrategy)
);

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/logout", (req, res) => {
  res.json({ message: "User logged out" });
});

router.get("/me", (req, res) => {
  res.json(req.user);
});

module.exports = router;
