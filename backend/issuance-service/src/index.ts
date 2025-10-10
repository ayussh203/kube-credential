import app from './app';
import { env } from './utils/env';
import logger from './utils/logger';
import { pingDb } from './db/sqlite';

pingDb();
app.listen(env.PORT, () => {
  logger.info(`Issuance service listening on http://localhost:${env.PORT}`);
});
