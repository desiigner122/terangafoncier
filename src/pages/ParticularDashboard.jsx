import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  CreditCard,
  Users,
  MapPin,
  Search,
  Bell,
  Settings,
  ShoppingCart,
  Heart,
  Star,
  Filter,
  Grid,
  List,
  ChevronRight,
  Bookmark,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ParticularDashboard = () => {
  const [activeSection, setActiveSection] = useState('recherche');
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    type: '',
    location: '',
    priceRange: '',
    surface: ''
  });
  const [viewMode, setViewMode] = useState('grid');

  const menuItems = [
    { id: 'recherche', label: 'Recherche de Biens', icon: Search, color: 'bg-blue-500' },
    { id: 'favoris', label: 'Mes Favoris', icon: Heart, color: 'bg-red-500' },
    { id: 'demandes', label: 'Mes Demandes', icon: FileText, color: 'bg-green-500' },
    { id: 'rendez-vous', label: 'Rendez-vous', icon: Calendar, color: 'bg-purple-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-orange-500' },
    { id: 'profil', label: 'Mon Profil', icon: Settings, color: 'bg-gray-500' }
  ];

  const sampleProperties = [
    {
      id: 1,
      title: "Villa Moderne - Almadies",
      location: "Almadies, Dakar",
      price: "450,000,000 FCFA",
      surface: "250 mÂ²",
      bedrooms: 4,
      bathrooms: 3,
      image: "/api/YOUR_API_KEY/300/200",
      type: "Villa",
      status: "Disponible",
      features: ["Piscine", "Jardin", "Garage", "Climatisation"]
    },
    {
      id: 2,
      title: "Appartement Standing - Plateau",
      location: "Plateau, Dakar",
      price: "180,000,000 FCFA",
      surface: "120 mÂ²",
      bedrooms: 3,
      bathrooms: 2,
      image: "/api/YOUR_API_KEY/300/200",
      type: "Appartement",
      status: "Disponible",
      features: ["Vue mer", "Ascenseur", "Parking", "SÃ©curitÃ©"]
    },
    {
      id: 3,
      title: "Terrain Constructible - Saly",
      location: "Saly, Mbour",
      price: "75,000,000 FCFA",
      surface: "800 mÂ²",
      image: "/api/YOUR_API_KEY/300/200",
      type: "Terrain",
      status: "Disponible",
      features: ["Titre foncier", "Proche plage", "ViabilisÃ©"]
    }
  ];

  const recentDemands = [
    {
      id: 1,
      type: "Visite",
      property: "Villa Moderne - Almadies",
      date: "2024-01-15",
      status: "En attente",
      statusColor: "bg-yellow-500"
    },
    {
      id: 2,
      type: "Information",
      property: "Appartement Standing - Plateau",
      date: "2024-01-14",
      status: "RÃ©pondu",
      statusColor: "bg-green-500"
    },
    {
      id: 3,
      type: "NÃ©gociation",
      property: "Terrain Constructible - Saly",
      date: "2024-01-13",
      status: "En cours",
      statusColor: "bg-blue-500"
    }
  ];

  const toggleFavorite = (propertyId) => {
    setFavoriteProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const PropertyCard = ({ property, isFavorite, onToggleFavorite }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onToggleFavorite(property.id)}
            className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400'} shadow-md hover:scale-110 transition-transform`}
          >
            <Heart size={20} fill={isFavorite ? 'white' : 'none'} />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {property.status}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">{property.price}</span>
          <span className="text-gray-500">{property.surface}</span>
        </div>
        
        {property.bedrooms && (
          <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
            <span>{property.bedrooms} chambres</span>
            <span>{property.bathrooms} SDB</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {property.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
              {feature}
            </span>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Voir dÃ©tails
          </button>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Phone size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSearchSection = () => (
    <div className="space-y-6">
      {/* Filtres de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2" />
            Filtres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchFilters.type}
              onChange={(e) => setSearchFilters({...searchFilters, type: e.target.value})}
            >
              <option value="">Type de bien</option>
              <option value="villa">Villa</option>
              <option value="appartement">Appartement</option>
              <option value="terrain">Terrain</option>
              <option value="bureau">Bureau</option>
            </select>
            
            <input
              type="text"
              YOUR_API_KEY="Localisation"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchFilters.location}
              onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
            />
            
            <select 
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchFilters.priceRange}
              onChange={(e) => setSearchFilters({...searchFilters, priceRange: e.target.value})}
            >
              <option value="">Budget</option>
              <option value="0-100M">0 - 100M FCFA</option>
              <option value="100M-300M">100M - 300M FCFA</option>
              <option value="300M+">300M+ FCFA</option>
            </select>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
              <button className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                Rechercher
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RÃ©sultats */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {sampleProperties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={favoriteProperties.includes(property.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mes Favoris</h2>
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
          {favoriteProperties.length} biens
        </span>
      </div>
      
      {favoriteProperties.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucun bien en favori pour le moment</p>
            <button 
              onClick={() => setActiveSection('recherche')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Parcourir les biens
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProperties
            .filter(property => favoriteProperties.includes(property.id))
            .map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
        </div>
      )}
    </div>
  );

  const renderDemands = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Mes Demandes</h2>
      
      <div className="space-y-4">
        {recentDemands.map(demand => (
          <Card key={demand.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${demand.statusColor}`}></span>
                    <h3 className="font-semibold text-gray-800">{demand.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${demand.statusColor}`}>
                      {demand.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{demand.property}</p>
                  <p className="text-sm text-gray-500 mt-1">{demand.date}</p>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'recherche': return renderSearchSection();
      case 'favoris': return renderFavorites();
      case 'demandes': return renderDemands();
      case 'rendez-vous': return (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Section Rendez-vous en dÃ©veloppement</p>
          </CardContent>
        </Card>
      );
      case 'notifications': return (
        <Card>
          <CardContent className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucune notification pour le moment</p>
          </CardContent>
        </Card>
      );
      case 'profil': return (
        <Card>
          <CardContent className="text-center py-12">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Section Profil en dÃ©veloppement</p>
          </CardContent>
        </Card>
      );
      default: return renderSearchSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Home className="text-blue-600" size={32} />
              <h1 className="text-xl font-bold text-gray-800">Espace Particulier</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell size={20} />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu latÃ©ral */}
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${activeSection === item.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticularDashboard;
