import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Globe,
  Settings,
  Bell,
  Eye,
  Plus,
  Download,
  Activity,
  Zap,
  Database,
  Server,
  Cpu,
  Lock,
  Unlock,
  Coins,
  Link2,
  Bot,
  BrainCircuit,
  Sparkles,
  Layers,
  TrendingDown,
  Calendar,
  MapPin,
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts';

const UltraModernAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('dark');

  const [dashboardData, setDashboardData] = useState({
    // KPIs en temps réel
    realTimeKPIs: {
      totalUsers: 3247,
      activeUsersNow: 156,
      totalProperties: 1654,
      pendingTransactions: 23,
      blockchainTxns: 8934,
      aiPredictions: 12,
      systemUptime: 99.94,
      monthlyRevenue: 892000000,
      dailyGrowth: 12.4,
      conversionRate: 8.7
    },

    // Blockchain Analytics
    blockchain: {
      totalTokens: 45678,
      activeContracts: 234,
      networkHashRate: '145.2 TH/s',
      averageBlockTime: '2.1s',
      gasPrice: '12 gwei',
      validatorNodes: 127,
      stakingRewards: 156780,
      totalValueLocked: 234567890
    },

    // AI Analytics
    aiMetrics: {
      predictionsToday: 1247,
      accuracyRate: 94.2,
      modelsDeployed: 8,
      autoDecisions: 456,
      fraudDetected: 12,
      priceOptimizations: 89
    },

    // Système & Performance
    system: {
      cpuUsage: 42,
      memoryUsage: 67,
      diskUsage: 78,
      networkThroughput: 890,
      activeConnections: 2340,
      databaseQueries: 45670,
      cacheHitRatio: 96.8,
      responseTime: 120
    },

    // Données graphiques
    revenueChart: [
      { month: 'Jan', revenue: 65000000, blockchain: 12000000, ai: 8000000 },
      { month: 'Fév', revenue: 78000000, blockchain: 15000000, ai: 12000000 },
      { month: 'Mar', revenue: 89000000, blockchain: 18000000, ai: 15000000 },
      { month: 'Avr', revenue: 95000000, blockchain: 22000000, ai: 18000000 },
      { month: 'Mai', revenue: 112000000, blockchain: 28000000, ai: 22000000 },
      { month: 'Juin', revenue: 134000000, blockchain: 35000000, ai: 28000000 }
    ],

    userDistribution: [
      { name: 'Acheteurs', value: 45, color: '#10B981' },
      { name: 'Vendeurs', value: 25, color: '#3B82F6' },
      { name: 'Investisseurs', value: 15, color: '#8B5CF6' },
      { name: 'Promoteurs', value: 10, color: '#F59E0B' },
      { name: 'Autres', value: 5, color: '#EF4444' }
    ],

    propertyTypes: [
      { name: 'Résidentiel', transactions: 234, value: 45000000 },
      { name: 'Commercial', transactions: 89, value: 67000000 },
      { name: 'Terrain nu', transactions: 156, value: 23000000 },
      { name: 'Industriel', transactions: 34, value: 89000000 }
    ]
  });

  useEffect(() => {
    // Simulation données temps réel
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        timestamp: new Date().toISOString(),
        activeUsers: Math.floor(Math.random() * 50) + 130,
        currentTransactions: Math.floor(Math.random() * 10) + 15,
        systemLoad: Math.floor(Math.random() * 20) + 40
      }));
    }, 5000);

    // Simulation notifications
    const notifInterval = setInterval(() => {
      const notifications = [
        { id: Date.now(), type: 'success', message: 'Nouvelle transaction blockchain confirmée' },
        { id: Date.now() + 1, type: 'warning', message: 'Pic de trafic détecté sur le système' },
        { id: Date.now() + 2, type: 'info', message: 'IA: 5 nouvelles prédictions générées' },
        { id: Date.now() + 3, type: 'error', message: 'Tentative de fraude bloquée automatiquement' }
      ];
      
      setNotifications(prev => [...notifications.slice(-3)]);
    }, 10000);

    setLoading(false);

    return () => {
      clearInterval(interval);
      clearInterval(notifInterval);
    };
  }, []);

  const stats = [
    {
      title: "Utilisateurs Actifs",
      value: dashboardData.realTimeKPIs.totalUsers.toLocaleString(),
      change: `+${dashboardData.realTimeKPIs.dailyGrowth}%`,
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500",
      description: "Croissance continue"
    },
    {
      title: "Transactions Blockchain",
      value: dashboardData.blockchain.totalTokens.toLocaleString(),
      change: "+8.2%",
      changeType: "positive", 
      icon: Link2,
      color: "bg-purple-500",
      description: "Tokens actifs"
    },
    {
      title: "Revenus Mensuels",
      value: `${(dashboardData.realTimeKPIs.monthlyRevenue / 1000000).toFixed(0)}M FCFA`,
      change: "+15.3%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-green-500", 
      description: "Performance financière"
    },
    {
      title: "IA - Précision",
      value: `${dashboardData.aiMetrics.accuracyRate}%`,
      change: "+2.1%",
      changeType: "positive",
      icon: BrainCircuit,
      color: "bg-orange-500",
      description: "Modèles prédictifs"
    }
  ];

  const SystemHealthCard = ({ title, value, max, color, icon: Icon, status }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className={`h-4 w-4 text-${color}-500`} />
            {title}
          </CardTitle>
          <Badge variant={status === 'optimal' ? 'default' : status === 'warning' ? 'destructive' : 'secondary'}>
            {status === 'optimal' ? 'OK' : status === 'warning' ? 'WARN' : 'CRIT'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{value}%</span>
            <span className="text-muted-foreground">{max}%</span>
          </div>
          <Progress value={value} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="🚀 Dashboard Admin Ultra-Moderne"
      subtitle="Supervision intelligente avec IA, Blockchain & Analytics temps réel"
      userRole="Admin"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Notifications temps réel */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Alertes Temps Réel</span>
              </div>
              <div className="space-y-1">
                {notifications.map(notif => (
                  <div key={notif.id} className="text-sm text-blue-800">
                    • {notif.message}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Widgets IA & Blockchain Premium */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AIAssistantWidget userRole="Admin" dashboardData={dashboardData} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BlockchainWidget userRole="Admin" />
          </motion.div>
        </div>

        {/* Analytics temps réel */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">🎯 Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="blockchain">⛓️ Blockchain</TabsTrigger>
            <TabsTrigger value="ai">🤖 Intelligence IA</TabsTrigger>
            <TabsTrigger value="system">⚙️ Système</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Temps Réel */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">Revenus Aujourd'hui</p>
                      <p className="text-2xl font-bold text-green-700">2.8M FCFA</p>
                      <p className="text-xs text-green-600">+12% vs hier</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Utilisateurs Actifs</p>
                      <p className="text-2xl font-bold text-blue-700">{realTimeData.activeUsers || 156}</p>
                      <p className="text-xs text-blue-600">En ligne maintenant</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-900">Smart Contracts</p>
                      <p className="text-2xl font-bold text-purple-700">{dashboardData.blockchain.activeContracts}</p>
                      <p className="text-xs text-purple-600">Actifs sur réseau</p>
                    </div>
                    <Layers className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-900">IA Prédictions</p>
                      <p className="text-2xl font-bold text-orange-700">{dashboardData.aiMetrics.predictionsToday}</p>
                      <p className="text-xs text-orange-600">Générées aujourd'hui</p>
                    </div>
                    <Sparkles className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques Revenus & Utilisateurs */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Évolution des Revenus
                  </CardTitle>
                  <CardDescription>Revenus par source de revenus (6 derniers mois)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.revenueChart}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBlockchain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${(value/1000000).toFixed(1)}M FCFA`, '']} />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="blockchain" stackId="2" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorBlockchain)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Répartition des Utilisateurs
                  </CardTitle>
                  <CardDescription>Distribution par type d'utilisateur</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={dashboardData.userDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <SystemHealthCard 
                title="CPU" 
                value={dashboardData.system.cpuUsage} 
                max={100} 
                color="blue" 
                icon={Cpu}
                status="optimal"
              />
              <SystemHealthCard 
                title="Mémoire" 
                value={dashboardData.system.memoryUsage} 
                max={100} 
                color="green" 
                icon={Database}
                status="warning"
              />
              <SystemHealthCard 
                title="Disque" 
                value={dashboardData.system.diskUsage} 
                max={100} 
                color="orange" 
                icon={Server}
                status="warning"
              />
              <SystemHealthCard 
                title="Réseau" 
                value={85} 
                max={100} 
                color="purple" 
                icon={Activity}
                status="optimal"
              />
            </div>
          </TabsContent>

          {/* Les autres onglets seront ajoutés dans les prochaines itérations */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UltraModernAdminDashboard;