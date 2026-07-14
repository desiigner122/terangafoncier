import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Image, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Camera,
  FileText,
  Upload,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ConstructionProgressBar = ({ projectName = "Projet en construction", phases = [], updates = [] }) => {
  const [selectedPhase, setSelectedPhase] = useState(phases[0]?.id ?? null);

  const constructionPhases = phases;
  const recentUpdates = updates;

  const overallProgress = constructionPhases.length > 0
    ? Math.round(
        constructionPhases.reduce((sum, phase) => sum + (phase.progress || 0), 0) / constructionPhases.length
      )
    : 0;

  const getProgressColor = (progress, status) => {
    if (status === 'completed') return 'bg-emerald-500';
    if (status === 'active') return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    if (status === 'active') return <Clock className="h-4 w-4 text-blue-600" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* En-tête du projet */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{projectName}</h3>
          <p className="text-gray-600">Suivi en temps réel par le promoteur</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          En Construction
        </Badge>
      </div>

      {/* Barre de progression globale */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-900">Progression Globale</span>
          <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        {recentUpdates.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Dernière mise à jour: {recentUpdates[0].date}{recentUpdates[0].promoter ? ` par ${recentUpdates[0].promoter}` : ''}
          </p>
        )}
      </div>

      {/* Phases de construction */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Phases de Construction</h4>
        {constructionPhases.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            Aucune donnée de construction disponible pour le moment.
          </p>
        ) : (
        <div className="space-y-4">
          {constructionPhases.map((phase) => (
            <motion.div
              key={phase.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPhase === phase.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPhase(phase.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phase.status)}
                  <span className="font-semibold text-gray-900">{phase.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{phase.progress}%</div>
                  <div className="text-sm text-gray-600">{phase.date}</div>
                </div>
              </div>

              {/* Barre de progression de la phase */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <motion.div 
                  className={`h-2 rounded-full ${getProgressColor(phase.progress, phase.status)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{phase.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    <span>{phase.images}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{phase.videos}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

      {/* Mises à jour récentes */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Mises à Jour Récentes</h4>
        {recentUpdates.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucune mise à jour récente.
          </p>
        ) : (
        <div className="space-y-3">
          {recentUpdates.map((update, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {update.type === 'image' && <Image className="h-5 w-5 text-blue-600" />}
                {update.type === 'video' && <Play className="h-5 w-5 text-emerald-600" />}
                {update.type === 'report' && <FileText className="h-5 w-5 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{update.title}</span>
                  {update.verified && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {update.date}{update.promoter ? ` • ${update.promoter}` : ''}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1">
          <Camera className="h-4 w-4 mr-2" />
          Voir Toutes les Preuves
        </Button>
        <Button variant="outline" className="flex-1">
          <Upload className="h-4 w-4 mr-2" />
          Demander Mise à Jour
        </Button>
      </div>
    </div>
  );
};

export default ConstructionProgressBar;
