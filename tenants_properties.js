module.exports = (function () {
  // Declare Variables
  var db = require('./database/db-connector');
  var express = require("express");
  var router = express.Router();

  // Access the sql object from the db-connector module
  var sql = db.sql;
  var config = db.config;

  function getUserIDs(res, context, done) {
    let query1 = "SELECT user_id FROM Users WHERE user_id NOT IN (SELECT user_id FROM Tenants)";
    sql.connect(config)
      .then((pool) => {
        return pool.request().query(query1);
      })
      .then((result) => {
        const rows = result.recordset;

        // return the context with a list of user_ids called users
        context.user = rows.map((row) => {
          return {
            user_id: row.user_id,
          };
        });

        done();
      })
      .catch((err) => {
        console.log("Failed to query: " + err);
        res.sendStatus(500);
      });
  }

  function getTenantIDs(res, context, done) {
    let query1 = "SELECT user_id FROM Tenants";
    sql.connect(config)
      .then((pool) => {
        return pool.request().query(query1);
      })
      .then((result) => {
        const rows = result.recordset;

        // return the context with a list of user_ids called tenantID
        context.tenantID = rows.map((row) => {
          return {
            user_id: row.user_id,
          };
        });

        done();
      })
      .catch((err) => {
        console.log("Failed to query: " + err);
        res.sendStatus(500);
      });
  }

  function getAddresses(res, context, done) {
    let query1 = "SELECT address FROM Properties";
    sql.connect(config)
      .then((pool) => {
        return pool.request().query(query1);
      })
      .then((result) => {
        const rows = result.recordset;

        // return the context with a list of addresses
        context.address = rows.map((row) => {
          return {
            address: row.address,
          };
        });

        done();
      })
      .catch((err) => {
        console.log("Failed to query: " + err);
        res.sendStatus(500);
      });
  }

  function getTenants(res, context, done) {
    let query1 = "SELECT * FROM Tenants";
    sql.connect(config)
      .then((pool) => {
        return pool.request().query(query1);
      })
      .then((result) => {
        const rows = result.recordset;

        //Format the data
        context.tenant = rows.map((row) => {
          return {
            user_id: row.user_id,
            role: row.role,
          };
        });

        done();
      })
      .catch((err) => {
        console.log("Failed to query for Tenants: " + err);
        res.sendStatus(500);
      });
  }

  function getTenants_Properties(res, context, done) {
    let query1 = "SELECT * FROM Tenants_Properties";
    sql.connect(config)
      .then((pool) => {
        return pool.request().query(query1);
      })
      .then((result) => {
        const rows = result.recordset;

        //Format the data
        context.tenantProperty = rows.map((row) => {
          return {
            user_id: row.user_id,
            address: row.address
          };
        });

        done();
      })
      .catch((err) => {
        console.log("Failed to query for Tenants_Properties: " + err);
        res.sendStatus(500);
      });
  }

  router.get('/', (req, res) => {
    context = {};

    getUserIDs(res, context, done);
    getTenantIDs(res, context, done);
    getAddresses(res, context, done);
    getTenants(res, context, done);
    getTenants_Properties(res, context, done);

    var count = 0;
    function done() {
      count++;
      if (count == 5) {
        res.render('tenants_properties', context);
      }
    }
  });

  router.post('/', (req, res) => {
    console.log("POST request received at /tenants_properties");
  
    var query = "INSERT INTO Tenants(user_id, role) VALUES (@user_id, @role)";
  
    var dataToInsert = {
      user_id: { type: sql.VarChar, value: req.body.user_id },
      role: { type: sql.VarChar, value: req.body.role }
    };
  
    sql.connect(config)
      .then((pool) => {
        const request = pool.request();
        Object.keys(dataToInsert).forEach((key) => {
          request.input(key, dataToInsert[key].type, dataToInsert[key].value);
        });
        return request.query(query);
      })
      .then(() => {
        res.redirect('/tenants_properties');
      })
      .catch((err) => {
        console.log("Failed to execute query: " + err);
        res.sendStatus(500);
      });
  });
  

  router.post('/add-tenant-property', (req, res) => {
    console.log("POST request received at /tenants_properties/add-tenant-property");
  
    var query = "INSERT INTO Tenants_Properties(user_id, address) VALUES (@user_id, @address)";
  
    var dataToInsert = {
      user_id: { type: sql.VarChar, value: req.body.user_id },
      address: { type: sql.VarChar, value: req.body.address }
    };
  
    sql.connect(config)
      .then((pool) => {
        const request = pool.request();
        Object.keys(dataToInsert).forEach((key) => {
          request.input(key, dataToInsert[key].type, dataToInsert[key].value);
        });
        return request.query(query);
      })
      .then(() => {
        res.redirect('/tenants_properties');
      })
      .catch((err) => {
        console.log("Failed to execute query: " + err);
        res.sendStatus(500);
      });
  });
  

  router.post('/delete/:user_id', (req, res) => {
    console.log("POST request received at /tenants_properties/delete, for user_id:" + req.params.user_id);
    var query = "DELETE FROM Tenants WHERE user_id = @user_id";

    sql.connect(config)
      .then((pool) => {
        return pool.request().input('user_id', sql.VarChar, req.params.user_id).query(query);
      })
      .then(() => {
        res.redirect('/tenants_properties');
      })
      .catch((err) => {
        console.log("Failed to execute query: " + err);
        res.sendStatus(500);
      });
  });

  router.post('/delete-tenant-property/:user_id', (req, res) => {
    console.log("POST request received at /tenants_properties/delete-tenant-property, for user_id:" + req.params.user_id);
    var query = "DELETE FROM Tenants_Properties WHERE user_id = @user_id";

    sql.connect(config)
      .then((pool) => {
        return pool.request().input('user_id', sql.VarChar, req.params.user_id).query(query);
      })
      .then(() => {
        res.redirect('/tenants_properties');
      })
      .catch((err) => {
        console.log("Failed to execute query: " + err);
        res.sendStatus(500);
      });
  });

  return router;
})();
