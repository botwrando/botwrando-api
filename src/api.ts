import express from 'express';
import helmet from 'helmet';

const api: express.Application = express();
api.use(helmet);

api.get('/', (_req, res) => {
  res.end('BotW Rando API is working...');
});

export default api;
