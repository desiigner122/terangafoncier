/**
 * Étape 1: Informations personnelles
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ChevronRight
} from 'lucide-react';

const PersonalInfoStep = ({ data, errors, onNext, isLoading, role }) => {
  const [formData, setFormData] = useState({
    full_name: data.full_name || '',
    email: data.email || '',
    phone: data.phone || '',
    date_of_birth: data.date_of_birth || '',
    address: data.address || '',
    ...data
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const personalErrors = errors.personal || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Informations personnelles
        </h2>
        <p className="text-gray-600 mt-2">
          Renseignez vos informations personnelles pour créer votre compte {role}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom complet */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nom complet *
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              personalErrors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre nom complet"
            required
          />
          {personalErrors.full_name && (
            <p className="text-red-500 text-sm mt-1">{personalErrors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Adresse email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              personalErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="votre.email@exemple.com"
            required
          />
          {personalErrors.email && (
            <p className="text-red-500 text-sm mt-1">{personalErrors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Numéro de téléphone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              personalErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+221 XX XXX XX XX"
            required
          />
          {personalErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{personalErrors.phone}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Format: +221 suivi de 9 chiffres
          </p>
        </div>

        {/* Date de naissance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date de naissance *
          </label>
          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              personalErrors.date_of_birth ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {personalErrors.date_of_birth && (
            <p className="text-red-500 text-sm mt-1">{personalErrors.date_of_birth}</p>
          )}
        </div>

        {/* Adresse */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Adresse complète *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              personalErrors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre adresse complète (rue, quartier, ville)"
            required
          />
          {personalErrors.address && (
            <p className="text-red-500 text-sm mt-1">{personalErrors.address}</p>
          )}
        </div>
      </div>

      {/* Bouton suivant */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Validation...
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">
          Informations importantes
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Toutes les informations marquées d'un * sont obligatoires</li>
          <li>• Votre email servira d'identifiant de connexion</li>
          <li>• Vous devez être majeur pour créer un compte</li>
          <li>• Les informations seront vérifiées par nos équipes</li>
        </ul>
      </div>
    </form>
  );
};

export default PersonalInfoStep;

