import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  User, 
  Users, 
  Scale, 
  MapPin, 
  Building2, 
  Hammer, 
  Landmark, 
  Briefcase,
  LogIn,
  Eye,
  Zap
} from 'lucide-react';
import { localAuth } from '@/services/LocalAuthService';

const DashboardSelectorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const dashboards = [
    {
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'Gestion complète de la plateforme',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      role: 'admin',
      features: ['Gestion utilisateurs', 'Analytics globales', 'Configuration système']
    },
    {
      id: 'particular',
      title: 'Particulier Dashboard',
      description: 'Interface pour les particuliers',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      role: 'particular',
      features: ['Mes propriétés', 'Recherche terrains', 'Demandes communales']
    },
    {
      id: 'agent_foncier',
      title: 'Agent Foncier Dashboard',
      description: 'Gestion des dossiers fonciers',
      icon: Users,
      color: 'from-green-500 to-green-600',
      role: 'agent_foncier',
      features: ['Validation dossiers', 'Suivi procédures', 'Cartographie']
    },
    {
      id: 'notaire',
      title: 'Notaire Dashboard',
      description: 'Actes notariés et certifications',
      icon: Scale,
      color: 'from-purple-500 to-purple-600',
      role: 'notaire',
      features: ['Actes notariés', 'Authentifications', 'Archives juridiques']
    },
    {
      id: 'geometre',
      title: 'Géomètre Dashboard',
      description: 'Mesures et délimitations',
      icon: MapPin,
      color: 'from-orange-500 to-orange-600',
      role: 'geometre',
      features: ['Bornage terrains', 'Plans topographiques', 'Géolocalisation']
    },
    {
      id: 'banque',
      title: 'Banque Dashboard',
      description: 'Services financiers fonciers',
      icon: Building2,
      color: 'from-indigo-500 to-indigo-600',
      role: 'banque',
      features: ['Crédits immobiliers', 'Évaluations', 'Garanties hypothécaires']
    },
    {
      id: 'promoteur',
      title: 'Promoteur Dashboard',
      description: 'Développement immobilier',
      icon: Hammer,
      color: 'from-yellow-500 to-yellow-600',
      role: 'promoteur',
      features: ['Projets développement', 'Permis construire', 'Commercialisation']
    },
    {
      id: 'lotisseur',
      title: 'Lotisseur Dashboard',
      description: 'Subdivision et aménagement',
      icon: Briefcase,
      color: 'from-teal-500 to-teal-600',
      role: 'lotisseur',
      features: ['Lotissements', 'Viabilisation', 'Commercialisation lots']
    },
    {
      id: 'mairie',
      title: 'Mairie Dashboard',
      description: 'Administration municipale',
      icon: Landmark,
      color: 'from-pink-500 to-pink-600',
      role: 'mairie',
      features: ['Urbanisme', 'Autorisations', 'Domaine communal']
    }
  ];

  const handleQuickAccess = async (dashboard) => {
    setLoading(dashboard.id);
    
    try {
      // Connexion automatique avec le rôle sélectionné
      const result = localAuth.quickSignIn(dashboard.role);
      
      if (result.user) {
        // Mapping des IDs vers les vraies routes
        const routeMapping = {
          'admin': '/admin',
          'particular': '/particulier',
          'agent_foncier': '/agent-foncier',
          'notaire': '/notaire',
          'geometre': '/geometre',
          'banque': '/banque',
          'promoteur': '/promoteur',
          'lotisseur': '/lotisseur',
          'mairie': '/mairie'
        };
        
        const route = routeMapping[dashboard.id] || `/${dashboard.id}`;
        
        // Redirection vers le dashboard
        setTimeout(() => {
          navigate(route);
        }, 500);
      } else {
        console.error('Erreur connexion automatique:', result.error);
      }
    } catch (error) {
      console.error('Erreur accès dashboard:', error);
    }
    
    setTimeout(() => setLoading(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏗️ Dashboards Teranga Foncier
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accès direct aux 9 dashboards spécialisés de la plateforme foncière du Sénégal
          </p>
          <Badge variant="secondary" className="mt-4">
            <Zap className="w-4 h-4 mr-1" />
            Accès rapide sans inscription
          </Badge>
        </motion.div>

        {/* Grid des dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard, index) => {
            const IconComponent = dashboard.icon;
            const isLoading = loading === dashboard.id;
            
            return (
              <motion.div
                key={dashboard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${dashboard.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {dashboard.title}
                    </CardTitle>
                    <p className="text-gray-600">
                      {dashboard.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Fonctionnalités */}
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          Fonctionnalités clés :
                        </h4>
                        <ul className="space-y-1">
                          {dashboard.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Boutons d'accès */}
                      <div className="space-y-2 pt-4">
                        <Button
                          onClick={() => handleQuickAccess(dashboard)}
                          disabled={isLoading}
                          className={`w-full bg-gradient-to-r ${dashboard.color} hover:opacity-90 text-white`}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Connexion...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              Accès Rapide
                            </div>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate('/temp-login')}
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Connexion Standard
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 p-6 bg-white rounded-xl shadow-sm"
        >
          <h3 className="font-semibold text-gray-900 mb-2">
            🎯 Accès Instantané
          </h3>
          <p className="text-gray-600 mb-4">
            Cliquez sur "Accès Rapide" pour explorer immédiatement chaque dashboard avec des données simulées réalistes.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">Aucune inscription requise</Badge>
            <Badge variant="outline">Données simulées</Badge>
            <Badge variant="outline">Interface complète</Badge>
            <Badge variant="outline">9 rôles spécialisés</Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSelectorPage;
