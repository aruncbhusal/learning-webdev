### Objectives

We will work with the world-food.csv inside this folder by creating a table in PostgreSQL inside the same db as before.

#### Task 1: Create world_food table

We need to create the new table with the fields shown in the course. This was my answer:

```sql
CREATE TABLE world_food (
    id SERIAL PRIMARY KEY,
    country VARCHAR(45),
    rice_production FLOAT,
    wheat_production FLOAT
);
```

Okay now I've imported them, and I realized, we don't need to match the header names to the field names, just the order is fine.

Since our table also had the id field, I just needed to cross that out while importing, and the rest was a breeze.

#### Task 2: Select ALL

We need to write a query to select all the entries and all the fields from the world_food table. Simple enough:

```sql
SELECT * FROM world_food;
```

#### Task 3: Select a column

We need to select the country column from the table. We can do this simply as well:

```sql
SELECT country FROM world_food;
```

#### Task 3: Select multiple columns

We can also select multiple columns by just separating them with a comma:

```sql
SELECT country, wheat_production FROM world_food;
```

#### Task 4: Use WHERE

We can use WHERE at the end after selecting the fields to filter by value. Here we need the rice production of the United States.

```sql
SELECT rice_production FROM world_food
WHERE country = 'United States';
```

The strings are represented with single quotes in SQL.

We can use operators other than = as well, for example, the task here is to select all countries with wheat production greater than 20

```sql
SELECT country FROM world_food
WHERE wheat_production > 20;
```

#### Task 5: Use LIKE operator

An operator we can use with WHERE is LIKE, which compares the value with a value that can have similarity.

If we want to select all elements starting with a string `str` we can use `str || '%'` to select them.

The challenge here is to select all the countries starting with the letter U.

```sql
SELECT country FROM world_food
WHERE country LIKE 'U%';
```

I wanted to test if my method works as well, and looks like it does. The || symbol is used to concatenate, but we can also supply preconcatenated strings.

Next challenge is to find all countries that end in 'a'. Simple enough:

```sql
SELECT country FROM world_food
WHERE country LIKE '%a';
```

In the course, she did bring it up that we can use the method I used instead. Nothing groundbreaking here.

#### Task 6: Insert into table

This is after part 1 of travel tracker, and the task is to insert a new row for Italy, with given values into the world_food table.

```sql
INSERT INTO world_food(country, rice_production, wheat_production)
VALUES ('Italy', 1.46, 7.3);
```

I could have also included an id so that I wouldn't have to write column names, but since I can auto increment it, why to write.

And that was what was done in the course as well, so I'm on par.
