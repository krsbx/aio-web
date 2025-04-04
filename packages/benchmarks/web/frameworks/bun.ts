import { PORT_ALLOCATION } from '../utilities/config';

Bun.serve({
  port: PORT_ALLOCATION.BUN,
  routes: {
    '/': {
      async GET() {
        return new Response('');
      },
    },
    '/user/:id': {
      async GET(req) {
        return new Response(req.params.id);
      },
    },
    '/user': {
      async POST() {
        return new Response('');
      },
    },
  },
});
