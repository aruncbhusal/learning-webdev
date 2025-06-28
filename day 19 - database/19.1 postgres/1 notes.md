### Alter a table

We can alter/modify a table after already creating it, and we can do the following:

#### 1. Rename the table

We can use

```sql
ALTER TABLE table_name
    RENAME TO new_name;
```

#### 2. Change data type of a field

To change the data type of a field in the table, we can use

```sql
ALTER TABLE table_name
    ALTER COLUMN field_name TYPE VARCHAR(50);
```

The data type may be anything.

#### 3. Add a new column to the table

```sql
ALTER TABLE table_name
    ADD salary INT;
```

#### 4. Add constraints to the table

We can add constraints like UNIQUE, NOT NULL, etc later as well. If I had not set country and user id as PK, I would have used

```sql
ALTER TABLE visited_countries
    ADD UNIQUE(user_id, country_id);
```

In this way we can avoid duplicates.

### More commands the affect table data

#### 5. Delete a table

In SQL lingo we call it "dropping" a table from the database. We use

```sql
DROP TABLE table_name1, table_name2 ...;
```

But if we don't have a table, we might run into errors, so we use constraints to be safe

```sql
DROP TABLE IF EXISTS table_name1, table_name2 ...;
```

#### 6. Updating certain value(s)

We can update values in a specified column or a specific record's column by using UPDATE

```sql
UPDATE table_name
    SET column_name = value1, value2,...
    WHERE constraint;
```

#### 7. Order the queried data

When selecting from a table, we can choose to order/sort our data by using a certain field as the parameter, ascending or descending.

To sort by name in the users table in descending order we can use

```sql
SELECT * FROM users
    ORDER BY name DESC;
```

#### 8. Delete a record

We can delete a record rather than a table by using DELETE

```sql
DELETE FROM table_name
    WHERE (condition_to_find_the_record(s));
```

To delete a record, we can either select the condition to be the id of the record, but we might not have it available.

So we can instead use the other constraints and join them with AND / OR.
