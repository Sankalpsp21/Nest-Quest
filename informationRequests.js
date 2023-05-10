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
        user_id: [
            {user_id: 1},
            {user_id: 2},
            {user_id: 3} 
          ],
        informationRequest: [
          {
            user_id: 1,
            date_contacted: "12-11-2022",
            address: '23819 bald mtn rd',
          },
          {
            user_id: 1,
            date_contacted: '09-28-2022',
            address: '23465 west ave',
          }
        ]
      };
  
      // Render the users.handlebars file with the context
      res.render('informationRequests', context);
    });
  
    //This router object is what handles the requests to "/reviews"
    return router;
  })();
  