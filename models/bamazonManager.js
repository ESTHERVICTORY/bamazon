let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Apiah#1992",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);


});

var List = require('prompt-list');
function ManagerAction() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Please select an option:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            filter: function (val) {
                if (val === 'View Products for Sale') {
                    return 'productForSale';
                } else if (val === 'View Low Inventory') {
                    return 'lowInventory';
                } else if (val === 'Add to Inventory') {
                    return 'addInventory';
                } else if (val === 'Add New Product') {
                    return 'addProduct';
                } else {
                    // This case should be unreachable
                    console.log('ERROR: Unsupported operation!');
                    exit(1);
                }
            }
        }
    ]).then(function (input) {
        // console.log('User has selected: ' + JSON.stringify(input));

        // Trigger the appropriate action based on the user input
        if (input.option === 'sale') {
            productForSale();
        } else if (input.option === 'lowInventory') {
            lowInventory();
        } else if (input.option === 'addInventory') {
            addInventory();
        } else if (input.option === 'newProduct') {
            addProduct();
        } else {
            // This case should be unreachable
            console.log('ERROR: Unsupported operation!');
            exit(1);
        }
    })
}
ManagerAction();
// async
list.ask(function (answer) {
    console.log(answer);
});

// promise
list.run()
    .then(function (answer) {
        console.log(answer);
    });

const productForSale = function (item_id, product_name, price, stock_quantity) {
    connection.query(`SELECT item_id, product_name, price,stock_quantity, from products `), function (err, res) {
        console.log(err);
    }
}
const lowInventory = function () {
    connection.query(`SELECT item_id, product_name, price, stock_quantity from products WHERE stock_quantity < 5`), function (err, res) {
        console.log(err);
    }
}
console.log(lowInventory);

const addInventory = function () {
    connection.query(`SELECT item_id, product_name, price,stock_quantity from products WHERE stock_quantity <5`), function (err, res) {
        console.log(err);
        if (stock_quantity < 5) {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'item_id',
                    message: 'Please enter the Item ID for stock_count update.',
                    validate: validateInteger,
                    filter: Number
                },
                {
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like to add?',
                    validate: validateInteger,
                    filter: Number
                }
            ]).then(function (input) {
                // console.log('Manager has selected: \n    item_id = '  + input.item_id + '\n    additional quantity = ' + input.quantity);

                var item = input.item_id;
                var addQuantity = input.quantity;

                // Query db to confirm that the given item ID exists and to determine the current stock_count
                var queryStr = 'SELECT * FROM products WHERE ?';

                connection.query(queryStr, { item_id: item }, function (err, data) {
                    if (err) throw err;

                    // If the user has selected an invalid item ID, data attay will be empty
                    // console.log('data = ' + JSON.stringify(data));

                    if (data.length === 0) {
                        console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');

                    } else {
                        var productData = data[0];

                        // console.log('productData = ' + JSON.stringify(productData));
                        // console.log('productData.stock_quantity = ' + productData.stock_quantity);

                        console.log('Updating Inventory...');

                        // Construct the updating query string
                        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
                        // console.log('updateQueryStr = ' + updateQueryStr);

                        // Update the inventory
                        connection.query(updateQueryStr, function (err, data) {
                            if (err) throw err;

                            console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
                            console.log("\n---------------------------------------------------------------------\n");

                            // End the database connection
                            connection.end();
                        })
                    }
                })
            })


        }
    }
}
addInventory();
const addProduct = function () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'Please enter the new product name.',
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Which department does the new product belong to?',
        },
        {
            type: 'input',
            name: 'price',
            message: 'What is the price per unit?',

        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many items are in stock?',

        }
    ]).then(function (input) {
        // console.log('input: ' + JSON.stringify(input));

        console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +
            '    department_name = ' + input.department_name + '\n' +
            '    price = ' + input.price + '\n' +
            '    stock_quantity = ' + input.stock_quantity);

        // Create the insertion query string
        var queryStr = 'INSERT INTO products SET ?';

        // Add new product to the db
        connection.query(queryStr, input, function (error, results, fields) {
            if (error) throw error;

            console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
            console.log("\n---------------------------------------------------------------------\n");

            // End the database connection
            connection.end();
        });
    })
}
