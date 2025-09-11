/**
 * ==========================================================
 * 🔄 TERANGA BLOCKCHAIN SYNC SERVICE
 * Service de synchronisation automatique blockchain vers Supabase
 * ==========================================================
 */

import { createClient } from '@supabase/supabase-js';
import { TerangaBlockchainSecurity } from './TerangaBlockchainSecurity.js';

class TerangaBlockchainSyncService {
  constructor() {
    // Configuration Supabase
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    // Service blockchain
    this.blockchainService = new TerangaBlockchainSecurity();
    
    // Configuration de sync
    this.syncConfig = {
      autoSyncInterval: 30000, // 30 secondes
      batchSize: 50, // Nombre d'enregistrements par batch
      enableRealTimeSync: true,
      maxRetries: 3
    };

    // État du service
    this.syncStats = {
      lastSync: null,
      totalSynced: 0,
      failedSyncs: 0,
      successfulSyncs: 0
    };

    this.isRunning = false;
    this.syncInterval = null;
  }

  /**
   * 🚀 Démarrer la synchronisation automatique
   */
  async startAutoSync() {
    try {
      console.log('🔄 Démarrage synchronisation blockchain → Supabase...');
      
      if (this.isRunning) {
        console.log('⚠️ Synchronisation déjà en cours');
        return;
      }

      this.isRunning = true;

      // Synchronisation initiale complète
      await this.performFullSync();

      // Démarrer l'intervalle automatique
      this.syncInterval = setInterval(async () => {
        await this.performIncrementalSync();
      }, this.syncConfig.autoSyncInterval);

      console.log('✅ Synchronisation automatique démarrée');
      return true;

    } catch (error) {
      console.error('❌ Erreur démarrage sync:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * ⏹️ Arrêter la synchronisation
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isRunning = false;
    console.log('🛑 Synchronisation arrêtée');
  }

  /**
   * 📊 Synchronisation complète (première fois)
   */
  async performFullSync() {
    try {
      console.log('📊 Synchronisation complète en cours...');
      
      const syncOperations = [
        this.syncLandTitles(),
        this.syncDocumentVerifications(),
        this.syncAuditTrail(),
        this.syncDigitalCertificates(),
        this.syncFraudPatterns(),
        this.syncSecurityMetrics()
      ];

      const results = await Promise.allSettled(syncOperations);
      
      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
          console.log(`✅ Sync ${index + 1}/6 réussie: ${result.value} enregistrements`);
        } else {
          failureCount++;
          console.error(`❌ Sync ${index + 1}/6 échouée:`, result.reason);
        }
      });

      this.syncStats.lastSync = new Date().toISOString();
      this.syncStats.successfulSyncs += successCount;
      this.syncStats.failedSyncs += failureCount;

      console.log(`📈 Synchronisation complète terminée: ${successCount} succès, ${failureCount} échecs`);
      
      return { success: successCount, failures: failureCount };

    } catch (error) {
      console.error('❌ Erreur synchronisation complète:', error);
      throw error;
    }
  }

  /**
   * 🔄 Synchronisation incrémentale (changements uniquement)
   */
  async performIncrementalSync() {
    try {
      const lastSyncTime = this.syncStats.lastSync || new Date(Date.now() - 3600000).toISOString(); // Dernière heure par défaut
      
      console.log(`🔄 Sync incrémentale depuis: ${lastSyncTime}`);

      // Récupérer les changements depuis la dernière sync
      const changes = await this.getChangesSince(lastSyncTime);
      
      if (changes.length === 0) {
        console.log('✅ Aucun changement à synchroniser');
        return 0;
      }

      console.log(`📋 ${changes.length} changements détectés`);

      // Synchroniser par lots
      let syncedCount = 0;
      for (let i = 0; i < changes.length; i += this.syncConfig.batchSize) {
        const batch = changes.slice(i, i + this.syncConfig.batchSize);
        const batchResult = await this.syncBatch(batch);
        syncedCount += batchResult;
      }

      this.syncStats.lastSync = new Date().toISOString();
      this.syncStats.totalSynced += syncedCount;
      this.syncStats.successfulSyncs++;

      console.log(`✅ Sync incrémentale terminée: ${syncedCount} enregistrements`);
      return syncedCount;

    } catch (error) {
      console.error('❌ Erreur sync incrémentale:', error);
      this.syncStats.failedSyncs++;
      throw error;
    }
  }

  /**
   * 📋 Synchroniser les titres fonciers
   */
  async syncLandTitles() {
    try {
      // Récupérer les titres fonciers blockchain
      const landTitles = await this.blockchainService.getAllLandTitles();
      
      if (!landTitles || landTitles.length === 0) {
        return 0;
      }

      // Préparer les données pour Supabase
      const supabaseData = landTitles.map(title => ({
        blockchain_hash: title.hash,
        title_number: title.titleNumber,
        owner_id: title.ownerId,
        property_details: title.propertyDetails,
        registration_date: title.registrationDate,
        verification_status: title.verificationStatus,
        document_type: 'land_title',
        sync_timestamp: new Date().toISOString(),
        blockchain_metadata: {
          block_number: title.blockNumber,
          transaction_hash: title.transactionHash,
          gas_used: title.gasUsed
        }
      }));

      // Upsert dans Supabase (insert ou update)
      const { data, error } = await this.supabase
        .from('blockchain_sync_data')
        .upsert(supabaseData, {
          onConflict: 'blockchain_hash',
          ignoreDuplicates: false
        });

      if (error) {
        throw error;
      }

      return supabaseData.length;

    } catch (error) {
      console.error('❌ Erreur sync titres fonciers:', error);
      throw error;
    }
  }

  /**
   * 📄 Synchroniser les vérifications de documents
   */
  async syncDocumentVerifications() {
    try {
      const verifications = await this.blockchainService.getAllVerifications();
      
      if (!verifications || verifications.length === 0) {
        return 0;
      }

      const supabaseData = verifications.map(verification => ({
        blockchain_hash: verification.hash,
        document_id: verification.documentId,
        verification_result: verification.result,
        verification_date: verification.date,
        verifier_id: verification.verifierId,
        verification_method: verification.method,
        confidence_score: verification.confidenceScore,
        document_type: 'verification',
        sync_timestamp: new Date().toISOString(),
        blockchain_metadata: {
          proof_hash: verification.proofHash,
          merkle_root: verification.merkleRoot
        }
      }));

      const { data, error } = await this.supabase
        .from('blockchain_sync_data')
        .upsert(supabaseData, {
          onConflict: 'blockchain_hash',
          ignoreDuplicates: false
        });

      if (error) throw error;

      return supabaseData.length;

    } catch (error) {
      console.error('❌ Erreur sync vérifications:', error);
      throw error;
    }
  }

  /**
   * 📊 Synchroniser l'audit trail
   */
  async syncAuditTrail() {
    try {
      const auditEntries = await this.blockchainService.getAllAuditEntries();
      
      if (!auditEntries || auditEntries.length === 0) {
        return 0;
      }

      const supabaseData = auditEntries.map(entry => ({
        blockchain_hash: entry.hash,
        action_type: entry.action,
        user_id: entry.userId,
        resource_id: entry.resourceId,
        timestamp: entry.timestamp,
        details: entry.details,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        document_type: 'audit_entry',
        sync_timestamp: new Date().toISOString(),
        blockchain_metadata: {
          block_timestamp: entry.blockTimestamp,
          chain_position: entry.chainPosition
        }
      }));

      const { data, error } = await this.supabase
        .from('blockchain_sync_data')
        .upsert(supabaseData, {
          onConflict: 'blockchain_hash',
          ignoreDuplicates: false
        });

      if (error) throw error;

      return supabaseData.length;

    } catch (error) {
      console.error('❌ Erreur sync audit trail:', error);
      throw error;
    }
  }

  /**
   * 🏆 Synchroniser les certificats numériques
   */
  async syncDigitalCertificates() {
    try {
      const certificates = await this.blockchainService.getAllCertificates();
      
      if (!certificates || certificates.length === 0) {
        return 0;
      }

      const supabaseData = certificates.map(cert => ({
        blockchain_hash: cert.hash,
        certificate_id: cert.id,
        holder_id: cert.holderId,
        issuer_id: cert.issuerId,
        certificate_type: cert.type,
        issue_date: cert.issueDate,
        expiry_date: cert.expiryDate,
        status: cert.status,
        metadata: cert.metadata,
        document_type: 'digital_certificate',
        sync_timestamp: new Date().toISOString(),
        blockchain_metadata: {
          signature_hash: cert.signatureHash,
          validation_proof: cert.validationProof
        }
      }));

      const { data, error } = await this.supabase
        .from('blockchain_sync_data')
        .upsert(supabaseData, {
          onConflict: 'blockchain_hash',
          ignoreDuplicates: false
        });

      if (error) throw error;

      return supabaseData.length;

    } catch (error) {
      console.error('❌ Erreur sync certificats:', error);
      throw error;
    }
  }

  /**
   * 🚨 Synchroniser les patterns de fraude
   */
  async syncFraudPatterns() {
    try {
      const patterns = await this.blockchainService.getAllFraudPatterns();
      
      if (!patterns || patterns.length === 0) {
        return 0;
      }

      const supabaseData = patterns.map(pattern => ({
        blockchain_hash: pattern.hash,
        pattern_type: pattern.type,
        risk_score: pattern.riskScore,
        detection_date: pattern.detectionDate,
        affected_documents: pattern.affectedDocuments,
        pattern_details: pattern.details,
        resolution_status: pattern.status,
        document_type: 'fraud_pattern',
        sync_timestamp: new Date().toISOString(),
        blockchain_metadata: {
          detection_algorithm: pattern.algorithm,
          confidence_level: pattern.confidence
        }
      }));

      const { data, error } = await this.supabase
        .from('blockchain_sync_data')
        .upsert(supabaseData, {
          onConflict: 'blockchain_hash',
          ignoreDuplicates: false
        });

      if (error) throw error;

      return supabaseData.length;

    } catch (error) {
      console.error('❌ Erreur sync patterns fraude:', error);
      throw error;
    }
  }

  /**
   * 📈 Synchroniser les métriques de sécurité
   */
  async syncSecurityMetrics() {
    try {
      const metrics = await this.blockchainService.getSecurityMetrics();
      
      if (!metrics) {
        return 0;
      }

      const supabaseData = [{
        blockchain_hash: `metrics_${Date.now()}`,
        total_documents: metrics.totalDocuments,
        verified_documents: metrics.verifiedDocuments,
        fraud_attempts: metrics.fraudAttempts,
        success_rate: metrics.successRate,
        average_processing_time: metrics.avgProcessingTime,
        document_type: 'security_metrics',
        sync_timestamp: new Date().toISOString(),
        blockchain_metadata: {
          calculation_method: metrics.method,
          data_range: metrics.range
        }
      }];

      const { data, error } = await this.supabase
        .from('blockchain_sync_data')
        .upsert(supabaseData, {
          onConflict: 'blockchain_hash',
          ignoreDuplicates: false
        });

      if (error) throw error;

      return 1;

    } catch (error) {
      console.error('❌ Erreur sync métriques:', error);
      throw error;
    }
  }

  /**
   * 🔍 Récupérer les changements depuis une date
   */
  async getChangesSince(timestamp) {
    try {
      // Simplication: récupérer tous les changements récents
      // En production, il faudrait implémenter une vraie détection de changements
      
      const changes = [];
      
      // Récupérer les nouveaux titres fonciers
      const recentTitles = await this.blockchainService.getLandTitlesSince(timestamp);
      if (recentTitles) {
        changes.push(...recentTitles.map(title => ({ type: 'land_title', data: title })));
      }

      // Récupérer les nouvelles vérifications
      const recentVerifications = await this.blockchainService.getVerificationsSince(timestamp);
      if (recentVerifications) {
        changes.push(...recentVerifications.map(ver => ({ type: 'verification', data: ver })));
      }

      return changes;

    } catch (error) {
      console.error('❌ Erreur récupération changements:', error);
      return [];
    }
  }

  /**
   * 📦 Synchroniser un lot de changements
   */
  async syncBatch(batch) {
    try {
      let syncedCount = 0;

      for (const change of batch) {
        switch (change.type) {
          case 'land_title':
            await this.syncSingleLandTitle(change.data);
            break;
          case 'verification':
            await this.syncSingleVerification(change.data);
            break;
          case 'audit_entry':
            await this.syncSingleAuditEntry(change.data);
            break;
          default:
            console.warn(`Type de changement non supporté: ${change.type}`);
        }
        syncedCount++;
      }

      return syncedCount;

    } catch (error) {
      console.error('❌ Erreur sync batch:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtenir les statistiques de synchronisation
   */
  getSyncStats() {
    return {
      ...this.syncStats,
      isRunning: this.isRunning,
      nextSyncIn: this.syncInterval ? this.syncConfig.autoSyncInterval : null,
      config: this.syncConfig
    };
  }

  /**
   * ⚙️ Configurer les paramètres de synchronisation
   */
  updateSyncConfig(newConfig) {
    this.syncConfig = { ...this.syncConfig, ...newConfig };
    
    // Redémarrer avec la nouvelle configuration si en cours
    if (this.isRunning) {
      this.stopAutoSync();
      this.startAutoSync();
    }
    
    console.log('⚙️ Configuration sync mise à jour:', this.syncConfig);
  }

  /**
   * 🔄 Forcer une synchronisation manuelle
   */
  async forceSync() {
    try {
      console.log('🔄 Synchronisation forcée...');
      const result = await this.performFullSync();
      console.log('✅ Synchronisation forcée terminée');
      return result;
    } catch (error) {
      console.error('❌ Erreur synchronisation forcée:', error);
      throw error;
    }
  }

  /**
   * 🏥 Vérifier l'état de santé du service
   */
  async healthCheck() {
    try {
      const health = {
        service: 'TerangaBlockchainSyncService',
        status: 'healthy',
        lastSync: this.syncStats.lastSync,
        isRunning: this.isRunning,
        timestamp: new Date().toISOString()
      };

      // Tester la connexion Supabase
      const { data, error } = await this.supabase
        .from('blockchain_sync_data')
        .select('count')
        .limit(1);

      if (error) {
        health.status = 'unhealthy';
        health.supabaseError = error.message;
      } else {
        health.supabaseConnection = 'ok';
      }

      // Tester la connexion blockchain
      try {
        const blockchainStatus = await this.blockchainService.getServiceStatus();
        health.blockchainConnection = blockchainStatus ? 'ok' : 'error';
      } catch (err) {
        health.status = 'unhealthy';
        health.blockchainError = err.message;
      }

      return health;

    } catch (error) {
      return {
        service: 'TerangaBlockchainSyncService',
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Instance singleton
export const blockchainSyncService = new TerangaBlockchainSyncService();
export default TerangaBlockchainSyncService;
