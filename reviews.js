module.exports = (function() {
  // Declare Variables
  var express = require("express");
  var router = express.Router();
  var db = require('./database/db-connector');

  // Here, we will write functions to handle
  // 1. Input validation
  // 2. Database queries (Create, Select (Read), Update, Delete (CRUD)
  // 3. Search queries
  // 4. Rendering the page

  function getUserIDs(res, context, done) {
    const query = "SELECT user_id FROM Users";

    db.sql.connect(db.config, (err) => {
      if (err) {
        console.log("Failed to connect to the database: " + err);
        res.sendStatus(500);
        return;
      }

      const request = new db.sql.Request();

      request.query(query, (err, result) => {
        if (err) {
          console.log("Failed to query for users: " + err);
          res.sendStatus(500);
          return;
        }

        // return the context with a list of user_ids called users
        context.user_id = result.recordset.map((row) => {
          return {
            user_id: row.user_id,
          };
        });

        done();
      });
    });
  }

  function getAddresses(res, context, done) {
    const query = "SELECT address FROM Properties";

    db.sql.connect(db.config, (err) => {
      if (err) {
        console.log("Failed to connect to the database: " + err);
        res.sendStatus(500);
        return;
      }

      const request = new db.sql.Request();

      request.query(query, (err, result) => {
        if (err) {
          console.log("Failed to query for properties: " + err);
          res.sendStatus(500);
          return;
        }

        context.address = result.recordset.map((row) => {
          return {
            address: row.address,
          };
        });

        done();
      });
    });
  }

  function getReviews(res, context, done) {
    const query = "SELECT * FROM Reviews";

    db.sql.connect(db.config, (err) => {
      if (err) {
        console.log("Failed to connect to the database: " + err);
        res.sendStatus(500);
        return;
      }

      const request = new db.sql.Request();

      request.query(query, (err, result) => {
        if (err) {
          console.log("Failed to query for reviews: " + err);
          res.sendStatus(500);
          return;
        }

        context.review = result.recordset.map((row) => {
          return {
            review_id: row.review_id,
            user_id: row.user_id,
            address: row.address,
            stars: row.stars,
            description: row.description,
          };
        });

        done();
      });
    });
  }

  router.get('/', (req, res) => {
    var context = {};

    getUserIDs(res, context, done);
    getAddresses(res, context, done);
    getReviews(res, context, done);

    var count = 0;

    function done() {
      count++;
      if (count == 3) {
        res.render('reviews', context);
      }
    }
  });

  router.post('/', (req, res) => {
    console.log("POST request received at /reviews");

    var query =
      "INSERT INTO Reviews(user_id, address, stars, description) VALUES (@user_id, @address, @stars, @description)";

    var dataToInsert = {
      user_id: { type: db.sql.Int, value: req.body.user_id },
      address: { type: db.sql.VarChar, value: req.body.address },
      stars: { type: db.sql.Int, value: req.body.stars },
      description: { type: db.sql.VarChar, value: req.body.description },
    };

    db.sql.connect(db.config, (err) => {
      if (err) {
        console.log("Failed to connect to the database: " + err);
        res.sendStatus(500);
        return;
      }

      const request = new db.sql.Request();

      for (const key in dataToInsert) {
        request.input(key, dataToInsert[key].type, dataToInsert[key].value);
      }

      request.query(query, (err, result) => {
        if (err) {
          console.log("Error executing query: " + err);
          res.sendStatus(500);
          return;
        }

        res.redirect('/reviews');
      });
    });
  });

  // This router object handles the requests to "/reviews"
  return router;
})();
