// module.exports = function(connection, Sequelize) {
//     const bamazon = connection.define('bamazon', {
//       name: Sequelize.STRING,
//       phoneNumber: Sequelize.STRING,
//       email: Sequelize.STRING
//     });

//   return bamazon;
// }
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
  afterConnection();

});

function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log(res);
    questions();
  });
}
const questions = function () {
  inquirer
    .prompt(
      [
        {
          type: "input",
          name: "id",
          message: "What is your ID of choice?"
        }
      ]
    )
    .then(function (idResponse) {
      let choiceID = parseInt(idResponse.id);
      inquirer
        .prompt(
          [
            {
              type: "input",
              name: "Quantity",
              message: "WHow many do you want?"
            }
          ]
        ).then(function (qtyresponse) {
          console.log(parseInt(qtyresponse));
          checkInventory(parseInt(qtyresponse.Quantity),choiceID);
        });
    })
}
const checkInventory = function (qty,id) {
  connection.query(`SELECT stock_quantity,price from products WHERE item_id = ${id}`, function (err, res) {
  if(res[0].stock_quantity >= qty)  
{
  connection.query(`UPDATE products SET stock_quantity = ${res[0].stock_quantity - qty} WHERE item_id =${id}`);
  console.log(`Your price is ${qty * res[0].price}`)
}else{
  console.log(`There is not enough product #${id} for you`)
}
connection.end();
  });
}

