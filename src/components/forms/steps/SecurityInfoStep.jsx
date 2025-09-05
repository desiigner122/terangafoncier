/**
 * Étape de sécurité: Mot de passe et conditions
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  ChevronRight
} from 'lucide-react';
import { accountCreationService } from '../../../lib/accountCreationService';

const SecurityInfoStep = ({ data, errors, onNext, isLoading, role }) => {
  const [formData, setFormData] = useState({
    password: data.password || '',
    confirmPassword: data.confirmPassword || '',
    acceptTerms: data.acceptTerms || false,
    acceptPrivacy: data.acceptPrivacy || false,
    ...data
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Vérifier la force du mot de passe
    if (field === 'password') {
      const strength = accountCreationService.checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const securityErrors = errors.security || {};

  // Indicateur de force du mot de passe
  const renderPasswordStrength = () => {
    if (!passwordStrength || !formData.password) return null;

    const getStrengthColor = (strength) => {
      switch (strength) {
        case 'Très fort': return 'text-green-600 bg-green-100';
        case 'Fort': return 'text-green-600 bg-green-100';
        case 'Moyen': return 'text-yellow-600 bg-yellow-100';
        case 'Faible': return 'text-red-600 bg-red-100';
        default: return 'text-red-600 bg-red-100';
      }
    };

    return (
      <div className="mt-2">
        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStrengthColor(passwordStrength.strength)}`}>
          Force: {passwordStrength.strength}
        </div>
        
        <div className="mt-2 space-y-1">
          {Object.entries({
            length: 'Au moins 8 caractères',
            uppercase: 'Une majuscule',
            lowercase: 'Une minuscule', 
            numbers: 'Un chiffre',
            special: 'Un caractère spécial'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center text-xs">
              {passwordStrength.checks[key] ? (
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={passwordStrength.checks[key] ? 'text-green-600' : 'text-red-600'}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Sécurité du compte
        </h2>
        <p className="text-gray-600 mt-2">
          Créez un mot de passe sécurisé et acceptez nos conditions d'utilisation
        </p>
      </div>

      <div className="space-y-6">
        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                securityErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Créez un mot de passe sécurisé"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {securityErrors.password && (
            <p className="text-red-500 text-sm mt-1">{securityErrors.password}</p>
          )}
          {renderPasswordStrength()}
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                securityErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirmez votre mot de passe"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {securityErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{securityErrors.confirmPassword}</p>
          )}
        </div>

        {/* Acceptation des conditions */}
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
              J'accepte les{' '}
              <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                conditions d'utilisation
              </a>{' '}
              de Teranga Foncier *
            </label>
          </div>
          {securityErrors.acceptTerms && (
            <p className="text-red-500 text-sm">{securityErrors.acceptTerms}</p>
          )}

          <div className="flex items-start">
            <input
              type="checkbox"
              id="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="acceptPrivacy" className="ml-2 text-sm text-gray-700">
              J'accepte la{' '}
              <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                politique de confidentialité
              </a>{' '}
              et le traitement de mes données personnelles *
            </label>
          </div>
          {securityErrors.acceptPrivacy && (
            <p className="text-red-500 text-sm">{securityErrors.acceptPrivacy}</p>
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

      {/* Conseils de sécurité */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">
          Conseils de sécurité
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Utilisez un mot de passe unique pour ce compte</li>
          <li>• Ne partagez jamais vos identifiants avec d'autres personnes</li>
          <li>• Activez la double authentification si disponible</li>
          <li>• Déconnectez-vous après chaque session sur un ordinateur partagé</li>
        </ul>
      </div>
    </form>
  );
};

export default SecurityInfoStep;
