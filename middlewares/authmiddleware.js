const { getToken, policyFor } = require("../utils/utils.js");
const jwt = require("jsonwebtoken");
const config = require("../app/config");
const User = require("../app/user/model");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretkey);

      let user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res.json({
          error: 1,
          message: "Token Expired",
        });
      }
    } catch (err) {
      if (err && err.name === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }

      next(err);
    }

    return next();
  };
}

async function checkAbility(req, res, next, action, subject) {
  const user = req.user;

  const ability = await policyFor(user);

  if (await ability.can(action, subject)) {
    return next();
  } else {
    return res.status(403).send("Unauthorized");
  }
}

module.exports = {
  decodeToken,
  checkAbility,
};
