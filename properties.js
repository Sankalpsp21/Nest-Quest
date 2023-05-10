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
      property: [
        {
          address: '12345 Berry st',
          rooms: 3,
          bathrooms: 3,
          sqft: 1550,
          rent: 750,
          utilities: 'water, sewage, garbage, washer/dryer',
          description: 'Townhome 2.2 miles from campus'
        },
        {
          address: '23465 west ave',
          rooms: 2,
          bathrooms: 2,
          sqft: 1450,
          rent: 850,
          utilities: 'water, sewage, garbage, washer/dryer',
          description: 'Apartment room located 5 minutes from campus'
        }
      ]
    };

    // Render the properties.handlebars file with the context
    res.render('properties', context);
  });

  //This router object is what handles the requests to "/properties"
  return router;
})();
