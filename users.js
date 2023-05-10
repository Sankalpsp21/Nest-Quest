module.exports = (function() {
    // Declare Variables
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

    // Context for layout:
    // jxscripts: a list of javascript files to include


  
    // Route for showing a specific User entry to update
    // router.get('/:id', function(req, res, next){


  
    router.get('/', (req, res) => {
      // Get the username from your data source or wherever it is available

      //THIS IS HARD CODED FOR NOW. 
      context = {
        insert_error: 'Error message for insert',
        search_error: 'Error message for search',
        user: [
          {
            user_id: 1,
            fname: 'Rob',
            lname: 'Michaels',
            email: 'rob@gmail.com',
            phone: '1234567890',
            smoking: 'Yes',
            pet: 'No',
            gender: 'Male',
            age: 22,
          },
          {
            user_id: 2,
            fname: 'Amy',
            lname: 'Stevenson',
            email: 'amy@outlook.com',
            phone: '987654321',
            smoking: 'No',
            pet: 'No',
            gender: 'Female',
            age: 20,
          }
        ]
      };
  
      // Render the users.handlebars file with the context
      res.render('users', context);
    });
  
    //This router object is what handles the requests to "/users"
    return router;
  })();
  