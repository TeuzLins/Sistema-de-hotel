import { createServer } from './server.js';
import { env } from './config/env.js';

const app = createServer();
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}/api/v1`);
  if (env.NODE_ENV === 'development') {
    console.log(`Swagger UI on http://localhost:${port}/api-docs`);
  }
});