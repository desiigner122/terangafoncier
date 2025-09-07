import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Map, MapPin, Search, Filter, Eye, Shield, Zap, Target, Home, DollarSign, Phone, Star } from 'lucide-react';

const InteractiveMapPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Propriétés fictives avec données réalistes pour le Sénégal
  const properties = [
    {
      id: 1,
      title: "Terrain résidentiel - Almadies",
      location: "Almadies, Dakar",
      price: 75000000,
      surface: 500,
      type: "terrain",
      status: "verified",
      coordinates: { lat: 14.7645, lng: -17.5230 },
      owner: "Promoteur Sénégal Plus",
      phone: "+221 77 123 45 67",
      rating: 4.8,
      amenities: ["electricity", "water", "road"],
      description: "Terrain viabilisé dans le quartier résidentiel des Almadies"
    },
    {
      id: 2,
      title: "Villa moderne - Mermoz",
      location: "Mermoz, Dakar",
      price: 180000000,
      surface: 300,
      type: "villa",
      status: "available",
      coordinates: { lat: 14.7392, lng: -17.4816 },
      owner: "Construction Téranga",
      phone: "+221 77 987 65 43",
      rating: 4.9,
      amenities: ["electricity", "water", "road", "garden"],
      description: "Villa moderne avec jardin et garage"
    },
    {
      id: 3,
      title: "Appartement 3 pièces - Plateau",
      location: "Plateau, Dakar",
      price: 95000000,
      surface: 120,
      type: "appartement",
      status: "sold",
      coordinates: { lat: 14.6928, lng: -17.4467 },
      owner: "Immobilier Central",
      phone: "+221 77 456 78 90",
      rating: 4.6,
      amenities: ["electricity", "water", "elevator"],
      description: "Appartement moderne au cœur du Plateau"
    },
    {
      id: 4,
      title: "Terrain commercial - Thiès",
      location: "Centre-ville, Thiès",
      price: 45000000,
      surface: 800,
      type: "commercial",
      status: "verified",
      coordinates: { lat: 14.7889, lng: -16.9300 },
      owner: "Invest Thiès",
      phone: "+221 77 234 56 78",
      rating: 4.5,
      amenities: ["electricity", "water", "road", "commercial"],
      description: "Terrain commercial bien situé à Thiès"
    },
    {
      id: 5,
      title: "Villa traditionnelle - Saint-Louis",
      location: "Île de Saint-Louis",
      price: 85000000,
      surface: 250,
      type: "villa",
      status: "available",
      coordinates: { lat: 16.0469, lng: -16.4894 },
      owner: "Patrimoine Saint-Louis",
      phone: "+221 77 345 67 89",
      rating: 4.7,
      amenities: ["electricity", "water", "heritage"],
      description: "Villa coloniale rénovée sur l'île historique"
    }
  ];

  const propertyTypes = [
    { value: 'all', label: 'Tous', icon: Home },
    { value: 'terrain', label: 'Terrains', icon: MapPin },
    { value: 'villa', label: 'Villas', icon: Home },
    { value: 'appartement', label: 'Appartements', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: DollarSign }
  ];

  const statusColors = {
    verified: 'bg-green-100 text-green-800',
    available: 'bg-blue-100 text-blue-800',
    sold: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    verified: 'Vérifié',
    available: 'Disponible',
    sold: 'Vendu'
  };

  const filteredProperties = properties.filter(property => {
    const matchesFilter = activeFilter === 'all' || property.type === activeFilter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const features = [
    {
      icon: Shield,
      title: "Propriétés Vérifiées",
      description: "Toutes les propriétés sont vérifiées par nos notaires partenaires"
    },
    {
      icon: Zap,
      title: "Recherche Intelligente",
      description: "Filtres avancés et géolocalisation pour trouver le bien idéal"
    },
    {
      icon: Target,
      title: "Contact Direct",
      description: "Contactez directement les propriétaires vérifiés"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Carte Interactive des Propriétés - Teranga Foncier</title>
        <meta name="description" content="Explorez les terrains et propriétés disponibles au Sénégal sur notre carte interactive. Propriétés vérifiées, prix transparents, contact direct." />
        <meta name="keywords" content="carte immobilier sénégal, terrains dakar, propriétés vérifiées, géolocalisation foncier" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-teal-600/10"></div>
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl">
                  <Map className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
                Carte Interactive des Propriétés
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Explorez les terrains et propriétés disponibles au Sénégal en temps réel.
                <br />
                <span className="text-green-600 font-semibold">Propriétés vérifiées • Géolocalisation • Contact direct</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Interface */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Search and Filters */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Rechercher des Propriétés</h2>
                
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par localisation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    {propertyTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setActiveFilter(type.value)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${
                          activeFilter === type.value
                            ? 'bg-white text-green-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <type.icon className="inline h-4 w-4 mr-2" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-white/90">
                  {filteredProperties.length} propriété{filteredProperties.length > 1 ? 's' : ''} trouvée{filteredProperties.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Map Simulation */}
              <div className="h-96 bg-gradient-to-br from-green-100 to-teal-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Carte Interactive</h3>
                    <p className="text-gray-600">
                      Visualisation des {filteredProperties.length} propriétés disponibles
                    </p>
                  </div>
                </div>
                
                {/* Property markers simulation */}
                {filteredProperties.slice(0, 3).map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer ${
                      property.status === 'verified' ? 'bg-green-500' :
                      property.status === 'available' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                    style={{
                      left: `${20 + index * 25}%`,
                      top: `${30 + index * 15}%`
                    }}
                    onClick={() => setSelectedProperty(property)}
                  />
                ))}
              </div>

              {/* Properties List */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Propriétés Disponibles</h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  {filteredProperties.map(property => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-semibold text-gray-800">{property.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[property.status]}`}>
                          {statusLabels[property.status]}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        {property.location}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Prix</div>
                          <div className="text-lg font-bold text-green-600">
                            {property.price.toLocaleString()} CFA
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Surface</div>
                          <div className="text-lg font-semibold text-gray-800">
                            {property.surface}m²
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">{property.rating}</span>
                        </div>
                        <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-teal-700 transition-all">
                          <Eye className="inline h-4 w-4 mr-1" />
                          Voir détails
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Detail Modal */}
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedProperty.title}</h3>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedProperty.location}
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Prix</div>
                    <div className="text-3xl font-bold text-green-600">
                      {selectedProperty.price.toLocaleString()} CFA
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Surface</div>
                    <div className="text-2xl font-semibold text-gray-800">
                      {selectedProperty.surface}m²
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{selectedProperty.description}</p>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Propriétaire</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{selectedProperty.owner}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {selectedProperty.rating} étoiles
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Contacter
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-teal-700 transition-all">
                    Programmer visite
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Vous avez une propriété à vendre ?
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Ajoutez votre propriété sur notre carte et touchez des milliers d'acheteurs vérifiés
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Ajouter ma propriété
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Devenir partenaire
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InteractiveMapPage;
