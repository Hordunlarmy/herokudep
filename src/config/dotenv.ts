import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

// Validate necessary environment variables
if (!process.env.PORT) {
  logger.error('PORT environment variable is not defined!');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL environment variable is not defined!');
  process.exit(1);
}

if (!process.env.WHITELISTED_IPS) {
  logger.error('WHITELISTED_IPS environment variable is not set. Application cannot start without it.');
  process.exit(1);  
}

export default {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  whitelistIps: process.env.WHITELISTED_IPS
};