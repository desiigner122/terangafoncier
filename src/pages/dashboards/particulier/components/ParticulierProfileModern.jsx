import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  CreditCard,
  Heart,
  Eye,
  MessageSquare,
  TrendingUp,
  Settings,
  Lock,
  Smartphone,
  Globe,
  DollarSign,
  Home,
  Building2,
  Building,
  Briefcase,
  Star,
  Award,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

const ParticulierProfileModern = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    firstName: 'Aminata',
    lastName: 'Diallo',
    email: 'aminata.diallo@email.com',
    phone: '+221 77 123 45 67',
    location: 'Dakar, Sénégal',
    birthDate: '1985-06-15',
    bio: 'À la recherche d\'un bien immobilier familial dans la région de Dakar. Intéressée par les villas et appartements modernes.',
    preferences: {
      propertyTypes: ['villa', 'apartment'],
      locations: ['Almadies', 'Mamelles', 'Point E'],
      budgetMin: 30000000,
      budgetMax: 80000000,
      bedrooms: 3,
      features: ['parking', 'security', 'wifi']
    },
    notifications: {
      newProperties: true,
      priceChanges: true,
      appointments: true,
      newsletter: false
    }
  });

  const [stats] = useState({
    propertiesViewed: 187,
    favoriteProperties: 24,
    agentsContacted: 12,
    visitsScheduled: 8,
    memberSince: '2023-03-15',
    profileViews: 45,
    rating: 4.8,
    verified: true
  });

  const propertyTypes = [
    { id: 'villa', name: 'Villa', icon: Home },
    { id: 'apartment', name: 'Appartement', icon: Building2 },
    { id: 'office', name: 'Bureau', icon: Briefcase },
    { id: 'studio', name: 'Studio', icon: Building }
  ];

  const locations = [
    'Almadies', 'Plateau', 'Mamelles', 'Ouakam', 'Ngor', 'Yoff', 'Parcelles Assainies',
    'Grand Dakar', 'Medina', 'HLM', 'Liberté', 'Point E', 'Mermoz', 'Sacré-Cœur'
  ];

  const features = [
    { id: 'parking', name: 'Parking' },
    { id: 'security', name: 'Sécurité 24h' },
    { id: 'wifi', name: 'WiFi' },
    { id: 'garden', name: 'Jardin' },
    { id: 'pool', name: 'Piscine' },
    { id: 'furnished', name: 'Meublé' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Logique de sauvegarde
    console.log('Profil sauvegardé:', profileData);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const formatPrice = (price) => {
    return (price / 1000000).toFixed(0) + 'M FCFA';
  };

  const sections = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'preferences', name: 'Préférences', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'activity', name: 'Activité', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Mon Profil Particulier
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gérez vos informations personnelles et vos préférences de recherche
        </p>
      </motion.div>

      {/* Profile Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Biens Vus</p>
              <p className="text-3xl font-bold">{stats.propertiesViewed}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Favoris</p>
              <p className="text-3xl font-bold">{stats.favoriteProperties}</p>
            </div>
            <Heart className="h-8 w-8 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Agents Contactés</p>
              <p className="text-3xl font-bold">{stats.agentsContacted}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Visites</p>
              <p className="text-3xl font-bold">{stats.visitsScheduled}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-8">
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <motion.button
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="h-4 w-4 text-gray-600" />
                </motion.button>
              </div>
              <h3 className="font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <div className="flex items-center justify-center mt-2">
                {stats.verified ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Profil Vérifié
                  </div>
                ) : (
                  <div className="flex items-center text-orange-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Non Vérifié
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600">{stats.rating}/5</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <section.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{section.name}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {sections.find(s => s.id === activeSection)?.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {activeSection === 'profile' && 'Informations personnelles'}
                    {activeSection === 'preferences' && 'Préférences de recherche'}
                    {activeSection === 'notifications' && 'Paramètres de notification'}
                    {activeSection === 'security' && 'Sécurité et confidentialité'}
                    {activeSection === 'activity' && 'Historique d\'activité'}
                  </p>
                </div>
                
                {activeSection === 'profile' && (
                  <div className="flex space-x-3">
                    {isEditing ? (
                      <>
                        <motion.button
                          className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          onClick={() => setIsEditing(false)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </motion.button>
                        <motion.button
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={handleSave}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setIsEditing(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section Content */}
            <div className="p-8">
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                      {isEditing ? (
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                          {new Date(profileData.birthDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
                    {isEditing ? (
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.bio}</p>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'preferences' && (
                <div className="space-y-8">
                  {/* Property Types */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Types de Biens Recherchés</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {propertyTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                            profileData.preferences.propertyTypes.includes(type.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            const newTypes = profileData.preferences.propertyTypes.includes(type.id)
                              ? profileData.preferences.propertyTypes.filter(t => t !== type.id)
                              : [...profileData.preferences.propertyTypes, type.id];
                            handlePreferenceChange('propertyTypes', newTypes);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <type.icon className="h-6 w-6 text-blue-600 mr-3" />
                          <span className="font-medium text-gray-900">{type.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Fourchette de Budget</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Minimum</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.preferences.budgetMin}
                          onChange={(e) => handlePreferenceChange('budgetMin', parseInt(e.target.value))}
                        />
                        <p className="text-sm text-gray-600 mt-1">{formatPrice(profileData.preferences.budgetMin)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Maximum</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={profileData.preferences.budgetMax}
                          onChange={(e) => handlePreferenceChange('budgetMax', parseInt(e.target.value))}
                        />
                        <p className="text-sm text-gray-600 mt-1">{formatPrice(profileData.preferences.budgetMax)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Locations */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Zones Préférées</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {locations.map((location) => (
                        <motion.button
                          key={location}
                          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm ${
                            profileData.preferences.locations.includes(location)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                          onClick={() => {
                            const newLocations = profileData.preferences.locations.includes(location)
                              ? profileData.preferences.locations.filter(l => l !== location)
                              : [...profileData.preferences.locations, location];
                            handlePreferenceChange('locations', newLocations);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {location}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Équipements Souhaités</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {features.map((feature) => (
                        <motion.button
                          key={feature.id}
                          className={`flex items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                            profileData.preferences.features.includes(feature.id)
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            const newFeatures = profileData.preferences.features.includes(feature.id)
                              ? profileData.preferences.features.filter(f => f !== feature.id)
                              : [...profileData.preferences.features, feature.id];
                            handlePreferenceChange('features', newFeatures);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium text-gray-900">{feature.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  {Object.entries(profileData.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key === 'newProperties' && 'Nouveaux biens'}
                          {key === 'priceChanges' && 'Changements de prix'}
                          {key === 'appointments' && 'Rendez-vous'}
                          {key === 'newsletter' && 'Newsletter'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'newProperties' && 'Recevoir des notifications pour les nouveaux biens'}
                          {key === 'priceChanges' && 'Être informé des changements de prix'}
                          {key === 'appointments' && 'Rappels de rendez-vous et visites'}
                          {key === 'newsletter' && 'Newsletter hebdomadaire'}
                        </p>
                      </div>
                      <motion.button
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        onClick={() => handleNotificationChange(key, !value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-7' : 'translate-x-1'
                          }`}
                          animate={{ x: value ? 28 : 4 }}
                        />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.button
                      className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Lock className="h-8 w-8 text-gray-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Changer le Mot de Passe</h3>
                      <p className="text-gray-600 text-sm">Mettre à jour votre mot de passe</p>
                    </motion.button>

                    <motion.button
                      className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Smartphone className="h-8 w-8 text-gray-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Authentification 2FA</h3>
                      <p className="text-gray-600 text-sm">Sécuriser votre compte</p>
                    </motion.button>
                  </div>
                </div>
              )}

              {activeSection === 'activity' && (
                <div className="space-y-6">
                  {/* Activity Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Eye className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">{stats.propertiesViewed}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Biens Consultés</h3>
                      <p className="text-gray-600 text-sm">Ce mois-ci</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <MessageSquare className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{stats.agentsContacted}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Agents Contactés</h3>
                      <p className="text-gray-600 text-sm">Total</p>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <span className="text-2xl font-bold text-purple-600">{stats.visitsScheduled}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Visites Planifiées</h3>
                      <p className="text-gray-600 text-sm">À venir</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Membre depuis</h3>
                        <p className="text-gray-600">{new Date(stats.memberSince).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParticulierProfileModern;