module.exports = (function() {
  // Declare Variables
  var db = require('./database/db-connector');
  var express = require("express");
  var router = express.Router();

  // Here, we will write functions to handle
  // 1. Input validation
  // 2. Database queries (Create, Select (Read), Update, Delete (CRUD)
  // 3. Search queries
  // 4. Rendering the page
  function getSeekers(res, context, done){
    let query1 = "SELECT * FROM Seekers";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query for seekers: " + err);
        res.sendStatus(500);
        return;
      }

      //Format the data
      console.log("Fetched seekers successfully");
      context.seeker = rows.map((row) => {
        return {
          user_id: row.user_id,
          price_upper: row.price_upper,
          price_lower: row.price_lower,
        };
      });

      console.log(context);
      done();
    });
  }

  function getUserIDs(res, context, done){
    // Write an sql query to select all userIDs from users where user_id not in (select user_id from seekers)
    let query1 = "SELECT user_id FROM Users WHERE user_id NOT IN (SELECT user_id FROM Seekers)";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query for users: " + err);
        res.sendStatus(500);
        return;
      }

      // return the context with a list of user_ids calles users
      console.log("Fetched seekers successfully");
      context.user = rows.map((row) => {
        return {
          user_id: row.user_id,
        };
      });

      console.log(context);
      done();
    });
  }
 
  router.get('/', (req, res) => {

    context = {};

    context.search_error = "error message for search";
    context.insert_error = "error message for insert";
    getSeekers(res, context, done);
    getUserIDs(res, context, done);

    var count = 0;
    function done(){
      count++;
      if (count == 2){
        // console.log("Rendering page");        
        // console.log(context);
        // Render the users.handlebars file with the context
        res.render('seekers', context);
      }
    }
  });

  router.post('/', (req, res) => {
    console.log("POST request received at /seekers");

    var query = 
    "INSERT INTO Seekers(user_id, price_upper, price_lower) VALUES (?, ?, ?)";

    var dataToInsert = [
      req.body.user_id,
      req.body.price_upper,
      req.body.price_lower,
    ]

    db.pool.query(query, dataToInsert, (err, results, fields) => {
      res.redirect('/seekers');
    });
  });

  //This router object is what handles the requests to "/seekers"
  return router;
})();
