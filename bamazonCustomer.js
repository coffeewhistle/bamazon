var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "test",

    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayProducts();
});

function endConnection() {
    // connection.query("SELECT * FROM products", function (err, res) {
    //     if (err) throw err;
    //     console.log(res);
        connection.end();
    // });
}

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id +
            "\nProduct Name: " + res[i].product_name +
            "\nPrice: " + res[i].price
            );
        }
    });
    endConnection();
}
