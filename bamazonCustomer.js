/* jshint esversion: 6 */

var mysql = require("mysql");
var inquirer = require("inquirer");
var lineBreak = "\n-------------------------";
var productArr = [];

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
    loadProduct();
    chooseYourAdventure();
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
        res.forEach(element => {
            console.log("Item ID: " + element.item_id +
                " | Product Name: " + element.product_name +
                " | Price: " + element.price
            );
        });
        console.log(lineBreak);
        chooseYourAdventure();
    });
}

function loadProduct() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            var newProduct = element.item_id + " | " + element.product_name + " | $" + element.price;
            productArr.push(newProduct);
        });
    });
}

function chooseYourAdventure() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["List Products", "Enter Order", "Quit"]
        }
    ]).then(function (answers) {
        if (answers.choice === "List Products") {
            displayProducts();
        } else if (answers.choice === "Quit") {
            endConnection();
        } else if (answers.choice === "Enter Order") {
            enterOrder();
        }
    });
}

function enterOrder() {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer.prompt([
            {
                type: "list",
                name: "productList",
                message: "What product would you like to order?",
                choices: productArr,
                pageSize: productArr.length
            },
            {
                type: "text",
                name: "quantity",
                message: "How much would you like to order?",
            }
        ]).then(function (answers) {
            var prodID = answers.productList.split(" | ")[0];
            var prodName = answers.productList.split(" | ")[1];
            var prodQuant = answers.quantity;
            if (prodQuant > res[prodID - 1].stock_quantity) {
                console.log("\nInsufficient quantity!\n");
            } else {
                console.log("\nYour order for " + prodQuant + " " + prodName + "(s) has been placed!\nOrder Total: $" + (prodQuant * res[prodID - 1].price) + "\n");
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: (res[prodID -1].stock_quantity - prodQuant)
                        },
                        {
                            item_id: prodID
                        }
                    ]
                );
            }
            chooseYourAdventure();
        });
    });
}
