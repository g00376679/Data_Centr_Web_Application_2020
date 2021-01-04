const express = require("express");
const router = express.Router();
const countries = require("./countries");
const cities = require('./cities');
const headsOfStates = require('./heads-of-states')

router.get("/", async (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    next(error);
  }
});
router.use("/countries", countries);
router.use("/cities",cities);
router.use("/heads-of-states",headsOfStates)

module.exports = router;
