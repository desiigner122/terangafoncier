import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logBlockchain } from '../utils/logger.js';
import { registerPropertyOnBlockchain, verifyPropertyOnBlockchain, transferPropertyOnBlockchain } from '../config/blockchain.js';
import { setBlockchainCache, getBlockchainCache } from '../config/redis.js';
import db from '../config/database.js';

const router = express.Router();

// 🔗 ENREGISTRER PROPRIÉTÉ SUR BLOCKCHAIN
router.post('/register', authenticateToken, requireRole(['admin', 'geometre']), asyncErrorHandler(async (req, res) => {
  const { propertyId, documentHash } = req.body;

  if (!propertyId || !documentHash) {
    throw new AppError('ID propriété et hash document requis', 400);
  }

  // Vérifier propriété
  const propertyQuery = 'SELECT cadastral_ref, owner_id, title, blockchain_hash FROM properties WHERE id = $1';
  const propertyResult = await db.query(propertyQuery, [propertyId]);

  if (propertyResult.rows.length === 0) {
    throw new AppError('Propriété non trouvée', 404);
  }

  const property = propertyResult.rows[0];

  if (!property.cadastral_ref) {
    throw new AppError('Référence cadastrale requise pour blockchain', 400);
  }

  if (property.blockchain_hash) {
    throw new AppError('Propriété déjà enregistrée sur blockchain', 409);
  }

  // Vérifier cache blockchain
  const cacheKey = `blockchain_register_${property.cadastral_ref}`;
  const cachedResult = await getBlockchainCache(cacheKey);
  
  if (cachedResult) {
    return res.json({
      success: true,
      message: 'Propriété déjà enregistrée (cache)',
      data: cachedResult
    });
  }

  // Enregistrer sur blockchain
  const blockchainResult = await registerPropertyOnBlockchain(
    property.cadastral_ref,
    documentHash,
    property.owner_id
  );

  if (!blockchainResult.success) {
    throw new AppError(`Erreur blockchain: ${blockchainResult.error}`, 500);
  }

  try {
    await db.query('BEGIN');

    // Mettre à jour propriété
    await db.query(
      'UPDATE properties SET blockchain_hash = $1, status = $2 WHERE id = $3',
      [blockchainResult.txHash, 'verified', propertyId]
    );

    // Sauvegarder transaction blockchain
    const txQuery = `
      INSERT INTO transactions (
        property_id, seller_id, buyer_id, type, amount, status,
        blockchain_tx_hash, blockchain_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id
    `;

    await db.query(txQuery, [
      propertyId,
      property.owner_id,
      property.owner_id,
      'blockchain_registration',
      0,
      'completed',
      blockchainResult.txHash,
      JSON.stringify(blockchainResult)
    ]);

    await db.query('COMMIT');

    // Mettre en cache
    await setBlockchainCache(cacheKey, blockchainResult);

    logBlockchain('property_registered', blockchainResult.txHash, {
      propertyId,
      cadastralRef: property.cadastral_ref,
      ownerId: property.owner_id
    });

    res.json({
      success: true,
      message: 'Propriété enregistrée sur blockchain',
      data: {
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        propertyTitle: property.title
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}));

// ✅ VÉRIFIER PROPRIÉTÉ SUR BLOCKCHAIN
router.get('/verify/:cadastralRef', authenticateToken, asyncErrorHandler(async (req, res) => {
  const cadastralRef = req.params.cadastralRef;

  if (!cadastralRef) {
    throw new AppError('Référence cadastrale requise', 400);
  }

  // Vérifier cache
  const cacheKey = `blockchain_verify_${cadastralRef}`;
  let verification = await getBlockchainCache(cacheKey);

  if (!verification) {
    // Vérifier sur blockchain
    verification = await verifyPropertyOnBlockchain(cadastralRef);
    
    // Mettre en cache (courte durée car peut changer)
    if (verification.verified) {
      await setBlockchainCache(cacheKey, verification, 300); // 5 minutes
    }
  }

  // Récupérer infos locales
  const localQuery = 'SELECT id, title, owner_id, blockchain_hash FROM properties WHERE cadastral_ref = $1';
  const localResult = await db.query(localQuery, [cadastralRef]);

  const localProperty = localResult.rows[0] || null;

  logBlockchain('property_verified', null, {
    cadastralRef,
    verified: verification.verified,
    hasLocalRecord: !!localProperty
  });

  res.json({
    success: true,
    data: {
      cadastralRef,
      blockchain: {
        verified: verification.verified,
        documentHash: verification.documentHash,
        owner: verification.owner,
        timestamp: verification.timestamp
      },
      local: localProperty ? {
        id: localProperty.id,
        title: localProperty.title,
        ownerId: localProperty.owner_id,
        blockchainHash: localProperty.blockchain_hash
      } : null,
      isConsistent: localProperty ? 
        (localProperty.blockchain_hash === verification.documentHash) : 
        false
    }
  });
}));

// 🔄 TRANSFÉRER PROPRIÉTÉ SUR BLOCKCHAIN
router.post('/transfer', authenticateToken, requireRole(['admin', 'geometre', 'notaire']), asyncErrorHandler(async (req, res) => {
  const { propertyId, newOwnerId } = req.body;

  if (!propertyId || !newOwnerId) {
    throw new AppError('ID propriété et nouvel propriétaire requis', 400);
  }

  // Vérifier propriété
  const propertyQuery = 'SELECT cadastral_ref, owner_id, title, blockchain_hash FROM properties WHERE id = $1';
  const propertyResult = await db.query(propertyQuery, [propertyId]);

  if (propertyResult.rows.length === 0) {
    throw new AppError('Propriété non trouvée', 404);
  }

  const property = propertyResult.rows[0];

  if (!property.blockchain_hash) {
    throw new AppError('Propriété non enregistrée sur blockchain', 400);
  }

  // Vérifier nouveau propriétaire
  const newOwnerQuery = 'SELECT email FROM users WHERE id = $1';
  const newOwnerResult = await db.query(newOwnerQuery, [newOwnerId]);

  if (newOwnerResult.rows.length === 0) {
    throw new AppError('Nouveau propriétaire non trouvé', 404);
  }

  // Transférer sur blockchain
  const transferResult = await transferPropertyOnBlockchain(
    property.cadastral_ref,
    newOwnerId
  );

  if (!transferResult.success) {
    throw new AppError(`Erreur transfert blockchain: ${transferResult.error}`, 500);
  }

  try {
    await db.query('BEGIN');

    // Mettre à jour propriété
    await db.query(
      'UPDATE properties SET owner_id = $1, blockchain_hash = $2 WHERE id = $3',
      [newOwnerId, transferResult.txHash, propertyId]
    );

    // Sauvegarder transaction
    const txQuery = `
      INSERT INTO transactions (
        property_id, seller_id, buyer_id, type, amount, status,
        blockchain_tx_hash, blockchain_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id
    `;

    await db.query(txQuery, [
      propertyId,
      property.owner_id,
      newOwnerId,
      'blockchain_transfer',
      0,
      'completed',
      transferResult.txHash,
      JSON.stringify(transferResult)
    ]);

    await db.query('COMMIT');

    logBlockchain('property_transferred', transferResult.txHash, {
      propertyId,
      cadastralRef: property.cadastral_ref,
      oldOwnerId: property.owner_id,
      newOwnerId
    });

    res.json({
      success: true,
      message: 'Propriété transférée sur blockchain',
      data: {
        txHash: transferResult.txHash,
        newOwner: transferResult.newOwner,
        propertyTitle: property.title
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}));

// 📊 HISTORIQUE BLOCKCHAIN D'UNE PROPRIÉTÉ
router.get('/history/:propertyId', authenticateToken, asyncErrorHandler(async (req, res) => {
  const propertyId = req.params.propertyId;

  // Récupérer toutes les transactions blockchain de cette propriété
  const historyQuery = `
    SELECT 
      t.id, t.type, t.blockchain_tx_hash, t.blockchain_data, t.created_at,
      seller.profile->>'firstName' as seller_first_name,
      seller.profile->>'lastName' as seller_last_name,
      buyer.profile->>'firstName' as buyer_first_name,
      buyer.profile->>'lastName' as buyer_last_name
    FROM transactions t
    LEFT JOIN users seller ON t.seller_id = seller.id
    LEFT JOIN users buyer ON t.buyer_id = buyer.id
    WHERE t.property_id = $1 
      AND t.blockchain_tx_hash IS NOT NULL
    ORDER BY t.created_at ASC
  `;

  const historyResult = await db.query(historyQuery, [propertyId]);

  const history = historyResult.rows.map(row => ({
    id: row.id,
    type: row.type,
    txHash: row.blockchain_tx_hash,
    blockchainData: row.blockchain_data ? JSON.parse(row.blockchain_data) : null,
    createdAt: row.created_at,
    seller: {
      firstName: row.seller_first_name,
      lastName: row.seller_last_name
    },
    buyer: {
      firstName: row.buyer_first_name,
      lastName: row.buyer_last_name
    }
  }));

  res.json({
    success: true,
    data: { history }
  });
}));

// 📈 STATISTIQUES BLOCKCHAIN
router.get('/stats/overview', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) FILTER (WHERE blockchain_hash IS NOT NULL) as properties_on_blockchain,
      COUNT(*) as total_properties,
      COUNT(*) FILTER (WHERE status = 'verified') as verified_properties
    FROM properties
  `;

  const txStatsQuery = `
    SELECT 
      COUNT(*) as total_blockchain_transactions,
      COUNT(*) FILTER (WHERE type = 'blockchain_registration') as registrations,
      COUNT(*) FILTER (WHERE type = 'blockchain_transfer') as transfers,
      COUNT(*) FILTER (WHERE status = 'completed') as completed_transactions,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent_transactions
    FROM transactions
    WHERE blockchain_tx_hash IS NOT NULL
  `;

  const [statsResult, txStatsResult] = await Promise.all([
    db.query(statsQuery),
    db.query(txStatsQuery)
  ]);

  const stats = statsResult.rows[0];
  const txStats = txStatsResult.rows[0];

  res.json({
    success: true,
    data: {
      stats: {
        properties: {
          onBlockchain: parseInt(stats.properties_on_blockchain),
          total: parseInt(stats.total_properties),
          verified: parseInt(stats.verified_properties),
          blockchainPercentage: stats.total_properties > 0 ? 
            ((stats.properties_on_blockchain / stats.total_properties) * 100).toFixed(2) : 0
        },
        transactions: {
          total: parseInt(txStats.total_blockchain_transactions),
          registrations: parseInt(txStats.registrations),
          transfers: parseInt(txStats.transfers),
          completed: parseInt(txStats.completed_transactions),
          recent30d: parseInt(txStats.recent_transactions)
        }
      }
    }
  });
}));

// 🔍 RECHERCHER SUR BLOCKCHAIN
router.get('/search/:query', authenticateToken, asyncErrorHandler(async (req, res) => {
  const searchQuery = req.params.query;

  // Rechercher par référence cadastrale ou hash de transaction
  const searchResults = [];

  // Recherche par référence cadastrale
  if (searchQuery.match(/^[A-Z0-9-]+$/)) {
    try {
      const verification = await verifyPropertyOnBlockchain(searchQuery);
      if (verification.verified) {
        searchResults.push({
          type: 'cadastral_ref',
          value: searchQuery,
          blockchain: verification
        });
      }
    } catch (error) {
      // Ignorer les erreurs de recherche blockchain
    }
  }

  // Recherche en base locale
  const localQuery = `
    SELECT 
      p.id, p.title, p.location, p.cadastral_ref, p.blockchain_hash,
      u.profile->>'firstName' as owner_first_name,
      u.profile->>'lastName' as owner_last_name
    FROM properties p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE 
      p.cadastral_ref ILIKE $1 OR 
      p.blockchain_hash = $2 OR
      p.title ILIKE $1
    LIMIT 10
  `;

  const localResult = await db.query(localQuery, [`%${searchQuery}%`, searchQuery]);

  const localProperties = localResult.rows.map(row => ({
    type: 'local_property',
    property: {
      id: row.id,
      title: row.title,
      location: row.location,
      cadastralRef: row.cadastral_ref,
      blockchainHash: row.blockchain_hash,
      owner: {
        firstName: row.owner_first_name,
        lastName: row.owner_last_name
      }
    }
  }));

  res.json({
    success: true,
    data: {
      query: searchQuery,
      results: [...searchResults, ...localProperties]
    }
  });
}));

// 🌐 STATUT DU RÉSEAU BLOCKCHAIN
router.get('/network/status', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  try {
    // TODO: Implémenter vérification statut réseau
    // Pour l'instant, retourner statut mock
    res.json({
      success: true,
      data: {
        network: {
          name: process.env.NODE_ENV === 'production' ? 'Polygon Mainnet' : 'Polygon Mumbai Testnet',
          connected: true,
          blockNumber: 'N/A',
          gasPrice: 'N/A'
        },
        contract: {
          address: process.env.CONTRACT_ADDRESS || 'Not deployed',
          deployed: !!process.env.CONTRACT_ADDRESS
        }
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        network: {
          connected: false,
          error: error.message
        }
      }
    });
  }
}));

export default router;