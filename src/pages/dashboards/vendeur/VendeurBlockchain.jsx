import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Network, 
  Shield, 
  Bitcoin, 
  Wallet, 
  Link2, 
  Award,
  TrendingUp,
  Users,
  Globe,
  Lock,
  Key,
  Zap,
  ArrowRight,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Star,
  Clock,
  DollarSign,
  Building,
  Sparkles,
  QrCode,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';

const VendeurBlockchain = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [walletConnected, setWalletConnected] = useState(false);
  const [isTokenizing, setIsTokenizing] = useState(false);

  // Données simulées
  const [blockchainData, setBlockchainData] = useState({
    walletAddress: '0x742d35cc...a9b1c4e8',
    balance: {
      eth: 2.45,
      tera: 150000,
      usd: 3850
    },
    nftCollection: [
      {
        id: 1,
        tokenId: 'TERA001',
        property: 'Villa Moderne Almadies',
        tokenizedValue: 125000000, // FCFA
        mintDate: '2024-01-15',
        status: 'active',
        royalties: 2.5,
        transactions: 12,
        currentOwner: '0x742d35cc...a9b1c4e8',
        metadata: {
          image: '/api/placeholder/300/300',
          attributes: {
            location: 'Almadies',
            type: 'Villa',
            surface: '450m²',
            rooms: 5
          }
        }
      },
      {
        id: 2,
        tokenId: 'TERA002',
        property: 'Terrain Sacré-Cœur',
        tokenizedValue: 85000000,
        mintDate: '2024-01-10',
        status: 'pending',
        royalties: 3.0,
        transactions: 0,
        currentOwner: 'pending',
        metadata: {
          image: '/api/placeholder/300/300',
          attributes: {
            location: 'Sacré-Cœur',
            type: 'Terrain',
            surface: '600m²',
            zoning: 'Résidentiel'
          }
        }
      }
    ],
    transactions: [
      {
        id: 1,
        type: 'mint',
        tokenId: 'TERA001',
        amount: 125000000,
        hash: '0xa1b2c3d4...e5f6g7h8',
        date: '2024-01-15T10:30:00Z',
        status: 'confirmed',
        gasUsed: 0.0023
      },
      {
        id: 2,
        type: 'transfer',
        tokenId: 'TERA001',
        amount: 0,
        hash: '0xf8e7d6c5...h4g3f2e1',
        date: '2024-01-20T14:22:00Z',
        status: 'confirmed',
        gasUsed: 0.0012
      }
    ],
    analytics: {
      totalValue: 210000000,
      monthlyVolume: 45000000,
      activeContracts: 2,
      pendingTokenization: 1
    }
  });

  const connectWallet = () => {
    setWalletConnected(true);
    // Simulation de connexion wallet
  };

  const tokenizeProperty = () => {
    setIsTokenizing(true);
    setTimeout(() => {
      setIsTokenizing(false);
      // Ajouter le nouveau NFT
    }, 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Network className="mr-3 h-8 w-8 text-purple-600" />
            Blockchain & NFT TerangaFoncier
          </h1>
          <p className="text-gray-600 mt-1">
            Tokenisation et gestion décentralisée de vos biens immobiliers
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {!walletConnected ? (
            <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
              <Wallet className="w-4 h-4 mr-2" />
              Connecter Wallet
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Wallet Connecté
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Status */}
      {walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Portefeuille TerangaChain</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm">{blockchainData.walletAddress}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(blockchainData.walletAddress)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {blockchainData.balance.usd.toLocaleString()} USD
                  </div>
                  <div className="text-sm text-gray-600">
                    {blockchainData.balance.tera.toLocaleString()} TERA
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Indicateurs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Tokenisée</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(blockchainData.analytics.totalValue / 1000000).toFixed(0)}M FCFA
                  </p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Volume Mensuel</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(blockchainData.analytics.monthlyVolume / 1000000).toFixed(0)}M FCFA
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">NFTs Actifs</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {blockchainData.analytics.activeContracts}
                  </p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {blockchainData.analytics.pendingTokenization}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio NFT</TabsTrigger>
          <TabsTrigger value="tokenize">Tokeniser</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Portfolio NFT */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {blockchainData.nftCollection.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={nft.metadata.image}
                      alt={nft.property}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={nft.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}>
                        {nft.status === 'active' ? 'Actif' : 'En attente'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white">
                        #{nft.tokenId}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{nft.property}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Valeur tokenisée</span>
                        <span className="font-bold text-purple-600">
                          {(nft.tokenizedValue / 1000000).toFixed(0)}M FCFA
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Royalties</span>
                        <span className="font-bold">{nft.royalties}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transactions</span>
                        <span className="font-bold">{nft.transactions}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-1 font-medium">{nft.metadata.attributes.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Surface:</span>
                          <span className="ml-1 font-medium">{nft.metadata.attributes.surface}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir NFT
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Explorer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Tokeniser */}
        <TabsContent value="tokenize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Tokeniser une nouvelle propriété
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  La tokenisation transforme votre bien immobilier en NFT sur la blockchain TerangaChain, 
                  permettant une propriété fractionnée et des transactions sécurisées.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Propriété à tokeniser
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>Sélectionner une propriété</option>
                      <option>Appartement Plateau</option>
                      <option>Terrain Medina</option>
                      <option>Villa Ouakam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur de tokenisation (FCFA)
                    </label>
                    <Input placeholder="Ex: 150000000" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Royalties (%)
                    </label>
                    <Input placeholder="Ex: 2.5" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fractions (optionnel)
                    </label>
                    <Input placeholder="Ex: 100 (pour 100 parts)" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Coûts de tokenisation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Frais de minting</span>
                        <span>0.05 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de gas</span>
                        <span>~0.02 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commission TerangaFoncier</span>
                        <span>1%</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold">
                        <span>Total estimé</span>
                        <span>0.07 ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Avantages de la tokenisation</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Propriété fractionnée possible</li>
                      <li>• Transactions instantanées</li>
                      <li>• Traçabilité complète</li>
                      <li>• Liquidité améliorée</li>
                      <li>• Royalties automatiques</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={tokenizeProperty}
                  disabled={isTokenizing}
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  {isTokenizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Tokenisation en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Lancer la tokenisation
                    </>
                  )}
                </Button>
              </div>

              {isTokenizing && (
                <div className="mt-4">
                  <Progress value={33} className="mb-2" />
                  <p className="text-center text-sm text-gray-600">
                    Création du smart contract et minting du NFT...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                Historique des transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blockchainData.transactions.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === 'mint' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {tx.type === 'mint' ? (
                          <Sparkles className={`w-5 h-5 ${tx.type === 'mint' ? 'text-green-600' : 'text-blue-600'}`} />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {tx.type === 'mint' ? 'Création NFT' : 'Transfert'} - {tx.tokenId}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{new Date(tx.date).toLocaleDateString('fr-FR')}</span>
                          <span>Gas: {tx.gasUsed} ETH</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge className={tx.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {tx.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(tx.hash)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      {tx.amount > 0 && (
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {(tx.amount / 1000000).toFixed(0)}M FCFA
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance du portefeuille</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ROI Total</span>
                    <span className="font-bold text-green-600">+24.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valeur totale</span>
                    <span className="font-bold">{(blockchainData.analytics.totalValue / 1000000).toFixed(0)}M FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Volume 30j</span>
                    <span className="font-bold">{(blockchainData.analytics.monthlyVolume / 1000000).toFixed(0)}M FCFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Réseau TerangaChain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bloc actuel</span>
                    <span className="font-bold">2,847,391</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Temps de bloc</span>
                    <span className="font-bold">~15s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prix TERA</span>
                    <span className="font-bold">$0.025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Statut réseau</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Opérationnel
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurBlockchain;