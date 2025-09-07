import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Building, Calendar,
  CheckCircle, Star, Award, TrendingUp, CreditCard,
  FileText, BarChart3, Settings
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const UserProfileTestPage = () => {
  const { user, profile } = useUser();

  // Données de test pour démontrer les fonctionnalités
  const userStats = {
    totalTransactions: 12,
    totalValue: 45600000,
    successRate: 96,
    joinDate: '2023-10-15',
    lastLogin: new Date().toISOString()
  };

  const recentActivity = [
    {
      id: 1,
      type: 'transaction',
      description: 'Terrain vendu à Mbour',
      amount: 15000000,
      date: '2024-03-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'message',
      description: 'Nouveau message de Aminata Diallo',
      date: '2024-03-14',
      status: 'new'
    },
    {
      id: 3,
      type: 'document',
      description: 'Document téléchargé: Plan_Terrain.pdf',
      date: '2024-03-13',
      status: 'info'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'transaction':
        return <CreditCard className="w-5 h-5 text-green-500" />;
      case 'message':
        return <Mail className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex">
      <ModernSidebar currentPage="profile" />
      <div className="flex-1 ml-80 p-6 bg-gray-50 min-h-screen">
        <Helmet>
          <title>Test Profil - Teranga Foncier</title>
          <meta name="description" content="Page de test du profil utilisateur" />
        </Helmet>

        {/* En-tête avec nom d'utilisateur */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenue, {profile?.name || user?.email?.split('@')[0] || 'Utilisateur'} ! 🎉
            </h1>
            <p className="text-gray-600">
              Voici votre profil et vos activités récentes
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil utilisateur principal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profil Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar et infos principales */}
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                      {profile?.name ? 
                        profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                        (user?.email ? user.email.slice(0, 2).toUpperCase() : 'U')
                      }
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {profile?.name || 'Nom non défini'}
                  </h3>
                  <Badge variant="secondary" className="mb-2">
                    {profile?.role || 'Rôle non défini'}
                  </Badge>
                  
                  {profile?.company && (
                    <p className="text-sm text-gray-600 mb-4">
                      <Building className="w-4 h-4 inline mr-1" />
                      {profile.company}
                    </p>
                  )}
                </div>

                {/* Informations de contact */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user?.email || 'Email non défini'}</span>
                  </div>
                  
                  {profile?.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{profile.phone}</span>
                    </div>
                  )}
                  
                  {profile?.location && (
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Membre depuis {new Date(userStats.joinDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Statut de vérification */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compte vérifié</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistiques et activités */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <CreditCard className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.totalTransactions}
                  </div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(userStats.totalValue)}
                  </div>
                  <div className="text-sm text-gray-600">Volume total</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.successRate}%
                  </div>
                  <div className="text-sm text-gray-600">Taux de succès</div>
                </CardContent>
              </Card>
            </div>

            {/* Activités récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                        </p>
                        {activity.amount && (
                          <p className="text-sm font-semibold text-green-600">
                            {formatCurrency(activity.amount)}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 
                                activity.status === 'new' ? 'destructive' : 'secondary'}
                      >
                        {activity.status === 'completed' ? 'Terminé' : 
                         activity.status === 'new' ? 'Nouveau' : 'Info'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-16 flex flex-col space-y-1">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Nouvelle vente</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-1">
                    <Mail className="w-5 h-5" />
                    <span className="text-xs">Messages</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-1">
                    <FileText className="w-5 h-5" />
                    <span className="text-xs">Documents</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-1">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-xs">Statistiques</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Debug des données utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Debug - Données utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Données utilisateur (user):</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Données profil (profile):</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(profile, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfileTestPage;
