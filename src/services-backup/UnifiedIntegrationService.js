/**
 * 🔗 SERVICE D'INTÉGRATION COMPLÈTE : BLOCKCHAIN ↔ SUPABASE ↔ IA
 * ================================================================
 * 
 * Ce service orchestre l'intégration complète entre :
 * - Blockchain (TerangaBlockchainService + smart contracts)
 * - Base de données (Supabase)
 * - Intelligence Artificielle (AdvancedAIService)
 */

import { supabase } from '@/lib/supabaseClient';
import { TerangaBlockchainService } from './TerangaBlockchainService';
import { AdvancedAIService } from './AdvancedAIService';
import { BlockchainAIService } from './BlockchainAIService';

class UnifiedIntegrationService {
  constructor() {
    this.blockchain = new TerangaBlockchainService();
    this.ai = new AdvancedAIService();
    this.blockchainAI = new BlockchainAIService();
    this.isInitialized = false;
    
    // Cache pour les données synchronisées
    this.syncCache = new Map();
    this.eventHandlers = new Map();
    
    // Monitoring des intégrations
    this.integrationMetrics = {
      blockchainToSupabase: 0,
      supabaseToAI: 0,
      aiToBlockchain: 0,
      totalSyncOperations: 0,
      lastSyncTimestamp: null,
      errors: []
    };
  }

  // ═══════════════════════════════════════════════════════════
  // 🚀 INITIALISATION DU SYSTÈME UNIFIÉ
  // ═══════════════════════════════════════════════════════════

