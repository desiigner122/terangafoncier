import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// 📝 CONFIGURATION LOGGER TERANGA FONCIER 📝
const { combine, timestamp, errors, json, printf, colorize } = winston.format;

// Format personnalisé pour console
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level}] ${message}`;
  
  // Ajouter stack trace si erreur
  if (stack) {
    log += `\n${stack}`;
  }
  
  // Ajouter métadonnées si présentes
  if (Object.keys(meta).length > 0) {
    log += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return log;
});

// Configuration transport fichiers avec rotation
const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/teranga-foncier-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  )
});

const errorFileTransport = new DailyRotateFile({
  filename: 'logs/teranga-foncier-error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  )
});

// Création logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { 
    service: 'teranga-foncier-api',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    fileRotateTransport,
    errorFileTransport
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/exceptions.log',
      format: combine(timestamp(), errors({ stack: true }), json())
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/rejections.log',
      format: combine(timestamp(), errors({ stack: true }), json())
    })
  ]
});

// Transport console pour développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'HH:mm:ss' }),
      consoleFormat
    )
  }));
}

// 🎯 FONCTIONS LOGGING SPÉCIALISÉES
export const logAuth = (userId, action, details = {}) => {
  logger.info('🔐 AUTH', {
    userId,
    action,
    details,
    category: 'authentication'
  });
};

export const logBlockchain = (action, txHash, details = {}) => {
  logger.info('🔗 BLOCKCHAIN', {
    action,
    txHash,
    details,
    category: 'blockchain'
  });
};

export const logAI = (action, documentId, details = {}) => {
  logger.info('🤖 AI', {
    action,
    documentId,
    details,
    category: 'ai'
  });
};

export const logAPI = (method, url, statusCode, responseTime, userId = null) => {
  const level = statusCode >= 400 ? 'warn' : 'info';
  logger.log(level, '🌐 API', {
    method,
    url,
    statusCode,
    responseTime: `${responseTime}ms`,
    userId,
    category: 'api'
  });
};

export const logDatabase = (operation, table, details = {}) => {
  logger.info('💾 DATABASE', {
    operation,
    table,
    details,
    category: 'database'
  });
};

export const logSecurity = (event, details = {}, level = 'warn') => {
  logger.log(level, '🛡️ SECURITY', {
    event,
    details,
    category: 'security'
  });
};

export const logBusiness = (event, details = {}) => {
  logger.info('💼 BUSINESS', {
    event,
    details,
    category: 'business'
  });
};

export const logPerformance = (operation, duration, details = {}) => {
  const level = duration > 1000 ? 'warn' : 'info';
  logger.log(level, '⚡ PERFORMANCE', {
    operation,
    duration: `${duration}ms`,
    details,
    category: 'performance'
  });
};

// 📊 MIDDLEWARE LOGGER EXPRESS
export const expressLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log requête entrante
  logger.info('📥 REQUEST', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    category: 'request'
  });
  
  // Intercepter réponse
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - start;
    
    logAPI(req.method, req.originalUrl, res.statusCode, responseTime, req.user?.id);
    
    // Log réponse détaillée si erreur
    if (res.statusCode >= 400) {
      logger.warn('📤 ERROR_RESPONSE', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        body: req.body,
        query: req.query,
        params: req.params,
        userId: req.user?.id,
        category: 'error_response'
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// 🚨 GESTION ERREURS GLOBALES
export const logError = (error, context = {}) => {
  logger.error('❌ ERROR', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    context,
    category: 'error'
  });
};

export const logCritical = (message, details = {}) => {
  logger.error('🚨 CRITICAL', {
    message,
    details,
    timestamp: new Date().toISOString(),
    category: 'critical'
  });
  
  // En production, envoyer alerte (email, Slack, etc.)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Intégrer système d'alertes
  }
};

// 📈 MÉTRIQUES & MONITORING
export const logMetric = (name, value, unit = 'count', tags = {}) => {
  logger.info('📊 METRIC', {
    metricName: name,
    value,
    unit,
    tags,
    category: 'metric'
  });
};

export const logTimer = (name) => {
  const start = Date.now();
  return () => {
    const duration = Date.now() - start;
    logMetric(`${name}_duration`, duration, 'ms');
    return duration;
  };
};

// 🔍 FONCTIONS UTILITAIRES
export const sanitizeLogData = (data) => {
  // Supprimer informations sensibles des logs
  const sensitive = ['password', 'token', 'key', 'secret', 'authorization'];
  const sanitized = { ...data };
  
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  };
  
  return sanitizeObject(sanitized);
};

export const createChildLogger = (service) => {
  return logger.child({ service });
};

// 🧹 NETTOYAGE LOGS
export const cleanupLogs = () => {
  // winston-daily-rotate-file s'occupe automatiquement du nettoyage
  logger.info('🧹 Log cleanup completed');
};

export default logger;