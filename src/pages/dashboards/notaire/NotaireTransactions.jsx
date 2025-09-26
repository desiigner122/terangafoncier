import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Calendar,
  MapPin,
  DollarSign,
  Scale,
  Stamp,
  Shield,
  Star,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotaireTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Statuts possibles des transactions
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
    { value: 'review', label: 'En révision', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Terminée', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Refusée', color: 'bg-red-100 text-red-800' }
  ];

  // Types de transactions
  const transactionTypes = [
    'Vente immobilière',
    'Succession',
    'Donation',
    'Acte de propriété',
    'Hypothèque',
    'Servitude',
    'Partage',
    'Constitution société'
  ];

  // Données simulées des transactions
  const mockTransactions = [
    {
      id: 'TXN-001',
      type: 'Vente immobilière',
      client: 'Famille Diallo',
      property: 'Villa Almadies - Lot 456',
      amount: 85000000,
      status: 'completed',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      description: 'Vente d\'une villa de 4 chambres dans le quartier des Almadies',
      documents: ['Titre foncier', 'Acte de vente', 'Certificat de propriété'],
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef',
      notaryFees: 850000,
      priority: 'high'
    },
    {
      id: 'TXN-002',
      type: 'Succession',
      client: 'Héritiers Ndiaye',
      property: 'Terrain Parcelles Assainies - 500m²',
      amount: 25000000,
      status: 'in_progress',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22',
      description: 'Succession d\'un terrain familial entre 5 héritiers',
      documents: ['Acte de décès', 'Testament', 'Certificat hérédité'],
      blockchainHash: null,
      notaryFees: 375000,
      priority: 'medium'
    },
    {
      id: 'TXN-003',
      type: 'Donation',
      client: 'M. et Mme Seck',
      property: 'Appartement Plateau - 90m²',
      amount: 45000000,
      status: 'review',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-23',
      description: 'Donation d\'un appartement aux enfants',
      documents: ['Acte de propriété', 'Certificat fiscal'],
      blockchainHash: null,
      notaryFees: 675000,
      priority: 'low'
    },
    {
      id: 'TXN-004',
      type: 'Acte de propriété',
      client: 'Entreprise SARLU Teranga',
      property: 'Immeuble commercial Médina - 200m²',
      amount: 120000000,
      status: 'pending',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      description: 'Régularisation acte de propriété pour usage commercial',
      documents: ['Permis de construire', 'Plan cadastral'],
      blockchainHash: null,
      notaryFees: 1200000,
      priority: 'high'
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  // Filtrage des transactions
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, transactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  // Handlers
  const handleCreateTransaction = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Transaction créée",
        description: "Nouvelle transaction notariale créée avec succès",
        variant: "success"
      });
      setShowCreateDialog(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    window.safeGlobalToast({
      title: "Transaction ouverte",
      description: `Consultation du dossier ${transaction.id}`,
      variant: "success"
    });
  };

  const handleUpdateStatus = (transactionId, newStatus) => {
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? { ...t, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
            : t
        )
      );
      window.safeGlobalToast({
        title: "Statut mis à jour",
        description: `Transaction ${transactionId} mise à jour avec succès`,
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteTransaction = (transactionId) => {
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      window.safeGlobalToast({
        title: "Transaction supprimée",
        description: "Transaction supprimée avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExportTransactions = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Export terminé",
        description: "Liste des transactions exportée en Excel",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <ArrowRight className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Transactions</h2>
          <p className="text-gray-600 mt-1">
            Suivi et gestion des transactions notariales
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            variant="outline"
            onClick={handleExportTransactions}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Transaction
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {transactions.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <ArrowRight className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(transactions.reduce((sum, t) => sum + t.notaryFees, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {filteredTransactions.length} transaction(s) trouvée(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Transactions</CardTitle>
          <CardDescription>
            Gestion complète des transactions notariales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Propriété</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.client}</TableCell>
                  <TableCell className="max-w-48 truncate">
                    {transaction.property}
                  </TableCell>
                  <TableCell>
                    {(transaction.amount / 1000000).toFixed(1)}M FCFA
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">
                        {statusOptions.find(s => s.value === transaction.status)?.label}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(transaction.priority)}>
                      {transaction.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          window.safeGlobalToast({
                            title: "Transaction consultée",
                            description: `Détails de ${transaction.id}`,
                            variant: "success"
                          });
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => {
                            window.safeGlobalToast({
                              title: "Transaction modifiée",
                              description: `${transaction.id} mis à jour`,
                              variant: "success"
                            });
                            setIsLoading(false);
                          }, 1000);
                        }}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => {
                            window.safeGlobalToast({
                              title: "Transaction validée",
                              description: `${transaction.id} approuvée`,
                              variant: "success"
                            });
                            setIsLoading(false);
                          }, 1500);
                        }}
                        disabled={isLoading}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => {
                            window.safeGlobalToast({
                              title: "Document généré",
                              description: `Acte pour ${transaction.id}`,
                              variant: "success"
                            });
                            setIsLoading(false);
                          }, 2000);
                        }}
                        disabled={isLoading}
                      >
                        <Download className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de création de transaction */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Transaction Notariale</DialogTitle>
            <DialogDescription>
              Créer une nouvelle transaction pour un acte notarié
            </DialogDescription>
          </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Informations Générales</TabsTrigger>
            <TabsTrigger value="property">Propriété</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input id="client" placeholder="Nom du client" />
              </div>
              <div>
                <Label htmlFor="type">Type de transaction</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Montant (FCFA)</Label>
                <Input id="amount" type="number" placeholder="Montant de la transaction" />
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Description détaillée de la transaction..."
                rows={4}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="property" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-address">Adresse de la propriété</Label>
                <Input id="property-address" placeholder="Adresse complète" />
              </div>
              <div>
                <Label htmlFor="property-area">Superficie (m²)</Label>
                <Input id="property-area" type="number" placeholder="Superficie" />
              </div>
              <div>
                <Label htmlFor="cadastral-ref">Référence cadastrale</Label>
                <Input id="cadastral-ref" placeholder="Référence cadastrale" />
              </div>
              <div>
                <Label htmlFor="property-type">Type de propriété</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de propriété" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industriel">Industriel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                Glissez-déposez vos documents ici ou cliquez pour parcourir
              </p>
              <Button variant="outline" className="mt-2">
                Parcourir les fichiers
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Types de documents requis :</Label>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Titre de propriété ou acte authentique</li>
                <li>• Pièce d'identité des parties</li>
                <li>• Certificat de non-gage</li>
                <li>• Plan cadastral</li>
                <li>• Quitus fiscal</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowCreateDialog(false)}
          >
            Annuler
          </Button>
          <Button 
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleCreateTransaction}
            disabled={isLoading}
          >
            {isLoading ? 'Création...' : 'Créer Transaction'}
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotaireTransactions;