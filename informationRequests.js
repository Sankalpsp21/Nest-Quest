module.exports = (function() {
  // Declare Variables
  var db = require('./database/db-connector');
  var express = require("express");
  var router = express.Router();

  function getUserIDs(res, context, done){
    let query1 = "SELECT user_id FROM Seekers";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query: " + err);
        res.sendStatus(500);
        return;
      }

      // return the context with a list of user_ids calles users
      context.user = rows.map((row) => {
        return {
          user_id: row.user_id,
        };
      });

      // console.log(context);
      done();
    });
  }

  function getAddresses(res, context, done){
    let query1 = "SELECT address FROM Properties";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query: " + err);
        res.sendStatus(500);
        return;
      }

      // return the context with a list of user_ids calles tenantID
      context.address = rows.map((row) => {
        return {
          address: row.address,
        };
      });

      // console.log(context);
      done();
    });
  }

  function getInformationRequests(res, context, done){
    let query1 = "SELECT * FROM InformationRequests";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query: " + err);
        res.sendStatus(500);
        return;
      }

      // return the context with a list of user_ids calles users
      context.informationRequest = rows.map((row) => {
        return {
          user_id: row.user_id,
          date_contacted: row.date_contacted,
          address: row.address
        };
      });

      // console.log(context);
      done();
    });
  }    
  
  router.get('/', (req, res) => {

    context = {};

    getUserIDs(res, context, done);
    getAddresses(res, context, done);
    getInformationRequests(res, context, done);

    var count = 0;
    function done(){
      count++;
      if (count == 3){
        // console.log("Rendering page");        
        // console.log(context);
        // Render the users.handlebars file with the context
        res.render('informationRequests', context);
      }
    }
  });

  router.post('/', (req, res) => {
    console.log("POST request received at /informationRequests");

    var query = 
    "INSERT INTO InformationRequests(user_id, date_contacted, address) VALUES (?, ?, ?)";

    var dataToInsert = [
      req.body.user_id,
      req.body.date_contacted,
      req.body.address
    ]

    db.pool.query(query, dataToInsert, (err, results, fields) => {
      res.redirect('/informationRequests');
    });
  });

  return router;
})();
