import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  CreditCard,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Bell,
  Settings,
  Search,
  Download,
  Eye,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AIEstimationWidget, AIMarketInsights } from '../components/AIComponents';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const BanqueDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('credits');
  const [notifications, setNotifications] = useState(0);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);
        if (!error) setNotifications(count || 0);
      } catch (error) {
        console.error('Error fetching notifications count:', error);
      }
    };

    const fetchEvaluations = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, location, city, surface, estimated_value, market_value, updated_at')
          .not('estimated_value', 'is', null)
          .order('updated_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        setEvaluations(data || []);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setEvaluations([]);
      }
    };

    fetchNotifications();
    fetchEvaluations();
  }, [user]);

  const menuItems = [
    { id: 'credits', label: 'Crédits Immobiliers', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'hypotheques', label: 'Hypothèques', icon: Building2, color: 'bg-green-500' },
    { id: 'evaluations', label: 'Évaluations', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'clients', label: 'Portefeuille Clients', icon: Users, color: 'bg-orange-500' },
    { id: 'risques', label: 'Gestion des Risques', icon: Shield, color: 'bg-red-500' },
    { id: 'statistiques', label: 'Statistiques', icon: BarChart3, color: 'bg-indigo-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-yellow-500' },
    { id: 'parametres', label: 'Paramètres', icon: Settings, color: 'bg-gray-500' }
  ];

  const stats = [
    {
      title: 'Encours Crédit Immobilier',
      value: '—',
      change: null,
      changeType: 'increase',
      icon: CreditCard,
      color: 'bg-blue-500',
      unit: 'FCFA'
    },
    {
      title: 'Dossiers en Cours',
      value: '—',
      change: null,
      changeType: 'increase',
      icon: FileText,
      color: 'bg-green-500',
      unit: 'dossiers'
    },
    {
      title: 'Taux de Défaut',
      value: '—',
      change: null,
      changeType: 'decrease',
      icon: AlertTriangle,
      color: 'bg-red-500',
      unit: ''
    },
    {
      title: 'Nouveaux Clients',
      value: '—',
      change: null,
      changeType: 'increase',
      icon: Users,
      color: 'bg-orange-500',
      unit: 'ce mois'
    }
  ];

  const creditsImmobiliers = []; // démo retirée

  const hypotheques = []; // démo retirée

  // evaluations chargées depuis Supabase (table properties) via useEffect ci-dessus

  const indicateursRisque = [];

  const getStatutColor = (statut) => {
    switch(statut.toLowerCase()) {
      case 'approuvé': return 'bg-green-100 text-green-800';
      case 'en instruction': return 'bg-blue-100 text-blue-800';
      case 'en attente documents': return 'bg-yellow-100 text-yellow-800';
      case 'rejeté': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'en cours': return 'bg-blue-100 text-blue-800';
      case 'résiliée': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRisqueColor = (risque) => {
    switch(risque.toLowerCase()) {
      case 'très faible': return 'bg-green-100 text-green-800';
      case 'faible': return 'bg-blue-100 text-blue-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'élevé': return 'bg-orange-100 text-orange-800';
      case 'très élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCredits = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Crédits Immobiliers</h2>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Nouveau Dossier
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {creditsImmobiliers.map(credit => (
          <Card key={credit.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{credit.reference}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRisqueColor(credit.risque)}`}>
                      Risque {credit.risque}
                    </span>
                  </div>
                  <p className="text-blue-600 font-medium">{credit.client}</p>
                  <p className="text-gray-600">{credit.bien}</p>
                  <div className="flex space-x-4 text-sm text-gray-600 mt-2">
                    <span>Montant: {credit.montant}</span>
                    <span>Durée: {credit.duree}</span>
                    <span>Taux: {credit.taux}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(credit.statut)}`}>
                    {credit.statut}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">{credit.dateCreation}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Avancement du dossier</span>
                  <span>{credit.progression}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${credit.progression}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Eye size={16} />
                  <span>Détails</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <FileText size={16} />
                  <span>Documents</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                  <TrendingUp size={16} />
                  <span>Évaluation</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHypotheques = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Registre des Hypothèques</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Nouvelle Inscription
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Débiteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créancier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant Garanti
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hypotheques.map(hyp => (
              <tr key={hyp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {hyp.reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hyp.debiteur}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hyp.creancier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {hyp.montantGaranti}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hyp.bien}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  {hyp.rang}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(hyp.statut)}`}>
                    {hyp.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye size={16} />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvaluations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Évaluations Immobilières</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Nouvelle Évaluation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evaluations.map(evaluation => (
          <Card key={evaluation.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{evaluation.title || 'Bien sans titre'}</h3>
                  <p className="text-gray-600">{evaluation.location || evaluation.city || 'Localisation non renseignée'}</p>
                  {evaluation.surface && (
                    <p className="text-gray-600">Surface: {evaluation.surface} m²</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {evaluation.updated_at ? new Date(evaluation.updated_at).toLocaleDateString('fr-FR') : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valeur estimée:</span>
                  <span className="font-semibold text-green-600">
                    {evaluation.estimated_value ? `${Number(evaluation.estimated_value).toLocaleString('fr-FR')} FCFA` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valeur de marché:</span>
                  <span className="font-semibold text-blue-600">
                    {evaluation.market_value ? `${Number(evaluation.market_value).toLocaleString('fr-FR')} FCFA` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                  Voir Rapport
                </button>
                <button className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRisques = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gestion des Risques</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {indicateursRisque.map((indicateur, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{indicateur.categorie}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  indicateur.niveau === 'Très bon' ? 'bg-green-100 text-green-800' :
                  indicateur.niveau === 'Acceptable' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {indicateur.niveau}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Encours total:</span>
                  <span className="font-semibold">{indicateur.encours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provisionnement:</span>
                  <span className="font-semibold text-orange-600">{indicateur.provisionnement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux de défaut:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{indicateur.tauxDefaut}</span>
                    <span className={`flex items-center text-sm ${
                      indicateur.evolution.startsWith('+') ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {indicateur.evolution.startsWith('+') ? 
                        <ArrowUpRight size={14} /> : 
                        <ArrowDownLeft size={14} />
                      }
                      {indicateur.evolution}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertes Risques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Shield size={48} className="mx-auto mb-4" />
            <p>Aucune alerte risque active</p>
            <p className="text-sm">Tous les indicateurs sont dans les seuils acceptables</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStatistiques = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Statistiques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? 
                    <ArrowUpRight size={16} className="text-green-500 mr-1" /> :
                    <ArrowDownLeft size={16} className="text-green-500 mr-1" />
                  }
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Crédits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              Graphique d'évolution en développement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              Graphique de répartition en développement
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'credits': return renderCredits();
      case 'hypotheques': return renderHypotheques();
      case 'evaluations': return renderEvaluations();
      case 'risques': return renderRisques();
      case 'statistiques': return renderStatistiques();
      case 'clients': return (
        <Card>
          <CardContent className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Portefeuille clients en développement</p>
          </CardContent>
        </Card>
      );
      case 'notifications': return (
        <Card>
          <CardContent className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Centre de notifications en développement</p>
          </CardContent>
        </Card>
      );
      case 'parametres': return (
        <Card>
          <CardContent className="text-center py-12">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Paramètres bancaires en développement</p>
          </CardContent>
        </Card>
      );
      default: return renderCredits();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="text-blue-600" size={32} />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Banque Immobilière</h1>
                <p className="text-sm text-gray-600">Division Crédit & Financement</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">BI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? 
                      <ArrowUpRight size={16} className="text-green-500 mr-1" /> :
                      <ArrowDownLeft size={16} className="text-green-500 mr-1" />
                    }
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🚀 WIDGETS IA TERANGA - SPÉCIALISATION BANQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AIEstimationWidget className="w-full" />
          <AIMarketInsights region="Dakar" className="w-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu latéral */}
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${activeSection === item.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanqueDashboard;
