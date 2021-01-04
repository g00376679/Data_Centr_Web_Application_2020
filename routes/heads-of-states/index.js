const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    req.app.get("mongodb")(async (err, connection) => {
      if (err) {
        return res.render("error", { error: err });
      }
      let collection = connection.db().collection("headsOfState");
      res.render("heads-of-states", { results: await collection.find().toArray() });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/add", async (req, res, next) => {
  try {
    return res.render("add-heads-of-states", { errors: [] });
  } catch (error) {
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const errors = [];
    if (req.body.co_code.length < 3) {
      errors.push("Country Code must be 3 characters");
    }
    if (req.body.head_of_state.length < 3) {
      errors.push("Country Name must be atleast 3 characters");
    }
    if (errors.length) {
      return res.render("add-heads-of-states", { errors });
    }

    req.app.get("mysql")((err, connection) => {
      if (err) {
        return console.error(err);
      }
      connection.query("SELECT * FROM country WHERE co_code = ? ", [req.body.co_code], function (error, results) {
        if (error) {
          return res.render("error", { error: error.sqlMessage });
        }
        if (results.length < 1) {
          return res.render("add-heads-of-states", { errors: ["Country not found in MySQL database"] });
        }
        return req.app.get("mongodb")(async (err, connection) => {
          if (err) {
            return res.render("error", { error: err });
          }
          let collection = connection.db().collection("headsOfState");
          collection
            .insertOne({ _id: req.body.co_code, headOfState: req.body.head_of_state })
            .then(() => {
              res.redirect("/heads-of-states");
            })
            .catch((err) => {
              if(err.code === 11000){
                return res.render("error", { error: "head of state already present for this country" });
              }
             
            });
        });
      });
      connection.release();
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
