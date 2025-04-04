import { Elysia } from 'elysia';
import { PORT_ALLOCATION } from '../utilities/config';

new Elysia()
  .get('/', () => '')
  .get('/user/:id', ({ params }) => params.id)
  .post('/user', () => '')
  .listen(PORT_ALLOCATION.ELYSIA);

console.log(`Elysia server listening on port ${PORT_ALLOCATION.ELYSIA}`);
