import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

class TerangaBlockchainService {
  constructor() {
    // Mainnet configuration
    this.networks = {
      polygon: {
        chainId: 137,
        name: 'Polygon Mainnet',
        rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-rpc.com',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        blockExplorer: 'https://polygonscan.com',
        contracts: {
          terangaProperty: import.meta.env.VITE_PROPERTY_CONTRACT_ADDRESS,
          terangaToken: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS,
          terangaNFT: import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
          terangaStaking: import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
          terangaMarketplace: import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS,
          terangaDAO: import.meta.env.VITE_DAO_CONTRACT_ADDRESS
        }
      },
      bsc: {
        chainId: 56,
        name: 'BNB Smart Chain',
        rpcUrl: import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed1.binance.org',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        blockExplorer: 'https://bscscan.com',
        contracts: {
          terangaProperty: import.meta.env.VITE_BSC_PROPERTY_CONTRACT_ADDRESS,
          terangaToken: import.meta.env.VITE_BSC_TOKEN_CONTRACT_ADDRESS
        }
      },
      ethereum: {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/' + import.meta.env.VITE_INFURA_KEY,
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        blockExplorer: 'https://etherscan.io',
        contracts: {
          terangaProperty: import.meta.env.VITE_ETH_PROPERTY_CONTRACT_ADDRESS,
          terangaToken: import.meta.env.VITE_ETH_TOKEN_CONTRACT_ADDRESS
        }
      }
    };

    this.currentNetwork = 'polygon'; // Default to Polygon for lower fees
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.isInitialized = false;

    // Contract ABIs (simplified for brevity)
    this.contractABIs = {
      property: [
        'function createProperty(string memory _title, string memory _description, uint256 _price, string memory _location, string memory _imageHash) public returns (uint256)',
        'function getProperty(uint256 _tokenId) public view returns (tuple(string title, string description, uint256 price, string location, string imageHash, address owner, bool isVerified, uint256 createdAt))',
        'function verifyProperty(uint256 _tokenId) public',
        'function transferProperty(address _to, uint256 _tokenId) public',
        'function getPropertiesByOwner(address _owner) public view returns (uint256[])',
        'function getTotalProperties() public view returns (uint256)',
        'event PropertyCreated(uint256 indexed tokenId, address indexed owner, string title, uint256 price)',
        'event PropertyVerified(uint256 indexed tokenId, address indexed verifier)',
        'event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to)'
      ],
      token: [
        'function totalSupply() public view returns (uint256)',
        'function balanceOf(address account) public view returns (uint256)',
        'function transfer(address to, uint256 amount) public returns (bool)',
        'function allowance(address owner, address spender) public view returns (uint256)',
        'function approve(address spender, uint256 amount) public returns (bool)',
        'function transferFrom(address from, address to, uint256 amount) public returns (bool)',
        'function mint(address to, uint256 amount) public',
        'function burn(uint256 amount) public',
        'function stake(uint256 amount) public',
        'function unstake(uint256 amount) public',
        'function getStakingRewards(address account) public view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 value)',
        'event Approval(address indexed owner, address indexed spender, uint256 value)',
        'event Staked(address indexed user, uint256 amount)',
        'event Unstaked(address indexed user, uint256 amount)'
      ],
      nft: [
        'function mint(address to, string memory tokenURI) public returns (uint256)',
        'function tokenURI(uint256 tokenId) public view returns (string memory)',
        'function ownerOf(uint256 tokenId) public view returns (address)',
        'function balanceOf(address owner) public view returns (uint256)',
        'function approve(address to, uint256 tokenId) public',
        'function transferFrom(address from, address to, uint256 tokenId) public',
        'function setApprovalForAll(address operator, bool approved) public',
        'function isApprovedForAll(address owner, address operator) public view returns (bool)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)'
      ],
      marketplace: [
        'function listProperty(uint256 _tokenId, uint256 _price) public',
        'function buyProperty(uint256 _listingId) public payable',
        'function depositEscrow(bytes32 reference) public payable',
        'function cancelListing(uint256 _listingId) public',
        'function getListing(uint256 _listingId) public view returns (tuple(uint256 tokenId, address seller, uint256 price, bool isActive, uint256 createdAt))',
        'function getActiveListings() public view returns (uint256[])',
        'function updateListingPrice(uint256 _listingId, uint256 _newPrice) public',
        'event PropertyListed(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 price)',
        'event PropertySold(uint256 indexed listingId, uint256 indexed tokenId, address indexed buyer, uint256 price)',
        'event ListingCancelled(uint256 indexed listingId)',
        'event EscrowDeposited(address indexed payer, uint256 amount, bytes32 reference)'
      ],
      staking: [
        'function stake(uint256 amount) public',
        'function unstake(uint256 amount) public',
        'function claimRewards() public',
        'function getStakedAmount(address user) public view returns (uint256)',
        'function getPendingRewards(address user) public view returns (uint256)',
        'function getTotalStaked() public view returns (uint256)',
        'function getAPY() public view returns (uint256)',
        'event Staked(address indexed user, uint256 amount)',
        'event Unstaked(address indexed user, uint256 amount)',
        'event RewardsClaimed(address indexed user, uint256 amount)'
      ],
      dao: [
        'function createProposal(string memory _description, uint256 _votingPeriod) public returns (uint256)',
        'function vote(uint256 _proposalId, bool _support) public',
        'function executeProposal(uint256 _proposalId) public',
        'function getProposal(uint256 _proposalId) public view returns (tuple(string description, uint256 votesFor, uint256 votesAgainst, uint256 endTime, bool executed, address proposer))',
        'function getActiveProposals() public view returns (uint256[])',
        'function hasVoted(uint256 _proposalId, address _voter) public view returns (bool)',
        'event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description)',
        'event Voted(uint256 indexed proposalId, address indexed voter, bool support)',
        'event ProposalExecuted(uint256 indexed proposalId)'
      ]
    };

    this.initialize();
  }

