import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';

const OffersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement de données
    setTimeout(() => {
      setData([]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Offres Reçues
          </h1>
          <p className="text-gray-600">
            Gestion des offres sur vos biens
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Offres Reçues
            </h3>
            <p className="text-gray-600 mb-6">
              Cette fonctionnalité est en cours de développement.
            </p>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Commencer
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OffersPage;