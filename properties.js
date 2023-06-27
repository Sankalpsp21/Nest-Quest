module.exports = (function() {
  var db = require('./database/db-connector');
  var express = require("express");
  var router = express.Router();
  var search_error = "";
  var insert_error = "";
  var update_error = "";
  var sql = require('mssql');

  function getProperties() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Properties";
      new sql.ConnectionPool(db.config).connect()
        .then((pool) => {
          return pool.request().query(query);
        })
        .then((result) => {
          const rows = result.recordset;
          const properties = rows.map((row) => ({
            address: row.address,
            rooms: row.rooms,
            bathrooms: row.bathrooms,
            sqft: row.sqft,
            rent: row.rent,
            utilities: row.utilities,
            description: row.description,
          }));
          console.log("Fetched properties successfully");
          resolve(properties);
        })
        .catch((err) => {
          console.error("Failed to query for properties:", err);
          reject(err);
        });
    });
  }

  router.post('/', (req, res) => {
    console.log("POST request received at /properties");

    const query = "INSERT INTO Properties(address, rooms, bathrooms, sqft, rent, utilities, description) VALUES (@address, @rooms, @bathrooms, @sqft, @rent, @utilities, @description)";

    const dataToInsert = {
      address: req.body.address,
      rooms: req.body.rooms,
      bathrooms: req.body.bathrooms,
      sqft: req.body.sqft,
      rent: req.body.rent,
      utilities: req.body.utilities,
      description: req.body.description
    };

    new sql.ConnectionPool(db.config).connect()
      .then((pool) => {
        const request = pool.request();
        Object.keys(dataToInsert).forEach((key) => {
          request.input(key, dataToInsert[key]);
        });
        return request.query(query);
      })
      .then(() => {
        res.redirect('/properties');
      })
      .catch((err) => {
        console.error("Error executing query:", err);
        res.sendStatus(500);
      });
  });

  router.get('/', (req, res) => {
    var context = {};
    context.search_error = "error message for search";
    context.insert_error = "error message for insert";

    getProperties()
      .then((properties) => {
        context.property = properties;
        res.render('properties', context);
      })
      .catch((err) => {
        console.error("Error:", err);
        res.sendStatus(500);
      });
  });

  router.post('/delete/:address', (req, res) => {
    console.log("POST request received at /properties/delete, for address: " + req.params.address);
    const query = "DELETE FROM Properties WHERE address = @address";

    new sql.ConnectionPool(db.config).connect()
      .then((pool) => {
        return pool.request().input('address', req.params.address).query(query);
      })
      .then(() => {
        res.redirect('/properties');
      })
      .catch((err) => {
        console.error("Error executing query:", err);
        res.sendStatus(500);
      });
  });

  router.post('/update/:address', (req, res) => {
    console.log("POST request received at /properties/update, for address: " + req.params.address);
    const query = "UPDATE Properties SET rooms = @rooms, bathrooms = @bathrooms, sqft = @sqft, rent = @rent, utilities = @utilities, description = @description WHERE address = @address";
    const dataToInsert = {
      address: req.params.address,
      rooms: req.body.rooms,
      bathrooms: req.body.bathrooms,
      sqft: req.body.sqft,
      rent: req.body.rent,
      utilities: req.body.utilities,
      description: req.body.description
    };

    new sql.ConnectionPool(db.config).connect()
      .then((pool) => {
        const request = pool.request();
        Object.keys(dataToInsert).forEach((key) => {
          request.input(key, dataToInsert[key]);
        });
        return request.query(query);
      })
      .then(() => {
        res.redirect('/properties');
      })
      .catch((err) => {
        console.error("Error executing query:", err);
        res.sendStatus(500);
      });
  });

  return router;
})();
