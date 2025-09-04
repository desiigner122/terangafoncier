/**
 * Wizard de création de compte multi-étapes
 */

import React, { useState, useEffect } from 'react';
import { accountCreationService } from '../../lib/accountCreationService';
import { ROLES } from '../../lib/rbacConfig';
import { ChevronLeft, ChevronRight, User, Building, Shield, CheckCircle, AlertCircle } from 'lucide-react';

// Composants d'étapes
import PersonalInfoStep from './steps/PersonalInfoStep';
import TerritorialInfoStep from './steps/TerritorialInfoStep';
import BankInfoStep from './steps/BankInfoStep';
import NotaryOfficeStep from './steps/NotaryOfficeStep';
import SurveyorOfficeStep from './steps/SurveyorOfficeStep';
import ProfessionalInfoStep from './steps/ProfessionalInfoStep';
import CoverageAreaStep from './steps/CoverageAreaStep';
import LegalAuthorizationsStep from './steps/LegalAuthorizationsStep';
import TechnicalQualificationsStep from './steps/TechnicalQualificationsStep';
import SecurityInfoStep from './steps/SecurityInfoStep';
import ConfirmationStep from './steps/ConfirmationStep';

const MultiStepAccountCreation = ({ initialRole = null, onSuccess, onCancel }) => {
  const [role, setRole] = useState(initialRole);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);
  const [steps, setSteps] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser le service quand le rôle est sélectionné
  useEffect(() => {
    if (role && ROLES[role]) {
      try {
        const initResult = accountCreationService.initializeCreation(role);
        if (initResult.success) {
          setCurrentStep(initResult.currentStep);
          setTotalSteps(initResult.totalSteps);
          setSteps(initResult.steps);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        setErrors({ init: error.message });
      }
    }
  }, [role]);

  // Sélection du rôle
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ role: selectedRole });
    setErrors({});
  };

  // Passer à l'étape suivante
  const handleNextStep = async (stepData) => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await accountCreationService.nextStep(stepData);
      
      if (result.success) {
        setCurrentStep(result.currentStep);
        setFormData(prev => ({ ...prev, ...stepData }));
        
        // Si c'est la dernière étape, finaliser le compte
        if (result.currentStep > totalSteps) {
          await handleFinalizeAccount();
        }
      } else {
        setErrors(result.errors || {});
      }
    } catch (error) {
      console.error('❌ Erreur étape suivante:', error);
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Revenir à l'étape précédente
  const handlePreviousStep = () => {
    const result = accountCreationService.previousStep();
    if (result.success) {
      setCurrentStep(result.currentStep);
      setErrors({});
    }
  };

  // Finaliser la création du compte
  const handleFinalizeAccount = async () => {
    setIsLoading(true);
    
    try {
      const result = await accountCreationService.finalizeAccount();
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.user, result.message);
        }
      } else {
        setErrors({ finalization: result.error });
        setCurrentStep(totalSteps); // Retourner à la dernière étape
      }
    } catch (error) {
      console.error('❌ Erreur finalisation:', error);
      setErrors({ finalization: error.message });
      setCurrentStep(totalSteps);
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler la création
  const handleCancel = () => {
    accountCreationService.resetService();
    if (onCancel) {
      onCancel();
    }
  };

  // Rendu du composant d'étape approprié
  const renderStepComponent = () => {
    if (!isInitialized || !steps[currentStep - 1]) {
      return <div className="text-center py-8">Chargement...</div>;
    }

    const currentStepConfig = steps[currentStep - 1];
    const commonProps = {
      data: formData,
      errors: errors,
      onNext: handleNextStep,
      onPrevious: currentStep > 1 ? handlePreviousStep : null,
      isLoading,
      role
    };

    switch (currentStepConfig.component) {
      case 'PersonalInfo':
        return <PersonalInfoStep {...commonProps} />;
      case 'TerritorialInfo':
        return <TerritorialInfoStep {...commonProps} />;
      case 'BankInfo':
        return <BankInfoStep {...commonProps} />;
      case 'NotaryOffice':
        return <NotaryOfficeStep {...commonProps} />;
      case 'SurveyorOffice':
        return <SurveyorOfficeStep {...commonProps} />;
      case 'ProfessionalInfo':
        return <ProfessionalInfoStep {...commonProps} />;
      case 'CoverageArea':
        return <CoverageAreaStep {...commonProps} />;
      case 'LegalAuthorizations':
        return <LegalAuthorizationsStep {...commonProps} />;
      case 'TechnicalQualifications':
        return <TechnicalQualificationsStep {...commonProps} />;
      case 'SecurityInfo':
        return <SecurityInfoStep {...commonProps} />;
      case 'Confirmation':
        return <ConfirmationStep {...commonProps} onFinalize={handleFinalizeAccount} />;
      default:
        return <div className="text-center py-8">Composant d'étape non trouvé</div>;
    }
  };

  // Indicateur de progression
  const renderProgressIndicator = () => {
    if (!isInitialized) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Création de compte {role}
          </h2>
          <span className="text-sm text-gray-600">
            Étape {currentStep} sur {totalSteps}
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Étapes */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const isAvailable = stepNumber <= currentStep;

            return (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${
                  isAvailable ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted ? 'bg-green-500 text-white' : 
                    isActive ? 'bg-blue-600 text-white' : 
                    'bg-gray-200 text-gray-600'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-20">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Sélection du rôle si pas encore fait
  if (!role) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Créer un nouveau compte
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sélectionnez votre type de compte
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLES).map(([roleKey, roleConfig]) => (
              <button
                key={roleKey}
                onClick={() => handleRoleSelection(roleKey)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Building className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-800">{roleKey}</h3>
                  <p className="text-sm text-gray-600 text-center mt-1">
                    {roleConfig.description || `Compte ${roleKey}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderProgressIndicator()}
      
      {/* Erreurs générales */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{errors.general}</span>
          </div>
        </div>
      )}

      {/* Contenu de l'étape */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderStepComponent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Annuler
        </button>

        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepAccountCreation;
