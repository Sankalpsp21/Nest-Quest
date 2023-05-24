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

    // Context for layout:
    // jxscripts: a list of javascript files to include

    function getUsers(res, context, done){
      let query1 = "SELECT * FROM Users";
      db.pool.query(query1, (err, rows, fields) => {
        if(err) {
          console.log("Failed to query for users: " + err);
          res.sendStatus(500);
          return;
        }

        //Format the data
        console.log("Fetched users successfully");
        context.user = rows.map((row) => {
          return {
            user_id: row.user_id,
            fname: row.fname,
            lname: row.lname,
            email: row.email,
            phone: row.phone,
            smoking: row.smoking === 'yes' ? 'Yes' : 'No',
            pet: row.pets === 'yes' ? 'Yes' : 'No',
            gender: row.gender.charAt(0).toUpperCase() + row.gender.slice(1),
            age: parseInt(row.age),
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
      getUsers(res, context, done);

      //Ensures that the database query is done before rendering the page
      function done(){
        // console.log("Rendering page");        
        // console.log(context);
        // Render the users.handlebars file with the context
        res.render('users', context);

      }
    });

    router.post('/', (req, res) => {
      console.log("POST request received at /users");

      var query = 
      "INSERT INTO Users(fname, lname, email, phone, smoking, pets, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      var dataToInsert = [
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.phone,
        req.body.smoking,
        req.body.pet,
        req.body.gender,
        req.body.age
      ]

      db.pool.query(query, dataToInsert, (err, results, fields) => {
        res.redirect('/users');
      });
    });

    router.post('/delete/:user_id', (req, res) => {

      console.log("POST request received at /users/delete, for deleting user_id:"+ req.params.user_id);
      var query = "DELETE FROM Users WHERE user_id = ?;"
      db.pool.query(query, req.params.user_id, (err, results, fields) => {
        res.redirect('/users');
      });
        
      
    });
 
    

    //This router object is what handles the requests to "/users"
    return router;
  })();
  