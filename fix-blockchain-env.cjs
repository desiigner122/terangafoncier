const fs = require('fs');

// Lire le fichier
const filePath = 'src/services/TerangaBlockchainService.js';
let content = fs.readFileSync(filePath, 'utf8');

// Remplacements des variables d'environnement
const replacements = {
  'process.env.REACT_APP_POLYGON_RPC_URL': 'import.meta.env.VITE_POLYGON_RPC_URL',
  'process.env.REACT_APP_PROPERTY_CONTRACT_ADDRESS': 'import.meta.env.VITE_PROPERTY_CONTRACT_ADDRESS',
  'process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS': 'import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS',
  'process.env.REACT_APP_NFT_CONTRACT_ADDRESS': 'import.meta.env.VITE_NFT_CONTRACT_ADDRESS',
  'process.env.REACT_APP_STAKING_CONTRACT_ADDRESS': 'import.meta.env.VITE_STAKING_CONTRACT_ADDRESS',
  'process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS': 'import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS',
  'process.env.REACT_APP_DAO_CONTRACT_ADDRESS': 'import.meta.env.VITE_DAO_CONTRACT_ADDRESS',
  'process.env.REACT_APP_BSC_RPC_URL': 'import.meta.env.VITE_BSC_RPC_URL',
  'process.env.REACT_APP_BSC_PROPERTY_CONTRACT_ADDRESS': 'import.meta.env.VITE_BSC_PROPERTY_CONTRACT_ADDRESS',
  'process.env.REACT_APP_BSC_TOKEN_CONTRACT_ADDRESS': 'import.meta.env.VITE_BSC_TOKEN_CONTRACT_ADDRESS',
  'process.env.REACT_APP_ETHEREUM_RPC_URL': 'import.meta.env.VITE_ETHEREUM_RPC_URL',
  'process.env.REACT_APP_INFURA_KEY': 'import.meta.env.VITE_INFURA_KEY',
  'process.env.REACT_APP_ETH_PROPERTY_CONTRACT_ADDRESS': 'import.meta.env.VITE_ETH_PROPERTY_CONTRACT_ADDRESS',
  'process.env.REACT_APP_ETH_TOKEN_CONTRACT_ADDRESS': 'import.meta.env.VITE_ETH_TOKEN_CONTRACT_ADDRESS'
};

// Appliquer les remplacements
Object.keys(replacements).forEach(oldVar => {
  const newVar = replacements[oldVar];
  content = content.split(oldVar).join(newVar);
});

// Sauvegarder le fichier
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ TerangaBlockchainService.js mis à jour avec import.meta.env');
console.log('   Variables remplacées:', Object.keys(replacements).length);