import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  ArrowUpDown,
  Coins,
  Wallet,
  Shield,
  Zap,
  Target,
  Repeat,
  Lock,
  Unlock,
  Timer,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { terangaBlockchain } from '@/services/TerangaBlockchainService';
import { toast } from 'react-hot-toast';

const DeFiNFTMarketplace = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('liquidity');
  const [loading, setLoading] = useState(false);
  
  // DeFi States
  const [defiStats, setDefiStats] = useState({
    totalValueLocked: '0',
    totalRewards: '0',
    myLiquidity: '0',
    myRewards: '0',
    apy: 0,
    volume24h: '0'
  });

  const [liquidityForm, setLiquidityForm] = useState({
    tokenA: 'TERANGA',
    tokenB: 'MATIC',
    amountA: '',
    amountB: '',
    slippage: 0.5,
    deadline: 20
  });

  const [swapForm, setSwapForm] = useState({
    fromToken: 'MATIC',
    toToken: 'TERANGA',
    fromAmount: '',
    toAmount: '',
    slippage: 0.5,
    priceImpact: 0
  });

  const [farmingPools, setFarmingPools] = useState([
    {
      id: 1,
      name: 'TERANGA-MATIC LP',
      apy: 125.6,
      tvl: '2,450,000',
      myStake: '0',
      rewards: '0',
      lockPeriod: 0,
      isActive: true
    },
    {
      id: 2,
      name: 'TERANGA Single Stake',
      apy: 85.2,
      tvl: '1,850,000',
      myStake: '0',
      rewards: '0',
      lockPeriod: 30,
      isActive: true
    },
    {
      id: 3,
      name: 'Real Estate Pool',
      apy: 95.4,
      tvl: '3,200,000',
      myStake: '0',
      rewards: '0',
      lockPeriod: 90,
      isActive: true
    }
  ]);

  // NFT States
  const [nftCollections, setNftCollections] = useState([
    {
      id: 1,
      name: 'Teranga Properties',
      description: 'Propriétés immobilières tokenisées au Sénégal',
      floorPrice: '50',
      volume: '12,500',
      items: 1245,
      owners: 892,
      image: '/api/YOUR_API_KEY/400/300'
    },
    {
      id: 2,
      name: 'Dakar Luxury Villas',
      description: 'Villas de luxe dans les quartiers premium de Dakar',
      floorPrice: '250',
      volume: '45,800',
      items: 156,
      owners: 98,
      image: '/api/YOUR_API_KEY/400/300'
    }
  ]);

  const [nftListings, setNftListings] = useState([
    {
      id: 1,
      tokenId: '001',
      name: 'Villa Moderne Almadies',
      collection: 'Teranga Properties',
      price: '75',
      image: '/api/YOUR_API_KEY/300/300',
      seller: '0x1234...5678',
      rarity: 'Rare',
      traits: ['Prime Location', 'Ocean View', 'Modern Design']
    },
    {
      id: 2,
      tokenId: '045',
      name: 'Appartement Centre-Ville',
      collection: 'Teranga Properties',
      price: '35',
      image: '/api/YOUR_API_KEY/300/300',
      seller: '0x8765...4321',
      rarity: 'Common',
      traits: ['City Center', 'Furnished', 'Parking']
    }
  ]);

  useEffect(() => {
    loadDeFiData();
  }, []);

  const loadDeFiData = async () => {
    setLoading(true);
    try {
      // Simulate DeFi data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDefiStats({
        totalValueLocked: '15,750,000',
        totalRewards: '2,350,000',
        myLiquidity: '1,250',
        myRewards: '145.50',
        apy: 95.4,
        volume24h: '850,000'
      });
    } catch (error) {
      console.error('Failed to load DeFi data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSwapOutput = (inputAmount, fromToken, toToken) => {
    // Simplified swap calculation (in real implementation, use actual AMM formulas)
    const exchangeRate = fromToken === 'MATIC' ? 6.67 : 0.15; // MATIC to TERANGA and vice versa
    const slippageMultiplier = 1 - (swapForm.slippage / 100);
    return (parseFloat(inputAmount) * exchangeRate * slippageMultiplier).toFixed(4);
  };

  const handleSwapAmountChange = (value, field) => {
    const newSwapForm = { ...swapForm };
    
    if (field === 'fromAmount') {
      newSwapForm.fromAmount = value;
      newSwapForm.toAmount = calculateSwapOutput(value, swapForm.fromToken, swapForm.toToken);
    } else {
      newSwapForm.toAmount = value;
      newSwapForm.fromAmount = calculateSwapOutput(value, swapForm.toToken, swapForm.fromToken);
    }
    
    // Calculate price impact
    const impact = Math.min((parseFloat(value) / 10000) * 100, 15);
    newSwapForm.priceImpact = impact;
    
    setSwapForm(newSwapForm);
  };

  const executeSwap = async () => {
    if (!swapForm.fromAmount || parseFloat(swapForm.fromAmount) <= 0) {
      toast.error('Montant invalide');
      return;
    }

    setLoading(true);
    try {
      toast.loading('Échange en cours...', { id: 'swap' });
      
      // Simulate swap transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Échange réussi: ${swapForm.fromAmount} ${swapForm.fromToken} â†’ ${swapForm.toAmount} ${swapForm.toToken}`, { id: 'swap' });
      
      setSwapForm(prev => ({ ...prev, fromAmount: '', toAmount: '' }));
      await loadDeFiData();
    } catch (error) {
      toast.error('Erreur lors de l\'échange', { id: 'swap' });
    } finally {
      setLoading(false);
    }
  };

  const addLiquidity = async () => {
    if (!liquidityForm.amountA || !liquidityForm.amountB) {
      toast.error('Veuillez saisir les montants');
      return;
    }

    setLoading(true);
    try {
      toast.loading('Ajout de liquidité...', { id: 'liquidity' });
      
      // Simulate liquidity addition
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast.success(`Liquidité ajoutée: ${liquidityForm.amountA} ${liquidityForm.tokenA} + ${liquidityForm.amountB} ${liquidityForm.tokenB}`, { id: 'liquidity' });
      
      setLiquidityForm(prev => ({ ...prev, amountA: '', amountB: '' }));
      await loadDeFiData();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de liquidité', { id: 'liquidity' });
    } finally {
      setLoading(false);
    }
  };

  const stakeInFarm = async (poolId, amount) => {
    setLoading(true);
    try {
      toast.loading('Mise en farming...', { id: 'farm' });
      
      // Simulate farming stake
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${amount} tokens mis en farming!`, { id: 'farm' });
      
      // Update pool data
      setFarmingPools(pools => 
        pools.map(pool => 
          pool.id === poolId 
            ? { ...pool, myStake: (parseFloat(pool.myStake) + parseFloat(amount)).toString() }
            : pool
        )
      );
    } catch (error) {
      toast.error('Erreur de farming', { id: 'farm' });
    } finally {
      setLoading(false);
    }
  };

  const buyNFT = async (nftId, price) => {
    setLoading(true);
    try {
      toast.loading('Achat du NFT...', { id: 'buy-nft' });
      
      // Simulate NFT purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`NFT acheté pour ${price} MATIC!`, { id: 'buy-nft' });
      
      // Remove from listings
      setNftListings(listings => listings.filter(nft => nft.id !== nftId));
    } catch (error) {
      toast.error('Erreur lors de l\'achat', { id: 'buy-nft' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">DeFi & NFT Marketplace</h1>
          <p className="text-purple-200">Écosystème financier décentralisé pour l'immobilier</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                TVL Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${defiStats.totalValueLocked}</div>
              <p className="text-xs text-blue-200">+12.5% cette semaine</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Volume 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${defiStats.volume24h}</div>
              <p className="text-xs text-green-200">+8.2% depuis hier</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Coins className="h-4 w-4 mr-2" />
                Ma Liquidité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${defiStats.myLiquidity}</div>
              <p className="text-xs text-purple-200">Dans 3 pools</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Récompenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{defiStats.myRewards} TERANGA</div>
              <p className="text-xs text-orange-200">APY: {defiStats.apy}%</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white/10 backdrop-blur-lg border-white/20 grid grid-cols-5">
              <TabsTrigger value="swap" className="data-[state=active]:bg-white/20 text-white">
                Échange
              </TabsTrigger>
              <TabsTrigger value="liquidity" className="data-[state=active]:bg-white/20 text-white">
                Liquidité
              </TabsTrigger>
              <TabsTrigger value="farming" className="data-[state=active]:bg-white/20 text-white">
                Farming
              </TabsTrigger>
              <TabsTrigger value="nft-collections" className="data-[state=active]:bg-white/20 text-white">
                Collections NFT
              </TabsTrigger>
              <TabsTrigger value="nft-marketplace" className="data-[state=active]:bg-white/20 text-white">
                Marketplace
              </TabsTrigger>
            </TabsList>

            {/* Swap Tab */}
            <TabsContent value="swap" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ArrowUpDown className="h-5 w-5" />
                      <span>Échange de Tokens</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* From Token */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label>De</Label>
                        <span className="text-xs text-gray-300">Balance: 1,250.50</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={swapForm.fromAmount}
                          onChange={(e) => handleSwapAmountChange(e.target.value, 'fromAmount')}
                          className="bg-transparent border-0 text-xl font-bold p-0 focus:ring-0"
                          placeholder="0.0"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          {swapForm.fromToken}
                        </Button>
                      </div>
                    </div>

                    {/* Swap Icon */}
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => setSwapForm(prev => ({
                          ...prev,
                          fromToken: prev.toToken,
                          toToken: prev.fromToken,
                          fromAmount: prev.toAmount,
                          toAmount: prev.fromAmount
                        }))}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* To Token */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Vers</Label>
                        <span className="text-xs text-gray-300">Balance: 8,456.78</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={swapForm.toAmount}
                          onChange={(e) => handleSwapAmountChange(e.target.value, 'toAmount')}
                          className="bg-transparent border-0 text-xl font-bold p-0 focus:ring-0"
                          placeholder="0.0"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          {swapForm.toToken}
                        </Button>
                      </div>
                    </div>

                    {/* Swap Details */}
                    {swapForm.fromAmount && (
                      <div className="bg-white/5 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Taux de change</span>
                          <span>1 {swapForm.fromToken} = {calculateSwapOutput('1', swapForm.fromToken, swapForm.toToken)} {swapForm.toToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Slippage</span>
                          <span>{swapForm.slippage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact sur le prix</span>
                          <span className={swapForm.priceImpact > 5 ? 'text-red-400' : 'text-green-400'}>
                            {swapForm.priceImpact.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Slippage Settings */}
                    <div className="space-y-2">
                      <Label>Slippage toléré: {swapForm.slippage}%</Label>
                      <Slider
                        value={[swapForm.slippage]}
                        onValueChange={(value) => setSwapForm(prev => ({ ...prev, slippage: value[0] }))}
                        max={5}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <Button 
                      onClick={executeSwap}
                      disabled={loading || !swapForm.fromAmount}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Échanger
                    </Button>
                  </CardContent>
                </Card>

                {/* Swap Statistics */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Statistiques d'Échange</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">$45,230</div>
                        <div className="text-xs text-gray-400">Volume personnel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">142</div>
                        <div className="text-xs text-gray-400">Échanges réalisés</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>TERANGA/MATIC</span>
                          <span className="text-green-400">+2.5%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>TERANGA/USDC</span>
                          <span className="text-red-400">-1.2%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    </div>
                    
                    <Alert className="border-blue-200 bg-blue-50/10">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-blue-200">
                        Les échanges sont automatiquement optimisés pour minimiser les frais et le slippage.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Liquidity Tab */}
            <TabsContent value="liquidity" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Coins className="h-5 w-5" />
                      <span>Ajouter de la Liquidité</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Token A */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <Label className="mb-2 block">{liquidityForm.tokenA}</Label>
                      <Input
                        type="number"
                        value={liquidityForm.amountA}
                        onChange={(e) => setLiquidityForm(prev => ({ ...prev, amountA: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="0.0"
                      />
                      <div className="text-xs text-gray-400 mt-1">Balance: 8,456.78 TERANGA</div>
                    </div>

                    {/* Token B */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <Label className="mb-2 block">{liquidityForm.tokenB}</Label>
                      <Input
                        type="number"
                        value={liquidityForm.amountB}
                        onChange={(e) => setLiquidityForm(prev => ({ ...prev, amountB: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="0.0"
                      />
                      <div className="text-xs text-gray-400 mt-1">Balance: 1,250.50 MATIC</div>
                    </div>

                    {/* Pool Share */}
                    {liquidityForm.amountA && liquidityForm.amountB && (
                      <div className="bg-white/5 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Part du pool</span>
                          <span>0.125%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tokens LP Ï  recevoir</span>
                          <span>145.67 LP</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Valeur totale</span>
                          <span>${(parseFloat(liquidityForm.amountA) * 0.15 + parseFloat(liquidityForm.amountB) * 1.2).toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={addLiquidity}
                      disabled={loading || !liquidityForm.amountA || !liquidityForm.amountB}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Coins className="h-4 w-4 mr-2" />
                      )}
                      Ajouter la liquidité
                    </Button>
                  </CardContent>
                </Card>

                {/* My Liquidity Positions */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>Mes Positions de Liquidité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                          <span className="font-medium">TERANGA/MATIC</span>
                        </div>
                        <Badge variant="secondary">Actif</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Liquidité:</span>
                          <div className="font-bold">$1,250.00</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Frais collectés:</span>
                          <div className="font-bold text-green-400">$45.60</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2 border-white/20 text-white hover:bg-white/10">
                        Retirer la liquidité
                      </Button>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                          <span className="font-medium">TERANGA/USDC</span>
                        </div>
                        <Badge variant="secondary">Actif</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Liquidité:</span>
                          <div className="font-bold">$850.00</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Frais collectés:</span>
                          <div className="font-bold text-green-400">$32.10</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2 border-white/20 text-white hover:bg-white/10">
                        Retirer la liquidité
                      </Button>
                    </div>

                    <Alert className="border-yellow-200 bg-yellow-50/10">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-yellow-200">
                        La fourniture de liquidité comporte des risques de pertes impermanentes.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Farming Tab */}
            <TabsContent value="farming" className="space-y-4">
              <div className="grid lg:grid-cols-3 gap-4">
                {farmingPools.map((pool) => (
                  <Card key={pool.id} className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{pool.name}</span>
                        {pool.isActive ? (
                          <Badge className="bg-green-500">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">APY</span>
                          <div className="text-2xl font-bold text-green-400">{pool.apy}%</div>
                        </div>
                        <div>
                          <span className="text-gray-400">TVL</span>
                          <div className="text-lg font-bold">${pool.tvl}</div>
                        </div>
                      </div>

                      {pool.lockPeriod > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Timer className="h-4 w-4 text-orange-400" />
                          <span>Verrouillage: {pool.lockPeriod} jours</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Mon stake:</span>
                          <span className="font-bold">{pool.myStake || '0'} LP</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Récompenses:</span>
                          <span className="font-bold text-green-400">{pool.rewards || '0'} TERANGA</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Montant Ï  staker"
                          className="bg-white/10 border-white/20 text-white"
                          id={`stake-${pool.id}`}
                        />
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                          onClick={() => {
                            const input = document.getElementById(`stake-${pool.id}`);
                            const amount = input.value;
                            if (amount) stakeInFarm(pool.id, amount);
                          }}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Staker
                        </Button>
                      </div>

                      {parseFloat(pool.rewards) > 0 && (
                        <Button 
                          variant="outline" 
                          className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Réclamer ({pool.rewards} TERANGA)
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* NFT Collections Tab */}
            <TabsContent value="nft-collections" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {nftCollections.map((collection) => (
                  <Card key={collection.id} className="bg-white/10 backdrop-blur-lg border-white/20 text-white overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 relative">
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-white">{collection.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-gray-300 mb-4">{collection.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-400 text-sm">Prix plancher</span>
                          <div className="text-xl font-bold">{collection.floorPrice} MATIC</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Volume total</span>
                          <div className="text-xl font-bold">{collection.volume} MATIC</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Articles</span>
                          <div className="font-bold">{collection.items.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Propriétaires</span>
                          <div className="font-bold">{collection.owners}</div>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Explorer la collection
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* NFT Marketplace Tab */}
            <TabsContent value="nft-marketplace" className="space-y-4">
              <div className="grid lg:grid-cols-3 gap-4">
                {nftListings.map((nft) => (
                  <Card key={nft.id} className="bg-white/10 backdrop-blur-lg border-white/20 text-white overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
                      <div className="absolute top-2 right-2">
                        <Badge className={`${nft.rarity === 'Rare' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                          {nft.rarity}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="border-white/40 text-white">
                          #{nft.tokenId}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-1">{nft.name}</h4>
                      <p className="text-sm text-gray-400 mb-2">{nft.collection}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {nft.traits.slice(0, 2).map((trait, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                        {nft.traits.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{nft.traits.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm text-gray-400">Prix</span>
                          <div className="text-xl font-bold text-green-400">{nft.price} MATIC</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Vendeur: {nft.seller.slice(0, 6)}...
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        onClick={() => buyNFT(nft.id, nft.price)}
                        disabled={loading}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <DollarSign className="h-4 w-4 mr-2" />
                        )}
                        Acheter maintenant
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {nftListings.length === 0 && (
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">ðŸŽ¨</div>
                    <h3 className="text-xl font-bold mb-2">Aucun NFT disponible</h3>
                    <p className="text-gray-400">Les NFT achetés apparaîtront dans votre portefeuille</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default DeFiNFTMarketplace;

