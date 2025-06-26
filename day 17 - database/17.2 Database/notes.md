### What Was Missing in The Blog Project?

We may create, edit, delete or do anything with the blog posts, but as soon as we restart the server, it reverts back.

This was because all the information was stored in temporary memory as variables, but what if we want the data to persist?

### Database

Databases are the data to be used in a service, stored in permanent memory, like hard disks.

In the past magnetic disks were used, where an electromagnet used to flip poles to deltermine the data stored.

### Types of Databases

There are two main types of database technologies available currently: SQL and NoSQL

#### SQL (Structured Query Language)

It is the most popular as well as the traditional way of storing data. We use the SQL to query data from the database.

In SQL, the information is stored as tables, there are different tables for each category, like posts, users, etc.

These tables are linked by relationships, and can be used to retrieve information from one table to another through these.

Because of this ability, they are also called relational databases.

The most popular SQL Databases are Oracle Database, PostgreSQL, MySQL, SQLite, etc.

#### NoSQL

It is the storage of data as documents or in key value pairs like JSON. It is different from the table like structure of SQL.

Because of this difference, it is highly flexible, both horizontally and vertically. Verticlly simply means more entries.

But it can scale horizontally, i.e. add additional attributes / change existing ones for entries flexibly. SQL tables are rigid.

Though it is popular with databases like MongoDB, Redis and DynamoDB, SQL is still the most popular because of the relational nature.
