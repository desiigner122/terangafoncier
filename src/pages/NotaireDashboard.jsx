import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  Stamp, 
  BookOpen, 
  Users, 
  Shield, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  Banknote, 
  TrendingUp, 
  Archive, 
  Signature, 
  Lock, 
  Phone, 
  Mail, 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  Building, 
  Home, 
  MapPin, 
  Calculator, 
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { supabase } from '@/lib/supabase';

const NotaireDashboard = () => {
  const { user, profile } = useAuth();
  
  // États pour les métriques notaire
  const [notaireMetrics, setNotaireMetrics] = useState({
    activeFiles: 24,              // Dossiers en cours
    completedActs: 156,           // Actes terminés
    monthlyRevenue: 3250000,      // Revenus mensuels FCFA
    clientSatisfaction: 96,       // Satisfaction client
    responseTime: 0.8,            // Temps réponse (jours)
    legalCompliance: 99.2,        // Conformité légale
    averageActValue: 45000000,    // Valeur moyenne actes
    registrationSuccess: 98.7,    // Taux enregistrement
    clientRetention: 87,          // Fidélisation clients
    professionalRating: 4.8,     // Note professionnelle
    yearsExperience: 15,          // Années d'expérience
    specializations: 6            // Domaines spécialisés
  });

  // Données pour les graphiques
  const [chartData, setChartData] = useState({
    monthlyActivity: [
      { month: 'Sept', actes: 18, revenus: 2800000, valeur: 650000000 },
      { month: 'Oct', actes: 22, revenus: 3100000, valeur: 780000000 },
      { month: 'Nov', actes: 25, revenus: 3450000, valeur: 920000000 },
      { month: 'Déc', actes: 20, revenus: 2950000, valeur: 700000000 },
      { month: 'Jan', actes: 24, revenus: 3200000, valeur: 850000000 },
      { month: 'Fév', actes: 21, revenus: 3250000, valeur: 780000000 }
    ],
    actTypes: [
      { type: 'Vente Immobilière', count: 45, revenue: 6750000, avgValue: 35000000, color: '#0088FE' },
      { type: 'Donation', count: 18, revenue: 1800000, avgValue: 25000000, color: '#00C49F' },
      { type: 'Succession', count: 12, revenue: 2400000, avgValue: 55000000, color: '#FFBB28' },
      { type: 'Hypothèque', count: 8, revenue: 1600000, avgValue: 80000000, color: '#FF8042' },
      { type: 'Bail Emphytéotique', count: 5, revenue: 1250000, avgValue: 120000000, color: '#8884D8' },
      { type: 'Partage', count: 6, revenue: 1500000, avgValue: 40000000, color: '#82CA9D' }
    ],
    clientTypes: [
      { type: 'Particuliers', percentage: 65, color: '#0088FE' },
      { type: 'Entreprises', percentage: 25, color: '#00C49F' },
      { type: 'Administrations', percentage: 10, color: '#FFBB28' }
    ]
  });

  // Dossiers actifs du notaire
  const [activeFiles, setActiveFiles] = useState([
    {
      id: 'NOT-001',
      type: 'Vente Immobilière',
      client: 'M. & Mme Diallo',
      property: 'Villa Almadies - 4 pièces',
      value: 180000000,
      status: 'draft_review',
      progress: 75,
      deadline: '2024-03-20',
      priority: 'high',
      fees: 2700000,
      location: 'Almadies, Dakar'
    },
    {
      id: 'NOT-002',
      type: 'Succession',
      client: 'Famille Ba',
      property: 'Terrain + Bâtiments Rufisque',
      value: 85000000,
      status: 'FileTextation',
      progress: 45,
      deadline: '2024-04-15',
      priority: 'medium',
      fees: 1700000,
      location: 'Rufisque'
    },
    {
      id: 'NOT-003',
      type: 'Donation',
      client: 'Mme Fatou Sall',
      property: 'Appartement Plateau',
      value: 65000000,
      status: 'signature_pending',
      progress: 90,
      deadline: '2024-03-12',
      priority: 'urgent',
      fees: 975000,
      location: 'Plateau, Dakar'
    }
  ]);

  // Agenda rendez-vous
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      time: '09:00',
      client: 'M. Amadou Ndiaye',
      type: 'Signature acte vente',
      duration: 60,
      status: 'confirmed',
      location: 'Étude notariale'
    },
    {
      id: 2,
      time: '11:30',
      client: 'Société IMMODA',
      type: 'Conseil juridique',
      duration: 45,
      status: 'confirmed',
      location: 'Étude notariale'
    },
    {
      id: 3,
      time: '14:00',
      client: 'Famille Thiam',
      type: 'Lecture testament',
      duration: 90,
      status: 'pending',
      location: 'Étude notariale'
    },
    {
      id: 4,
      time: '16:30',
      client: 'Mme Aida Diop',
      type: 'Authentification FileTexts',
      duration: 30,
      status: 'confirmed',
      location: 'Étude notariale'
    }
  ]);

  useEffect(() => {
    loadNotaireData();
  }, []);

  const loadNotaireData = async () => {
    try {
      // Charger les données réelles depuis Supabase
      const { data: acts } = await supabase
        .from('notarial_acts')
        .select('*')
        .eq('notaire_id', user?.id)
        .order('created_at', { ascending: false });

      if (acts) {
        // Calculer métriques réelles
        const activeFilesCount = acts.filter(a => a.status !== 'completed').length;
        const completedCount = acts.filter(a => a.status === 'completed').length;
        const totalRevenue = acts.reduce((sum, a) => sum + (a.fees || 0), 0);
        
        setNotaireMetrics(prev => ({
          ...prev,
          activeFiles: activeFilesCount,
          completedActs: completedCount,
          monthlyRevenue: totalRevenue
        }));
      }
    } catch (error) {
      console.error('Erreur chargement données notaire:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft_review': return <Edit3 className="w-4 h-4" />;
      case 'FileTextation': return <FileText className="w-4 h-4" />;
      case 'signature_pending': return <Signature className="w-4 h-4" />;
      case 'registration': return <Stamp className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft_review: { label: 'Révision', className: 'bg-blue-100 text-blue-800' },
      FileTextation: { label: 'FileTextation', className: 'bg-yellow-100 text-yellow-800' },
      signature_pending: { label: 'Signature', className: 'bg-orange-100 text-orange-800' },
      registration: { label: 'Enregistrement', className: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status] || statusConfig.draft_review;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800' },
      high: { label: 'Prioritaire', className: 'bg-orange-100 text-orange-800' },
      medium: { label: 'Normal', className: 'bg-blue-100 text-blue-800' },
      low: { label: 'Différé', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getAppointmentStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmé', className: 'bg-green-100 text-green-800' },
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatValue = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}Mrd FCFA`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M FCFA`;
    } else {
      return formatCurrency(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Notaire */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-amber-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Étude Notariale - Dashboard Professionnel
                </h1>
                <p className="text-gray-600">
                  Bonjour Maître {profile?.last_name || 'Notaire'}, gérez vos actes et dossiers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                Archives
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Nouvel Acte
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPIs Notaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dossiers Actifs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dossiers Actifs</p>
                    <p className="text-3xl font-bold text-amber-600">{notaireMetrics.activeFiles}</p>
                    <p className="text-xs text-amber-500 mt-1">+4 cette semaine</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <FileText className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenus Mensuels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(notaireMetrics.monthlyRevenue)}
                    </p>
                    <p className="text-xs text-green-500 mt-1">+8.5% vs mois dernier</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Banknote className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conformité Légale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conformité Légale</p>
                    <p className="text-3xl font-bold text-blue-600">{notaireMetrics.legalCompliance}%</p>
                    <p className="text-xs text-blue-500 mt-1">Excellent niveau</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Satisfaction Client */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfaction Client</p>
                    <p className="text-3xl font-bold text-purple-600">{notaireMetrics.clientSatisfaction}%</p>
                    <p className="text-xs text-purple-500 mt-1">Note: {notaireMetrics.professionalRating}/5</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Graphiques Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité Mensuelle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Activité Notariale Mensuelle
                </CardTitle>
                <CardDescription>
                  Évolution actes et revenus sur 6 mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [
                      name === 'actes' ? value : name === 'revenus' ? formatCurrency(value) : formatValue(value),
                      name === 'actes' ? 'Actes' : name === 'revenus' ? 'Revenus' : 'Valeur Totale'
                    ]} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="actes"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#fbbf24"
                      name="Actes"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenus"
                      stackId="2"
                      stroke="#10b981"
                      fill="#34d399"
                      name="Revenus"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Types d'Actes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Répartition Types d'Actes
                </CardTitle>
                <CardDescription>
                  Volume et revenus par spécialité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData.actTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {chartData.actTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Actes']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Dossiers Actifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dossiers en Cours de Traitement
              </CardTitle>
              <CardDescription>
                Suivi détaillé de vos actes actifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-amber-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          {getStatusIcon(file.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{file.type} - {file.id}</h4>
                          <p className="text-gray-600">{file.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(file.status)}
                        {getPriorityBadge(file.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{file.property}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{file.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Échéance: {file.deadline}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progression</span>
                        <span className="text-sm text-gray-600">{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Valeur Acte</p>
                          <p className="font-bold text-blue-600">{formatValue(file.value)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Honoraires</p>
                          <p className="font-bold text-green-600">{formatCurrency(file.fees)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Consulter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Signature className="w-4 h-4 mr-2" />
                          Signer
                        </Button>
                        <Button size="sm" className="bg-amber-500 text-white">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agenda du Jour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Agenda du Jour - {new Date().toLocaleDateString('fr-FR')}
              </CardTitle>
              <CardDescription>
                Vos rendez-vous et rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{appointment.time} - {appointment.client}</h4>
                          <p className="text-gray-600 text-sm">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{appointment.duration}min</span>
                        {getAppointmentStatusBadge(appointment.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistiques Détaillées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Statistiques Professionnelles
              </CardTitle>
              <CardDescription>
                Performance et indicateurs clés de votre étude
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {notaireMetrics.completedActs}
                  </div>
                  <p className="text-gray-600">Actes Terminés</p>
                  <p className="text-xs text-green-500 mt-1">Cette année</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatValue(notaireMetrics.averageActValue)}
                  </div>
                  <p className="text-gray-600">Valeur Moyenne Actes</p>
                  <p className="text-xs text-blue-500 mt-1">+12% vs année dernière</p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {notaireMetrics.registrationSuccess}%
                  </div>
                  <p className="text-gray-600">Taux Enregistrement</p>
                  <p className="text-xs text-green-500 mt-1">Excellent niveau</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotaireDashboard;

