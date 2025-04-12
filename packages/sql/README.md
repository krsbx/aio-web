# @Ignisia/SQL

Type-safe SQL query builder for Bun SQL and SQLite.

## Requirements

- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/) (optional, only for PostgreSQL dialect)

## Installation

```bash
bun add @ignisia/sql
```

## Usage

```ts
import { Table, Column, Database } from '@ignisia/sql';

// Define a table
const users = Table.define({
  name: 'users',
  dialect: 'postgres',
  columns: {
    // Define a column called "id"
    id: Column.define({
      type: 'SERIAL',
    }).primaryKey(),
    name: Column.define({
      type: 'TEXT',
      length: 255,
    }).notNull(),
    email: Column.define({
      type: 'TEXT',
      length: 255,
    }).notNull(),
    password: Column.define({
      type: 'TEXT',
      length: 255,
    }).notNull(),
  },
  // Use soft delete, set `paranoid` to `false` to use hard delete
  // By default the name of the paranoid column called "deletedAt", pass a string to renames it
  paranoid: true,
  // Enable timestamps to track created at and updated at, set `timestamp` to `false` to disable timestamp
  // By default the name of the created at column called "createdAt" and the name of the updated at column called "updatedAt"
  // Pass an object with `createdAt` and `updatedAt` to rename them
  timestamp: true,
});

// Define a database
const db = Database.define({
  // Define a connection with PostgreSQL
  dialect: 'postgres',
  // Define a PostgreSQL connection
  config: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'my_database',
  },
  // Define tables that connected to the database
  //  This will automatically assign db properties to each table so it can do query
  tables: {
    users,
  },
});

// Using the database

// Fetch all users
const listUsers = await db.table('users').select().query();
// ^ Add .limit before the .query() to limit the number of results
// ^ Add .offset before the .query() to offset the results
// ^ Add .orderBy before the .query() to order the results
// ^ Add .where before the .query() to filter the results
// ^ Replace .query() with .toQuery() to know what is the generated query and what are the parameters that will be passed on the query

// Create a new user
const newUsers = await db.table('users').insert(
  {
    name: 'John Doe',
    email: 'jRZQ3@example.com',
    password: 'password',
  },
  {
    name: 'Jane Doe',
    email: 'YKt0x@example.com',
    password: 'password',
  }
);

// Delete a user
const deletedUsers = await db.table('users').delete();
// ^ Add .where before the .query() to filter the deleted rows

// Update a user
const updatedUsers = await db.table('users').update({
  name: 'John Doe',
  email: 'jRZQ3@example.com',
  password: 'password',
});
// ^ Add .where before the .query() to filter the updated rows
```

> Some of the functions is not covered in the usage example above
> **Note**: `@ignisia/sql` does not do any input validations, therefore it is your responsibility to validate the user input on your own.

## Security Considerations

- For SQLite Dialect, we recommend to use along with the `@ignisia/securedb` package to encrypt/decrypt the database file.
