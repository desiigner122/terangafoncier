import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Clock, 
  Mail, 
  Phone, 
  AlertTriangle,
  RefreshCw,
  Shield,
  Wrench
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MaintenancePage = () => {
  const currentTime = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full space-y-8"
      >
        {/* Header avec logo */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6"
          >
            <Wrench className="h-10 w-10 text-orange-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Teranga Foncier
          </h1>
          <p className="text-lg text-gray-600">
            Plateforme immobilière du Sénégal
          </p>
        </div>

        {/* Carte principale de maintenance */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2">
                <Settings className="h-4 w-4 mr-2" />
                Maintenance en cours
              </Badge>
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Site temporairement indisponible
            </CardTitle>
            <CardDescription className="text-lg">
              Nous effectuons actuellement des améliorations importantes pour vous offrir une meilleure expérience
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Status */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 text-orange-600 mr-2 animate-spin" />
                  <span className="font-medium text-orange-900">Maintenance en cours...</span>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Actif
                </Badge>
              </div>
              
              <div className="text-sm text-orange-800">
                <p className="mb-2">
                  <strong>Dernière mise à jour :</strong> {currentTime}
                </p>
                <p>
                  <strong>Type de maintenance :</strong> Mise à jour système et amélioration des performances
                </p>
              </div>
            </div>

            {/* Ce que nous améliorons */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Améliorations en cours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Optimisation des performances
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Renforcement de la sécurité
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Nouvelles fonctionnalités
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Interface utilisateur améliorée
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button 
                onClick={handleRefresh} 
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Vérifier à nouveau
              </Button>
              
              <div className="text-center text-sm text-gray-500">
                La maintenance sera terminée dans les plus brefs délais
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de contact */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
              Besoin d'aide ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                palaye122@gmail.com
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-green-600" />
                +221 77 593 42 41
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Pour les urgences, contactez notre équipe support qui reste disponible 24h/24
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Teranga Foncier - Tous droits réservés</p>
          <p className="mt-1">
            Plateforme immobilière intelligente au Sénégal
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;