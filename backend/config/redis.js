import redis from 'redis';
import logger from '../utils/logger.js';

// ⚡ CONFIGURATION REDIS TERANGA FONCIER ⚡
let redisClient;
let redisSubscriber;
let redisPublisher;

// Durées de cache par défaut (en secondes)
export const CACHE_DURATIONS = {
  USER_SESSION: 3600, // 1 heure
  PROPERTY_DATA: 1800, // 30 minutes
  SEARCH_RESULTS: 900, // 15 minutes
  BLOCKCHAIN_DATA: 600, // 10 minutes
  AI_ANALYSIS: 7200, // 2 heures
  MARKET_DATA: 21600, // 6 heures
  NOTIFICATIONS: 300 // 5 minutes
};

export const initRedis = async () => {
  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 0,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    };

    // Client principal
    redisClient = redis.createClient(redisConfig);
    
    // Client pour pub/sub notifications
    redisSubscriber = redis.createClient(redisConfig);
    redisPublisher = redis.createClient(redisConfig);

    // Gestion erreurs
    redisClient.on('error', (err) => logger.error('❌ Redis Client Error:', err));
    redisSubscriber.on('error', (err) => logger.error('❌ Redis Subscriber Error:', err));
    redisPublisher.on('error', (err) => logger.error('❌ Redis Publisher Error:', err));

    // Connexion
    await redisClient.connect();
    await redisSubscriber.connect();
    await redisPublisher.connect();

    logger.info('✅ Redis connecté - Cache Teranga Foncier actif');
    
    // Test connexion
    await redisClient.ping();
    logger.info('🏓 Redis ping successful');

    return { redisClient, redisSubscriber, redisPublisher };
    
  } catch (error) {
    logger.error('❌ Erreur connexion Redis:', error);
    // Mode dégradé sans cache
    return { redisClient: null, redisSubscriber: null, redisPublisher: null };
  }
};

// 🔄 FONCTIONS CACHE GÉNÉRIQUES
export const setCache = async (key, value, duration = CACHE_DURATIONS.PROPERTY_DATA) => {
  try {
    if (!redisClient) return false;
    
    const serializedValue = JSON.stringify(value);
    await redisClient.setEx(key, duration, serializedValue);
    
    logger.debug(`📦 Cache set: ${key} (${duration}s)`);
    return true;
    
  } catch (error) {
    logger.error('❌ Erreur set cache:', error);
    return false;
  }
};

export const getCache = async (key) => {
  try {
    if (!redisClient) return null;
    
    const value = await redisClient.get(key);
    if (!value) return null;
    
    logger.debug(`📦 Cache hit: ${key}`);
    return JSON.parse(value);
    
  } catch (error) {
    logger.error('❌ Erreur get cache:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    if (!redisClient) return false;
    
    await redisClient.del(key);
    logger.debug(`🗑️ Cache deleted: ${key}`);
    return true;
    
  } catch (error) {
    logger.error('❌ Erreur delete cache:', error);
    return false;
  }
};

export const clearCachePattern = async (pattern) => {
  try {
    if (!redisClient) return false;
    
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`🧹 Cache cleared: ${keys.length} keys matching ${pattern}`);
    }
    return true;
    
  } catch (error) {
    logger.error('❌ Erreur clear cache pattern:', error);
    return false;
  }
};

// 👤 CACHE SESSIONS UTILISATEURS
export const setUserSession = async (userId, sessionData) => {
  const key = `session:${userId}`;
  return await setCache(key, sessionData, CACHE_DURATIONS.USER_SESSION);
};

export const getUserSession = async (userId) => {
  const key = `session:${userId}`;
  return await getCache(key);
};

export const clearUserSession = async (userId) => {
  const key = `session:${userId}`;
  return await deleteCache(key);
};

// 🏠 CACHE PROPRIÉTÉS
export const setPropertyCache = async (propertyId, propertyData) => {
  const key = `property:${propertyId}`;
  return await setCache(key, propertyData, CACHE_DURATIONS.PROPERTY_DATA);
};

export const getPropertyCache = async (propertyId) => {
  const key = `property:${propertyId}`;
  return await getCache(key);
};

export const clearPropertyCache = async (propertyId) => {
  const key = `property:${propertyId}`;
  return await deleteCache(key);
};

// 🔍 CACHE RECHERCHES
export const setSearchCache = async (searchQuery, results) => {
  const key = `search:${Buffer.from(searchQuery).toString('base64')}`;
  return await setCache(key, results, CACHE_DURATIONS.SEARCH_RESULTS);
};

