module.exports = (function() {
  // Declare Variables
  var db = require('./database/db-connector');
  var express = require("express");
  var router = express.Router();

  // Access the sql object from the db-connector module
  var sql = db.sql;
  var config = db.config;

  // Here, we will write functions to handle
  // 1. Input validation
  // 2. Database queries (Create, Select (Read), Update, Delete (CRUD)
  // 3. Search queries
  // 4. Rendering the page

  function getSeekers(res, context, done) {
    const query = 'SELECT * FROM Seekers';

    sql.connect(config)
      .then((pool) => {
        return pool.request().query(query);
      })
      .then((result) => {
        const rows = result.recordset;

        context.seeker = rows.map((row) => {
          return {
            user_id: row.user_id,
            price_upper: row.price_upper,
            price_lower: row.price_lower,
          };
        });

        done();
      })
      .catch((err) => {
        console.error('Failed to query for seekers:', err);
        res.sendStatus(500);
      });
  }

  function getUserIDs(res, context, done) {
    const query = 'SELECT user_id FROM Users WHERE user_id NOT IN (SELECT user_id FROM Seekers)';

    sql.connect(config)
      .then((pool) => {
        return pool.request().query(query);
      })
      .then((result) => {
        const rows = result.recordset;

        context.user = rows.map((row) => {
          return {
            user_id: row.user_id,
          };
        });

        done();
      })
      .catch((err) => {
        console.error('Failed to query for users:', err);
        res.sendStatus(500);
      });
  }

  router.get('/', (req, res) => {
    var context = {};

    context.search_error = "error message for search";
    context.insert_error = "error message for insert";

    getSeekers(res, context, done);
    getUserIDs(res, context, done);

    var count = 0;
    function done() {
      count++;
      if (count == 2) {
        res.render('seekers', context);
      }
    }
  });

  router.post('/', (req, res) => {
    console.log("POST request received at /seekers");
  
    const query =
      "INSERT INTO Seekers(user_id, price_upper, price_lower) VALUES (@user_id, @price_upper, @price_lower)";
  
    const dataToInsert = {
      user_id: req.body.user_id,
      price_upper: req.body.price_upper,
      price_lower: req.body.price_lower,
    };
  
    sql.connect(config)
      .then((pool) => {
        const request = pool.request();
        for (const key in dataToInsert) {
          request.input(key, dataToInsert[key]);
        }
        return request.query(query);
      })
      .then(() => {
        res.redirect('/seekers');
      })
      .catch((err) => {
        console.error('Error executing query:', err);
        res.sendStatus(500);
      });
  });

  //This router object handles the requests to "/seekers"
  return router;
})();
