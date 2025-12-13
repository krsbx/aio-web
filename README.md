# Ignisia

An all-in-one tooling for your web development needs. Everything you need in one place, built with most of [**Bun**](https://bun.sh) internal modules unless otherwise specified.

## Features

- [x] [@ignisia/sql](./packages/sql)

> SQL Database Query Builder for [**Bun**](https://bun.sh) SQL and SQLite.

- [x] [@ignisia/nosql](./packages/nosql)

> NoSQL Database Query Builder for [**Bun**](https://bun.sh), built on top of [**SQLite**](https://sqlite.org/).

- [ ] [@ignisia/storage](./packages/storage)

> Bun File Storage adapter, built on top of Bun File System and S3.

- [x] [ignisia](./packages/ignisia)

> Web Framework built on top of [**Bun**](https://bun.sh) HTTP Server and WebSocket Server.

- [x] [@ignisia/encryption](./packages/encryption)

> Encryption utilities for SQLite [@ignisia/securedb](./packages/securedb).

- [x] [@ignisia/securedb](./packages/securedb)

> Password protected SQLite for [@ignisia/sql](./packages/sql) and [@ignisia/nosql](./packages/nosql).

- [x] [@ignisia/replica](./packages/replica)

> Replica-Set mechanism for [@ignisia/sql](./packages/sql), [@ignisia/nosql](./packages/nosql), and [@ignisia/securedb](./packages/securedb).

- [ ] [@ignisia/mongodb](./packages/mongodb)

> Database Query Builder for [**MongoDB**](https://www.mongodb.com/).

## Plan

- [x] Add support for replica-set mechanism for the NoSQL adapters.

- [x] Add support for replica-set mechanism for the SQL adapters.

- [x] Add support for password protected database for the NoSQL adapters.

- [x] Add support for password protected database for the SQL (SQLite) adapters.

- [ ] Add support for mongodb database for the NoSQL adapters.

- [ ] Add support for full-stack web framework.
