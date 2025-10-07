// Use an in-memory SQLite during tests
process.env.DB_FILE = ':memory:';
process.env.HOSTNAME = 'issuance-pod-42';
process.env.LOG_LEVEL = 'silent';
