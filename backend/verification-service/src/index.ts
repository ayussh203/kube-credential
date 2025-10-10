import app from './app';
import { env } from './utils/env';
import logger from './utils/logger';

app.listen(env.PORT, () => {
  logger.info(`Verification service listening on http://localhost:${env.PORT}`);
});
logger.info({ path: env.ISSUANCE_DB_FILE }, 'ISSUANCE_DB_FILE');
logger.info({ path: env.VERIFICATION_DB_FILE }, 'VERIFICATION_DB_FILE');