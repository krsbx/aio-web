# @Ignisia/Encryption

Encryption utilities for [@ignisia/securedb](./packages/securedb) and other package related.

## Requirements

- [Bun](https://bun.sh/)

## Installation

```bash
bun add @ignisia/encryption
```

## Usage

```ts
import {
  encryptFile,
  decryptFile,
  encryptData,
  decryptData,
} from '@ignisia/encryption';

// Encrypt a file
await encryptFile({
  input: 'file.txt',
  output: 'file.txt.enc',
  password: 'password',
  // Add salt for extra security, optional
  salt: 'salt',
});

// Decrypt a file
await decryptFile({
  input: 'file.txt.enc',
  output: 'file.txt',
  password: 'password',
  // Add salt for extra security, optional
  // Salt should be the same as the one used to encrypt the file
  salt: 'salt',
});

// Encrypt data
const encryptedData = await encryptData({
  data: 'data',
  password: 'password',
  // Add salt for extra security, optional
  salt: 'salt',
});
// ^ it will return the encrypted data as a string base64 encoded and the iv as a string base64 encoded

// Decrypt data
const decryptedData = await decryptData({
  data: 'data',
  password: 'password',
  // The iv should be the same as the one used to encrypt the data
  iv: 'iv',
  // Add salt for extra security, optional
  // Salt should be the same as the one used to encrypt the data
  salt: 'salt',
});
```

> Some of the functions is not covered in the usage example above
