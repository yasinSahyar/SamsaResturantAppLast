
const mysql = require("mysql2");
const config = require("../config");

let connection = mysql.createConnection(config.db);

connection.connect(function(err) {
    if(err) {
        return console.log(err);
    }

    // connection.query("select * from product", function(err, result) {
    //     console.log(result[0].productname);
    // })

    console.log("mysql server connection established ");
});

module.exports = connection.promise();

// promise , async-away => async