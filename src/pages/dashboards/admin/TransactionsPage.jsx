import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Brain,
  Users,
  Building,
  TrendingUp,
  MapPin,
  FileText,
  Banknote
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpenAIService } from '../../../services/ai/OpenAIService';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    totalVolume: 0,
    averageAmount: 0
  });

  useEffect(() => {
    loadTransactions();
    generateAIInsights();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, selectedFilter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Données mockup transactions réalistes
      const mockTransactions = [
        {
          id: 'TXN-2024-001',
          type: 'purchase',
          status: 'completed',
          amount: 450000000,
          fee: 13500000,
          property: {
            id: 1,
            title: 'Villa moderne Almadies',
            type: 'Villa',
            location: 'Almadies, Dakar'
          },
          buyer: {
            name: 'Amadou Diallo',
            email: 'amadou.diallo@email.com'
          },
          seller: {
            name: 'Fatou Seck',
            email: 'fatou.seck@email.com'
          },
          createdAt: '2024-03-10T10:30:00Z',
          completedAt: '2024-03-12T15:45:00Z',
          paymentMethod: 'bank_transfer',
          escrowAccount: 'ESC-2024-001'
        },
        {
          id: 'TXN-2024-002',
          type: 'reservation',
          status: 'pending',
          amount: 25000000,
          fee: 750000,
          property: {
            id: 2,
            title: 'Appartement Plateau',
            type: 'Appartement',
            location: 'Plateau, Dakar'
          },
          buyer: {
            name: 'Mamadou Ba',
            email: 'mamadou.ba@email.com'
          },
          seller: {
            name: 'Aissatou Ndiaye',
            email: 'aissatou.ndiaye@email.com'
          },
          createdAt: '2024-03-14T09:15:00Z',
          completedAt: null,
          paymentMethod: 'mobile_money',
          escrowAccount: 'ESC-2024-002'
        },
        {
          id: 'TXN-2024-003',
          type: 'purchase',
          status: 'failed',
          amount: 85000000,
          fee: 2550000,
          property: {
            id: 3,
            title: 'Maison Liberté 6',
            type: 'Maison',
            location: 'Liberté 6, Dakar'
          },
          buyer: {
            name: 'Ousmane Diop',
            email: 'ousmane.diop@email.com'
          },
          seller: {
            name: 'Mame Diarra',
            email: 'mame.diarra@email.com'
          },
          createdAt: '2024-03-08T14:20:00Z',
          failedAt: '2024-03-09T11:30:00Z',
          failureReason: 'Paiement refusé par la banque',
          paymentMethod: 'bank_transfer',
          escrowAccount: null
        },
        {
          id: 'TXN-2024-004',
          type: 'rental_deposit',
          status: 'completed',
          amount: 1500000,
          fee: 45000,
          property: {
            id: 4,
            title: 'Studio Mermoz',
            type: 'Appartement',
            location: 'Mermoz, Dakar'
          },
          buyer: {
            name: 'Khadija Fall',
            email: 'khadija.fall@email.com'
          },
          seller: {
            name: 'Cheikh Sy',
            email: 'cheikh.sy@email.com'
          },
          createdAt: '2024-03-13T16:00:00Z',
          completedAt: '2024-03-13T16:15:00Z',
          paymentMethod: 'mobile_money',
          escrowAccount: 'ESC-2024-004'
        },
        {
          id: 'TXN-2024-005',
          type: 'commission',
          status: 'completed',
          amount: 22500000,
          fee: 675000,
          property: {
            id: 5,
            title: 'Local commercial Sandaga',
            type: 'Commercial',
            location: 'Sandaga, Dakar'
          },
          buyer: {
            name: 'Teranga Foncier',
            email: 'admin@terangafoncier.com'
          },
          seller: {
            name: 'Moussa Kane',
            email: 'moussa.kane@email.com'
          },
          createdAt: '2024-03-11T12:00:00Z',
          completedAt: '2024-03-11T12:05:00Z',
          paymentMethod: 'commission',
          escrowAccount: null
        }
      ];

      setTransactions(mockTransactions);
      
      // Calcul des statistiques
      const totalTransactions = mockTransactions.length;
      const completedTransactions = mockTransactions.filter(t => t.status === 'completed').length;
      const pendingTransactions = mockTransactions.filter(t => t.status === 'pending').length;
      const failedTransactions = mockTransactions.filter(t => t.status === 'failed').length;
      const totalVolume = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      const averageAmount = totalVolume / (completedTransactions || 1);

      setStats({ 
        totalTransactions, 
        completedTransactions, 
        pendingTransactions, 
        failedTransactions, 
        totalVolume, 
        averageAmount 
      });
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      // Simulation insights IA - En production, appel API OpenAI
      setAiInsights([
        'Volume transactions en hausse de 28% ce mois',
        'Taux de réussite paiements: 94% (excellent)',
        'Mobile Money devient le mode préféré (65%)',
        'Détection activité suspecte: aucune anomalie'
      ]);
    } catch (error) {
      console.error('Erreur génération insights IA:', error);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.property.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (selectedFilter) {
      case 'completed':
        filtered = filtered.filter(t => t.status === 'completed');
        break;
      case 'pending':
        filtered = filtered.filter(t => t.status === 'pending');
        break;
      case 'failed':
        filtered = filtered.filter(t => t.status === 'failed');
        break;
      case 'purchase':
        filtered = filtered.filter(t => t.type === 'purchase');
        break;
      case 'rental':
        filtered = filtered.filter(t => t.type === 'rental_deposit');
        break;
      default:
        break;
    }

    setFilteredTransactions(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      'purchase': 'bg-blue-100 text-blue-800',
      'reservation': 'bg-purple-100 text-purple-800',
      'rental_deposit': 'bg-orange-100 text-orange-800',
      'commission': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Suivi des transactions immobilières</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Complétées</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTransactions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingTransactions}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Échouées</p>
                <p className="text-3xl font-bold text-red-600">{stats.failedTransactions}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume Total</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.totalVolume)}</p>
              </div>
              <Banknote className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant Moyen</p>
                <p className="text-lg font-bold text-indigo-600">{formatCurrency(stats.averageAmount)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">Insights IA Transactions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-blue-800">
                  <CheckCircle className="h-4 w-4" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par ID, utilisateur ou propriété..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les transactions</SelectItem>
                  <SelectItem value="completed">Complétées</SelectItem>
                  <SelectItem value="pending">En cours</SelectItem>
                  <SelectItem value="failed">Échouées</SelectItem>
                  <SelectItem value="purchase">Achats</SelectItem>
                  <SelectItem value="rental">Locations</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={loadTransactions}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {transaction.id}
                          </h3>
                          <Badge className={getTypeColor(transaction.type)}>
                            {transaction.type === 'purchase' ? 'Achat' :
                             transaction.type === 'reservation' ? 'Réservation' :
                             transaction.type === 'rental_deposit' ? 'Caution location' :
                             'Commission'}
                          </Badge>
                          <Badge className={getStatusColor(transaction.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(transaction.status)}
                              <span>
                                {transaction.status === 'completed' ? 'Complétée' :
                                 transaction.status === 'pending' ? 'En cours' : 'Échouée'}
                              </span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-800 mb-1">{transaction.property.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{transaction.property.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{transaction.property.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Acheteur</p>
                            <p className="text-sm font-medium">{transaction.buyer.name}</p>
                            <p className="text-xs text-gray-600">{transaction.buyer.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Vendeur</p>
                            <p className="text-sm font-medium">{transaction.seller.name}</p>
                            <p className="text-xs text-gray-600">{transaction.seller.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div>
                            <p>Créée: {formatDate(transaction.createdAt)}</p>
                            {transaction.completedAt && (
                              <p>Complétée: {formatDate(transaction.completedAt)}</p>
                            )}
                            {transaction.failedAt && (
                              <p>Échouée: {formatDate(transaction.failedAt)}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p>Mode: {transaction.paymentMethod}</p>
                            {transaction.escrowAccount && (
                              <p>Séquestre: {transaction.escrowAccount}</p>
                            )}
                          </div>
                        </div>
                        
                        {transaction.status === 'failed' && transaction.failureReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-sm">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            {transaction.failureReason}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="mb-2">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Frais: {formatCurrency(transaction.fee)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;