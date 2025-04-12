# @Ignisia/NoSQL

Type-safe NoSQL query builder for Bun SQLite.

## Requirements

- [Bun](https://bun.sh/)

## Installation

```bash
bun add @ignisia/nosql
```

## Usage

### Key-Value

```ts
import { KeyValue } from '@ignisia/nosql';

const db = KeyValue.define({
  // Location of the database to be stored
  filepath: 'db.sqlite',
  // Time to live in seconds, default is 3
  ttl: 3,
});

// Store an item to the database
db.setItem('foo', 'bar', 10);
// ^ `10` is optional, it will use the default ttl if not provided

// Store an item to the database
db.setItems({
  key: 'foo',
  value: 'bar',
  // Custom time to live for the item
  ttl: 10,
});

// Get an item from the database
const item = db.getItem('foo');
// ^ By default the return type will be any
// ^ You can specify the return type, by adding <typeof the properties> before the functions call

// Get an item from the database with type casting
const item = db.getItem<string>('foo');

// Get multiple items
const items = db.getItems('foo');
// ^ It will return multiple of items that start with `foo`
// ^ You also can do a type casting
const items = db.getItems<string>('foo');

// Get multiple items with multiple keys
const items = db.getItems(['foo', 'bar']);
// ^ It will return item that name `foo` and `bar`

// Get all items
const items = db.getItems();

// Delete an item from the database
db.delete('foo');

// Delete multiple items from the database
db.delete('foo', 'bar');
```

> Some of the functions is not covered in the usage example above

### Collections/Documents

```ts
import { Database, Document, Field } from '@ignisia/nosql';

// Define a document
const users = Document.define({
  name: 'users',
  fields: {
    // Define a field called "name"
    name: Field.define({
      type: 'STRING',
    }).notNull(),
    email: Field.define({
      type: 'STRING',
    }).notNull(),
    password: Field.define({
      type: 'STRING',
    }).notNull(),
  },
});

const db = Database.define({
  // Location of the database to be stored
  filename: 'db.sqlite',
  // Define documents that connected to the database
  //  This will automatically assign db properties to each documents so it can do query
  docs: {
    users,
  },
});

// Using the database

// Fetch all users
const listUsers = await db.document('users').select().query();
// ^ Add .limit before the .query() to limit the number of results
// ^ Add .offset before the .query() to offset the results
// ^ Add .orderBy before the .query() to order the results
// ^ Add .where before the .query() to filter the results
// ^ Replace .query() with .toQuery() to know what is the generated query and what are the parameters that will be passed on the query

// Create a new user
const newUsers = await db.document('users').insert(
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
const deletedUsers = await db.document('users').delete();
// ^ Add .where before the .query() to filter the deleted rows

// Update a user
const updatedUsers = await db.document('users').update({
  name: 'John Doe',
  email: 'jRZQ3@example.com',
  password: 'password',
});
// ^ Add .where before the .query() to filter the updated rows
```

> Some of the functions is not covered in the usage example above
> **Note**: `@ignisia/nosql` does not do any input validations, therefore it is your responsibility to validate the user input on your own.

## Security Considerations

- For SQLite Dialect, we recommend to use along with the `@ignisia/securedb` package to encrypt/decrypt the database file.
