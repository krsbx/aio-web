import { Ignisia } from '../../../core/src';
import { PORT_ALLOCATION } from '../utilities/config';

const app = new Ignisia();

app.get('/', (c) => c.text(''));
app.get('/user/:id', (c) => c.text(c.req.param('id')));
app.post('/user', (c) => c.text(''));

console.log(`Ignisia server listening on port ${PORT_ALLOCATION.IGNISIA}`);

app.listen({
  routes: false,
  port: PORT_ALLOCATION.IGNISIA,
  development: false,
});
