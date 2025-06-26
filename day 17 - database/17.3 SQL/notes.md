### How to Use SQL

For the sake of this beginning lessons, we'll be taking references from [W3Schools SQL Tutorial](https://www.w3schools.com/sql/)

We will be using the commands on [SQLite Online](https://sqliteonline.com/)

The commands are usually written in uppercase.

There are four types of operations on a database: CRUD (Create, Read, Update, Destroy). Here's how we can perform them:

### Create

#### 1. Creating a new table

To store data, we need a table. In order to create a table for stationery items and their prices, we can use the following:

```sql
CREATE TABLE products (
    id INT NOT NULL,
    name STRING,
    price MONEY,
    PRIMARY KEY (id)
)
```

Here we have defined three columns id, name and price, each with their own data types. Since we're using SQLite here, we're using the STRING type for name.

We also need to specify a primary key which is a column which uniquely identifies each entry. In this table, each id is exclusive to a single entry.

Since it is used to identify the rest, we can't have it empty, so we need to add a constraint NOT NULL for validation.

#### 2. Adding entries to the table

To add some data entries into the table we can perform the following:

```sql
INSERT INTO products
    VALUES (1, 'Copy', 0.50)
```

Note: We can only use single quotes, not double quotes, to enclose strings, at least in SQLite Online.

This is actually a single line command but we split it into multiple lines for readability. By using this format, we must specify values for all columns.

But we may not have values available for every column. In such case we need to use:

```sql
INSERT INTO products (id, name)
    VALUES (2, 'Pen')
```

But we can't use this format by supplying the name and price, because that would violate the NOT NULL constraint for id, and cause an error.

### Read

#### 3. Viewing the table

To view the entire table, we can use the following:

```sql
SELECT * FROM products
```

But what if we only want certain columns from the table? We can simply change \* to the name of columns:

```sql
SELECT name, price FROM products
```

Now if we instead want a certain row, we need to search and filter. If we want the entry with id=1, we can use:

```sql
SELECT * FROM products WHERE id=1
```

Apart from =, we have many other operators, like <> for not equal to, <, > for less/greater than, BETWEEN, LIKE, IN, and <=,>=

### Update

#### 4. Adding a column to the table

Sometimes after creating a table, we might need a new column, and we can add the new column using:

```sql
ALTER TABLE products
ADD stock INT
```

#### 5. Updating the values of an entry

In order to update the values, we need to select the table then set the value for a certain condition (selecting the row).

```sql
UPDATE products
SET price=0.2
WHERE id=2
```

This will update the price of pen to become 0.2, similarly we can use this to update stocks of both, which was the challenge given.

One thing to note here is that we must include the WHERE condition, else all the values in the price column would be set to 0.2.

### Delete

#### 6. Delete values from a table

When we want to delete, say a row from a table, we can delete it by giving it a condition to select that row.

```sql
DELETE FROM products
WHERE id=2
```

This is also a dangerous command because if we don't supply the WHERE clause, the entire table's data is gone, so we must be careful.

### Relationship

One of the greatest features of SQL is that we can establish relationships between two or more tables. We can use it here as well.

Let's say we have created a Customers table and Orders table with the following schemas:

```sql
CREATE TABLE customers (
    id INT NOT NULL,
    first_name STRING,
    last_name STRING,
    address STRING,
    PRIMARY KEY (id)
)
```

and

```sql
CREATE TABLE orders (
    id INT NOT NULL,
    order_num INT,
    customer_id INT,
    product_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)
```

In the orders table, we have created foreign keys, these link the tables customers and orders with the orders table, using their primary key i.e. id.

Now let's say we have some values inside these tables as well. We can join all the three tables together based on the order now.

We have many ways of joining tables, but the most used is INNER JOIN in which only rows with matching conditions are joined. We can use:

```sql
SELECT orders.order_num, customers.first_name, customers.last_name, customers.address, products.name, products.price, products.stock
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
INNER JOIN products ON orders.product_id = products.id
```

In the course, combining three tables together was not shown, but since this is a bit complicated(not really), the course had following:

```sql
SELECT orders.order_num, customers.first_name, customers.last_name, customers.address
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
```

and

```sql
SELECT orders.order_num, products.name, products.price, products.stock
FROM orders
INNER JOIN products ON orders.product_id = products.id
```
