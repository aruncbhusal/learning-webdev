### Task Example

-   We have a csv file called capitals.csv, which has comma separated values
-   The first line contains the headers: id, country, capital. When creating a database, those will be our columns
-   We can open pgAdmin and set up a global password for the default server which has a database, but we need a new one
-   Let's create a database called "countries" by right clicking on "Databases"
-   After creating, we can then use the query tool (Alt+Shit+Q) to insert our query to create the table for capitals. We can use:

```sql
CREATE TABLE capitals (
    id SERIAL PRIMARY KEY,
    country VARCHAR(45),
    capital VARCHAR(45)
);
```

-   We can have many other constraints like NOT NULL, UNIQUE, etc, but for this one, we won't be using them.
-   all the fields except the last one will have a comma afterward, and we need to end the SQL Query with a semicolon.
-   After the query is executed (F5), we now have a table inside "Schema" which we can right click and View > All Data.
-   Since it has no data, we can then right click on the capitals table and select "import data" from csv then select the file.
-   We should take care to select the "headers" checkbox, and also ensure the headers spelling and order matches in both sides.
-   After importing, we can refresh and see all the entries added to our database.

### Task Challenge

-   Our assigned task is to similarly create a new table and import data from flags.csv
-   We can see that the fields are id, name and flag; and flag is a UTF-8 character, we can use VARCHAR, but this time let's use TEXT

```sql
CREATE TABLE flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45),
    flag TEXT
);
```

-   Similarly, refresh, open table then import from csv
