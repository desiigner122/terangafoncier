/**
 * CONFIGURATION WAGMI - WEB3 BLOCKCHAIN
 * Support Polygon, Ethereum, testnets
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonAmoy, mainnet, sepolia } from 'wagmi/chains';

// Configuration RainbowKit + Wagmi
export const wagmiConfig = getDefaultConfig({
  appName: 'TerangaFoncier',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c3db6e1e5e5e5e5e5e5e5e5e5e5e5e5e', // Remplacer par votre ID
  chains: [
    polygonAmoy, // Testnet par défaut
    polygon,     // Mainnet Polygon
    mainnet,     // Ethereum Mainnet
    sepolia      // Ethereum Testnet
  ],
  ssr: false,
});

// Adresses des smart contracts déployés
export const CONTRACTS = {
  TERANGA_PROPERTY_NFT: {
    // Polygon Mumbai Testnet
    80001: {
      address: '0x0000000000000000000000000000000000000000', // À remplacer après déploiement
      abi: [], // ABI du contrat
      network: 'Polygon Amoy Testnet'
    },
    // Polygon Mainnet
    137: {
      address: '0x0000000000000000000000000000000000000000', // À remplacer
      abi: [],
      network: 'Polygon Mainnet'
    }
  }
};

// Configuration réseau par défaut
export const DEFAULT_CHAIN = polygonAmoy;

// URLs explorers blockchain
export const BLOCK_EXPLORERS = {
  80001: 'https://amoy.polygonscan.com',
  137: 'https://polygonscan.com',
  1: 'https://etherscan.io',
  11155111: 'https://sepolia.etherscan.io'
};

// Fonction helper pour obtenir le contrat actuel
export const getContract = (chainId) => {
  return CONTRACTS.TERANGA_PROPERTY_NFT[chainId] || CONTRACTS.TERANGA_PROPERTY_NFT[80001];
};

// Fonction helper pour l'URL explorer
export const getExplorerUrl = (chainId, txHash) => {
  const baseUrl = BLOCK_EXPLORERS[chainId] || BLOCK_EXPLORERS[80001];
  return `${baseUrl}/tx/${txHash}`;
};

// Fonction helper pour l'URL d'une adresse
export const getAddressUrl = (chainId, address) => {
  const baseUrl = BLOCK_EXPLORERS[chainId] || BLOCK_EXPLORERS[80001];
  return `${baseUrl}/address/${address}`;
};

export default wagmiConfig;
