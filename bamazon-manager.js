// Require mysql and inguirer
var mysql = require("mysql");
var inquirer = require("inquirer");

// Create the connection obkject
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root1234",
    database: "bamazon_dev"
});

// Start Connection
connection.connect(function (err) {
    if (err) throw err;
    questionPrompt()
});

function questionPrompt() {
    inquirer
        .prompt({
            name: "menuOption",
            type: "list",
            message: "Would you like to continue shopping?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            console.log(answer);

            if (answer.menuOption === "View Products for Sale") {
                var myQuery = "SELECT * FROM products"
                connection.query(myQuery, function (err, results) {
                    console.table(results);
                });
            } else if (answer.menuOption === "View Low Inventory") {
                var myQuery = "SELECT item_id, product_name, stock_quantity, price FROM products WHERE stock_quantity < 20"
                connection.query(myQuery, function (err, results) {
                    console.table(results);
                });
            } else if (answer.menuOption === "Add to Inventory") {
                var myQuery = "SELECT item_id, product_name, stock_quantity, price FROM products"
                connection.query(myQuery, function (err, results) {
                    console.table(results);
                    inquirer
                        .prompt([
                            {
                                name: "productID",
                                type: "input",
                                message: "add to inventory by id",
                            },{
                                name: "productQuantity",
                                type: "input",
                                message: "add many would you like to add ?",
                            },

                        ]).then(function (answer) {
                            console.log(answer);
                            var productID = answer.productID;
                            var productQuantity = Number(answer.productQuantity);
                            var productIDQuery = `SELECT * FROM products WHERE item_id =${productID}`;
                     
                            connection.query( productIDQuery, function (error, results) {
                                var currentQuantity = Number(results[0].stock_quantity);
                                console.log(currentQuantity);
                                var myQuery = `UPDATE products SET stock_quantity=${currentQuantity + productQuantity} WHERE item_id=${productID}`;
                            
                                connection.query( myQuery, function (error, results) {
                                    console.log(results);
                                });
                            });

                        })
                });
            } else if (answer.menuOption === "Add New Product") {
                inquirer
                .prompt([
                    {
                        name: "productName",
                        type: "input",
                        message: "What is the product Name?",
                    },{
                        name: "productQuantity",
                        type: "input",
                        message: "add many would you like to add ?",
                    },{
                        name: "productDepartment",
                        type: "input",
                        message: "What department does the product belong to?",
                    },{
                        name: "productPrice",
                        type: "input",
                        message: "How much is the product ?",
                    },

                ]).then(function (answer) { 

                   
                    var productName =  answer.productName;
                    var productQuantity =  answer.productQuantity ;
                    var productDepartment =  answer.productDepartmen;
                    var productPrice =  answer.productPrice;

                    var productIDQuery = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (${productName, productQuantity, productDepartment, productPrice})`;
                    connection.query( productIDQuery, function (error, results) { 
                        if (error)console.log(error);
                        console.log(results);
                        
                    });
                });


                
            }
        });
}

