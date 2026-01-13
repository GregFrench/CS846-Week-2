// Frontend Logger Service
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const getTimestamp = () => {
  return new Date().toLocaleTimeString();
};

const getLogStyle = (level) => {
  const styles = {
    ERROR: 'color: #c33; font-weight: bold;',
    WARN: 'color: #f90; font-weight: bold;',
    INFO: 'color: #1DA1F2; font-weight: bold;',
    DEBUG: 'color: #666;'
  };
  return styles[level] || '';
};

const log = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const style = getLogStyle(level);
  const prefix = `%c[${timestamp}] [${level}]`;

  if (data) {
    console.log(prefix + ` ${message}`, style, data);
  } else {
    console.log(prefix + ` ${message}`, style);
  }
};

export const logger = {
  error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
  warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
  info: (message, data) => log(LOG_LEVELS.INFO, message, data),
  debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data),
};

// Log API calls
export const logApiCall = (method, endpoint, status, duration) => {
  const statusColor = status >= 400 ? 'ERROR' : 'INFO';
  const statusEmoji = status >= 400 ? '❌' : '✓';
  logger[statusColor.toLowerCase()](`${statusEmoji} ${method} ${endpoint} ${status} (${duration}ms)`);
};

export default logger;
