const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const userSchemas = Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["company", "vendor"],
    default: "company",
  },
  token: [String],
});

const User = mongoose.model("User", userSchemas);

userSchemas.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} needs to use valid email!`
);

userSchemas.path("email").validate(
  async function (value) {
    try {
      const user = await User.findOne({ email: value });
      return !user;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} has been registered`
);

const HASH_ROUND = 10;
userSchemas.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchemas.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchemas);
