import { Router } from '../../../core/src';
import { PORT_ALLOCATION } from '../utilities/config';

const app = new Router();

app.get('/', (c) => c.text(''));
app.get('/user/:id', (c) => c.text(c.req.params('id')));
app.post('/user', (c) => c.text(''));

const config = {
  fetch: app.fetch as never,
  port: PORT_ALLOCATION.IGNISIA,
};

console.log(`Ignisia server listening on port ${PORT_ALLOCATION.IGNISIA}`);

export default config;
