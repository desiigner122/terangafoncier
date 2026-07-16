import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Activity,
  FileText,
  Briefcase,
  Home,
  CreditCard,
  Percent,
  Calculator,
  UserCheck,
  Archive,
  Download,
  Share2,
  Award,
  Banknote,
  Euro,
  Receipt
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const BanqueCRM = ({ dashboardStats }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);

  // Données CRM réelles (bank_clients filtré par bank_id)
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [crmStats, setCrmStats] = useState({
    totalClients: 0,
    activeCredits: 0,
    monthlyVolume: 0, // CFA
    conversionRate: null
  });

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Clients réels de la banque
        const { data: clientsData, error: clientsError } = await supabase
          .from('bank_clients')
          .select('*')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false });
        if (clientsError) throw clientsError;

        // Crédits réels pour dériver les statistiques
        const { data: loansData, error: loansError } = await supabase
          .from('loans')
          .select('id, amount, status, created_at')
          .eq('bank_id', user.id);
        if (loansError) throw loansError;

        if (cancelled) return;

        const loans = loansData || [];
        const activeStatuses = ['approved', 'disbursed'];
        const activeCredits = loans.filter(l => activeStatuses.includes(l.status)).length;

        // Volume du mois en cours (crédits créés ce mois-ci)
        const now = new Date();
        const monthlyVolume = loans
          .filter(l => {
            if (!l.created_at) return false;
            const d = new Date(l.created_at);
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
          })
          .reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

        // Taux de conversion réel : crédits approuvés / total des demandes
        const approved = loans.filter(l => activeStatuses.includes(l.status)).length;
        const conversionRate = loans.length > 0 ? Math.round((approved / loans.length) * 100) : null;

        setClients(clientsData || []);
        setCrmStats({
          totalClients: (clientsData || []).length,
          activeCredits,
          monthlyVolume,
          conversionRate
        });
      } catch (err) {
        console.error('Erreur chargement CRM banque:', err);
        if (!cancelled) {
          setClients([]);
          setCrmStats({ totalClients: 0, activeCredits: 0, monthlyVolume: 0, conversionRate: null });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [user?.id]);

  // Filtrage des clients (colonnes réelles : name, email, client_type)
  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (client.name || '').toLowerCase().includes(term) ||
                         (client.email || '').toLowerCase().includes(term);
    const matchesFilter = filterType === 'all' || client.client_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'entreprise': return Building2;
      case 'cooperative': return Users;
      case 'particulier': return Home;
      default: return Users;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'entreprise': return 'bg-blue-100 text-blue-800';
      case 'cooperative': return 'bg-purple-100 text-purple-800';
      case 'particulier': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ClientCard = ({ client, onClick }) => {
    const TypeIcon = getTypeIcon(client.client_type);
    const lastContact = client.updated_at || client.created_at;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => onClick(client)}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TypeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {client.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    {client.client_type && (
                      <Badge className={`text-xs ${getTypeColor(client.client_type)}`}>
                        {client.client_type}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              {client.credit_score != null && (
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    Score: {client.credit_score}
                  </div>
                  <Progress value={client.credit_score} className="w-16 h-2 mt-1" />
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              {client.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}

              {client.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total crédits:</span>
                  <span className="font-semibold text-blue-600">
                    {client.total_credits != null
                      ? `${(Number(client.total_credits) / 1000000).toFixed(1)}M CFA`
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  {lastContact
                    ? `Contact: ${new Date(lastContact).toLocaleDateString('fr-FR')}`
                    : 'Contact: —'}
                </span>
                {client.status && (
                  <Badge
                    className={`text-xs ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' :
                      client.status === 'prospect' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {client.status}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques CRM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Clients Actifs</p>
                  <p className="text-2xl font-bold text-blue-900">{crmStats.totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Crédits Actifs</p>
                  <p className="text-2xl font-bold text-green-900">{crmStats.activeCredits}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Volume Mensuel</p>
                  <p className="text-2xl font-bold text-purple-900">{(crmStats.monthlyVolume / 1000000).toFixed(0)}M</p>
                </div>
                <Banknote className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Taux Conversion</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {crmStats.conversionRate != null ? `${crmStats.conversionRate}%` : '—'}
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>CRM Bancaire - Crédit Immobilier</span>
          </CardTitle>
          <CardDescription>
            Gestion des relations clients pour crédits immobiliers et fonciers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                Tous
              </Button>
              <Button
                variant={filterType === 'particulier' ? 'default' : 'outline'}
                onClick={() => setFilterType('particulier')}
                size="sm"
              >
                Particuliers
              </Button>
              <Button
                variant={filterType === 'entreprise' ? 'default' : 'outline'}
                onClick={() => setFilterType('entreprise')}
                size="sm"
              >
                Entreprises
              </Button>
              <Button
                variant={filterType === 'cooperative' ? 'default' : 'outline'}
                onClick={() => setFilterType('cooperative')}
                size="sm"
              >
                Coopératives
              </Button>
            </div>
          </div>

          {/* Liste des clients */}
          {loading ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500">Chargement des clients...</p>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onClick={setSelectedClient}
                  />
                ))}
              </motion.div>

              {filteredClients.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun client trouvé</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Nouveau Client</h3>
              <p className="text-sm text-blue-700">Ajouter un prospect crédit immobilier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <Calculator className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Simulation Crédit</h3>
              <p className="text-sm text-green-700">Calculateur de financement immobilier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Rapport Commercial</h3>
              <p className="text-sm text-purple-700">Performance équipe crédit immobilier</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BanqueCRM;