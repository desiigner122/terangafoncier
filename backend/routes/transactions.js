import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logBusiness } from '../utils/logger.js';
import { registerPropertyOnBlockchain, verifyPropertyOnBlockchain } from '../config/blockchain.js';
import db from '../config/database.js';

const router = express.Router();

// 🔗 ENREGISTRER TRANSACTION SUR BLOCKCHAIN
router.post('/blockchain', authenticateToken, requireRole(['admin', 'geometre']), asyncErrorHandler(async (req, res) => {
  const { propertyId, documentHash, transactionType = 'registration' } = req.body;

  if (!propertyId || !documentHash) {
    throw new AppError('ID propriété et hash document requis', 400);
  }

  // Vérifier que la propriété existe
  const propertyQuery = 'SELECT cadastral_ref, owner_id, title FROM properties WHERE id = $1';
  const propertyResult = await db.query(propertyQuery, [propertyId]);

  if (propertyResult.rows.length === 0) {
    throw new AppError('Propriété non trouvée', 404);
  }

  const property = propertyResult.rows[0];

  if (!property.cadastral_ref) {
    throw new AppError('Référence cadastrale requise pour blockchain', 400);
  }

  try {
    await db.query('BEGIN');

    // Enregistrer sur blockchain
    const blockchainResult = await registerPropertyOnBlockchain(
      property.cadastral_ref,
      documentHash,
      property.owner_id
    );

    if (!blockchainResult.success) {
      throw new AppError(`Erreur blockchain: ${blockchainResult.error}`, 500);
    }

    // Sauvegarder transaction en base
    const transactionQuery = `
      INSERT INTO transactions (
        property_id, seller_id, buyer_id, type, amount, status,
        blockchain_tx_hash, blockchain_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, blockchain_tx_hash
    `;

    const transactionResult = await db.query(transactionQuery, [
      propertyId,
      property.owner_id,
      property.owner_id, // Pour registration, seller = buyer
      transactionType,
      0, // Pas de montant pour registration
      'completed',
      blockchainResult.txHash,
      JSON.stringify(blockchainResult)
    ]);

    // Mettre à jour propriété
    await db.query(
      'UPDATE properties SET blockchain_hash = $1, status = $2 WHERE id = $3',
      [blockchainResult.txHash, 'verified', propertyId]
    );

    await db.query('COMMIT');

    logBusiness('blockchain_registration', {
      propertyId,
      txHash: blockchainResult.txHash,
      cadastralRef: property.cadastral_ref
    });

    res.json({
      success: true,
      message: 'Transaction enregistrée sur blockchain',
      data: {
        transactionId: transactionResult.rows[0].id,
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}));

// 📋 LISTER TRANSACTIONS
router.get('/', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { page = 1, limit = 20, type, status, propertyId } = req.query;
  const offset = (page - 1) * limit;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Construire query selon permissions
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  // Non-admin: voir seulement ses transactions
  if (!isAdmin) {
    whereConditions.push(`(t.seller_id = $${paramIndex} OR t.buyer_id = $${paramIndex})`);
    queryParams.push(userId);
    paramIndex++;
  }

  if (type) {
    whereConditions.push(`t.type = $${paramIndex}`);
    queryParams.push(type);
    paramIndex++;
  }

  if (status) {
    whereConditions.push(`t.status = $${paramIndex}`);
    queryParams.push(status);
    paramIndex++;
  }

  if (propertyId) {
    whereConditions.push(`t.property_id = $${paramIndex}`);
    queryParams.push(propertyId);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const transactionsQuery = `
    SELECT 
      t.id, t.type, t.amount, t.status, t.blockchain_tx_hash, t.created_at,
      p.title as property_title, p.location as property_location,
      seller.profile->>'firstName' as seller_first_name,
      seller.profile->>'lastName' as seller_last_name,
      buyer.profile->>'firstName' as buyer_first_name,
      buyer.profile->>'lastName' as buyer_last_name
    FROM transactions t
    LEFT JOIN properties p ON t.property_id = p.id
    LEFT JOIN users seller ON t.seller_id = seller.id
    LEFT JOIN users buyer ON t.buyer_id = buyer.id
    ${whereClause}
    ORDER BY t.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  queryParams.push(limit, offset);

  const transactionsResult = await db.query(transactionsQuery, queryParams);

  // Count total
  const countQuery = `SELECT COUNT(*) FROM transactions t ${whereClause}`;
  const countResult = await db.query(countQuery, queryParams.slice(0, -2));
  const total = parseInt(countResult.rows[0].count);

  const transactions = transactionsResult.rows.map(row => ({
    id: row.id,
    type: row.type,
    amount: row.amount,
    status: row.status,
    blockchainTxHash: row.blockchain_tx_hash,
    createdAt: row.created_at,
    property: {
      title: row.property_title,
      location: row.property_location
    },
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
    data: {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// 🔍 DÉTAILS TRANSACTION
router.get('/:id', authenticateToken, asyncErrorHandler(async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  const transactionQuery = `
    SELECT 
      t.*,
      p.title as property_title, p.location as property_location, p.cadastral_ref,
      seller.email as seller_email, seller.profile as seller_profile,
      buyer.email as buyer_email, buyer.profile as buyer_profile
    FROM transactions t
    LEFT JOIN properties p ON t.property_id = p.id
    LEFT JOIN users seller ON t.seller_id = seller.id
    LEFT JOIN users buyer ON t.buyer_id = buyer.id
    WHERE t.id = $1
  `;

  const transactionResult = await db.query(transactionQuery, [transactionId]);

  if (transactionResult.rows.length === 0) {
    throw new AppError('Transaction non trouvée', 404);
  }

  const transaction = transactionResult.rows[0];

  // Vérifier permissions
  if (!isAdmin && transaction.seller_id !== userId && transaction.buyer_id !== userId) {
    throw new AppError('Accès non autorisé', 403);
  }

  res.json({
    success: true,
    data: {
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        blockchainTxHash: transaction.blockchain_tx_hash,
        blockchainData: transaction.blockchain_data ? JSON.parse(transaction.blockchain_data) : null,
        createdAt: transaction.created_at,
        property: {
          id: transaction.property_id,
          title: transaction.property_title,
          location: transaction.property_location,
          cadastralRef: transaction.cadastral_ref
        },
        seller: {
          id: transaction.seller_id,
          email: transaction.seller_email,
          profile: JSON.parse(transaction.seller_profile || '{}')
        },
        buyer: {
          id: transaction.buyer_id,
          email: transaction.buyer_email,
          profile: JSON.parse(transaction.buyer_profile || '{}')
        }
      }
    }
  });
}));

// ✅ VÉRIFIER TRANSACTION SUR BLOCKCHAIN
router.get('/:id/verify', authenticateToken, asyncErrorHandler(async (req, res) => {
  const transactionId = req.params.id;

  // Récupérer transaction
  const transactionQuery = `
    SELECT t.blockchain_tx_hash, p.cadastral_ref 
    FROM transactions t
    LEFT JOIN properties p ON t.property_id = p.id
    WHERE t.id = $1
  `;

  const transactionResult = await db.query(transactionQuery, [transactionId]);

  if (transactionResult.rows.length === 0) {
    throw new AppError('Transaction non trouvée', 404);
  }

  const transaction = transactionResult.rows[0];

  if (!transaction.blockchain_tx_hash) {
    return res.json({
      success: true,
      data: {
        verified: false,
        message: 'Transaction non enregistrée sur blockchain'
      }
    });
  }

  // Vérifier sur blockchain
  const verification = await verifyPropertyOnBlockchain(transaction.cadastral_ref);

  res.json({
    success: true,
    data: {
      verified: verification.verified,
      blockchainData: verification,
      txHash: transaction.blockchain_tx_hash
    }
  });
}));

// 📊 STATISTIQUES TRANSACTIONS
router.get('/stats/overview', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_transactions,
      COUNT(*) FILTER (WHERE status = 'completed') as completed_transactions,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_transactions,
      COUNT(*) FILTER (WHERE status = 'failed') as failed_transactions,
      COUNT(*) FILTER (WHERE type = 'sale') as sales,
      COUNT(*) FILTER (WHERE type = 'transfer') as transfers,
      COUNT(*) FILTER (WHERE type = 'registration') as registrations,
      SUM(amount) FILTER (WHERE status = 'completed' AND type = 'sale') as total_sales_amount,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as transactions_30d,
      COUNT(*) FILTER (WHERE blockchain_tx_hash IS NOT NULL) as blockchain_transactions
    FROM transactions
  `;

  const statsResult = await db.query(statsQuery);
  const stats = statsResult.rows[0];

  res.json({
    success: true,
    data: {
      stats: {
        totalTransactions: parseInt(stats.total_transactions),
        completedTransactions: parseInt(stats.completed_transactions),
        pendingTransactions: parseInt(stats.pending_transactions),
        failedTransactions: parseInt(stats.failed_transactions),
        transactionsByType: {
          sales: parseInt(stats.sales),
          transfers: parseInt(stats.transfers),
          registrations: parseInt(stats.registrations)
        },
        totalSalesAmount: parseFloat(stats.total_sales_amount || 0),
        transactions30d: parseInt(stats.transactions_30d),
        blockchainTransactions: parseInt(stats.blockchain_transactions)
      }
    }
  });
}));

export default router;