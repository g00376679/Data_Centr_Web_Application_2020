const express = require("express");
const router = express.Router(); //check this plz
//app.set('view engine', 'ejs')
router.get("/", async (req, res, next) => {
  try {
    req.app.get("mysql")((err, connection) => {
      if (err) {
        return res.render("error", { error: err });
      }
      // get all cities from the DB
      connection.query("SELECT * FROM city", function (error, results) {
        if (error) {
          return res.render("error", { error: error.sqlMessage });
        }
        res.render("cities", { results });
      });
      connection.release();
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:city", async (req, res, next) => {
  try {
    req.app.get("mysql")((err, connection) => {
      if (err) {
        return console.error(err);
      }
      // get city based on country code and city code
      connection.query(
        "SELECT * FROM city INNER JOIN country ON country.co_code=city.co_code WHERE city.cty_code = ? ",
        [req.params.city],
        function (error, results) {
          if (error) {
            return res.render("error", { error: error.sqlMessage });
          }
          res.render("city_detail", { result: results[0] });
        }
      );
      connection.release();
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
