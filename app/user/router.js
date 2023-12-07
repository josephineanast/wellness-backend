const express = require("express");
const router = express.Router();
const User = require("../user/model");

router.get("/vendors", async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" });

    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
