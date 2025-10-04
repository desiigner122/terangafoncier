import { ethers } from 'ethers';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// 🔗 CONFIGURATION BLOCKCHAIN TERANGA FONCIER 🔗
let provider;
let wallet;
let propertyContract;

// ABI Smart Contract (Simplifié pour démarrage)
const PROPERTY_CONTRACT_ABI = [
  'function registerProperty(string calldata cadastralRef, string calldata documentHash, address owner) external',
  'function verifyProperty(string calldata cadastralRef) external view returns (bool)',
  'function getProperty(string calldata cadastralRef) external view returns (string memory, address, uint256)',
  'function transferProperty(string calldata cadastralRef, address newOwner) external',
  'event PropertyRegistered(string indexed cadastralRef, address indexed owner, string documentHash)',
  'event PropertyTransferred(string indexed cadastralRef, address indexed oldOwner, address indexed newOwner)'
];

export const initBlockchain = async () => {
  try {
    // Configuration réseau selon environnement
    const isProduction = process.env.NODE_ENV === 'production';
    const rpcUrl = isProduction 
      ? process.env.POLYGON_RPC_URL 
      : process.env.POLYGON_TESTNET_RPC_URL || 'https://polygon-mumbai.infura.io/v3/demo';

    // Initialiser provider
    provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Test connexion
    const network = await provider.getNetwork();
    logger.info(`🔗 Blockchain connectée: ${network.name} (ChainId: ${network.chainId})`);

    // Initialiser wallet si clé privée fournie
    if (process.env.PRIVATE_KEY) {
      wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const balance = await wallet.provider.getBalance(wallet.address);
      logger.info(`👛 Wallet: ${wallet.address}`);
      logger.info(`💰 Balance: ${ethers.formatEther(balance)} ${isProduction ? 'MATIC' : 'Test MATIC'}`);
    }

    // Initialiser contrat si adresse fournie
    if (process.env.CONTRACT_ADDRESS && wallet) {
      propertyContract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        PROPERTY_CONTRACT_ABI,
        wallet
      );
      logger.info(`📄 Smart Contract: ${process.env.CONTRACT_ADDRESS}`);
    }

    logger.info('✅ Blockchain initialisée - Teranga Foncier Ready');
    return { provider, wallet, propertyContract };
    
  } catch (error) {
    logger.error('❌ Erreur initialisation blockchain:', error);
    // Ne pas faire planter l'app si blockchain non disponible
    return { provider: null, wallet: null, propertyContract: null };
  }
};

// 🏠 FONCTIONS BLOCKCHAIN TERANGA FONCIER
export const registerPropertyOnBlockchain = async (cadastralRef, documentHash, ownerAddress) => {
  try {
    if (!propertyContract) {
      throw new Error('Smart contract non initialisé');
    }

    logger.info(`🔗 Enregistrement propriété blockchain: ${cadastralRef}`);
    
    const tx = await propertyContract.registerProperty(
      cadastralRef,
      documentHash,
      ownerAddress
    );
    
    logger.info(`⏳ Transaction envoyée: ${tx.hash}`);
    
    const receipt = await tx.wait();
    logger.info(`✅ Propriété enregistrée sur blockchain: ${receipt.transactionHash}`);
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
    
  } catch (error) {
    logger.error('❌ Erreur enregistrement blockchain:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const verifyPropertyOnBlockchain = async (cadastralRef) => {
  try {
    if (!propertyContract) {
      return { verified: false, error: 'Smart contract non disponible' };
    }

    const isVerified = await propertyContract.verifyProperty(cadastralRef);
    const propertyData = await propertyContract.getProperty(cadastralRef);
    
    return {
      verified: isVerified,
      documentHash: propertyData[0],
      owner: propertyData[1],
      timestamp: propertyData[2]
    };
    
  } catch (error) {
    logger.error('❌ Erreur vérification blockchain:', error);
    return {
      verified: false,
      error: error.message
    };
  }
};

export const transferPropertyOnBlockchain = async (cadastralRef, newOwnerAddress) => {
  try {
    if (!propertyContract) {
      throw new Error('Smart contract non initialisé');
    }

    const tx = await propertyContract.transferProperty(cadastralRef, newOwnerAddress);
    const receipt = await tx.wait();
    
    logger.info(`✅ Propriété transférée: ${receipt.transactionHash}`);
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      newOwner: newOwnerAddress
    };
    
  } catch (error) {
    logger.error('❌ Erreur transfert blockchain:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export { provider, wallet, propertyContract };