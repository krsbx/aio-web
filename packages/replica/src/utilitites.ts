import type { WebSocket } from 'ws';
import type {
  AcceptedPrimaryInstance,
  PrimaryDatabaseQueryRequest,
} from './types';

export function onPrimaryQueryListener(
  ws: WebSocket,
  db: AcceptedPrimaryInstance
) {
  ws.addEventListener('message', async (event) => {
    try {
      if (typeof event.data !== 'string') return;

      const data = JSON.parse(event.data) as PrimaryDatabaseQueryRequest;

      if (data.action !== '@ignisia/replica' || data.payload.type === 'SELECT')
        return;

      await db.client.exec(data.payload.query, data.payload.params);
    } catch {
      // Ignore the JSON parsing error or other errors
    }
  });
}
