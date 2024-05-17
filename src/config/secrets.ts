export const secrets = {
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
  PGHOST: process.env.PGHOST || 'localhost',
  PGPORT: process.env.PGPORT || 5432,
  PGUSER: process.env.PGUSER || 'postgres',
  PGPASSWORD: process.env.PGPASSWORD || 'postgres',
  PGDATABASE: process.env.PGDATABASE || 'postgres',
  AUTOSYNC_DB: process.env.AUTOSYNC_DB || 'FALSE',
  DB_LOGGING: process.env.DB_LOGGING || 'TRUE',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
