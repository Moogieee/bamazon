var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function(err) {
    if(err) throw err;
    console.log('\nWelcome to Bamazon Manager View!\n');
    managerMenu();
});


//main menu
function managerMenu() {
    inquirer.prompt([{
        name: 'managerMenu',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        message: 'What would you like to do?'
    }]).then(function(answer) {

        switch(answer.managerMenu) {
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
        }
    });
}



//function that allows the manager to view current inventory
function viewProducts() {
    var table = new Table ({
        head: ['Item ID', 'Product', 'Department', 'Price', 'Stock'],
        colWidths: [10, 55, 15, 10, 10]
    });
    
    connection.query('SELECT * FROM products', function(err, res) {
        if(err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, 
                        res[i].product_name, 
                        res[i].department_name, 
                        '$' + res[i].price, 
                        res[i].stock_quantity]);
        };
        console.log(table.toString());
        managerMenu();
    });
}


//function that allows the manager to view item currently low on inventory
function viewLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
        if(err) throw err;
        if (res.length === 0) {
            console.log('No items are currently low in stock');
        } else {
            var table = new Table ({
                head: ['Item ID', 'Product', 'Department', 'Price', 'Stock'],
                colWidths: [10, 55, 15, 10, 10]
            });
            console.log('\nThese items are low in stock\n')

            for (var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, 
                            res[i].product_name, 
                            res[i].department_name, 
                            '$' + res[i].price, 
                            res[i].stock_quantity
                ]);
            }
            console.log(table.toString());
            managerMenu();
        }
    })
};


//function that allows the manager to add inventory to an item
function addToInventory() {
    var product = [];
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            product.push(res[i].product_name);
        }

        inquirer.prompt([
            {
                name: 'productAdd',
                type: 'list',
                choices: product,
                message: 'What would you like to add?'
            }, {
                name: 'qtyUpdate',
                type: 'input',
                message: 'How much would you like to add to the current inventory?',
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    } else {
                        return 'Please enter a valid number';
                    }
                }
            }
        ]).then(function(answer) {
            updateInventory(answer)
        })
    })
};


//function that allows the manager to update inventory of an item
function updateInventory(product) {
    connection.query('UPDATE products SET ? WHERE ?', [
        {
            stock_quantity: product.qtyUpdate
        },
        {
            product_name: product.productAdd
        }
    ], function(err, res) {
        viewProducts();
        managerMenu();
    })
};


//function that allows the manager to add a new product
function addNewProduct() {
    inquirer.prompt([
        {
            name: 'productID',
            type: 'input',
            message: 'Please enter the Product ID.',
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                } else {
                    return 'Please enter a valid number';
                }
            } 
        },
        {
            name: 'productName',
            type: 'input',
            message: 'Please enter the Product Name.'
        },
        {
            name: 'productDept',
            type: 'input',
            message: 'Please enter the Department the product belongs to.'
        },
        {
            name: 'productPrice',
            type: 'input',
            message: 'Please enter the Price of the product.',
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                } else {
                    return 'Please enter a valid number';
                }
            }
        },
        {
            name: 'productQuantity',
            type: 'input',
            message: 'Please enter the Quantity of the product.',
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                } else {
                    return 'Please enter a valid number';
                }
            }
        }
    ]).then(function(answer) {
        var query = connection.query('SELECT department_name FROM products WHERE ?', {
            product_name: answer.productName
        },
        function(err, res) {
            if(err) throw err;
            if(res.length > 0) {
                console.log('The product already exists in this department');
                managerMenu();
            } else {
                var query = connection.query('INSERT INTO products SET ?',
                {
                    item_id: answer.productID,
                    product_name: answer.productName,
                    department_name: answer.productDept,
                    price: answer.productPrice,
                    stock_quantity: answer.productQuantity
                })
            }
            managerMenu();
        })
    })
};