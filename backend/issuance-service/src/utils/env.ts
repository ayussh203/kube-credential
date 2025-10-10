import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT || 4001),
  SERVICE_NAME: process.env.SERVICE_NAME || 'issuance-service',
  ISSUANCE_DB_FILE: process.env.ISSUANCE_DB_FILE || '/data/issuance.db',
};
