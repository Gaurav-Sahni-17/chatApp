var mysql_package = require('mysql');
var connection_data = mysql_package.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatApp",
});
module.exports = connection_data;