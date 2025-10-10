import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT || 4002),
  SERVICE_NAME: process.env.SERVICE_NAME || 'verification-service',
  ISSUANCE_DB_FILE: process.env.ISSUANCE_DB_FILE || '../issuance-service/data/issuance.db',
  VERIFICATION_DB_FILE: process.env.VERIFICATION_DB_FILE || './data/verification.db'
};
