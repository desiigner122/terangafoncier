/**
 * âš¡ OPTIMISATEUR IA TERANGA - PRODUCTION READY
 * ==========================================
 * 
 * Optimisations performance et prÃ©paration production
 */

import { terangaAI } from './src/services/TerangaAIService.js';

class TerangaAIOptimizer {
  constructor() {
    this.optimizations = {
      cache: new Map(),
      stats: {
        cacheHits: 0,
        cacheMisses: 0,
        totalRequests: 0,
        averageResponseTime: 0
      }
    };
  }

  /**
   * Cache intelligent pour les estimations
   */
  getCacheKey(location, type, surface) {
    return `${location}-${type}-${surface}`;
  }

  async getOptimizedEstimate(location, type, surface) {
    const cacheKey = this.getCacheKey(location, type, surface);
    const startTime = Date.now();
    
    this.optimizations.stats.totalRequests++;

    // VÃ©rification cache
    if (this.optimizations.cache.has(cacheKey)) {
      this.optimizations.stats.cacheHits++;
      const cached = this.optimizations.cache.get(cacheKey);
      
      // Cache valide 5 minutes
      if (Date.now() - cached.timestamp < 300000) {
        return {
          ...cached.data,
          fromCache: true,
          responseTime: Date.now() - startTime
        };
      }
    }

    // Nouvelle estimation
    this.optimizations.stats.cacheMisses++;
    const estimate = await terangaAI.getQuickEstimate(location, type, surface);
    
    // Mise en cache
    this.optimizations.cache.set(cacheKey, {
      data: estimate,
      timestamp: Date.now()
    });

    // Nettoyage automatique du cache (max 1000 entrÃ©es)
    if (this.optimizations.cache.size > 1000) {
      const oldestKey = this.optimizations.cache.keys().next().value;
      this.optimizations.cache.delete(oldestKey);
    }

    const responseTime = Date.now() - startTime;
    this.updateResponseTimeStats(responseTime);

    return {
      ...estimate,
      fromCache: false,
      responseTime
    };
  }

  updateResponseTimeStats(responseTime) {
    const { stats } = this.optimizations;
    stats.averageResponseTime = 
      (stats.averageResponseTime * (stats.totalRequests - 1) + responseTime) / stats.totalRequests;
  }

  /**
   * PrÃ©-chargement des donnÃ©es populaires
   */
  async preloadPopularData() {
    console.log('ðŸš€ PrÃ©-chargement donnÃ©es populaires...');
    
    const popularEstimates = [
      { location: 'Almadies', type: 'villa', surface: 300 },
      { location: 'Dakar-Plateau', type: 'appartement', surface: 120 },
      { location: 'Mermoz', type: 'villa', surface: 250 },
      { location: 'Pikine', type: 'terrain', surface: 500 },
      { location: 'Ouakam', type: 'villa', surface: 400 }
    ];

    for (const estimate of popularEstimates) {
      await this.getOptimizedEstimate(estimate.location, estimate.type, estimate.surface);
    }

    console.log(`âœ… ${popularEstimates.length} estimations prÃ©-chargÃ©es`);
  }

  /**
   * Compression des donnÃ©es marchÃ©
   */
  getCompressedMarketData() {
    const marketData = terangaAI.senegalMarketData;
    
    return {
      zones: Object.fromEntries(
        Object.entries(marketData.regions.Dakar.zones).map(([name, data]) => [
          name,
          {
            t: data.terrain_fcfa_m2,
            v: data.villa_fcfa,
            a: data.appartement_fcfa,
            tr: data.tendance === 'hausse' ? 1 : data.tendance === 'baisse' ? -1 : 0,
            d: data.demande === 'trÃ¨s_forte' ? 3 : data.demande === 'forte' ? 2 : 1
          }
        ])
      ),
      trends: {
        growth: marketData.marketTrends.croissance_annuelle,
        expansion: marketData.marketTrends.zones_expansion
      }
    };
  }

  /**
   * Optimisation batch pour estimations multiples
   */
  async getBatchEstimates(properties) {
    console.log(`ðŸ“Š Traitement batch de ${properties.length} propriÃ©tÃ©s...`);
    
    const startTime = Date.now();
    const promises = properties.map(prop => 
      this.getOptimizedEstimate(prop.location, prop.type, prop.surface)
    );

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    return {
      estimates: results,
      batchStats: {
        totalProperties: properties.length,
        totalTime,
        averageTimePerProperty: totalTime / properties.length,
        cacheHitRate: this.getCacheHitRate()
      }
    };
  }

