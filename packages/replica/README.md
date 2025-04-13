# @Ignisia/Replica

Replica-Set mechanism for SQLite, built on top of `@ignisia/sql`, `@ignisia/nosql`, `@ignisia/securedb`, and Bun WebSocket Server.

## Requirements

- [Bun](https://bun.sh/)

## Installation

```bash
# Add @ignisia/replica
bun add @ignisia/replica

# Add @ignisia/sql if you are intend to use @ignisia/sql
bun add @ignisia/sql

# Add @ignisia/nosql if you are intend to use @ignisia/nosql
bun add @ignisia/nosql

# Add @ignisia/securedb if you are intend to use @ignisia/securedb
bun add @ignisia/securedb
```

## Usage

```ts
import {
  PrimaryDatabaseReplica,
  ReplicaDatabaseReplica,
} from '@ignisia/replica';

// For @ignisia/sql
const db = Database.define({
  // Define dialect
  dialect: 'sqlite',
  config: {
    // Location of the database to be stored
    filename: 'db.db',
  },
  // Define tables that connected to the database
  //  This will automatically assign db properties to each table so it can do query
  tables: {
    users,
  },
});

// For @ignisia/sql with @ignisia/securedb
await using db = await SecureSqlDb.define({
  // Define dialect
  dialect: 'sqlite',
  config: {
    // Location of the database to be stored
    filename: 'db.db',
  },
  // Password to encrypt/decrypt the database
  password: 'password',
  // Salt to encrypt/decrypt the database
  salt: 'salt',
  // Define tables that connected to the database
  //  This will automatically assign db properties to each table so it can do query
  tables: {
    users,
  },
});

// For @ignisia/nosql
const db = Database.define({
  // Location of the database to be stored
  filename: 'db.sqlite',
  // Define documents that connected to the database
  //  This will automatically assign db properties to each documents so it can do query
  docs: {
    users,
  },
});

// For @ignisia/nosql with @ignisia/securedb
await using db = await SecureNoSqlDb.define({
  // Location of the database to be stored
  filename: 'db.db',
  // Password to encrypt/decrypt the database
  password: 'password',
  // Salt to encrypt/decrypt the database
  salt: 'salt',
  // Define documents that connected to the database
  //  This will automatically assign db properties to each documents so it can do query
  docs: {
    users,
  },
});

// On your main server/primary
const primary = PrimaryDatabaseReplica.define({
  db: db,
  replicas: [
    // Define replicas with ReplicaDatabaseReplica class
    ReplicaDatabaseReplica.define({
      type: ReplicaInstanceType.WEB_SOCKET,
      // Your WebSocket Server that will be subscribed by the replicas
      instance: wsServer,
    }),
  ],
});

// On your replicas
import { onPrimaryQueryListener } from '@ignisia/replica';

// Define a web socket subscriber
const ws = new WebSocket('ws://localhost:3000');

// Create a replica db instance using @ignisia/sql, @ignisia/nosql, or @ignisia/securedb

// For example, we will use the @ignisia/sql with @ignisia/securedb
await using db = await SecureSqlDb.define({
  // Define dialect
  dialect: 'sqlite',
  config: {
    // Location of the database to be stored
    filename: 'db.db',
  },
  // Password to encrypt/decrypt the database
  password: 'password',
  // Salt to encrypt/decrypt the database
  salt: 'salt',
  // Define tables that connected to the database
  //  This will automatically assign db properties to each table so it can do query
  tables: {
    users,
  },
});

// Subscribe to the primary db
onPrimaryQueryListener(ws, db);
```

> Some of the functions is not covered in the usage example above
> **Note**: `@ignisia/replica` does not do any input validations, therefore it is your responsibility to validate the user input on your own.
> **Note**: `@ignisia/replica` does not do any error handling, transactions between replicas, missing data handling, etc.
