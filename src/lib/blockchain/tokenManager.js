/**
 * Gestionnaire de tokens pour l'investissement fractionné
 */

export class TokenManager {
  constructor() {
    this.tokens = new Map();
    this.balances = new Map();
  }

  async createPropertyToken(propertyData) {
    console.log('🏠 Création de token immobilier:', propertyData.title);
    
    const tokenId = `TOKEN_${Date.now()}`;
    const token = {
      id: tokenId,
      symbol: propertyData.symbol || `TF${Date.now().toString().slice(-4)}`,
      name: propertyData.title,
      totalSupply: propertyData.totalValue,
      decimals: 18,
      propertyId: propertyData.id,
      metadata: propertyData,
      createdAt: new Date()
    };
    
    this.tokens.set(tokenId, token);
    
    return token;
  }

  async transferTokens(from, to, tokenId, amount) {
    console.log('💸 Transfert de tokens:', { from, to, tokenId, amount });
    
    // Vérifier le solde
    const fromBalance = this.getBalance(from, tokenId);
    if (fromBalance < amount) {
      throw new Error('Solde insuffisant');
    }
    
    // Effectuer le transfert
    this.setBalance(from, tokenId, fromBalance - amount);
    const toBalance = this.getBalance(to, tokenId);
    this.setBalance(to, tokenId, toBalance + amount);
    
    return {
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      from,
      to,
      amount,
      tokenId,
      timestamp: new Date()
    };
  }

  getBalance(address, tokenId) {
    const key = `${address}_${tokenId}`;
    return this.balances.get(key) || 0;
  }

  setBalance(address, tokenId, amount) {
    const key = `${address}_${tokenId}`;
    this.balances.set(key, amount);
  }

  getToken(tokenId) {
    return this.tokens.get(tokenId);
  }

  getAllTokens() {
    return Array.from(this.tokens.values());
  }
}

export const tokenManager = new TokenManager();