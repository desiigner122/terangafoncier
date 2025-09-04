/**
 * Page de test pour le système de création de comptes multi-étapes
 */

import React, { useState } from 'react';
import MultiStepAccountCreation from '../components/forms/MultiStepAccountCreation';
import { User, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const AccountCreationTestPage = () => {
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [creationResult, setCreationResult] = useState(null);

  const handleStartCreation = (role) => {
    setSelectedRole(role);
    setShowCreationForm(true);
    setCreationResult(null);
  };

  const handleCreationSuccess = (user, message) => {
    setCreationResult({
      success: true,
      user,
      message
    });
    setShowCreationForm(false);
  };

  const handleCreationCancel = () => {
    setShowCreationForm(false);
    setSelectedRole(null);
    setCreationResult(null);
  };

  const roles = [
    { key: 'Mairie', name: 'Mairie', description: 'Administration communale avec gestion territoriale' },
    { key: 'Banque', name: 'Banque', description: 'Institution financière avec zones de couverture' },
    { key: 'Notaire', name: 'Notaire', description: 'Office notarial avec habilitations légales' },
    { key: 'Geometre', name: 'Géomètre', description: 'Cabinet de géométrie avec qualifications techniques' },
    { key: 'Agent Foncier', name: 'Agent Foncier', description: 'Professionnel de l\'immobilier' },
    { key: 'Vendeur Pro', name: 'Vendeur Pro', description: 'Vendeur professionnel immobilier' },
    { key: 'Particulier', name: 'Particulier', description: 'Utilisateur particulier' }
  ];

  if (showCreationForm) {
    return (
      <MultiStepAccountCreation
        initialRole={selectedRole}
        onSuccess={handleCreationSuccess}
        onCancel={handleCreationCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Système de Création de Comptes Multi-Étapes
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Testez notre système complet de création de comptes avec validation par étapes, 
            gestion territoriale pour les mairies, et workflows spécialisés pour chaque rôle.
          </p>
        </div>

        {/* Résultat de création */}
        {creationResult && (
          <div className={`mb-8 p-6 rounded-lg border ${
            creationResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              {creationResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1" />
              )}
              <div>
                <h3 className={`font-medium ${
                  creationResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {creationResult.success ? 'Compte créé avec succès!' : 'Erreur lors de la création'}
                </h3>
                <p className={`mt-1 text-sm ${
                  creationResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {creationResult.message}
                </p>
                {creationResult.success && creationResult.user && (
                  <div className="mt-3 text-sm text-green-700">
                    <p><strong>Utilisateur:</strong> {creationResult.user.full_name}</p>
                    <p><strong>Email:</strong> {creationResult.user.email}</p>
                    <p><strong>Rôle:</strong> {creationResult.user.role}</p>
                    <p><strong>ID:</strong> {creationResult.user.id}</p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setCreationResult(null)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Masquer ce message
            </button>
          </div>
        )}

        {/* Sélection du rôle */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Choisissez un type de compte à créer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(role => (
              <div
                key={role.key}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => handleStartCreation(role.key)}
              >
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-800 mb-2">{role.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Créer un compte {role.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Fonctionnalités du système
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">🎯 Validation multi-étapes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Validation en temps réel</li>
                <li>• Sauvegarde automatique</li>
                <li>• Navigation flexible</li>
                <li>• Gestion d'erreurs complète</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">🗺️ Gestion territoriale</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hiérarchie région/département/commune</li>
                <li>• Création dynamique de territoires</li>
                <li>• Validation d'unicité des mairies</li>
                <li>• Liaison territoriale automatique</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">🔐 Sécurité renforcée</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mots de passe sécurisés</li>
                <li>• Validation des forces</li>
                <li>• Chiffrement des données</li>
                <li>• Authentification Supabase</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">👥 Rôles spécialisés</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Workflows personnalisés</li>
                <li>• Champs métier spécifiques</li>
                <li>• Validations adaptées</li>
                <li>• Interface contextuelle</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">📋 Données complètes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Informations personnelles</li>
                <li>• Données professionnelles</li>
                <li>• Certifications et licences</li>
                <li>• Zones de couverture</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">✅ Vérification</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Email de confirmation</li>
                <li>• Vérification administrateur</li>
                <li>• Contrôle des documents</li>
                <li>• Validation des licences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions techniques */}
        <div className="mt-8 bg-gray-800 text-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Instructions techniques
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Composants créés:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• <code>MultiStepAccountCreation.jsx</code> - Wizard principal</li>
                <li>• <code>PersonalInfoStep.jsx</code> - Informations personnelles</li>
                <li>• <code>TerritorialInfoStep.jsx</code> - Gestion territoriale</li>
                <li>• <code>SecurityInfoStep.jsx</code> - Sécurité et mots de passe</li>
                <li>• <code>ConfirmationStep.jsx</code> - Validation finale</li>
                <li>• + composants spécialisés par rôle</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Services utilisés:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• <code>accountCreationService.js</code> - Logique métier</li>
                <li>• <code>territorialManager.js</code> - Gestion territoriale</li>
                <li>• <code>rbacConfig.js</code> - Configuration des rôles</li>
                <li>• <code>supabaseClient.js</code> - Base de données</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-700 rounded">
            <p className="text-gray-300 text-sm">
              <strong>Test complet:</strong> Sélectionnez un rôle ci-dessus pour tester le processus de création 
              complet avec toutes les validations, la gestion territoriale pour les mairies, 
              et l'intégration avec Supabase pour l'authentification et la base de données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationTestPage;
