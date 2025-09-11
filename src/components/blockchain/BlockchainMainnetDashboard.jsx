import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Globe, 
  Coins, 
  TrendingUp, 
  Shield, 
  Zap,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Activity,
  Users,
  Vote,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { terangaBlockchain } from '@/services/TerangaBlockchainService';
import { toast } from 'react-hot-toast';

const BlockchainMainnetDashboard = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [networkInfo, setNetworkInfo] = useState(null);
  const [balances, setBalances] = useState({
    native: '0',
    teranga: '0',
    staked: '0',
    rewards: '0'
  });
  const [properties, setProperties] = useState([]);
  const [listings, setListings] = useState([]);
  const [stakingInfo, setStakingInfo] = useState({
    stakedAmount: '0',
    pendingRewards: '0',
    totalStaked: '0',
    apy: 0
  });
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gasPrice, setGasPrice] = useState('0');

  // Form states
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imageHash: ''
  });
  const [transferForm, setTransferForm] = useState({
    to: '',
    amount: ''
  });
  const [stakeForm, setStakeForm] = useState({
    amount: ''
  });
  const [proposalForm, setProposalForm] = useState({
    description: '',
    votingPeriod: 7
  });

  useEffect(() => {
    initializeBlockchain();
  }, []);

  const initializeBlockchain = async () => {
    setLoading(true);
    try {
      const initialized = await terangaBlockchain.initialize();
      if (initialized) {
        setIsConnected(true);
        await loadBlockchainData();
      }
    } catch (error) {
      console.error('Blockchain initialization failed:', error);
      toast.error('Erreur d\'initialisation blockchain');
    } finally {
      setLoading(false);
    }
  };

  const loadBlockchainData = async () => {
    try {
      // Get wallet address
      const address = await terangaBlockchain.getWalletAddress();
      setWalletAddress(address);

      // Get network info
      const network = await terangaBlockchain.getNetworkInfo();
      setNetworkInfo(network);

      // Get gas price
      const gas = await terangaBlockchain.getGasPrice();
      setGasPrice(gas);

      if (address) {
        // Get balances
        const [nativeBalance, terangaBalance] = await Promise.all([
          terangaBlockchain.provider.getBalance(address),
          terangaBlockchain.getTokenBalance(address)
        ]);

        setBalances(prev => ({
          ...prev,
          native: terangaBlockchain.formatAmount(ethers.utils.formatEther(nativeBalance)),
          teranga: terangaBlockchain.formatAmount(terangaBalance)
        }));

        // Get staking info
        const staking = await terangaBlockchain.getStakingInfo(address);
        setStakingInfo(staking);

        // Get user properties
        const userProperties = await terangaBlockchain.getPropertiesByOwner(address);
        setProperties(userProperties);
      }

      // Get marketplace listings
      const activeListings = await terangaBlockchain.getActiveListings();
      setListings(activeListings);

      // Get DAO proposals
      const activeProposals = await terangaBlockchain.getActiveProposals();
      setProposals(activeProposals);

    } catch (error) {
      console.error('Failed to load blockchain data:', error);
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await terangaBlockchain.createProperty(propertyForm);
      if (result.success) {
        setPropertyForm({
          title: '',
          description: '',
          price: '',
          location: '',
          imageHash: ''
        });
        await loadBlockchainData();
      }
    } catch (error) {
      console.error('Create property failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferTokens = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await terangaBlockchain.transferTokens(transferForm.to, transferForm.amount);
      if (result.success) {
        setTransferForm({ to: '', amount: '' });
        await loadBlockchainData();
      }
    } catch (error) {
      console.error('Transfer tokens failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStakeTokens = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await terangaBlockchain.stakeTokens(stakeForm.amount);
      if (result.success) {
        setStakeForm({ amount: '' });
        await loadBlockchainData();
      }
    } catch (error) {
      console.error('Stake tokens failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await terangaBlockchain.createProposal(
        proposalForm.description, 
        proposalForm.votingPeriod
      );
      if (result.success) {
        setProposalForm({ description: '', votingPeriod: 7 });
        await loadBlockchainData();
      }
    } catch (error) {
      console.error('Create proposal failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId, support) => {
    setLoading(true);
    try {
      const result = await terangaBlockchain.vote(proposalId, support);
      if (result.success) {
        await loadBlockchainData();
      }
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('CopiÃ© dans le presse-papier');
  };

  const openInExplorer = (hash) => {
    const explorerUrl = networkInfo?.current?.blockExplorer;
    if (explorerUrl) {
      window.open(`${explorerUrl}/tx/${hash}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Connecter Votre Wallet</CardTitle>
            <p className="text-sm text-gray-600">
              Connectez votre wallet pour accÃ©der aux fonctionnalitÃ©s blockchain
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={initializeBlockchain}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4 mr-2" />
              )}
              Connecter MetaMask
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Blockchain Mainnet</h1>
            <p className="text-blue-200">Gestion dÃ©centralisÃ©e des actifs immobiliers</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              {networkInfo?.current?.name}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              Gas: {gasPrice} Gwei
            </Badge>
          </div>
        </motion.div>

        {/* Wallet Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Informations Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-blue-200">Adresse</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="bg-black/20 px-2 py-1 rounded text-sm">
                      {terangaBlockchain.formatAddress(walletAddress)}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(walletAddress)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-blue-200">RÃ©seau</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Globe className="h-4 w-4 text-green-400" />
                    <span>{networkInfo?.current?.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Balances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {networkInfo?.current?.nativeCurrency?.symbol}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balances.native}</div>
              <p className="text-xs text-blue-200">Balance native</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Coins className="h-4 w-4 mr-1" />
                TERANGA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balances.teranga}</div>
              <p className="text-xs text-purple-200">Tokens Teranga</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                Staked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stakingInfo.stakedAmount}</div>
              <p className="text-xs text-green-200">Tokens en staking</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stakingInfo.pendingRewards}</div>
              <p className="text-xs text-orange-200">RÃ©compenses en attente</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="properties" className="space-y-4">
            <TabsList className="bg-white/10 backdrop-blur-lg border-white/20">
              <TabsTrigger value="properties" className="data-[state=active]:bg-white/20">
                PropriÃ©tÃ©s NFT
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="data-[state=active]:bg-white/20">
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="staking" className="data-[state=active]:bg-white/20">
                Staking
              </TabsTrigger>
              <TabsTrigger value="dao" className="data-[state=active]:bg-white/20">
                DAO
              </TabsTrigger>
              <TabsTrigger value="defi" className="data-[state=active]:bg-white/20">
                DeFi
              </TabsTrigger>
            </TabsList>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Create Property */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>CrÃ©er une PropriÃ©tÃ© NFT</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateProperty} className="space-y-4">
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={propertyForm.title}
                          onChange={(e) => setPropertyForm(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          YOUR_API_KEY="Villa moderne Ã  Dakar"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={propertyForm.description}
                          onChange={(e) => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          YOUR_API_KEY="Description dÃ©taillÃ©e..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Prix (MATIC)</Label>
                          <Input
                            type="number"
                            value={propertyForm.price}
                            onChange={(e) => setPropertyForm(prev => ({ ...prev, price: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white"
                            YOUR_API_KEY="100"
                          />
                        </div>
                        <div>
                          <Label>Localisation</Label>
                          <Input
                            value={propertyForm.location}
                            onChange={(e) => setPropertyForm(prev => ({ ...prev, location: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white"
                            YOUR_API_KEY="Dakar, SÃ©nÃ©gal"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Hash IPFS de l'image</Label>
                        <Input
                          value={propertyForm.imageHash}
                          onChange={(e) => setPropertyForm(prev => ({ ...prev, imageHash: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          YOUR_API_KEY="QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                        CrÃ©er NFT
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* My Properties */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Mes PropriÃ©tÃ©s ({properties.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {properties.map((property, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{property.title}</h4>
                              <p className="text-sm text-gray-300">{property.location}</p>
                              <p className="text-xs text-blue-200">{property.price} MATIC</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {property.isVerified && (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                              <Badge variant={property.isVerified ? 'default' : 'secondary'}>
                                Token #{property.tokenId}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      {properties.length === 0 && (
                        <p className="text-center text-gray-400 py-8">
                          Aucune propriÃ©tÃ© crÃ©Ã©e
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-4">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Marketplace ({listings.length} annonces)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4">
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-3"></div>
                        <h4 className="font-medium mb-2">{listing.property.title}</h4>
                        <p className="text-sm text-gray-300 mb-2">{listing.property.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-400">{listing.price} MATIC</span>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            onClick={() => terangaBlockchain.buyProperty(listing.listingId, listing.price)}
                          >
                            Acheter
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Vendeur: {terangaBlockchain.formatAddress(listing.seller)}
                        </div>
                      </div>
                    ))}
                    {listings.length === 0 && (
                      <div className="col-span-full text-center text-gray-400 py-8">
                        Aucune propriÃ©tÃ© en vente
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Staking Tab */}
            <TabsContent value="staking" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Staking Form */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Staking TERANGA</CardTitle>
                    <p className="text-sm text-gray-300">
                      APY actuel: {stakingInfo.apy}%
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleStakeTokens} className="space-y-4">
                      <div>
                        <Label>Montant Ã  staker</Label>
                        <Input
                          type="number"
                          value={stakeForm.amount}
                          onChange={(e) => setStakeForm({ amount: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          YOUR_API_KEY="100"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                        Staker les tokens
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Staking Stats */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Statistiques de Staking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Total stakÃ© dans le protocole</span>
                        <span>{stakingInfo.totalStaked} TERANGA</span>
                      </div>
                      <Progress value={75} className="mt-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Vos tokens stakÃ©s</span>
                        <span>{stakingInfo.stakedAmount} TERANGA</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>RÃ©compenses disponibles</span>
                        <span className="text-green-400">{stakingInfo.pendingRewards} TERANGA</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                      disabled={parseFloat(stakingInfo.pendingRewards) === 0}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      RÃ©clamer les rÃ©compenses
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* DAO Tab */}
            <TabsContent value="dao" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Create Proposal */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>CrÃ©er une Proposition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateProposal} className="space-y-4">
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={proposalForm.description}
                          onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          YOUR_API_KEY="Proposer une nouvelle fonctionnalitÃ©..."
                        />
                      </div>
                      <div>
                        <Label>PÃ©riode de vote (jours)</Label>
                        <Input
                          type="number"
                          value={proposalForm.votingPeriod}
                          onChange={(e) => setProposalForm(prev => ({ ...prev, votingPeriod: parseInt(e.target.value) }))}
                          className="bg-white/10 border-white/20 text-white"
                          min="1"
                          max="30"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      >
                        {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Vote className="h-4 w-4 mr-2" />}
                        CrÃ©er la proposition
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Active Proposals */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Propositions Actives ({proposals.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {proposals.map((proposal, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3">
                          <h4 className="font-medium mb-2">{proposal.description}</h4>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Pour: {proposal.votesFor}</span>
                            <span>Contre: {proposal.votesAgainst}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleVote(proposal.id, true)}
                            >
                              Pour
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                              onClick={() => handleVote(proposal.id, false)}
                            >
                              Contre
                            </Button>
                          </div>
                        </div>
                      ))}
                      {proposals.length === 0 && (
                        <p className="text-center text-gray-400 py-8">
                          Aucune proposition active
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* DeFi Tab */}
            <TabsContent value="defi" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Token Transfer */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Transfert de Tokens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTransferTokens} className="space-y-4">
                      <div>
                        <Label>Adresse destinataire</Label>
                        <Input
                          value={transferForm.to}
                          onChange={(e) => setTransferForm(prev => ({ ...prev, to: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          YOUR_API_KEY="0x..."
                        />
                      </div>
                      <div>
                        <Label>Montant (TERANGA)</Label>
                        <Input
                          type="number"
                          value={transferForm.amount}
                          onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          YOUR_API_KEY="10"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      >
                        {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
                        TransfÃ©rer
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* DeFi Stats */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Statistiques DeFi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">${(parseFloat(balances.teranga) * 0.15).toFixed(2)}</div>
                        <div className="text-xs text-gray-400">Valeur Portfolio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">+12.5%</div>
                        <div className="text-xs text-gray-400">Performance 24h</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>LiquiditÃ© fournie</span>
                        <span>0 TERANGA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Frais collectÃ©s</span>
                        <span className="text-green-400">0 TERANGA</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                      disabled
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      BientÃ´t disponible
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-4"
        >
          <Button 
            onClick={loadBlockchainData}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          
          <Button 
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => openInExplorer('')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Explorer
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BlockchainMainnetDashboard;
