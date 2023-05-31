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


  function getUserIDs(res, context, done){
    let query1 = "SELECT user_id FROM Users WHERE user_id NOT IN (SELECT user_id FROM Tenants)";
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

  function getTenantIDs(res, context, done){
    let query1 = "SELECT user_id FROM Tenants";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query: " + err);
        res.sendStatus(500);
        return;
      }

      // return the context with a list of user_ids calles tenantID
      context.tenantID = rows.map((row) => {
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

  function getTenants(res, context, done){
    let query1 = "SELECT * FROM Tenants";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query for Tenants: " + err);
        res.sendStatus(500);
        return;
      }

      //Format the data
      context.tenant = rows.map((row) => {
        return {
          user_id: row.user_id,
          role: row.role,
        };
      });

      // console.log(context);
      done();
    });
  }

  function getTenants_Properties(res, context, done){
    let query1 = "SELECT * FROM Tenants_Properties";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query for Tenants_Properties: " + err);
        res.sendStatus(500);
        return;
      }

      //Format the data
      context.tenantProperty = rows.map((row) => {
        return {
          user_id: row.user_id,
          address: row.address
        };
      });

      // console.log(context);
      done();
    });
  }
          
  router.get('/', (req, res) => {

    context = {};

    context.search_error = "error message for search";
    context.insert_error = "error message for insert";
    
    getUserIDs(res, context, done);
    getTenantIDs(res, context, done);
    getAddresses(res, context, done);
    getTenants(res, context, done);
    getTenants_Properties(res, context, done);


    var count = 0;
    function done(){
      count++;
      if (count == 5){
        // console.log("Rendering page");        
        // console.log(context);
        // Render the users.handlebars file with the context
        res.render('tenants_properties', context);
      }
    }
  });


  router.post('/', (req, res) => {
    console.log("POST request received at /tenants_properties");

    var query = 
    "INSERT INTO Tenants_Properties(user_id, price_upper, price_lower) VALUES (?, ?, ?)";

    var dataToInsert = [
      req.body.user_id,
      req.body.price_upper,
      req.body.price_lower,
    ]

    db.pool.query(query, dataToInsert, (err, results, fields) => {
      res.redirect('/seekers');
    });
  });

  router.post('/add-tenant-property', (req, res) => {

  });

  //This router object is what handles the requests to "/seekers"
  return router;
})();