  async initialize() {
    console.log('🚀 Initialisation du système d\'intégration unifié...');
    
    try {
      // 1. Initialiser les services individuels
      await Promise.all([
        this.blockchain.initialize(),
        this.ai.initialize?.() || Promise.resolve(),
        this.blockchainAI.initializeBlockchain()
      ]);

      // 2. Configurer les listeners cross-service
      await this.setupCrossServiceListeners();

      // 3. Synchroniser les données existantes
      await this.performInitialSync();

      // 4. Démarrer le monitoring temps réel
      this.startRealtimeMonitoring();

      this.isInitialized = true;
      console.log('✅ Système d\'intégration unifié initialisé avec succès');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur initialisation système unifié:', error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 🔄 SYNCHRONISATION BLOCKCHAIN ↔ SUPABASE
  // ═══════════════════════════════════════════════════════════

  async syncBlockchainToSupabase(transactionHash, eventType, eventData) {
    try {
      console.log(`📥 Sync Blockchain → Supabase: ${eventType}`);
      
      switch (eventType) {
        case 'PropertyCreated':
          return await this.handlePropertyCreated(eventData);
        case 'PropertyTransferred':
          return await this.handlePropertyTransferred(eventData);
        case 'PropertyListed':
          return await this.handlePropertyListed(eventData);
        case 'PropertySold':
          return await this.handlePropertySold(eventData);
        case 'EscrowCreated':
          return await this.handleEscrowCreated(eventData);
        default:
          console.warn('Type d\'événement blockchain non géré:', eventType);
      }
      
      this.integrationMetrics.blockchainToSupabase++;
      this.integrationMetrics.totalSyncOperations++;
      
    } catch (error) {
      this.handleSyncError('blockchain-to-supabase', error, { transactionHash, eventType, eventData });
    }
  }

  async handlePropertyCreated(data) {
    const { tokenId, owner, title, description, price, location, imageHash } = data;
    
    // 1. Enregistrer la propriété NFT dans Supabase
    const { data: propertyData, error } = await supabase
      .from('properties')
      .insert({
        blockchain_token_id: tokenId.toString(),
        title,
        description,
        price: parseFloat(price),
        address: location,
        owner_id: owner,
        type: 'terrain',
        status: 'available',
        blockchain_verified: true,
        ipfs_hash: imageHash,
        created_from_blockchain: true
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Déclencher l'analyse IA de la propriété
    const aiAnalysis = await this.ai.analyzePropertyData({
      propertyId: propertyData.id,
      location,
      price: parseFloat(price),
      type: 'terrain'
    });

    // 3. Sauvegarder l'analyse IA
    await supabase
      .from('ai_property_analysis')
      .insert({
        property_id: propertyData.id,
        analysis_data: aiAnalysis,
        confidence_score: aiAnalysis.confidence || 0.8,
        created_at: new Date().toISOString()
      });

    console.log(`✅ Propriété ${tokenId} synchronisée : Blockchain → Supabase → IA`);
    return propertyData;
  }

  async handlePropertyTransferred(data) {
    const { tokenId, from, to } = data;
    
    // Mettre à jour le propriétaire dans Supabase
    const { error } = await supabase
      .from('properties')
      .update({ 
        owner_id: to,
        previous_owner_id: from,
        last_transfer_date: new Date().toISOString()
      })
      .eq('blockchain_token_id', tokenId.toString());

    if (error) throw error;

    // Enregistrer la transaction de transfert
    await supabase
      .from('blockchain_transactions')
      .insert({
        type: 'property_transfer',
        token_id: tokenId.toString(),
        from_address: from,
        to_address: to,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });

    console.log(`✅ Transfert propriété ${tokenId} synchronisé`);
  }

  // ═══════════════════════════════════════════════════════════
  // 🧠 SYNCHRONISATION SUPABASE ↔ IA
  // ═══════════════════════════════════════════════════════════

  async syncSupabaseToAI(tableName, operation, data) {
    try {
      console.log(`📊 Sync Supabase → IA: ${tableName} (${operation})`);
      
      switch (tableName) {
        case 'properties':
          return await this.handlePropertyAISync(operation, data);
        case 'users':
          return await this.handleUserAISync(operation, data);
        case 'transactions':
          return await this.handleTransactionAISync(operation, data);
        default:
          console.warn('Table non gérée pour sync IA:', tableName);
      }
      
      this.integrationMetrics.supabaseToAI++;
      
    } catch (error) {
      this.handleSyncError('supabase-to-ai', error, { tableName, operation, data });
    }
  }

  async handlePropertyAISync(operation, propertyData) {
    if (operation === 'INSERT' || operation === 'UPDATE') {
      // 1. Analyse de la propriété par IA
      const analysis = await this.ai.analyzePropertyData({
        propertyId: propertyData.id,
        location: propertyData.address,
        price: propertyData.price,
        type: propertyData.type,
        surface: propertyData.surface
      });

      // 2. Prédiction de prix par IA
      const pricePrediction = await this.ai.predictPropertyPrice({
        location: propertyData.address,
        type: propertyData.type,
        surface: propertyData.surface,
        features: propertyData.features
      });

      // 3. Sauvegarder les insights IA
      await supabase
        .from('ai_insights')
        .upsert({
          entity_type: 'property',
          entity_id: propertyData.id,
          insights_data: {
            analysis,
            pricePrediction,
            recommendations: analysis.recommendations || [],
            risk_score: analysis.riskScore || 0.1
          },
          updated_at: new Date().toISOString()
        });

      console.log(`🧠 Analyse IA générée pour propriété ${propertyData.id}`);
      return { analysis, pricePrediction };
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 🔮 SYNCHRONISATION IA ↔ BLOCKCHAIN
  // ═══════════════════════════════════════════════════════════

  async syncAIToBlockchain(aiInsights) {
    try {
      console.log('🔮 Sync IA → Blockchain: Oracle update');
      
      // 1. Préparer les données pour l'oracle blockchain
      const oracleData = {
        marketPrices: aiInsights.marketAnalysis?.averagePrices || {},
        riskAssessments: aiInsights.riskAnalysis || {},
        priceForecasts: aiInsights.priceForecasts || {},
        timestamp: Date.now()
      };

      // 2. Soumettre à l'oracle blockchain via BlockchainAI Service
      const oracleResult = await this.blockchainAI.updateAIOracle(oracleData);

      // 3. Enregistrer la soumission oracle
      await supabase
        .from('oracle_submissions')
        .insert({
          oracle_data: oracleData,
          transaction_hash: oracleResult.hash,
          gas_used: oracleResult.gasUsed,
          status: 'submitted',
          created_at: new Date().toISOString()
        });

      this.integrationMetrics.aiToBlockchain++;
      console.log('✅ Données IA synchronisées vers l\'oracle blockchain');
      
      return oracleResult;
      
    } catch (error) {
      this.handleSyncError('ai-to-blockchain', error, aiInsights);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 🎯 WORKFLOWS INTÉGRÉS DE BOUT EN BOUT
  // ═══════════════════════════════════════════════════════════

  async executeFullPropertyWorkflow(propertyData, userWallet) {
    console.log('🎯 Démarrage workflow complet : Property Registration');
    
    try {
      // 1. IA : Validation et évaluation initiale
      const aiValidation = await this.ai.validatePropertyData(propertyData);
      if (!aiValidation.isValid) {
        throw new Error(`Validation IA échouée: ${aiValidation.errors.join(', ')}`);
      }

      const priceEstimate = await this.ai.estimatePropertyValue(propertyData);

      // 2. Supabase : Création de l'enregistrement temporaire
      const { data: dbProperty, error: dbError } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          status: 'pending_blockchain',
          ai_estimated_value: priceEstimate.value,
          ai_confidence: priceEstimate.confidence,
          validation_status: 'ai_validated'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. Blockchain : Mint du NFT propriété
      const nftResult = await this.blockchain.createProperty(
        propertyData.title,
        propertyData.description,
        priceEstimate.value,
        propertyData.address,
        propertyData.ipfsHash || 'default'
      );

      // 4. Mettre à jour avec l'ID blockchain
      await supabase
        .from('properties')
        .update({
          blockchain_token_id: nftResult.tokenId.toString(),
          blockchain_tx_hash: nftResult.txHash,
          status: 'blockchain_verified',
          blockchain_verified_at: new Date().toISOString()
        })
        .eq('id', dbProperty.id);

      // 5. IA : Analyse post-blockchain et recommandations
      const finalAnalysis = await this.ai.generatePropertyRecommendations({
        propertyId: dbProperty.id,
        blockchainTokenId: nftResult.tokenId.toString(),
        marketData: priceEstimate.marketData
      });

      console.log(`🎉 Workflow complet réussi pour propriété ${dbProperty.id}`);
      
      return {
        success: true,
        propertyId: dbProperty.id,
        tokenId: nftResult.tokenId.toString(),
        txHash: nftResult.txHash,
        aiAnalysis: finalAnalysis,
        estimatedValue: priceEstimate.value
      };

    } catch (error) {
      console.error('❌ Erreur dans workflow complet:', error);
      throw error;
    }
  }

  async executeSmartContractWithAI(contractType, contractData) {
    console.log(`🎯 Exécution smart contract avec IA: ${contractType}`);
    
    try {
      // 1. IA : Analyse des risques du contrat
      const riskAnalysis = await this.ai.analyzeContractRisk(contractData);
      
      // 2. IA : Optimisation des paramètres
      const optimizedParams = await this.ai.optimizeContractParameters(contractData, riskAnalysis);

      // 3. Blockchain : Déploiement du contrat optimisé
      let contractResult;
      switch (contractType) {
        case 'escrow':
          contractResult = await this.blockchainAI.createAutomatedEscrow({
            ...contractData,
            ...optimizedParams,
            aiRiskAssessment: riskAnalysis
          });
          break;
        case 'property_nft':
          contractResult = await this.blockchainAI.createPropertyNFT({
            ...contractData,
            aiValidation: riskAnalysis.validation
          });
          break;
        default:
          throw new Error(`Type de contrat non supporté: ${contractType}`);
      }

      // 4. Supabase : Enregistrement du contrat déployé
      await supabase
        .from('smart_contracts')
        .insert({
          type: contractType,
          contract_address: contractResult.escrowAddress || contractResult.contractAddress,
          deployment_data: contractData,
          ai_analysis: riskAnalysis,
          optimization_applied: optimizedParams,
          status: 'deployed',
          created_at: new Date().toISOString()
        });

      console.log(`✅ Smart contract ${contractType} déployé avec IA`);
      return contractResult;

    } catch (error) {
      console.error(`❌ Erreur déploiement contrat ${contractType}:`, error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 📊 ANALYTICS CROSS-PLATFORM
  // ═══════════════════════════════════════════════════════════

  async generateUnifiedAnalytics(timeframe = '30d') {
    console.log(`📊 Génération analytics unifiées: ${timeframe}`);
    
    try {
      // 1. Métriques Blockchain
      const blockchainMetrics = await this.blockchainAI.getRealtimeMetrics();
      
      // 2. Données Supabase
      const { data: dbMetrics } = await supabase.rpc('get_platform_analytics', {
        time_period: timeframe
      });
      
      // 3. Insights IA
      const aiInsights = await this.ai.generateMarketInsights({
        timeframe,
        includeBlockchainData: true
      });

      // 4. Fusion des données
      const unifiedAnalytics = {
        period: timeframe,
        timestamp: new Date().toISOString(),
        
        // Blockchain
        blockchain: {
          totalTransactions: blockchainMetrics.totalTransactions,
          activeContracts: blockchainMetrics.activeContracts,
          nftProperties: blockchainMetrics.nftProperties,
          networkHealth: blockchainMetrics.networkHealth,
          securityScore: blockchainMetrics.securityScore
        },
        
        // Base de données
        platform: {
          totalUsers: dbMetrics?.total_users || 0,
          activeProperties: dbMetrics?.active_properties || 0,
          completedTransactions: dbMetrics?.completed_transactions || 0,
          averagePropertyPrice: dbMetrics?.avg_property_price || 0
        },
        
        // Intelligence Artificielle
        ai: {
          predictionAccuracy: aiInsights.accuracy || 0.85,
          marketTrend: aiInsights.trend || 'stable',
          riskLevel: aiInsights.riskLevel || 'low',
          recommendations: aiInsights.recommendations || []
        },
        
        // Métriques d'intégration
        integration: {
          ...this.integrationMetrics,
          lastSync: this.integrationMetrics.lastSyncTimestamp,
          syncHealth: this.calculateSyncHealth()
        }
      };

      // 5. Sauvegarder les analytics
      await supabase
        .from('unified_analytics')
        .insert({
          period: timeframe,
          analytics_data: unifiedAnalytics,
          created_at: new Date().toISOString()
        });

      return unifiedAnalytics;

    } catch (error) {
      console.error('❌ Erreur génération analytics unifiées:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 🔧 UTILITAIRES ET MONITORING
  // ═══════════════════════════════════════════════════════════

  async setupCrossServiceListeners() {
    console.log('🔧 Configuration des listeners cross-service...');
    
    // Écouter les événements blockchain
    if (this.blockchain.contracts?.property) {
      this.blockchain.contracts.property.on('PropertyCreated', (tokenId, owner, title, price) => {
        this.syncBlockchainToSupabase('', 'PropertyCreated', { tokenId, owner, title, price });
      });

      this.blockchain.contracts.property.on('PropertyTransferred', (tokenId, from, to) => {
        this.syncBlockchainToSupabase('', 'PropertyTransferred', { tokenId, from, to });
      });
    }

    // Écouter les changements Supabase
    supabase
      .channel('unified-integration')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'properties' 
      }, (payload) => {
        this.syncSupabaseToAI('properties', payload.eventType, payload.new);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions' 
      }, (payload) => {
        this.syncSupabaseToAI('transactions', payload.eventType, payload.new);
      })
      .subscribe();

    console.log('✅ Listeners cross-service configurés');
  }

  async performInitialSync() {
    console.log('🔄 Synchronisation initiale des données...');
    
    try {
      // Synchroniser les propriétés existantes
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .is('blockchain_token_id', null)
        .limit(10);

      for (const property of properties || []) {
        await this.syncSupabaseToAI('properties', 'SYNC', property);
      }

      console.log('✅ Synchronisation initiale terminée');
    } catch (error) {
      console.error('❌ Erreur synchronisation initiale:', error);
    }
  }

  startRealtimeMonitoring() {
    console.log('📡 Démarrage du monitoring temps réel...');
    
    setInterval(async () => {
      try {
        // Vérifier la santé des intégrations
        const health = await this.checkIntegrationHealth();
        
        if (health.status !== 'healthy') {
          console.warn('⚠️ Problème détecté dans les intégrations:', health.issues);
        }
        
        // Mettre à jour le timestamp
        this.integrationMetrics.lastSyncTimestamp = new Date().toISOString();
        
      } catch (error) {
        console.error('❌ Erreur monitoring:', error);
      }
    }, 30000); // Toutes les 30 secondes
  }

  async checkIntegrationHealth() {
    const health = {
      status: 'healthy',
      issues: [],
      lastCheck: new Date().toISOString()
    };

    // Vérifier Blockchain
    if (!this.blockchain.isInitialized) {
      health.status = 'warning';
      health.issues.push('Blockchain service non initialisé');
    }

    // Vérifier Supabase
    try {
      const { error } = await supabase.from('properties').select('id').limit(1);
      if (error) {
        health.status = 'error';
        health.issues.push('Erreur connexion Supabase');
      }
    } catch (error) {
      health.status = 'error';
      health.issues.push('Erreur critique Supabase');
    }

    // Vérifier les métriques de sync
    const syncErrorRate = this.integrationMetrics.errors.length / Math.max(this.integrationMetrics.totalSyncOperations, 1);
    if (syncErrorRate > 0.1) { // Plus de 10% d'erreurs
      health.status = 'warning';
      health.issues.push('Taux d\'erreur de synchronisation élevé');
    }

    return health;
  }

  calculateSyncHealth() {
    const total = this.integrationMetrics.totalSyncOperations;
    const errors = this.integrationMetrics.errors.length;
    
    if (total === 0) return 1.0;
    return Math.max(0, (total - errors) / total);
  }

  handleSyncError(syncType, error, context) {
    console.error(`❌ Erreur sync ${syncType}:`, error);
    
    this.integrationMetrics.errors.push({
      type: syncType,
      error: error.message,
      context,
      timestamp: new Date().toISOString()
    });

    // Garder seulement les 100 dernières erreurs
    if (this.integrationMetrics.errors.length > 100) {
      this.integrationMetrics.errors = this.integrationMetrics.errors.slice(-100);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 📈 API PUBLIQUE POUR LES DASHBOARDS
  // ═══════════════════════════════════════════════════════════

  async getIntegrationStatus() {
    return {
      isInitialized: this.isInitialized,
      services: {
        blockchain: this.blockchain.isInitialized,
        ai: true, // L'AI service n'a pas de flag d'initialisation
        blockchainAI: this.blockchainAI !== null
      },
      metrics: this.integrationMetrics,
      health: await this.checkIntegrationHealth()
    };
  }

  async getUnifiedDashboardData() {
    try {
      const [analytics, status] = await Promise.all([
        this.generateUnifiedAnalytics('7d'),
        this.getIntegrationStatus()
      ]);

      return {
        analytics,
        integrationStatus: status,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur récupération données dashboard:', error);
      return null;
    }
  }
}

// Instance globale
export const unifiedIntegration = new UnifiedIntegrationService();
export default UnifiedIntegrationService;
