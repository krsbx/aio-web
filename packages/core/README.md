# @Ignisia/Core

Blazing fast web framework for [**Bun**](https://bun.sh).

## Requirements

- [Bun](https://bun.sh/)

## Installation

```bash
bun add @ignisia/core
```

## Usage

```ts
import { Ignisia } from '@ignisia/core';

const app = new Ignisia();
// ^ You can also use `const app = new Ignisia('/api');` to define a base path

app.get('/', async (ctx) => {
  // Get the request query
  const query = ctx.req.query();

  return ctx.text('Hello World');
});
// ^ You can also use other methods like `app.post`, `app.put`, `app.patch`, `app.delete`, `app.options`

// Route with parameters
app.get('/user/:id', async (ctx) => {
  // Get the request parameters
  const params = ctx.req.param();
  // ^ You can also use `ctx.req.param('id')` to get a specific parameter

  return ctx.text(`Hello ${params.id}`);
});

// Route with middleware
app.get(
  '/user/:id',
  async (ctx, next) => {
    // Do something before the route
    await next();
    // Do something after the route
  },
  async (ctx) => {
    // Get the request parameters
    const id = ctx.req.param('id');

    return ctx.text(`Hello ${id}`);
  }
);

app.post('/user', async (ctx) => {
  // Get the request body
  const body = await ctx.req.json();
  // ^ You can also use other ctx.req method to get the request body
  //    .json: returns a JSON object
  //    .text: returns a string
  //    .arrayBuffer: returns an ArrayBuffer
  //    .blob: returns a Blob
  //    .formData: returns a FormData object

  // Get the request query
  const query = ctx.req.query();

  // Get the request headers
  const headers = ctx.req.header();
  // ^ This will return an object of all the headers with the lowercase keys
  // ^ You can also use `ctx.req.header('Content-Type')` to get a specific header

  // Get the request cookies
  const cookies = ctx.req.cookies();

  // Get the request method
  const method = ctx.req.method;

  // Set the status code
  ctx.status(200);

  // Set the response headers
  ctx.header('Content-Type', 'application/json');

  return ctx.json(body);
  // ^ You can also use other ctx method to return a response
  //    .json: returns a JSON object
  //    .text: returns a string
  //    .html: returns an HTML string
  //    .body: returns an instance of Response
});

// Global middleware
app.use(async (ctx, next) => {
  // Do something before the request
  await next();
  // Do something after the request
});

// Route specific middleware
app.use('/user', async (ctx, next) => {
  // Do something before the request
  await next();
  // Do something after the request
});

// Start the server
app.listen();
```

> Some of the functions is not covered in the usage example above
