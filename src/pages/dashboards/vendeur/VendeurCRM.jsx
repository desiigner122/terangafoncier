import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Search,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  Target,
  Award,
  Activity,
  FileText
} from 'lucide-react';

const VendeurCRM = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProspect, setSelectedProspect] = useState(null);

  // Données CRM
  const crmData = {
    stats: {
      totalProspects: 89,
      hotProspects: 12,
      coldProspects: 28,
      convertedToday: 3,
      averageScore: 67,
      conversionRate: 18.5,
      monthlyRevenue: 125000000,
      avgDealSize: 75000000
    },
    prospects: [
      {
        id: 1,
        name: 'Fatou Sall',
        email: 'fatou.sall@gmail.com',
        phone: '+221 77 234 56 78',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c3e9a3?w=100&h=100&fit=crop&crop=face',
        company: 'Entreprise Sall & Fils',
        position: 'Directrice Générale',
        status: 'Chaud',
        score: 92,
        budget: '100-150M FCFA',
        interestedProperty: 'Villa Moderne Almadies',
        source: 'Site web',
        lastContact: '2024-03-20',
        nextAction: 'Visite programmée demain',
        notes: 'Très intéressée, budget confirmé, décision prévue fin de semaine',
        priority: 'high',
        tags: ['Budget confirmé', 'Decision maker', 'Urgent']
      },
      {
        id: 2,
        name: 'Moussa Diop',
        email: 'moussa.diop@outlook.com',
        phone: '+221 76 345 67 89',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        company: 'Cabinet Diop Associés',
        position: 'Avocat Principal',
        status: 'Tiède',
        score: 74,
        budget: '80-120M FCFA',
        interestedProperty: 'Appartement Standing Plateau',
        source: 'Recommandation',
        lastContact: '2024-03-18',
        nextAction: 'Rappel négociation prix',
        notes: 'Intéressé mais souhaite négocier le prix',
        priority: 'medium',
        tags: ['Négociation', 'Prix sensible']
      },
      {
        id: 3,
        name: 'Aïssa Ndiaye',
        email: 'aissa.ndiaye@gmail.com',
        phone: '+221 78 456 78 90',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        company: 'Boutique Mode Aïssa',
        position: 'Propriétaire',
        status: 'Nouveau',
        score: 58,
        budget: '60-90M FCFA',
        interestedProperty: 'Terrain Commercial Liberté 6',
        source: 'Facebook Ads',
        lastContact: '2024-03-19',
        nextAction: 'Première prise de contact',
        notes: 'Nouveau prospect, à qualifier rapidement',
        priority: 'medium',
        tags: ['Nouveau', 'À qualifier']
      },
      {
        id: 4,
        name: 'Ibrahima Fall',
        email: 'ibrahim.fall@tech.sn',
        phone: '+221 77 111 22 33',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        company: 'TechSen Solutions',
        position: 'CEO',
        status: 'Froid',
        score: 34,
        budget: '50-80M FCFA',
        interestedProperty: 'Bureau Moderne Plateau',
        source: 'LinkedIn',
        lastContact: '2024-03-15',
        nextAction: 'Relance nécessaire',
        notes: 'Peu réactif, à relancer avec une nouvelle approche',
        priority: 'low',
        tags: ['Relance', 'Peu réactif']
      }
    ],
    activities: [
      { type: 'call', prospect: 'Fatou Sall', time: '1h', action: 'Appel de suivi très positif' },
      { type: 'email', prospect: 'Moussa Diop', time: '2h', action: 'Envoi nouvelle proposition' },
      { type: 'meeting', prospect: 'Aïssa Ndiaye', time: '4h', action: 'Rendez-vous programmé' },
      { type: 'note', prospect: 'Ibrahima Fall', time: '6h', action: 'Note de suivi ajoutée' }
    ]
  };

  const getStatusColor = (status) => {
    const colors = {
      'Chaud': 'bg-red-100 text-red-800 border-red-200',
      'Tiède': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Nouveau': 'bg-blue-100 text-blue-800 border-blue-200',
      'Froid': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'border-l-red-500 bg-red-50',
      'medium': 'border-l-yellow-500 bg-yellow-50',
      'low': 'border-l-green-500 bg-green-50'
    };
    return colors[priority] || 'border-l-gray-500 bg-gray-50';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredProspects = crmData.prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'hot' && prospect.status === 'Chaud') ||
                         (activeFilter === 'warm' && prospect.status === 'Tiède') ||
                         (activeFilter === 'cold' && prospect.status === 'Froid') ||
                         (activeFilter === 'new' && prospect.status === 'Nouveau');
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                CRM Vendeur
              </h1>
              <p className="text-gray-600 mt-1">Gestion avancée de vos prospects et clients</p>
            </div>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg">
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Nouveau Prospect</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">{crmData.stats.totalProspects}</span>
              </div>
              <p className="text-blue-600 text-sm font-medium mt-1">Total Prospects</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-red-600" />
                <span className="text-2xl font-bold text-red-700">{crmData.stats.hotProspects}</span>
              </div>
              <p className="text-red-600 text-sm font-medium mt-1">Prospects Chauds</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-green-700">{crmData.stats.convertedToday}</span>
              </div>
              <p className="text-green-600 text-sm font-medium mt-1">Conversions Jour</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <Star className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-purple-700">{crmData.stats.averageScore}</span>
              </div>
              <p className="text-purple-600 text-sm font-medium mt-1">Score Moyen</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-700">{crmData.stats.conversionRate}%</span>
              </div>
              <p className="text-yellow-600 text-sm font-medium mt-1">Taux Conversion</p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-700">{formatCurrency(crmData.stats.monthlyRevenue).slice(0, -8)}M</span>
              </div>
              <p className="text-emerald-600 text-sm font-medium mt-1">Revenus Mois</p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center justify-between">
                <Award className="w-8 h-8 text-indigo-600" />
                <span className="text-lg font-bold text-indigo-700">{formatCurrency(crmData.stats.avgDealSize).slice(0, -8)}M</span>
              </div>
              <p className="text-indigo-600 text-sm font-medium mt-1">Deal Moyen</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
              <div className="flex items-center justify-between">
                <Activity className="w-8 h-8 text-pink-600" />
                <span className="text-2xl font-bold text-pink-700">{crmData.stats.coldProspects}</span>
              </div>
              <p className="text-pink-600 text-sm font-medium mt-1">À Relancer</p>
            </div>
          </div>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un prospect..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {[
                { id: 'all', label: 'Tous', count: crmData.stats.totalProspects },
                { id: 'hot', label: 'Chauds', count: crmData.stats.hotProspects },
                { id: 'warm', label: 'Tièdes', count: 15 },
                { id: 'new', label: 'Nouveaux', count: 8 },
                { id: 'cold', label: 'Froids', count: crmData.stats.coldProspects }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-white/60 text-gray-600 hover:bg-white hover:text-orange-600'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Liste des prospects */}
        <div className="grid gap-6">
          {filteredProspects.map((prospect, index) => (
            <motion.div
              key={prospect.id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 ${getPriorityColor(prospect.priority)} border-t border-r border-b border-white/20`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start space-x-6">
                {/* Avatar et infos principales */}
                <div className="flex-shrink-0">
                  <img
                    src={prospect.avatar}
                    alt={prospect.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold text-center border ${getScoreColor(prospect.score)}`}>
                    Score: {prospect.score}/100
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{prospect.name}</h3>
                      <p className="text-gray-600 font-medium">{prospect.position} - {prospect.company}</p>
                      <p className="text-orange-600 font-semibold mt-1">{prospect.interestedProperty}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(prospect.status)}`}>
                        {prospect.status}
                      </span>
                      <div className="text-right">
                        <p className="text-green-600 font-bold">{prospect.budget}</p>
                        <p className="text-xs text-gray-500">Budget</p>
                      </div>
                    </div>
                  </div>

                  {/* Contacts et actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{prospect.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{prospect.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Source: {prospect.source}</span>
                    </div>
                  </div>

                  {/* Notes et prochaine action */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-2">{prospect.notes}</p>
                        <div className="flex items-center space-x-2 text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">Prochaine action: {prospect.nextAction}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center space-x-2 mb-4">
                    {prospect.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <a 
                      href={`tel:${prospect.phone}`}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Appeler</span>
                    </a>
                    <a 
                      href={`mailto:${prospect.email}?subject=Suivi: ${prospect.property}`}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </a>
                    <button className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span>RDV</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => setSelectedProspect(prospect)}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Détails</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activité récente */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-orange-600" />
            Activité Récente
          </h3>
          <div className="space-y-3">
            {crmData.activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'email' ? 'bg-green-100 text-green-600' :
                  activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'call' && <Phone className="w-5 h-5" />}
                  {activity.type === 'email' && <Mail className="w-5 h-5" />}
                  {activity.type === 'meeting' && <Calendar className="w-5 h-5" />}
                  {activity.type === 'note' && <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-600">avec {activity.prospect} • Il y a {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VendeurCRM;