export const getSearchCache = async (searchQuery) => {
  const key = `search:${Buffer.from(searchQuery).toString('base64')}`;
  return await getCache(key);
};

// 🔗 CACHE BLOCKCHAIN
export const setBlockchainCache = async (txHash, data) => {
  const key = `blockchain:${txHash}`;
  return await setCache(key, data, CACHE_DURATIONS.BLOCKCHAIN_DATA);
};

export const getBlockchainCache = async (txHash) => {
  const key = `blockchain:${txHash}`;
  return await getCache(key);
};

// 🤖 CACHE ANALYSES IA
export const setAIAnalysisCache = async (documentHash, analysis) => {
  const key = `ai_analysis:${documentHash}`;
  return await setCache(key, analysis, CACHE_DURATIONS.AI_ANALYSIS);
};

export const getAIAnalysisCache = async (documentHash) => {
  const key = `ai_analysis:${documentHash}`;
  return await getCache(key);
};

// 📊 CACHE DONNÉES MARCHÉ
export const setMarketDataCache = async (location, data) => {
  const key = `market:${location.toLowerCase().replace(/\s+/g, '_')}`;
  return await setCache(key, data, CACHE_DURATIONS.MARKET_DATA);
};

export const getMarketDataCache = async (location) => {
  const key = `market:${location.toLowerCase().replace(/\s+/g, '_')}`;
  return await getCache(key);
};

// 🔔 SYSTÈME NOTIFICATIONS PUB/SUB
export const publishNotification = async (channel, notification) => {
  try {
    if (!redisPublisher) return false;
    
    const message = JSON.stringify({
      ...notification,
      timestamp: new Date().toISOString(),
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    await redisPublisher.publish(channel, message);
    logger.debug(`📢 Notification published to ${channel}`);
    return true;
    
  } catch (error) {
    logger.error('❌ Erreur publish notification:', error);
    return false;
  }
};

export const subscribeToNotifications = async (channel, callback) => {
  try {
    if (!redisSubscriber) return false;
    
    await redisSubscriber.subscribe(channel, (message) => {
      try {
        const notification = JSON.parse(message);
        callback(notification);
      } catch (error) {
        logger.error('❌ Erreur parse notification:', error);
      }
    });
    
    logger.info(`👂 Subscribed to notifications: ${channel}`);
    return true;
    
  } catch (error) {
    logger.error('❌ Erreur subscribe notifications:', error);
    return false;
  }
};

// 📈 CACHE STATISTIQUES
export const incrementCounter = async (key, increment = 1) => {
  try {
    if (!redisClient) return 0;
    
    const result = await redisClient.incrBy(key, increment);
    return result;
    
  } catch (error) {
    logger.error('❌ Erreur increment counter:', error);
    return 0;
  }
};

export const getCounter = async (key) => {
  try {
    if (!redisClient) return 0;
    
    const value = await redisClient.get(key);
    return parseInt(value) || 0;
    
  } catch (error) {
    logger.error('❌ Erreur get counter:', error);
    return 0;
  }
};

// 🕐 CACHE AVEC TTL DYNAMIQUE
export const setCacheWithTTL = async (key, value, ttlSeconds) => {
  try {
    if (!redisClient) return false;
    
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
    
  } catch (error) {
    logger.error('❌ Erreur set cache TTL:', error);
    return false;
  }
};

export const getTTL = async (key) => {
  try {
    if (!redisClient) return -1;
    
    return await redisClient.ttl(key);
    
  } catch (error) {
    logger.error('❌ Erreur get TTL:', error);
    return -1;
  }
};

// 🧹 NETTOYAGE CACHE
export const cleanupExpiredCache = async () => {
  try {
    if (!redisClient) return false;
    
    // Redis gère automatiquement l'expiration
    // Mais on peut forcer le nettoyage de patterns spécifiques
    const patterns = [
      'search:*',
      'temp:*',
      'session:expired:*'
    ];
    
    for (const pattern of patterns) {
      await clearCachePattern(pattern);
    }
    
    logger.info('🧹 Cache cleanup completed');
    return true;
    
  } catch (error) {
    logger.error('❌ Erreur cleanup cache:', error);
    return false;
  }
};

// 📋 INFORMATIONS CACHE
export const getCacheInfo = async () => {
  try {
    if (!redisClient) return null;
    
    const info = await redisClient.info('memory');
    const keyspace = await redisClient.info('keyspace');
    
    return {
      memory: info,
      keyspace: keyspace,
      connected: redisClient.isOpen
    };
    
  } catch (error) {
    logger.error('❌ Erreur get cache info:', error);
    return null;
  }
};

export { redisClient, redisSubscriber, redisPublisher };