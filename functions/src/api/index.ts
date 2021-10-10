import * as cors from 'cors';
import * as express from 'express';
import { logger } from 'firebase-functions';
import { order } from './order';

const app = express();
app.use((req, res, next) => {
  logger.info('Request received!', { headers: req.headers, url: req.url });
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.raw());

app.use('/order', order);

export { app };
