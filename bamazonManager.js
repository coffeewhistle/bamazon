/* jshint esversion: 6 */

var mysql = require("mysql");
var inquirer = require("inquirer");
function lineBreak() {
    console.log("\n------------------------\n");
}

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "test",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    userInput();
});

function userInput() {
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Quit"]
        }
    ]).then(function (answers) {
        switch (answers.selection) {
            case "View Products for Sale":
                viewProducts();
                lineBreak();
                break;
            case "View Low Inventory":
                viewLowInv();
                lineBreak();
                break;
            case "Add to Inventory":
                addInv();
                lineBreak();
                break;
            case "Add New Product":
                addProd();
                lineBreak();
                break;
            default:
                connection.end();
                break;
        }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        res.forEach(element => {
            console.log(
                "Item ID: " + element.item_id +
                " | Product Name: " + element.product_name +
                " | Department: " + element.department_name +
                " | Price: " + element.price +
                " | Stock: " + element.stock_quantity
            );
        });
        lineBreak();
        userInput();
    });
    console.log("\nYou're viewing products");
}

function viewLowInv() {
    console.log("\nHere's the products with low inventory");
}

function addInv() {
    console.log("\nYou're adding inventory!");
}

function addProd() {
    console.log("\nYou're adding a product!");
}

