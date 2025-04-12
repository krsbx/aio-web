# @Ignisia/SecureDB

Add encryption/decryption for Bun SQLite database for `@ignisia/sql` and `@ignisia/nosql` package.

## Requirements

- [Bun](https://bun.sh/)

## Installation

```bash
# Add @ignisia/securedb
bun add @ignisia/securedb

# Add @ignisia/sql if you are intend to use @ignisia/sql
bun add @ignisia/sql

# Add @ignisia/nosql if you are intend to use @ignisia/nosql
bun add @ignisia/nosql
```

## Usage

```ts
import { SecureSqlDb, SecureNoSqlDb } from '@ignisia/securedb';

// For @ignisia/sql
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
});

// For @ignisia/nosql
await using db = await SecureNoSqlDb.define({
  // Location of the database to be stored
  filename: 'db.db',
  // Password to encrypt/decrypt the database
  password: 'password',
  // Salt to encrypt/decrypt the database
  salt: 'salt',
});
```

> For functions that are implemented on the SecureSqlDb and SecureNoSqlDb is pretty much the same as the one exported from @ignisia/sql and @ignisia/nosql
> **Note**: `@ignisia/securedb` does not do any input validations, therefore it is your responsibility to validate the user input on your own.
