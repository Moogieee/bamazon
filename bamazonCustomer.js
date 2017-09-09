var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');
var itemsArray = [];
var itemsIdArray = [];

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(err) {
    if(err) throw err;
    console.log('Welcome to Bamazon!\n');
});


//display inventory
var table = new Table ({
    head: ['Item ID', 'Product', 'Department', 'Price', 'Stock'],
    colWidths: [10, 55, 15, 10, 10]
});

connection.query('SELECT * FROM products', function(err, res) {
    if(err) throw err;
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity]);
    };
    console.log(table.toString());
    userMenu();
});

function userMenu() {
    inquirer.prompt([
        {
            name: 'productID',
            type: 'input',
            message: 'Please enter the ID of the item you would like to purchase.\n'
        }, {
            name: 'productCount',
            type: 'input',
            message: '\nPlease enter the number of units you would like to purchase.\n',
            validate: function(value) {
                if(isNaN(value) === false)
                    return true;
                else
                    return 'Please enter a valid number';
            }
        }
    ]).then (function(answer) {
        var chosenItem = answer.productID;
        var quantity = answer.productCount;

        var query = connection.query(
            'SELECT * FROM products WHERE item_id =' + chosenItem, 
            function(err, res) {
                if (err) throw err;

                if(quantity > res[0].stock_quantity) {
                    console.log('\nSorry, there are only ' + res[0].stock_quantity + ' unit(s) of ' + res[0].product_name + ' in stock. Please enter a smaller amount.\n');
                    userMenu();
                } else {
                    var total = quantity * res[0].price;
                    console.log('\nTotal cost for ' + quantity + ' unit(s) of ' + res[0].product_name + ' is $' + total.toFixed(2) + '\n');
                    connection.query('UPDATE products SET ? WHERE ?', [{
                        stock_quantity: res[0].stock_quantity - quantity
                    }, {
                        item_id: res[0].item_id
                    }], function(err, res) {
                        userMenu();
                        console.log(table.toString());
                    });
                }
            }
        )

    })
}