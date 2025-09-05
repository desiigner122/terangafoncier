/**
 * Étape finale: Confirmation et création du compte
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Shield, 
  AlertCircle
} from 'lucide-react';

const ConfirmationStep = ({ data, errors, onFinalize, isLoading, role }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAccount = async () => {
    setIsCreating(true);
    try {
      await onFinalize();
    } catch (error) {
      console.error('Erreur création compte:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Masquer les informations sensibles
  const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  const maskPassword = (password) => {
    return '*'.repeat(password?.length || 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Vérification et confirmation
        </h2>
        <p className="text-gray-600 mt-2">
          Vérifiez vos informations avant de créer votre compte {role}
        </p>
      </div>

      {/* Erreurs de finalisation */}
      {errors.finalization && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <h3 className="font-medium text-red-800">Erreur lors de la création</h3>
              <p className="text-red-700 text-sm mt-1">{errors.finalization}</p>
            </div>
          </div>
        </div>
      )}

      {/* Récapitulatif des informations */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Récapitulatif de votre compte {role}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informations personnelles
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Nom:</span> {data.full_name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {maskEmail(data.email)}
              </div>
              <div>
                <span className="font-medium">Téléphone:</span> {data.phone}
              </div>
              <div>
                <span className="font-medium">Date de naissance:</span> {data.date_of_birth}
              </div>
              <div>
                <span className="font-medium">Adresse:</span> {data.address}
              </div>
            </div>
          </div>

          {/* Informations spécifiques au rôle */}
          <div className="space-y-3">
            {role === 'Mairie' && data.territorial_scope && (
              <>
                <h4 className="font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Territoire
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Région:</span> {data.territorial_scope.region}
                  </div>
                  <div>
                    <span className="font-medium">Département:</span> {data.territorial_scope.department}
                  </div>
                  <div>
                    <span className="font-medium">Commune:</span> {data.territorial_scope.commune}
                  </div>
                  <div>
                    <span className="font-medium">Municipalité:</span> {data.municipality_name}
                  </div>
                  <div>
                    <span className="font-medium">Maire:</span> {data.mayor_name}
                  </div>
                </div>
              </>
            )}

            {role === 'Banque' && (
              <>
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Informations bancaires
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Nom de la banque:</span> {data.bank_name}
                  </div>
                  <div>
                    <span className="font-medium">Code banque:</span> {data.bank_code}
                  </div>
                  <div>
                    <span className="font-medium">Siège social:</span> {data.headquarters_address}
                  </div>
                  <div>
                    <span className="font-medium">Licence:</span> {data.license_number}
                  </div>
                </div>
              </>
            )}

            {role === 'Notaire' && (
              <>
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Étude notariale
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Nom de l'étude:</span> {data.office_name}
                  </div>
                  <div>
                    <span className="font-medium">Numéro notarial:</span> {data.notary_number}
                  </div>
                  <div>
                    <span className="font-medium">Chambre notariale:</span> {data.bar_association}
                  </div>
                  <div>
                    <span className="font-medium">Adresse:</span> {data.office_address}
                  </div>
                </div>
              </>
            )}

            {role === 'Geometre' && (
              <>
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Cabinet de géométrie
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Nom du cabinet:</span> {data.office_name}
                  </div>
                  <div>
                    <span className="font-medium">Licence géomètre:</span> {data.surveyor_license}
                  </div>
                  <div>
                    <span className="font-medium">Spécialisations:</span> {data.specializations?.join(', ')}
                  </div>
                </div>
              </>
            )}

            {['Particulier', 'Vendeur Pro', 'Agent Foncier'].includes(role) && (
              <>
                <h4 className="font-medium text-gray-700 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Informations professionnelles
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Entreprise:</span> {data.company_name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Poste:</span> {data.job_title || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Expérience:</span> {data.experience_years ? `${data.experience_years} ans` : 'N/A'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sécurité */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 flex items-center mb-3">
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Mot de passe:</span> {maskPassword(data.password)}
            </div>
            <div>
              <span className="font-medium">Conditions acceptées:</span> {data.acceptTerms ? '✓' : '✗'}
            </div>
            <div>
              <span className="font-medium">Confidentialité acceptée:</span> {data.acceptPrivacy ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>

      {/* Informations importantes */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">
          Informations importantes
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Un email de confirmation sera envoyé à votre adresse</li>
          <li>• Votre compte devra être vérifié par nos équipes</li>
          <li>• Vous recevrez une notification une fois la vérification terminée</li>
          <li>• En cas de problème, contactez notre support technique</li>
        </ul>
      </div>

      {/* Bouton de création */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleCreateAccount}
          disabled={isLoading || isCreating}
          className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
        >
          {isLoading || isCreating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
              Création en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-3" />
              Créer mon compte {role}
            </>
          )}
        </button>
      </div>

      {/* Note légale */}
      <div className="text-center text-xs text-gray-500 mt-4">
        En créant votre compte, vous confirmez que toutes les informations fournies sont exactes et à jour.
        Toute fausse déclaration peut entraîner la suspension ou la fermeture de votre compte.
      </div>
    </div>
  );
};

export default ConfirmationStep;
