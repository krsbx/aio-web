import { Ignisia } from '../../../core/src';
import { PORT_ALLOCATION } from '../utilities/config';

const app = new Ignisia();

app.get('/', (c) => c.text(''));
app.get('/user/:id', (c) => c.text(c.req.param('id')));
app.post('/user', (c) => c.text(''));

const config = {
  fetch: app.fetch as never,
  port: PORT_ALLOCATION.IGNISIA,
};

console.log(`Ignisia server listening on port ${PORT_ALLOCATION.IGNISIA}`);

export default config;
