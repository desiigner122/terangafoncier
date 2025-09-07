import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle, 
  Clock,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SimpleProgressTracker = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      {/* En-tête simplifié */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Villa Moderne Dakar</h3>
          <p className="text-sm text-gray-600">Suivi en temps réel</p>
        </div>
        <Badge className="bg-green-100 text-green-700">En cours</Badge>
      </div>

      {/* Progression globale simplifiée */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-lg font-bold text-blue-600">65%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Étapes simplifiées */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { name: "Fondations", status: "completed" },
          { name: "Structure", status: "active" },
          { name: "Finitions", status: "pending" },
          { name: "Livraison", status: "pending" }
        ].map((step, index) => (
          <div key={index} className="text-center">
            <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
              step.status === 'completed' ? 'bg-green-500 text-white' :
              step.status === 'active' ? 'bg-blue-500 text-white' :
              'bg-gray-200 text-gray-400'
            }`}>
              {step.status === 'completed' && <CheckCircle className="h-4 w-4" />}
              {step.status === 'active' && <Clock className="h-4 w-4" />}
              {step.status === 'pending' && <Clock className="h-4 w-4" />}
            </div>
            <p className="text-xs text-gray-600">{step.name}</p>
          </div>
        ))}
      </div>

      {/* Actions simplifiées */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Eye className="h-3 w-3 mr-1" />
          Voir preuves
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <BarChart3 className="h-3 w-3 mr-1" />
          Détails
        </Button>
      </div>
    </div>
  );
};

export default SimpleProgressTracker;
