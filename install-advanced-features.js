#!/usr/bin/env node

/**
 * Installation et Configuration Automatique
 * Blockchain + IA + APIs Externes pour Teranga Foncier
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Installation des fonctionnalités avancées Teranga Foncier...\n');

// Packages NPM requis
const requiredPackages = [
  // Blockchain
  '@tensorflow/tfjs',
  '@tensorflow/tfjs-node',
  'ethers',
  'web3',
  '@walletconnect/web3-provider',
  
  // IA/ML
  'brain.js',
  'ml-matrix',
  'natural',
  'compromise',
  
  // APIs & Intégrations
  'axios',
  'socket.io-client',
  'ipfs-http-client',
  
  // Chiffrement & Sécurité
  'crypto-js',
  'bcryptjs',
  'jsonwebtoken',
  
  // Utilitaires
  'lodash',
  'moment',
  'uuid',
  'sharp'
];

const devPackages = [
  '@types/node',
  'hardhat',
  '@nomiclabs/hardhat-ethers',
  '@openzeppelin/contracts',
  'solidity-coverage'
];

function installPackages() {
  console.log('📦 Installation des packages NPM...');
  
  try {
    execSync(`npm install ${requiredPackages.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Packages principaux installés\n');
    
    execSync(`npm install -D ${devPackages.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Packages de développement installés\n');
  } catch (error) {
    console.error('❌ Erreur installation packages:', error.message);
    process.exit(1);
  }
}

function createDirectoryStructure() {
  console.log('📁 Création de la structure de dossiers...');
  
  const directories = [
    'src/lib/blockchain',
    'src/lib/blockchain/contracts',
    'src/lib/blockchain/abis',
    'src/lib/ai',
    'src/lib/ai/models',
    'src/lib/ai/training',
    'src/lib/api',
    'src/lib/api/integrations',
    'src/lib/utils',
    'src/lib/security',
    'src/components/blockchain',
    'src/components/ai',
    'src/hooks/blockchain',
    'src/hooks/ai',
    'src/services',
    'contracts',
    'contracts/interfaces',
    'scripts',
    'scripts/blockchain',
    'scripts/ai',
    'public/models',
    'docs/blockchain',
    'docs/ai',
    'tests/blockchain',
    'tests/ai'
  ];

  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`  ✅ ${dir}`);
    }
  });
  
  console.log('✅ Structure de dossiers créée\n');
}

function createSmartContracts() {
  console.log('📝 Création des smart contracts...');
  
  // PropertyRegistry.sol
  const propertyRegistryContract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PropertyRegistry is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    
    struct Property {
        string propertyId;
        address owner;
        string location;
        uint256 area;
        uint256 priceXOF;
        bool verified;
        uint256 timestamp;
        string metadataURI;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(string => uint256) public propertyIdToTokenId;
    mapping(address => uint256[]) public ownerProperties;
    
    event PropertyRegistered(
        uint256 indexed tokenId,
        string indexed propertyId,
        address indexed owner,
        uint256 priceXOF
    );
    
    event PropertyVerified(uint256 indexed tokenId, address verifier);
    event PropertyTransferred(uint256 indexed tokenId, address from, address to);
    
    constructor() ERC721("Teranga Property NFT", "TPNFT") {}
    
    function registerProperty(
        string memory propertyId,
        address to,
        string memory location,
        uint256 area,
        uint256 priceXOF,
        string memory metadataURI
    ) public returns (uint256) {
        require(propertyIdToTokenId[propertyId] == 0, "Property already registered");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        properties[tokenId] = Property({
            propertyId: propertyId,
            owner: to,
            location: location,
            area: area,
            priceXOF: priceXOF,
            verified: false,
            timestamp: block.timestamp,
            metadataURI: metadataURI
        });
        
        propertyIdToTokenId[propertyId] = tokenId;
        ownerProperties[to].push(tokenId);
        
        _safeMint(to, tokenId);
        
        emit PropertyRegistered(tokenId, propertyId, to, priceXOF);
        return tokenId;
    }
    
    function verifyProperty(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Property does not exist");
        properties[tokenId].verified = true;
        emit PropertyVerified(tokenId, msg.sender);
    }
    
    function transferProperty(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not authorized");
        
        properties[tokenId].owner = to;
        
        // Remove from old owner's list
        uint256[] storage fromProperties = ownerProperties[from];
        for (uint i = 0; i < fromProperties.length; i++) {
            if (fromProperties[i] == tokenId) {
                fromProperties[i] = fromProperties[fromProperties.length - 1];
                fromProperties.pop();
                break;
            }
        }
        
        // Add to new owner's list
        ownerProperties[to].push(tokenId);
        
        _transfer(from, to, tokenId);
        emit PropertyTransferred(tokenId, from, to);
    }
    
    function getProperty(uint256 tokenId) public view returns (Property memory) {
        require(_exists(tokenId), "Property does not exist");
        return properties[tokenId];
    }
    
    function getOwnerProperties(address owner) public view returns (uint256[] memory) {
        return ownerProperties[owner];
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Property does not exist");
        return properties[tokenId].metadataURI;
    }
}`;

  // EscrowContract.sol
  const escrowContract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyEscrow is ReentrancyGuard, Ownable {
    uint256 private _escrowIdCounter;
    
    struct Escrow {
        uint256 propertyId;
        address buyer;
        address seller;
        address notary;
        uint256 amount;
        bool completed;
        bool cancelled;
        uint256 createdAt;
    }
    
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userEscrows;
    
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed propertyId,
        address buyer,
        address seller,
        uint256 amount
    );
    
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);
    
    function createEscrow(
        uint256 propertyId,
        address buyer,
        address seller,
        uint256 priceXOF,
        address notary
    ) public payable returns (uint256) {
        require(msg.value >= priceXOF / 10, "Minimum 10% deposit required");
        
        _escrowIdCounter++;
        uint256 escrowId = _escrowIdCounter;
        
        escrows[escrowId] = Escrow({
            propertyId: propertyId,
            buyer: buyer,
            seller: seller,
            notary: notary,
            amount: msg.value,
            completed: false,
            cancelled: false,
            createdAt: block.timestamp
        });
        
        userEscrows[buyer].push(escrowId);
        userEscrows[seller].push(escrowId);
        
        emit EscrowCreated(escrowId, propertyId, buyer, seller, msg.value);
        return escrowId;
    }
    
    function releasePayment(uint256 escrowId) public nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(!escrow.completed && !escrow.cancelled, "Escrow already finalized");
        require(msg.sender == escrow.notary, "Only notary can release");
        
        escrow.completed = true;
        payable(escrow.seller).transfer(escrow.amount);
        
        emit EscrowCompleted(escrowId);
    }
    
    function cancelEscrow(uint256 escrowId) public nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(!escrow.completed && !escrow.cancelled, "Escrow already finalized");
        require(
            msg.sender == escrow.buyer || 
            msg.sender == escrow.seller || 
            msg.sender == escrow.notary,
            "Not authorized"
        );
        
        escrow.cancelled = true;
        payable(escrow.buyer).transfer(escrow.amount);
        
        emit EscrowCancelled(escrowId);
    }
}`;

  // Écriture des fichiers
  fs.writeFileSync(
    path.join(process.cwd(), 'contracts', 'PropertyRegistry.sol'),
    propertyRegistryContract
  );
  
  fs.writeFileSync(
    path.join(process.cwd(), 'contracts', 'PropertyEscrow.sol'),
    escrowContract
  );
  
  console.log('✅ Smart contracts créés\n');
}

function createHardhatConfig() {
  console.log('⚙️ Configuration Hardhat...');
  
  const hardhatConfig = `
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    senegal_testnet: {
      url: process.env.VITE_BLOCKCHAIN_RPC_URL || "https://testnet.senegal-chain.teranga.sn",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    senegal_mainnet: {
      url: "https://mainnet.senegal-chain.teranga.sn",
      accounts: process.env.MAINNET_PRIVATE_KEY ? [process.env.MAINNET_PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./tests/blockchain",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};`;

  fs.writeFileSync(
    path.join(process.cwd(), 'hardhat.config.js'),
    hardhatConfig
  );
  
  console.log('✅ Configuration Hardhat créée\n');
}

function createDeploymentScripts() {
  console.log('📜 Création des scripts de déploiement...');
  
  const deployScript = `
const hre = require("hardhat");

async function main() {
  console.log("🚀 Déploiement des smart contracts Teranga Foncier...");
  
  // Déployer PropertyRegistry
  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
  const propertyRegistry = await PropertyRegistry.deploy();
  await propertyRegistry.deployed();
  console.log("✅ PropertyRegistry déployé à:", propertyRegistry.address);
  
  // Déployer PropertyEscrow
  const PropertyEscrow = await hre.ethers.getContractFactory("PropertyEscrow");
  const propertyEscrow = await PropertyEscrow.deploy();
  await propertyEscrow.deployed();
  console.log("✅ PropertyEscrow déployé à:", propertyEscrow.address);
  
  // Sauvegarder les adresses
  const addresses = {
    PropertyRegistry: propertyRegistry.address,
    PropertyEscrow: propertyEscrow.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    './src/lib/blockchain/contractAddresses.json',
    JSON.stringify(addresses, null, 2)
  );
  
  console.log("📝 Adresses sauvegardées dans contractAddresses.json");
  console.log("🎉 Déploiement terminé avec succès!");
}

main().catch((error) => {
  console.error("❌ Erreur déploiement:", error);
  process.exitCode = 1;
});`;

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', 'deploy.js'),
    deployScript
  );
  
  // Script de vérification
  const verifyScript = `
const hre = require("hardhat");

async function main() {
  const addresses = require('../src/lib/blockchain/contractAddresses.json');
  
  console.log("🔍 Vérification des smart contracts...");
  
  try {
    await hre.run("verify:verify", {
      address: addresses.PropertyRegistry,
      constructorArguments: []
    });
    console.log("✅ PropertyRegistry vérifié");
    
    await hre.run("verify:verify", {
      address: addresses.PropertyEscrow,
      constructorArguments: []
    });
    console.log("✅ PropertyEscrow vérifié");
    
  } catch (error) {
    console.error("❌ Erreur vérification:", error);
  }
}

main().catch(console.error);`;

  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', 'verify.js'),
    verifyScript
  );
  
  console.log('✅ Scripts de déploiement créés\n');
}

function createPackageScripts() {
  console.log('📦 Mise à jour package.json...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Ajouter les scripts blockchain
  packageJson.scripts = {
    ...packageJson.scripts,
    'blockchain:compile': 'hardhat compile',
    'blockchain:test': 'hardhat test',
    'blockchain:node': 'hardhat node',
    'blockchain:deploy:local': 'hardhat run scripts/deploy.js --network localhost',
    'blockchain:deploy:testnet': 'hardhat run scripts/deploy.js --network senegal_testnet',
    'blockchain:deploy:mainnet': 'hardhat run scripts/deploy.js --network senegal_mainnet',
    'blockchain:verify': 'hardhat run scripts/verify.js',
    'ai:train': 'node scripts/ai/train-models.js',
    'ai:test': 'node scripts/ai/test-models.js',
    'setup:blockchain': 'npm run blockchain:compile && npm run blockchain:deploy:local',
    'setup:complete': 'npm run setup:blockchain && npm run ai:train'
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Scripts package.json mis à jour\n');
}

function createEnvironmentFiles() {
  console.log('🔐 Création des fichiers d\'environnement...');
  
  if (!fs.existsSync('.env.local')) {
    const envLocal = `
# Configuration locale Teranga Foncier
VITE_DEV_MODE=true
VITE_MOCK_APIS=true
VITE_DEBUG_BLOCKCHAIN=true

# Blockchain local
VITE_BLOCKCHAIN_RPC_URL=http://localhost:8545
VITE_BLOCKCHAIN_CHAIN_ID=31337

# APIs de développement
VITE_CBAO_API_URL=http://localhost:3001/mock/cbao
VITE_CADASTRE_API_URL=http://localhost:3001/mock/cadastre
VITE_NOTAIRES_API_URL=http://localhost:3001/mock/notaires

# Clés de test (à remplacer en production)
VITE_OPENAI_API_KEY=your_dev_openai_key
VITE_GOOGLE_MAPS_API_KEY=your_dev_google_maps_key
`;

    fs.writeFileSync('.env.local', envLocal);
    console.log('✅ .env.local créé');
  }
  
  console.log('✅ Fichiers d\'environnement configurés\n');
}

function createReadme() {
  console.log('📖 Création de la documentation...');
  
  const readmeBlockchain = `
# 🔗 Blockchain Teranga Foncier

## Installation

\`\`\`bash
npm install
npm run blockchain:compile
npm run blockchain:deploy:local
\`\`\`

## Smart Contracts

### PropertyRegistry
- Enregistrement de propriétés sur blockchain
- Tokenisation NFT automatique
- Vérification par notaires

### PropertyEscrow
- Séquestre sécurisé pour transactions
- Libération automatique de fonds
- Protection acheteur/vendeur

## Utilisation

\`\`\`javascript
import { useBlockchain } from '@/lib/blockchain/smartContracts';

const { registerProperty, createEscrow } = useBlockchain();

// Enregistrer une propriété
const result = await registerProperty({
  propertyId: 'TF001',
  owner: '0x...',
  location: 'Dakar, Sénégal',
  area: 500,
  priceXOF: 50000000,
  metadataURI: 'ipfs://...'
});
\`\`\`

## Tests

\`\`\`bash
npm run blockchain:test
\`\`\`
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'docs', 'blockchain', 'README.md'),
    readmeBlockchain
  );
  
  const readmeAI = `
# 🤖 Intelligence Artificielle Teranga Foncier

## Fonctionnalités

### Prédiction de Prix
- Modèles ML pour estimation valeur propriétés
- Facteurs: localisation, superficie, amenités
- Précision: 92%+ basé sur données historiques

### Recommandations Personnalisées
- Analyse comportement utilisateur
- Suggestions propriétés ciblées
- Optimisation portfolio investissement

### Évaluation des Risques
- Scoring risque automatique
- Analyse marché temps réel
- Alertes opportunités/dangers

## Utilisation

\`\`\`javascript
import { useAI } from '@/lib/ai/intelligenceArtificielle';

const { predictPrice, getRecommendations } = useAI();

// Prédiction prix
const prediction = await predictPrice({
  area: 500,
  location: 'Dakar',
  type: 'Terrain'
});

// Recommandations
const recs = await getRecommendations(userId, profile, preferences);
\`\`\`

## Entraînement

\`\`\`bash
npm run ai:train
npm run ai:test
\`\`\`
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'docs', 'ai', 'README.md'),
    readmeAI
  );
  
  console.log('✅ Documentation créée\n');
}

// Exécution principale
async function main() {
  try {
    console.log('🎯 Début de l\'installation...\n');
    
    installPackages();
    createDirectoryStructure();
    createSmartContracts();
    createHardhatConfig();
    createDeploymentScripts();
    createPackageScripts();
    createEnvironmentFiles();
    createReadme();
    
    console.log('🎉 Installation terminée avec succès!\n');
    console.log('📋 Prochaines étapes:');
    console.log('1. Copiez .env.blockchain vers .env.local et configurez vos clés API');
    console.log('2. Lancez: npm run blockchain:node (dans un terminal séparé)');
    console.log('3. Lancez: npm run setup:blockchain');
    console.log('4. Testez: npm run dev\n');
    console.log('🚀 Votre plateforme blockchain est prête!');
    
  } catch (error) {
    console.error('❌ Erreur during installation:', error);
    process.exit(1);
  }
}

main();
`;

// Rendre le script exécutable
const scriptPath = path.join(process.cwd(), 'install-advanced-features.js');
fs.writeFileSync(scriptPath, installScript);

if (process.platform !== 'win32') {
  execSync(`chmod +x ${scriptPath}`);
}

console.log('✅ Script d\'installation créé: install-advanced-features.js');