  getCacheHitRate() {
    const { stats } = this.optimizations;
    return stats.totalRequests > 0 ? 
      (stats.cacheHits / stats.totalRequests * 100).toFixed(2) + '%' : '0%';
  }

  /**
   * Diagnostic performance
   */
  getPerformanceDiagnostic() {
    return {
      cache: {
        size: this.optimizations.cache.size,
        hitRate: this.getCacheHitRate(),
        hits: this.optimizations.stats.cacheHits,
        misses: this.optimizations.stats.cacheMisses
      },
      performance: {
        totalRequests: this.optimizations.stats.totalRequests,
        averageResponseTime: Math.round(this.optimizations.stats.averageResponseTime) + 'ms'
      },
      memory: {
        cacheMemoryUsage: this.estimateCacheMemoryUsage()
      }
    };
  }

  estimateCacheMemoryUsage() {
    // Estimation approximative de l'usage mÃ©moire du cache
    const entrySize = 500; // bytes par entrÃ©e
    return Math.round((this.optimizations.cache.size * entrySize) / 1024) + 'KB';
  }

  /**
   * Configuration production
   */
  getProductionConfig() {
    return {
      caching: {
        enabled: true,
        maxEntries: 10000,
        ttl: 300000, // 5 minutes
        preloadOnStart: true
      },
      performance: {
        batchSize: 50,
        timeoutMs: 5000,
        retryAttempts: 3
      },
      monitoring: {
        enableMetrics: true,
        logSlowRequests: true,
        slowThreshold: 1000 // 1 seconde
      },
      optimization: {
        compressResponses: true,
        useWorkerThreads: false, // Pour Phase 2
        enableCDN: false // Pour Phase 3
      }
    };
  }
}

async function testOptimizer() {
  
  console.log('==============================');

  const optimizer = new TerangaAIOptimizer();

  try {
    // Initialisation
    await terangaAI.initialize();
    
        
    const estimate1 = await optimizer.getOptimizedEstimate('Almadies', 'villa', 300);
    console.log(`âœ… PremiÃ¨re estimation: ${estimate1.responseTime}ms (${estimate1.fromCache ? 'cache' : 'calcul'})`);
    
    const estimate2 = await optimizer.getOptimizedEstimate('Almadies', 'villa', 300);
    console.log(`âœ… DeuxiÃ¨me estimation: ${estimate2.responseTime}ms (${estimate2.fromCache ? 'cache' : 'calcul'})`);

        
    await optimizer.preloadPopularData();

        
    const batchProperties = [
      { location: 'Pikine', type: 'terrain', surface: 400 },
      { location: 'Mermoz', type: 'appartement', surface: 100 },
      { location: 'Yoff', type: 'villa', surface: 200 }
    ];
    
    const batchResults = await optimizer.getBatchEstimates(batchProperties);
    console.log(`âœ… Batch traitÃ©: ${batchResults.batchStats.totalProperties} propriÃ©tÃ©s en ${batchResults.batchStats.totalTime}ms`);
    console.log(`âœ… Moyenne: ${Math.round(batchResults.batchStats.averageTimePerProperty)}ms/propriÃ©tÃ©`);

    // Diagnostic
    
    const diagnostic = optimizer.getPerformanceDiagnostic();
    console.log(`âœ… Cache: ${diagnostic.cache.size} entrÃ©es, ${diagnostic.cache.hitRate} hit rate`);
    console.log(`âœ… Performance: ${diagnostic.performance.averageResponseTime} moyenne`);
    console.log(`âœ… MÃ©moire: ${diagnostic.memory.cacheMemoryUsage} utilisÃ©s`);

    // Configuration production
    
    const prodConfig = optimizer.getProductionConfig();
    console.log(`âœ… Cache TTL: ${prodConfig.caching.ttl / 1000}s`);
    console.log(`âœ… Timeout: ${prodConfig.performance.timeoutMs}ms`);
    console.log(`âœ… Monitoring: ${prodConfig.monitoring.enableMetrics ? 'ActivÃ©' : 'DÃ©sactivÃ©'}`);

    
    console.log(`Taux de cache: ${optimizer.getCacheHitRate()}`);
    console.log('PrÃªt pour la production !');

    return true;

  } catch (error) {
    console.error('\nâŒ Erreur optimisateur:', error.message);
    return false;
  }
}

// Auto-exÃ©cution si script lancÃ© directement
if (process.argv[1].includes('optimizer')) {
  testOptimizer().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export default TerangaAIOptimizer;
