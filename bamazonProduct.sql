DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL, 
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(6,2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (101, "Greenies Dental Dog Treats", "Pet Supplies", 26.56, 50),
(102, "Sony PlayStation 4 500GB Console", "Video Games", 289.80, 100),
(103, "Milk-Bone", "Pet Supplies", 10.38, 50),
(104, "XBOX One 500GB Console", "Electronics", 307.64, 1),
(105, "Zuke's Mini Naturals Dog Treats", "Pet Supplies", 9.57, 50),
(106, "Kraft Easy Macaroni & Cheese, 18-ct", "Food", 500.00, 1000),
(107, "Vienna Sausage (pack of 12)", "Food", 999.99, 500 ),
(108, "JavaScript: The Definitive Guide (David Flanagan)", "Books", 0.01, 9999),
(109, "Organic Gold Potatoes, 3 lb", "Food", 20.00, 50),
(110, "Broccoli, 1 Bunch", "Food", 1.00, 100);

