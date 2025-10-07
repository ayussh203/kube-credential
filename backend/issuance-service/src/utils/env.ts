import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT || 4001),
  SERVICE_NAME: process.env.SERVICE_NAME || 'issuance-service'
};
