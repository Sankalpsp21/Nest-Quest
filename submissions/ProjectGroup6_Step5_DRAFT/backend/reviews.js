module.exports = (function() {
  // Declare Variables
  var express = require("express");
  var router = express.Router();
  var db = require('./database/db-connector');
  var search_error = "";
  var insert_error = "";
  var update_error = "";

  // Here, we will write functions to handle
  // 1. Input validation
  // 2. Database queries (Create, Select (Read), Update, Delete (CRUD)
  // 3. Search queries
  // 4. Rendering the page

  // Context for layout:
  // jxscripts: a list of javascript files to include



  // Route for showing a specific User entry to update
  // router.get('/:id', function(req, res, next){

  function getUserIDs(res, context, done){
    let query1 = "SELECT user_id FROM Users";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query for users: " + err);
        res.sendStatus(500);
        return;
      }

      // return the context with a list of user_ids calles users
      context.user_id = rows.map((row) => {
        return {
          user_id: row.user_id,
        };
      });
      done();

      // console.log(context);
    });
  }

  function getAddresses(res, context, done){
    let query = "SELECT address FROM Properties";
    db.pool.query(query, (err, rows, fields) => {
      if(err){
        console.log("Failed to query for properties: " + err);
        res.sendStatus(500);
        return;
      }
      context.address = rows.map((row) =>{
        return {
          address: row.address,
        };
      });

      done();
    }
    )
  }

  function getReviews(res, context, done){
    let query1 = "SELECT * FROM Reviews";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query for users: " + err);
        res.sendStatus(500);
        return;
      }

      // return the context with a list of
      context.review = rows.map((row) => {
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
  }

  router.get('/', (req, res) => {
    // Get the username from your data source or wherever it is available
    context = {};
    getUserIDs(res, context, done);
    getAddresses(res, context, done);
    getReviews(res, context, done);


    var count = 0;
    function done(){
      count++;
      if (count == 3){
        res.render('reviews', context);
      }
    }
  });


  router.post('/', (req, res) => {
    console.log("POST request received at /reviews");

    var query = "INSERT INTO Reviews(user_id, address, stars, description) VALUES (?, ?, ?, ?)";

    var dataToInsert = [
      req.body.user_id,
      req.body.address,
      req.body.stars,
      req.body.description,
    ]

    db.pool.query(query, dataToInsert, (err, results, fields) => {
      res.redirect('/reviews');
    });
  });

  //This router object is what handles the requests to "/reviews"
  return router;
})();
