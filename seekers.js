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
      seeker: [
        {
          user_id: 1,
          price_upper: 750,
          price_lower: 0
        },
        {
          user_id: 2,
          price_upper: 950,
          price_lower: 300
        }
      ]
    };

    // Render the users.handlebars file with the context
    res.render('seekers', context);
  });

  //This router object is what handles the requests to "/seekers"
  return router;
})();
