import React from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lock, User, Shield, ArrowRight } from 'lucide-react';
import { getDefaultDashboard, PERMISSIONS } from '@/lib/rbacConfig';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AccessDeniedPage = () => {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  
  const requestedPermission = searchParams.get('permission');
  const userRole = searchParams.get('role');
  const requiredRoles = searchParams.get('required');
  
  if (!profile) {
    return null;
  }

  const defaultDashboard = getDefaultDashboard(profile.role);
  
  // Obtenir les pages accessibles par le rôle actuel
  const accessiblePages = Object.entries(PERMISSIONS)
    .filter(([, allowedRoles]) => allowedRoles.includes(profile.role))
    .map(([permission]) => permission);

  const roleDisplayNames = {
    'Admin': 'Administrateur',
    'Agent Foncier': 'Agent Foncier',
    'Particulier': 'Particulier',
    'Vendeur Particulier': 'Vendeur Particulier',
    'Vendeur Pro': 'Vendeur Professionnel',
    'Banque': 'Banque',
    'Mairie': 'Mairie',
    'Notaire': 'Notaire',
    'Geometre': 'Géomètre',
    'Investisseur': 'Investisseur',
    'Promoteur': 'Promoteur',
    'Agriculteur': 'Agriculteur'
  };

  const permissionDisplayNames = {
    'MY_REQUESTS': 'Mes Demandes',
    'FAVORITES': 'Mes Favoris',
    'DIGITAL_VAULT': 'Coffre-fort Numérique',
    'REQUEST_MUNICIPAL_LAND': 'Demande Terrain Municipal',
    'SELL_PROPERTY': 'Vendre une Propriété',
    'MY_LISTINGS': 'Mes Annonces',
    'ADD_PARCEL': 'Ajouter une Parcelle',
    'INVESTMENTS': 'Mes Investissements',
    'MARKET_ANALYSIS': 'Analyse de Marché',
    'OPPORTUNITIES': 'Opportunités',
    'ROI_CALCULATOR': 'Calculateur ROI',
    'DUE_DILIGENCE': 'Due Diligence',
    'PROJECTS': 'Mes Projets',
    'CONSTRUCTION_TRACKING': 'Suivi Construction',
    'SALES': 'Ventes',
    'MY_LANDS': 'Mes Terres',
    'LOGBOOK': 'Carnet de Bord',
    'SOIL_ANALYSIS': 'Analyse du Sol',
    'WEATHER': 'Météo',
    'EQUIPMENT': 'Équipements',
    'FUNDING_REQUESTS': 'Demandes de Financement',
    'GUARANTEES': 'Garanties',
    'LAND_VALUATION': 'Évaluation Foncière',
    'COMPLIANCE': 'Conformité',
    'MAIRIE_REQUESTS': 'Demandes Mairie',
    'LAND_MANAGEMENT': 'Gestion Foncière',
    'CADASTRE': 'Cadastre',
    'DISPUTES': 'Litiges',
    'URBAN_PLAN': 'Plan Urbain',
    'CASES': 'Dossiers',
    'AUTHENTICATION': 'Authentification',
    'ARCHIVES': 'Archives',
    'COMPLIANCE_CHECK': 'Vérification Conformité'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg border-red-200">
          <CardHeader className="text-center border-b bg-red-50">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-800 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Accès Interdit
            </CardTitle>
            <CardDescription className="text-red-600 text-lg">
              Cette page est réservée à certains types d'utilisateurs
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Informations utilisateur */}
            <Alert className="border-blue-200 bg-blue-50">
              <User className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Votre rôle actuel :</strong> {roleDisplayNames[profile.role] || profile.role}
                <Badge variant="outline" className="ml-2 text-blue-600 border-blue-300">
                  {profile.role}
                </Badge>
              </AlertDescription>
            </Alert>

            {/* Page demandée */}
            {requestedPermission && (
              <Alert className="border-orange-200 bg-orange-50">
                <Shield className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Page demandée :</strong> {permissionDisplayNames[requestedPermission] || requestedPermission}
                </AlertDescription>
              </Alert>
            )}

            {/* Message explicatif */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-700 text-center">
                Cette fonctionnalité est conçue pour un usage spécialisé. 
                Chaque rôle a accès à des outils adaptés à ses besoins métier.
              </p>
            </div>

            {/* Actions recommandées */}
            <div className="space-y-4">
              <div className="text-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to={defaultDashboard} className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Retour à mon tableau de bord
                  </Link>
                </Button>
              </div>

              {/* Suggestions d'amélioration du compte */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Besoin d'accès supplémentaires ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-green-700">
                    <p className="text-sm">
                      • Contactez votre administrateur pour une modification de rôle
                    </p>
                    <p className="text-sm">
                      • Vérifiez si vous devez devenir vendeur pour certaines fonctionnalités
                    </p>
                    <p className="text-sm">
                      • Assurez-vous que votre compte est correctement vérifié
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact support */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>
                Problème persistant ? {' '}
                <Link to="/contact" className="text-blue-600 hover:underline">
                  Contactez le support technique
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccessDeniedPage;
