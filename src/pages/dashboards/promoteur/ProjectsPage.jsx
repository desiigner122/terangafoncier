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

const ProjectsPage = () => {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mes Projets
        </h1>
        <p className="text-gray-600">
          Gestion de vos projets immobiliers
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Projet
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projets</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <Building className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unités Disponibles</p>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Réservations</p>
              <p className="text-2xl font-bold text-orange-600">89</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de Réservation</p>
              <p className="text-2xl font-bold text-purple-600">73%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            name: 'Résidence Les Palmiers',
            location: 'Almadies, Dakar',
            type: 'Appartements',
            totalUnits: 24,
            availableUnits: 6,
            reservedUnits: 18,
            priceRange: '45M - 85M FCFA',
            progress: 75,
            status: 'Ouvert aux réservations',
            deliveryDate: '2025-06-30',
            features: ['Vue mer', '2-4 pièces', 'Parking', 'Piscine'],
            reservationRate: 75
          },
          {
            id: 2,
            name: 'Villas Duplex Mermoz',
            location: 'Mermoz, Dakar',
            type: 'Villas',
            totalUnits: 8,
            availableUnits: 2,
            reservedUnits: 6,
            priceRange: '65M - 95M FCFA',
            progress: 45,
            status: 'Construction en cours',
            deliveryDate: '2025-12-31',
            features: ['R+1', '5 chambres', 'Jardin', 'Garage'],
            reservationRate: 75
          },
          {
            id: 3,
            name: 'Complexe Les Jardins',
            location: 'VDN, Dakar',
            type: 'Mixte',
            totalUnits: 36,
            availableUnits: 12,
            reservedUnits: 24,
            priceRange: '35M - 120M FCFA',
            progress: 20,
            status: 'Pré-commercialisation',
            deliveryDate: '2026-08-15',
            features: ['Appartements + Villas', 'Espaces verts', 'Commerce', 'École'],
            reservationRate: 67
          }
        ].map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                <Building className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status.includes('réservations') ? 'bg-green-100 text-green-800' :
                  project.status.includes('Construction') ? 'bg-blue-100 text-blue-800' :
                  project.status.includes('Pré-commercialisation') ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {project.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {project.location} • {project.type}
              </div>

              {/* Prix et disponibilité */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="font-bold text-green-600">{project.priceRange}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Disponible</p>
                  <p className="font-bold text-blue-600">{project.availableUnits}/{project.totalUnits}</p>
                </div>
              </div>

              {/* Taux de réservation */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Réservations</span>
                  <span className="font-semibold text-orange-600">{project.reservationRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${project.reservationRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {feature}
                  </span>
                ))}
                {project.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{project.features.length - 3}
                  </span>
                )}
              </div>

              {/* Livraison */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                Livraison: {project.deliveryDate}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-1" />
                  Détails
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                  <Edit className="w-4 h-4 mr-1" />
                  Gérer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;