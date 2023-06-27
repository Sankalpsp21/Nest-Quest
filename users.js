module.exports = (function() {
    // Declare Variables
    var db = require('./database/db-connector');
    var express = require("express");
    var router = express.Router();

    // Access the sql object from the db-connector module
    var sql = db.sql;
    var config = db.config;

    // Here, we will write functions to handle
    // 1. Input validation
    // 2. Database queries (Create, Select (Read), Update, Delete (CRUD)
    // 3. Search queries
    // 4. Rendering the page

    function getUsers(res, context, done) {
      const query = 'SELECT * FROM Users';
    
      sql.connect(config)
        .then((pool) => {
          return pool.request().query(query);
        })
        .then((result) => {
          const rows = result.recordset;
    
          context.user = rows.map((row) => {
            return {
              user_id: row.user_id,
              fname: row.fname,
              lname: row.lname,
              email: row.email,
              phone: row.phone,
              smoking: row.smoking === 'Yes' ? 'Yes' : 'No',
              pet: row.pets === 'Yes' ? 'Yes' : 'No',
              gender: row.gender.charAt(0).toUpperCase() + row.gender.slice(1),
              age: parseInt(row.age),
            };
          });
    
          done();
        })
        .catch((err) => {
          console.error('Failed to query for users:', err);
          res.sendStatus(500);
        });
    }

    
    function getSpecifiedUser(res, context, done, fname) {
      const query = 'SELECT * FROM Users WHERE fname = @fname';
    
      sql.connect(config)
        .then((pool) => {
          return pool.request().input('fname', sql.VarChar, fname).query(query);
        })
        .then((result) => {
          const rows = result.recordset;
    
          context.user = rows.map((row) => {
            return {
              user_id: row.user_id,
              fname: row.fname,
              lname: row.lname,
              email: row.email,
              phone: row.phone,
              smoking: row.smoking === 'Yes' ? 'Yes' : 'No',
              pet: row.pets === 'Yes' ? 'Yes' : 'No',
              gender: row.gender.charAt(0).toUpperCase() + row.gender.slice(1),
              age: parseInt(row.age),
            };
          });
    
          done();
        })
        .catch((err) => {
          console.error('Failed to query search for users:', err);
          res.sendStatus(500);
        });
    }
    
   
    router.get('/', (req, res) => {

      var context = {};

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
      const query = `
        INSERT INTO Users (fname, lname, email, phone, smoking, pets, gender, age)
        VALUES (@fname, @lname, @email, @phone, @smoking, @pet, @gender, @age)
      `;
    
      const dataToInsert = {
        fname: { type: sql.VarChar, value: req.body.fname },
        lname: { type: sql.VarChar, value: req.body.lname },
        email: { type: sql.VarChar, value: req.body.email },
        phone: { type: sql.VarChar, value: req.body.phone },
        smoking: { type: sql.VarChar, value: req.body.smoking },
        pet: { type: sql.VarChar, value: req.body.pet },
        gender: { type: sql.VarChar, value: req.body.gender },
        age: { type: sql.Int, value: req.body.age },
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
          res.redirect('/users');
        })
        .catch((err) => {
          console.error('Error executing query:', err);
          res.sendStatus(500);
        });
    });
    



    router.post('/search', (req, res) => {
      // console.log("GET request received at /users/search, for fname:"+ req.body.fname);

      var context = {};
      getSpecifiedUser(res, context, done, req.body.fname);

      //Ensures that the database query is done before rendering the page
      function done(){
        // console.log("Rendering page");        
        // console.log(context);
        // Render the users.handlebars file with the context
        res.render('users', context);
      }
    });


    
    router.post('/delete/:user_id', (req, res) => {
      const query = 'DELETE FROM Users WHERE user_id = @user_id';
    
      const dataToDelete = {
        user_id: {
          type: sql.Int,
          value: req.params.user_id
        }
      };
    
      sql.connect(config)
        .then((pool) => {
          return pool.request().input('user_id', dataToDelete.user_id.type, dataToDelete.user_id.value).query(query);
        })
        .then(() => {
          res.redirect('/users');
        })
        .catch((err) => {
          console.error('Error executing query:', err);
          res.sendStatus(500);
        });
    });
    
    


    router.post('/update/:user_id', (req, res) => {
      const query = `
        UPDATE Users
        SET fname = @fname, lname = @lname, email = @email, phone = @phone,
            smoking = @smoking, pets = @pet, gender = @gender, age = @age
        WHERE user_id = @user_id
      `;
        
      const dataToUpdate = {
        fname: { name: 'fname', type: sql.VarChar, value: req.body.fname },
        lname: { name: 'lname', type: sql.VarChar, value: req.body.lname },
        email: { name: 'email', type: sql.VarChar, value: req.body.email },
        phone: { name: 'phone', type: sql.VarChar, value: req.body.phone },
        smoking: { name: 'smoking', type: sql.VarChar, value: req.body.smoking },
        pet: { name: 'pet', type: sql.VarChar, value: req.body.pet },
        gender: { name: 'gender', type: sql.VarChar, value: req.body.gender },
        age: { name: 'age', type: sql.Int, value: req.body.age },
        user_id: { name: 'user_id', type: sql.Int, value: req.params.user_id },
      };
    
      sql.connect(config)
        .then((pool) => {
          const request = pool.request();
          for (const key in dataToUpdate) {
            request.input(key, dataToUpdate[key].type, dataToUpdate[key].value);
          }
          return request.query(query);
        })
        .then(() => {
          res.redirect('/users');
        })
        .catch((err) => {
          console.error('Error executing query:', err);
          res.sendStatus(500);
        });
    });
    
    

    //This router object is what handles the requests to "/users"
    return router;
  })();
  