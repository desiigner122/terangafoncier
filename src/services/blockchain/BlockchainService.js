// Service principal pour l'intégration Blockchain Ethereum/Polygon
import { ethers } from 'ethers';
import Web3 from 'web3';

class BlockchainService {
  constructor() {
    this.networks = {
      ethereum: {
        name: 'Ethereum Mainnet',
        rpcUrl: process.env.REACT_APP_ETHEREUM_RPC || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
        chainId: 1,
        symbol: 'ETH',
        blockExplorer: 'https://etherscan.io'
      },
      polygon: {
        name: 'Polygon',
        rpcUrl: process.env.REACT_APP_POLYGON_RPC || 'https://polygon-rpc.com',
        chainId: 137,
        symbol: 'MATIC',
        blockExplorer: 'https://polygonscan.com'
      },
      polygonTestnet: {
        name: 'Polygon Mumbai',
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        chainId: 80001,
        symbol: 'MATIC',
        blockExplorer: 'https://mumbai.polygonscan.com'
      }
    };

    this.currentNetwork = 'polygonTestnet'; // Utiliser testnet par défaut
    this.provider = null;
    this.signer = null;
    this.web3 = null;
    this.contracts = {};
    
    this.initializeProvider();
  }

  async initializeProvider() {
    try {
      const network = this.networks[this.currentNetwork];
      
      // Initialiser provider ethers.js
      this.provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      
      // Initialiser Web3
      this.web3 = new Web3(network.rpcUrl);
      
      // Vérifier la connexion
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`✅ Connecté au réseau ${network.name}, bloc: ${blockNumber}`);
      
      return true;
    } catch (error) {
      console.warn('⚠️ Connexion blockchain échouée, mode simulation activé:', error.message);
      this.simulationMode = true;
      return false;
    }
  }

  // Connexion du wallet utilisateur
  async connectWallet() {
    if (this.simulationMode) {
      return this.getSimulatedWallet();
    }

    try {
      if (!window.ethereum) {
        throw new Error('Aucun wallet détecté. Installez MetaMask.');
      }

      // Demander connexion
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Créer provider Web3
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = web3Provider.getSigner();
      
      // Obtenir adresse
      const address = await this.signer.getAddress();
      
      // Vérifier/changer de réseau
      await this.switchToNetwork(this.currentNetwork);
      
      // Obtenir solde
      const balance = await this.provider.getBalance(address);
      const balanceFormatted = ethers.utils.formatEther(balance);
      
      const walletInfo = {
        address,
        balance: balanceFormatted,
        network: this.networks[this.currentNetwork].name,
        connected: true
      };

      console.log('🔗 Wallet connecté:', walletInfo);
      return walletInfo;
      
    } catch (error) {
      console.error('Erreur connexion wallet:', error);
      throw error;
    }
  }

  // Changer de réseau blockchain
  async switchToNetwork(networkKey) {
    const network = this.networks[networkKey];
    
    if (!network) {
      throw new Error(`Réseau ${networkKey} non supporté`);
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${network.chainId.toString(16)}` }]
      });
      
      this.currentNetwork = networkKey;
      await this.initializeProvider();
      
    } catch (error) {
      // Si le réseau n'existe pas, l'ajouter
      if (error.code === 4902) {
        await this.addNetwork(network);
      } else {
        throw error;
      }
    }
  }

  // Ajouter un nouveau réseau au wallet
  async addNetwork(network) {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${network.chainId.toString(16)}`,
        chainName: network.name,
        nativeCurrency: {
          name: network.symbol,
          symbol: network.symbol,
          decimals: 18
        },
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: [network.blockExplorer]
      }]
    });
  }

  // Créer un smart contract pour les propriétés (NFT)
  async createPropertyNFT(propertyData) {
    if (this.simulationMode) {
      return this.getSimulatedNFT(propertyData);
    }

    try {
      // ABI simplifié pour NFT immobilier
      const contractABI = [
        "function createProperty(string memory tokenURI, uint256 price, address owner) public returns (uint256)",
        "function getProperty(uint256 tokenId) public view returns (tuple(uint256 price, address owner, string tokenURI, bool isForSale))",
        "function transferProperty(uint256 tokenId, address to) public",
        "event PropertyCreated(uint256 indexed tokenId, address indexed owner, uint256 price)"
      ];

      const contractAddress = process.env.REACT_APP_PROPERTY_NFT_CONTRACT;
      const contract = new ethers.Contract(contractAddress, contractABI, this.signer);

      // Métadonnées de la propriété
      const metadata = {
        name: propertyData.title,
        description: propertyData.description,
        image: propertyData.images?.[0] || '',
        attributes: [
          { trait_type: "Location", value: propertyData.location },
          { trait_type: "Surface", value: propertyData.surface },
          { trait_type: "Type", value: propertyData.type },
          { trait_type: "Price", value: propertyData.price }
        ]
      };

      // Upload metadata vers IPFS (simulation)
      const tokenURI = await this.uploadToIPFS(metadata);
      
      // Créer le NFT
      const price = ethers.utils.parseEther(propertyData.priceInEth || "0.1");
      const tx = await contract.createProperty(tokenURI, price, propertyData.owner);
      
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'PropertyCreated');
      
      return {
        tokenId: event?.args?.tokenId?.toString(),
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        tokenURI,
        metadata
      };

    } catch (error) {
      console.error('Erreur création NFT:', error);
      throw error;
    }
  }

  // Effectuer une transaction de propriété
  async transferProperty(tokenId, fromAddress, toAddress, price) {
    if (this.simulationMode) {
      return this.getSimulatedTransaction();
    }

    try {
      const contractAddress = process.env.REACT_APP_PROPERTY_NFT_CONTRACT;
      const contractABI = [
        "function transferProperty(uint256 tokenId, address to) public payable",
        "event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price)"
      ];

      const contract = new ethers.Contract(contractAddress, contractABI, this.signer);
      
      const priceInWei = ethers.utils.parseEther(price.toString());
      const tx = await contract.transferProperty(tokenId, toAddress, {
        value: priceInWei
      });

      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'Success' : 'Failed',
        from: fromAddress,
        to: toAddress,
        tokenId,
        price: price.toString()
      };

    } catch (error) {
      console.error('Erreur transfert propriété:', error);
      throw error;
    }
  }

  // Obtenir l'historique des transactions d'une propriété
  async getPropertyHistory(tokenId) {
    if (this.simulationMode) {
      return this.getSimulatedHistory(tokenId);
    }

    try {
      const contractAddress = process.env.REACT_APP_PROPERTY_NFT_CONTRACT;
      const contractABI = [
        "event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price)"
      ];

      const contract = new ethers.Contract(contractAddress, contractABI, this.provider);
      
      // Récupérer les événements de transfert
      const filter = contract.filters.PropertyTransferred(tokenId);
      const events = await contract.queryFilter(filter);

      const history = await Promise.all(
        events.map(async (event) => {
          const block = await this.provider.getBlock(event.blockNumber);
          return {
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            timestamp: new Date(block.timestamp * 1000),
            from: event.args.from,
            to: event.args.to,
            price: ethers.utils.formatEther(event.args.price),
            tokenId: event.args.tokenId.toString()
          };
        })
      );

      return history.sort((a, b) => b.blockNumber - a.blockNumber);

    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }

  // Obtenir le portefeuille NFT d'un utilisateur
  async getUserNFTs(userAddress) {
    if (this.simulationMode) {
      return this.getSimulatedNFTs(userAddress);
    }

    try {
      const contractAddress = process.env.REACT_APP_PROPERTY_NFT_CONTRACT;
      const contractABI = [
        "function balanceOf(address owner) public view returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
        "function getProperty(uint256 tokenId) public view returns (tuple(uint256 price, address owner, string tokenURI, bool isForSale))"
      ];

      const contract = new ethers.Contract(contractAddress, contractABI, this.provider);
      
      const balance = await contract.balanceOf(userAddress);
      const nfts = [];

      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        const property = await contract.getProperty(tokenId);
        
        // Récupérer métadonnées depuis IPFS
        const metadata = await this.fetchFromIPFS(property.tokenURI);
        
        nfts.push({
          tokenId: tokenId.toString(),
          price: ethers.utils.formatEther(property.price),
          owner: property.owner,
          isForSale: property.isForSale,
          metadata
        });
      }

      return nfts;

    } catch (error) {
      console.error('Erreur récupération NFTs:', error);
      return [];
    }
  }

  // Calculer les frais de transaction
  async estimateTransactionFee(transactionType, data = {}) {
    if (this.simulationMode) {
      return this.getSimulatedFees();
    }

    try {
      const gasPrice = await this.provider.getGasPrice();
      let gasEstimate;

      switch (transactionType) {
        case 'createNFT':
          gasEstimate = ethers.BigNumber.from("300000"); // Estimation pour création NFT
          break;
        case 'transfer':
          gasEstimate = ethers.BigNumber.from("100000"); // Estimation pour transfert
          break;
        default:
          gasEstimate = ethers.BigNumber.from("21000"); // Transaction basique
      }

      const totalCost = gasPrice.mul(gasEstimate);
      const network = this.networks[this.currentNetwork];

      return {
        gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
        gasEstimate: gasEstimate.toString(),
        totalCost: ethers.utils.formatEther(totalCost),
        currency: network.symbol,
        usdEstimate: await this.convertToUSD(ethers.utils.formatEther(totalCost), network.symbol)
      };

    } catch (error) {
      console.error('Erreur estimation frais:', error);
      return this.getSimulatedFees();
    }
  }

  // Utilitaires IPFS (simulation)
  async uploadToIPFS(metadata) {
    // Simulation - en production, utilisez un service IPFS réel
    const hash = 'Qm' + Math.random().toString(36).substring(2, 15);
    return `https://ipfs.io/ipfs/${hash}`;
  }

  async fetchFromIPFS(tokenURI) {
    try {
      const response = await fetch(tokenURI);
      return await response.json();
    } catch {
      return { name: 'Métadonnées indisponibles' };
    }
  }

  async convertToUSD(amount, currency) {
    // Simulation - en production, utilisez une API de taux de change réelle
    const rates = { ETH: 2000, MATIC: 0.8 };
    return (parseFloat(amount) * (rates[currency] || 1)).toFixed(2);
  }

  // Mode simulation pour développement
  getSimulatedWallet() {
    return {
      address: '0x742d35Cc6634C0532925a3b8D0c4d4A4E98B5B48',
      balance: '2.5',
      network: 'Polygon Mumbai (Testnet)',
      connected: true,
      simulated: true
    };
  }

  getSimulatedNFT(propertyData) {
    return {
      tokenId: Math.floor(0 * 10000).toString(),
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      blockNumber: Math.floor(0 * 1000000),
      tokenURI: 'https://ipfs.io/ipfs/QmSimulated123',
      metadata: {
        name: propertyData.title,
        description: propertyData.description,
        attributes: [
          { trait_type: "Location", value: propertyData.location },
          { trait_type: "Surface", value: propertyData.surface }
        ]
      },
      simulated: true
    };
  }

  getSimulatedTransaction() {
    return {
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      blockNumber: Math.floor(0 * 1000000),
      gasUsed: '125000',
      status: 'Success',
      simulated: true
    };
  }

  getSimulatedHistory(tokenId) {
    return [
      {
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(0 * 1000000),
        timestamp: new Date(Date.now() - 86400000), // Hier
        from: '0x0000000000000000000000000000000000000000',
        to: '0x742d35Cc6634C0532925a3b8D0c4d4A4E98B5B48',
        price: '0.1',
        tokenId,
        type: 'Création'
      }
    ];
  }

  getSimulatedNFTs(userAddress) {
    return [
      {
        tokenId: '1',
        price: '0.1',
        owner: userAddress,
        isForSale: false,
        metadata: {
          name: 'Villa Almadies #1',
          description: 'Belle villa avec vue sur mer',
          attributes: [
            { trait_type: "Location", value: "Almadies, Dakar" },
            { trait_type: "Surface", value: "350 m²" }
          ]
        },
        simulated: true
      }
    ];
  }

  getSimulatedFees() {
    return {
      gasPrice: '20',
      gasEstimate: '125000',
      totalCost: '0.0025',
      currency: 'MATIC',
      usdEstimate: '0.002',
      simulated: true
    };
  }
}

export default new BlockchainService();