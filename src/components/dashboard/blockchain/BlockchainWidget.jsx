import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Link, 
  Coins,
  Activity,
  Lock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Clock,
  TrendingUp,
  Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const BlockchainWidget = ({ userRole, userAddress, transactions = [] }) => {
  const [blockchainStatus, setBlockchainStatus] = useState('connected');
  const [walletBalance, setWalletBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    simulateBlockchainData();
  }, [userRole]);

  const simulateBlockchainData = () => {
    // Simulation données blockchain
    setWalletBalance(Math.floor(Math.random() * 10000) + 5000);
    setSecurityScore(Math.floor(Math.random() * 10) + 90);
    
    const mockTransactions = [
      {
        id: '0x7d1af7f3...',
        type: 'property_tokenization',
        description: 'Tokenisation terrain TF-2024-001',
        amount: 15000000,
        status: 'confirmed',
        timestamp: '2024-03-15T10:30:00Z',
        confirmations: 24
      },
      {
        id: '0x9b2ef4a1...',
        type: 'smart_contract',
        description: 'Contrat achat automatique',
        amount: 8500000,
        status: 'pending',
        timestamp: '2024-03-15T09:15:00Z',
        confirmations: 3
      },
      {
        id: '0x4c8df2b9...',
        type: 'escrow_release',
        description: 'Libération séquestre',
        amount: 25000000,
        status: 'confirmed',
        timestamp: '2024-03-14T16:45:00Z',
        confirmations: 48
      }
    ];
    
    setRecentTransactions(mockTransactions);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-green-600 bg-green-50',
      pending: 'text-yellow-600 bg-yellow-50',
      failed: 'text-red-600 bg-red-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const getTransactionIcon = (type) => {
    const icons = {
      property_tokenization: Coins,
      smart_contract: Shield,
      escrow_release: Lock,
      transfer: ExternalLink
    };
    const IconComponent = icons[type] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link className="h-6 w-6 text-purple-600" />
            <div>
              <CardTitle className="text-lg">TerangaChain</CardTitle>
              <CardDescription>
                Blockchain & Smart Contracts
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`${blockchainStatus === 'connected' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              {blockchainStatus === 'connected' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connecté
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Déconnecté
                </>
              )}
            </Badge>
            <Badge variant="outline" className="bg-purple-50">
              Sécurité: {securityScore}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Portefeuille</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(walletBalance)}
            </div>
            <div className="text-sm text-purple-600">FCFA Tokens</div>
          </div>

          {/* Wallet Address */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Adresse</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-white px-2 py-1 rounded">
                {userAddress || '0xA1B2...C3D4'}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(userAddress || '0xA1B2C3D4E5F6...')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Security Score */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span className="font-medium">Sécurité</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {securityScore}%
            </div>
            <div className="text-sm text-green-600">Score Global</div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Transactions Récentes</span>
            </h3>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{tx.description}</div>
                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <span>{formatTimestamp(tx.timestamp)}</span>
                        <span>•</span>
                        <span>{tx.confirmations} confirmations</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatCurrency(tx.amount)}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(tx.status)}`}
                    >
                      {tx.status === 'confirmed' ? 'Confirmé' : 
                       tx.status === 'pending' ? 'En cours' : 'Échoué'}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <span>TX:</span>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">{tx.id}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={() => copyToClipboard(tx.id)}
                    >
                      <Copy className="h-2 w-2" />
                    </Button>
                  </div>
                  {tx.status === 'pending' && (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Clock className="h-3 w-3" />
                      <span>En attente</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Coins className="h-3 w-3 mr-1" />
              Tokeniser
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Smart Contract
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Séquestre
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              Historique
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainWidget;
