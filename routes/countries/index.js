const express = require("express");
const router = express.Router();

// get all countries from the DB
router.get("/", async (req, res, next) => {
  try {
    req.app.get("mysql")((err, connection) => {
      if (err) {
        return res.render("error", { error: err });
      }
      connection.query("SELECT * FROM country", function (error, results) {
        if (error) {
          return res.render("error", { error: error.sqlMessage });
        }
        res.render("countries", { results });
      });
      connection.release();
    });
  } catch (error) {
    next(error);
  }
});

// this is for adding new country
router.get("/add", async (req, res, next) => {
  try {
    return res.render("add-country", { errors: [] });
  } catch (error) {
    next(error);
  }
});

// this is for updating already present country
router.get("/:country/update", async (req, res, next) => {
  try {
    req.app.get("mysql")((err, connection) => {
      if (err) {
        return console.error(err);
      }
      connection.query("SELECT * FROM country WHERE co_code = ? ", [req.params.country], function (error, results) {
        if (error) {
          return res.render("error", { error: error.sqlMessage });
        }
        if (results.length == 0) {
          return res.render("error", { error: "No record found" });
        }
        return res.render("edit-country", { result: results[0], errors: [] });
      });
      connection.release();
    });
  } catch (error) {
    next(error);
  }
});

// this is for adding country code and checking validation also
router.post("/add", async (req, res, next) => {
  try {
    const errors = [];
    if (req.body.co_code.length < 3) {
      errors.push("Country Code must be 3 characters");
    }
    if (req.body.co_name.length < 3) {
      errors.push("Country Name must be atleast 3 characters");
    }
    if (errors.length) {
      return res.render("add-country", { errors });
    }

    req.app.get("mysql")((err, connection) => {
      if (err) {
        return console.error(err);
      }
      connection.query("INSERT INTO country SET  ?", req.body, function (error) {
        if (error) {
          if (error.errno === 1062) {
            return res.render("add-country", { errors: ["Error: " + req.body.co_code + " already exist."] });
          }
          return res.render("error", { error: error.sqlMessage });
        }
        res.redirect("/countries");
      });
      connection.release();
    });
  } catch (error) {
    next(error);
  }
});

// this is for updating country code
router.post("/:country/update", async (req, res, next) => {
  try {
    const errors = [];
    if (req.body.co_code.length < 3) {
      errors.push("Country Code must be 3 characters");
    }
    if (req.body.co_name.length < 3) {
      errors.push("Country Name must be atleast 3 characters");
    }
    if (errors.length) {
      return res.render("edit-country", { result: req.body, errors });
    }

    req.app.get("mysql")((err, connection) => {
      if (err) {
        return console.error(err);
      }
      connection.query(
        "UPDATE country SET  ? where co_code = ?",
        [{ co_name: req.body.co_name, co_details: req.body.co_details }, req.body.co_code ],
        function (error) {
          if (error) {
            if (error.errno === 1062) {
              return res.render("edit-country", { result: req.body, errors: ["Error: " + req.body.co_code + " already exist."] });
            }
            return res.render("error", { error: error.sqlMessage });
          }
          res.redirect("/countries");
        }
      );
      connection.release();
    });
  } catch (error) {
    next(error);
  }
});
// this is for delete country
router.get("/:country/delete", async (req, res, next) => {
    try {  
      req.app.get("mysql")((err, connection) => {
        if (err) {
            return res.render("error", { error: err.sqlMessage });
        }
        connection.query(
          "DELETE FROM country where co_code = ?",
          [req.params.country],
          function (error) {
            if (error) {
                if(error.errno === 1451){
                    return res.render("error", { error: `${req.params.country} has cities it can not be deleted.` });
                }
              return res.render("error", { error: error.sqlMessage });
            }
            res.redirect("/countries");
          }
        );
        connection.release();
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
