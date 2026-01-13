// Simple logger utility for backend
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const log = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

const logger = {
  error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
  warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
  info: (message, data) => log(LOG_LEVELS.INFO, message, data),
  debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data),
};

// Middleware to log requests
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, path, query } = req;
  
  logger.info(`→ ${method} ${path}`, { query: Object.keys(query).length > 0 ? query : 'none' });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const statusColor = statusCode >= 400 ? '❌' : '✓';
    logger.info(`← ${statusColor} ${method} ${path} ${statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = { logger, requestLogger };