  async initialize() {
    try {
      if (typeof window.ethereum === 'undefined') {
        console.warn('MetaMask not detected');
        return false;
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Initialize provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();

      // Check current network
      const network = await this.provider.getNetwork();
      await this.switchToOptimalNetwork();

      // Initialize contracts
      await this.initializeContracts();

      // Setup event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      console.log('✅ Blockchain service initialized');
      
      return true;
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error);
      toast.error('Erreur d\'initialisation blockchain');
      return false;
    }
  }

  async switchToOptimalNetwork() {
    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const targetNetwork = this.networks[this.currentNetwork];

      if (parseInt(currentChainId, 16) !== targetNetwork.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${targetNetwork.chainId.toString(16)}` }]
          });
        } catch (switchError) {
          // Network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [targetNetwork]
            });
          } else {
            throw switchError;
          }
        }
      }

      console.log(`✅ Switched to ${targetNetwork.name}`);
    } catch (error) {
      console.error('❌ Network switch failed:', error);
      toast.error('Erreur de changement de réseau');
    }
  }

  async initializeContracts() {
    try {
      const network = this.networks[this.currentNetwork];
      
      // Initialize all contracts
      this.contracts = {
        property: new ethers.Contract(
          network.contracts.terangaProperty,
          this.contractABIs.property,
          this.signer
        ),
        token: new ethers.Contract(
          network.contracts.terangaToken,
          this.contractABIs.token,
          this.signer
        ),
        nft: new ethers.Contract(
          network.contracts.terangaNFT,
          this.contractABIs.nft,
          this.signer
        ),
        marketplace: new ethers.Contract(
          network.contracts.terangaMarketplace,
          this.contractABIs.marketplace,
          this.signer
        ),
        staking: new ethers.Contract(
          network.contracts.terangaStaking,
          this.contractABIs.staking,
          this.signer
        ),
        dao: new ethers.Contract(
          network.contracts.terangaDAO,
          this.contractABIs.dao,
          this.signer
        )
      };

      console.log('✅ Contracts initialized');
    } catch (error) {
      console.error('❌ Contract initialization failed:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Account change listener
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        await this.initialize();
        window.location.reload();
      }
    });

    // Network change listener
    window.ethereum.on('chainChanged', async (chainId) => {
      await this.initialize();
      window.location.reload();
    });

    // Contract event listeners
    this.setupContractEventListeners();
  }

  setupContractEventListeners() {
    if (!this.contracts.property) return;

    // Property events
    this.contracts.property.on('PropertyCreated', (tokenId, owner, title, price) => {
      console.log('🏠 New property created:', { tokenId: tokenId.toString(), owner, title, price: ethers.utils.formatEther(price) });
      toast.success(`Propriété "${title}" créée avec succès!`);
    });

    this.contracts.property.on('PropertyVerified', (tokenId, verifier) => {
      console.log('✅ Property verified:', { tokenId: tokenId.toString(), verifier });
      toast.success('Propriété vérifiée avec succès!');
    });

    // Token events
    this.contracts.token.on('Transfer', (from, to, amount) => {
      console.log('💰 Token transfer:', { from, to, amount: ethers.utils.formatEther(amount) });
    });

    // Marketplace events
    this.contracts.marketplace.on('PropertyListed', (listingId, tokenId, seller, price) => {
      console.log('🏪 Property listed:', { listingId: listingId.toString(), tokenId: tokenId.toString(), seller, price: ethers.utils.formatEther(price) });
      toast.success('Propriété mise en vente!');
    });

    this.contracts.marketplace.on('PropertySold', (listingId, tokenId, buyer, price) => {
      console.log('🎉 Property sold:', { listingId: listingId.toString(), tokenId: tokenId.toString(), buyer, price: ethers.utils.formatEther(price) });
      toast.success('Propriété vendue avec succès!');
    });

    // Escrow deposit event if available
    try {
      this.contracts.marketplace.on('EscrowDeposited', (payer, amount, reference) => {
        console.log('💼 Escrow deposit:', { payer, amount: ethers.utils.formatEther(amount), reference });
        toast.success('Dépôt d\'escrow confirmé');
      });
    } catch (e) {
      console.warn('Escrow event not available on marketplace contract');
    }
  }

  // Property Management
  async createProperty(propertyData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { title, description, price, location, imageHash } = propertyData;
      const priceInWei = ethers.utils.parseEther(price.toString());

      const tx = await this.contracts.property.createProperty(
        title,
        description,
        priceInWei,
        location,
        imageHash
      );

      toast.loading('Création de la propriété en cours...', { id: 'create-property' });
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'PropertyCreated');
      const tokenId = event.args.tokenId.toString();

      toast.success('Propriété créée avec succès!', { id: 'create-property' });
      
      return {
        success: true,
        tokenId,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Create property failed:', error);
      toast.error('Erreur lors de la création', { id: 'create-property' });
      throw error;
    }
  }

  async getProperty(tokenId) {
    try {
      const property = await this.contracts.property.getProperty(tokenId);
      return {
        title: property.title,
        description: property.description,
        price: ethers.utils.formatEther(property.price),
        location: property.location,
        imageHash: property.imageHash,
        owner: property.owner,
        isVerified: property.isVerified,
        createdAt: new Date(property.createdAt.toNumber() * 1000)
      };
    } catch (error) {
      console.error('❌ Get property failed:', error);
      throw error;
    }
  }

  async verifyProperty(tokenId) {
    try {
      const tx = await this.contracts.property.verifyProperty(tokenId);
      toast.loading('Vérification en cours...', { id: 'verify-property' });
      
      await tx.wait();
      toast.success('Propriété vérifiée!', { id: 'verify-property' });
      
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error('❌ Verify property failed:', error);
      toast.error('Erreur de vérification', { id: 'verify-property' });
      throw error;
    }
  }

  async getPropertiesByOwner(ownerAddress) {
    try {
      const tokenIds = await this.contracts.property.getPropertiesByOwner(ownerAddress);
      const properties = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const property = await this.getProperty(tokenId.toString());
          return { ...property, tokenId: tokenId.toString() };
        })
      );
      return properties;
    } catch (error) {
      console.error('❌ Get properties by owner failed:', error);
      throw error;
    }
  }

  // Token Management
  async getTokenBalance(address) {
    try {
      const balance = await this.contracts.token.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('❌ Get token balance failed:', error);
      throw error;
    }
  }

  async transferTokens(to, amount) {
    try {
      const amountInWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contracts.token.transfer(to, amountInWei);
      
      toast.loading('Transfert en cours...', { id: 'transfer-tokens' });
      await tx.wait();
      toast.success('Transfert réussi!', { id: 'transfer-tokens' });
      
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error('❌ Transfer tokens failed:', error);
      toast.error('Erreur de transfert', { id: 'transfer-tokens' });
      throw error;
    }
  }

  async stakeTokens(amount) {
    try {
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      // Approve staking contract first
      const approveTx = await this.contracts.token.approve(
        this.networks[this.currentNetwork].contracts.terangaStaking,
        amountInWei
      );
      await approveTx.wait();

      // Stake tokens
      const stakeTx = await this.contracts.staking.stake(amountInWei);
      
      toast.loading('Mise en staking...', { id: 'stake-tokens' });
      await stakeTx.wait();
      toast.success('Tokens mis en staking!', { id: 'stake-tokens' });
      
      return { success: true, transactionHash: stakeTx.hash };
    } catch (error) {
      console.error('❌ Stake tokens failed:', error);
      toast.error('Erreur de staking', { id: 'stake-tokens' });
      throw error;
    }
  }

  async getStakingInfo(address) {
    try {
      const [stakedAmount, pendingRewards, totalStaked, apy] = await Promise.all([
        this.contracts.staking.getStakedAmount(address),
        this.contracts.staking.getPendingRewards(address),
        this.contracts.staking.getTotalStaked(),
        this.contracts.staking.getAPY()
      ]);

      return {
        stakedAmount: ethers.utils.formatEther(stakedAmount),
        pendingRewards: ethers.utils.formatEther(pendingRewards),
        totalStaked: ethers.utils.formatEther(totalStaked),
        apy: apy.toNumber() / 100 // Convert from basis points
      };
    } catch (error) {
      console.error('❌ Get staking info failed:', error);
      throw error;
    }
  }

  // Marketplace Management
  async listProperty(tokenId, price) {
    try {
      // Approve marketplace contract to transfer NFT
      const approveTx = await this.contracts.property.approve(
        this.networks[this.currentNetwork].contracts.terangaMarketplace,
        tokenId
      );
      await approveTx.wait();

      // List property
      const priceInWei = ethers.utils.parseEther(price.toString());
      const listTx = await this.contracts.marketplace.listProperty(tokenId, priceInWei);
      
      toast.loading('Mise en vente...', { id: 'list-property' });
      const receipt = await listTx.wait();
      toast.success('Propriété mise en vente!', { id: 'list-property' });
      
      return { success: true, transactionHash: receipt.transactionHash };
    } catch (error) {
      console.error('❌ List property failed:', error);
      toast.error('Erreur de mise en vente', { id: 'list-property' });
      throw error;
    }
  }

  async buyProperty(listingId, price) {
    try {
      const priceInWei = ethers.utils.parseEther(price.toString());
      const tx = await this.contracts.marketplace.buyProperty(listingId, {
        value: priceInWei
      });
      
      toast.loading('Achat en cours...', { id: 'buy-property' });
      await tx.wait();
      toast.success('Propriété achetée!', { id: 'buy-property' });
      
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error('❌ Buy property failed:', error);
      toast.error('Erreur d\'achat', { id: 'buy-property' });
      throw error;
    }
  }

  async getActiveListings() {
    try {
      const listingIds = await this.contracts.marketplace.getActiveListings();
      const listings = await Promise.all(
        listingIds.map(async (listingId) => {
          const listing = await this.contracts.marketplace.getListing(listingId);
          const property = await this.getProperty(listing.tokenId.toString());
          
          return {
            listingId: listingId.toString(),
            tokenId: listing.tokenId.toString(),
            seller: listing.seller,
            price: ethers.utils.formatEther(listing.price),
            isActive: listing.isActive,
            createdAt: new Date(listing.createdAt.toNumber() * 1000),
            property
          };
        })
      );
      return listings.filter(listing => listing.isActive);
    } catch (error) {
      console.error('❌ Get active listings failed:', error);
      throw error;
    }
  }

  // DAO Management
  async createProposal(description, votingPeriodDays) {
    try {
      const votingPeriod = votingPeriodDays * 24 * 60 * 60; // Convert to seconds
      const tx = await this.contracts.dao.createProposal(description, votingPeriod);
      
      toast.loading('Création de proposition...', { id: 'create-proposal' });
      const receipt = await tx.wait();
      toast.success('Proposition créée!', { id: 'create-proposal' });
      
      return { success: true, transactionHash: receipt.transactionHash };
    } catch (error) {
      console.error('❌ Create proposal failed:', error);
      toast.error('Erreur de création', { id: 'create-proposal' });
      throw error;
    }
  }

  async vote(proposalId, support) {
    try {
      const tx = await this.contracts.dao.vote(proposalId, support);
      
      toast.loading('Vote en cours...', { id: 'vote' });
      await tx.wait();
      toast.success('Vote enregistré!', { id: 'vote' });
      
      return { success: true, transactionHash: tx.hash };
    } catch (error) {
      console.error('❌ Vote failed:', error);
      toast.error('Erreur de vote', { id: 'vote' });
      throw error;
    }
  }

  // On-chain escrow payment helper (native coin) with optional reference
  async payEscrowNative(amount, reference) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      const valueWei = ethers.utils.parseEther(amount.toString());
      const marketplaceAddr = this.networks[this.currentNetwork].contracts.terangaMarketplace;
      let tx;
      if (this.contracts.marketplace?.depositEscrow) {
        const refBytes32 = ethers.utils.id(String(reference ?? ''));
        tx = await this.contracts.marketplace.depositEscrow(refBytes32, { value: valueWei });
      } else {
        tx = await this.signer.sendTransaction({ to: marketplaceAddr, value: valueWei });
      }
      toast.loading('Paiement on-chain en cours...', { id: 'escrow-pay' });
      const receipt = await tx.wait();
      toast.success('Paiement on-chain confirmé', { id: 'escrow-pay' });
      return { success: true, transactionHash: receipt.transactionHash };
    } catch (error) {
      console.error('❌ Escrow payment failed:', error);
      toast.error('Échec du paiement on-chain', { id: 'escrow-pay' });
      throw error;
    }
  }

  // Simple proof NFT mint
  async mintProofNFT(toAddress, tokenURI) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      const tx = await this.contracts.nft.mint(toAddress, tokenURI);
      toast.loading('Émission du NFT de preuve...', { id: 'mint-proof' });
      const receipt = await tx.wait();
      const transferEvent = receipt.events?.find(e => e.event === 'Transfer');
      const tokenId = transferEvent?.args?.tokenId?.toString?.() ?? null;
      toast.success('NFT de preuve émis', { id: 'mint-proof' });
      return { success: true, tokenId, transactionHash: receipt.transactionHash };
    } catch (error) {
      console.error('❌ Mint proof NFT failed:', error);
      toast.error('Échec du mint', { id: 'mint-proof' });
      throw error;
    }
  }

  async getActiveProposals() {
    try {
      const proposalIds = await this.contracts.dao.getActiveProposals();
      const proposals = await Promise.all(
        proposalIds.map(async (proposalId) => {
          const proposal = await this.contracts.dao.getProposal(proposalId);
          
          return {
            id: proposalId.toString(),
            description: proposal.description,
            votesFor: proposal.votesFor.toString(),
            votesAgainst: proposal.votesAgainst.toString(),
            endTime: new Date(proposal.endTime.toNumber() * 1000),
            executed: proposal.executed,
            proposer: proposal.proposer
          };
        })
      );
      return proposals;
    } catch (error) {
      console.error('❌ Get active proposals failed:', error);
      throw error;
    }
  }

  // Utility functions
  async getWalletAddress() {
    try {
      if (!this.signer) {
        console.log('Wallet non connecté');
        return null;
      }
      return await this.signer.getAddress();
    } catch (error) {
      console.error('❌ Get wallet address failed:', error);
      return null;
    }
  }

  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: network.chainId,
        name: network.name,
        current: this.networks[this.currentNetwork]
      };
    } catch (error) {
      console.error('❌ Get network info failed:', error);
      return null;
    }
  }

  async getGasPrice() {
    try {
      const gasPrice = await this.provider.getGasPrice();
      return ethers.utils.formatUnits(gasPrice, 'gwei');
    } catch (error) {
      console.error('❌ Get gas price failed:', error);
      return null;
    }
  }

  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  formatAmount(amount, decimals = 4) {
    if (!amount) return '0';
    return parseFloat(amount).toFixed(decimals);
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.isInitialized = false;
    console.log('🔌 Blockchain service disconnected');
  }
}

// Export singleton instance
export const terangaBlockchain = new TerangaBlockchainService();
export default terangaBlockchain;
