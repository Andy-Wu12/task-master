import http from 'http';

import app from './app';

import { mongoConnect } from './services/mongo';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect(process.env.MONGO_URI!, 'taskTracker');
  
  server.listen(PORT, () => {
    console.log(`Running server on port ${PORT}...`);
  });
}

startServer();