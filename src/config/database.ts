import { Pool } from 'pg';
import logger from './logger';

// Connection configuration with fallback values
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 60000, // Timeout if a connection takes longer than 60 seconds
});

// Listen to pool events
pool.on('connect', () => {
  logger.info('✅ Successfully connected to the database');
});

pool.on('remove', () => {
  logger.info('🚪 A database connection was closed');
});

pool.on('error', (err) => {
  logger.error('❌ Unexpected error on the database', err);
  process.exit(-1); // Exit the process in case of a fatal error
});

// Retry logic for connecting to the database
const connectWithRetry = async (retries = 5) => {
  while (retries) {
    try {
      await pool.connect(); // Attempt to connect
      logger.info('✅ Database is operational');
      break; // If connection succeeds, break out of the loop
    } catch (error) {
      retries -= 1;
      logger.error(`❌ Failed to connect to the database. Retries left: ${retries}`, error);
      if (retries === 0) {
        logger.error('🚨 No retries left. Shutting down the application.');
        process.exit(1); // Exit if retries are exhausted
      } else {
        logger.info('🔁 Retrying to connect to the database in 5 seconds...');
        await new Promise(res => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
      }
    }
  }
};

// Call the retry connection logic when the application starts
connectWithRetry();

export default pool;
