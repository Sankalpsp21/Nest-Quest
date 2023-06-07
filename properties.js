module.exports = (function() {
  // Declare Variables
  var db = require('./database/db-connector');
  var express = require("express");
  var router = express.Router();
  var search_error = "";
  var insert_error = "";
  var update_error = "";

  // Here, we will write functions to handle
  // 1. Input validation
  // 2. Database queries (Create, Select (Read), Update, Delete (CRUD)
  // 3. Search queries
  // 4. Rendering the page

  function getProperties(res, context, done){
    let query1 = "SELECT * FROM Properties";
    db.pool.query(query1, (err, rows, fields) => {
      if(err) {
        console.log("Failed to query for properties: " + err);
        res.sendStatus(500);
        return;
      }

      //Format the data
      console.log("Fetched properties successfully");
      context.property = rows.map((row) => {
        return {
          address: row.address,
          rooms: row.rooms,
          bathrooms: row.bathrooms,
          sqft: row.sqft,
          rent: row.rent,
          utilities: row.utilities,
          description: row.description,
        };
      });
      
      done();
    });
  }

  router.post('/', (req, res) => {
    console.log("POST request received at /properties");

    var query = "INSERT INTO Properties(address, rooms, bathrooms, sqft, rent, utilities, description) VALUES(?, ?, ?, ?, ?, ?, ?)";


    var dataToInsert = [
      req.body.address,
      req.body.rooms,
      req.body.bathrooms,
      req.body.sqft,
      req.body.rent,
      req.body.utilities,
      req.body.description
    ]

    db.pool.query(query, dataToInsert, (err, results, fields) => {
      res.redirect('/properties');
    });
  });

  router.get('/', (req, res) => {

    context = {};

    context.search_error = "error message for search";
    context.insert_error = "error message for insert";
    getProperties(res, context, done);

    //Ensures that the database query is done before rendering the page
    function done(){
      // console.log("Rendering page");        
      // console.log(context);
      // Render the users.handlebars file with the context
      res.render('properties', context);

    }
  });


  router.post('/delete/:address', (req, res) => {

    console.log("POST request received at /properties/delete, for address: "+ req.params.address);
    var query = "DELETE FROM Properties WHERE address = ?;"
    db.pool.query(query, req.params.address, (err, results, fields) => {
      res.redirect('/properties');
    });
      
    
  });

  router.post('/update/:address', (req, res) => {
   
    console.log("POST request received at /properties/update, for address: "+ req.params.address);
    var query = " UPDATE Properties SET rooms = ?,bathrooms = ?, sqft = ?, rent = ?, utilities = ?, description = ? WHERE address = ?";
    var dataToInsert =[
      req.body.rooms,
      req.body.bathrooms,
      req.body.sqft,
      req.body.rent,
      req.body.utilities,
      req.body.description,
      req.body.address
    ]
    db.pool.query(query, dataToInsert, (err, results, fields) => {
      res.redirect('/properties');
    });
      
    
  });

  //This router object is what handles the requests to "/properties"
  return router;
})();
