module.exports = (function() {
  // Declare Variables
  var db = require('./database/db-connector');
  var express = require("express");
  var router = express.Router();

  function getUserIDs(res, context, done) {
    const query = "SELECT user_id FROM Seekers";
    db.sql.connect(db.config, (err) => {
      if (err) {
        console.error('Failed to connect to database:', err);
        res.sendStatus(500);
        return;
      }

      new db.sql.Request().query(query, (err, result) => {
        if (err) {
          console.error('Failed to query:', err);
          res.sendStatus(500);
          return;
        }

        // Return the context with a list of user_ids called user
        context.user = result.recordset.map((row) => {
          return {
            user_id: row.user_id
          };
        });

        done();
      });
    });
  }

  function getAddresses(res, context, done) {
    const query = "SELECT address FROM Properties";
    db.sql.connect(db.config, (err) => {
      if (err) {
        console.error('Failed to connect to database:', err);
        res.sendStatus(500);
        return;
      }

      new db.sql.Request().query(query, (err, result) => {
        if (err) {
          console.error('Failed to query:', err);
          res.sendStatus(500);
          return;
        }

        // Return the context with a list of addresses called address
        context.address = result.recordset.map((row) => {
          return {
            address: row.address
          };
        });

        done();
      });
    });
  }

  function getInformationRequests(res, context, done) {
    const query = "SELECT * FROM InformationRequests";
    db.sql.connect(db.config, (err) => {
      if (err) {
        console.error('Failed to connect to database:', err);
        res.sendStatus(500);
        return;
      }

      new db.sql.Request().query(query, (err, result) => {
        if (err) {
          console.error('Failed to query:', err);
          res.sendStatus(500);
          return;
        }

        // Return the context with a list of information requests called informationRequest
        context.informationRequest = result.recordset.map((row) => {
          return {
            user_id: row.user_id,
            date_contacted: row.date_contacted,
            address: row.address
          };
        });

        done();
      });
    });
  }

  router.get('/', (req, res) => {
    var context = {};

    var count = 0;
    function done() {
      count++;
      if (count == 3) {
        // Render the informationRequests.handlebars file with the context
        res.render('informationRequests', context);
      }
    }

    getUserIDs(res, context, done);
    getAddresses(res, context, done);
    getInformationRequests(res, context, done);
  });

  router.post('/', (req, res) => {
    console.log("POST request received at /informationRequests");

    const query = "INSERT INTO InformationRequests(user_id, date_contacted, address) VALUES (@user_id, @date_contacted, @address)";
    const request = new db.sql.Request();
    request.input('user_id', db.sql.Int, req.body.user_id);
    request.input('date_contacted', db.sql.DateTime, req.body.date_contacted);
    request.input('address', db.sql.VarChar, req.body.address);

    db.sql.connect(db.config)
      .then(() => {
        return request.query(query);
      })
      .then(() => {
        res.redirect('/informationRequests');
      })
      .catch((err) => {
        console.error('Error executing query:', err);
        res.sendStatus(500);
      });
  });

  return router;
})();
