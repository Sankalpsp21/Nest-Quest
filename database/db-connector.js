// Get an instance of mysql we can use in the app
var sql = require('mssql');

const config = {
  user: process.env.NQDB_USER,
  password: process.env.NQDB_PASSWORD,
  server: process.env.NQDB_SERVER,
  database: process.env.NQDB_DATABASE,
  options: {
    encrypt: true, // For secure connection
  },
};

// Export the sql object along with the config for use in our application
module.exports = {
  sql: sql,
  config: config,
};
