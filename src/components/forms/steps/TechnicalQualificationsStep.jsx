import React from 'react';
import { 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle
} from 'lucide-react';

const TechnicalQualificationsStep = ({ 
  formData, 
  updateFormData, 
  errors, 
  onNext, 
  onPrevious, 
  isValid 
}) => {
  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleArrayUpdate = (field, index, value) => {
    const currentArray = formData[field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateFormData({ [field]: newArray });
  };

  const addItem = (field) => {
    const currentArray = formData[field] || [];
    updateFormData({ [field]: [...currentArray, ''] });
  };

  const removeItem = (field, index) => {
    const currentArray = formData[field] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    updateFormData({ [field]: newArray });
  };

  const qualificationFields = {
    banque: {
      title: 'Qualifications Bancaires',
      fields: [
        { key: 'banking_certifications', label: 'Certifications bancaires', type: 'array', required: true },
        { key: 'financial_expertise', label: 'Expertises financières', type: 'array', required: false },
        { key: 'regulatory_knowledge', label: 'Connaissances réglementaires', type: 'textarea', required: true }
      ]
    },
    notaire: {
      title: 'Qualifications Notariales',
      fields: [
        { key: 'notary_specializations', label: 'Spécialisations notariales', type: 'array', required: true },
        { key: 'years_experience', label: 'Années d\'expérience', type: 'number', required: true },
        { key: 'professional_references', label: 'Références professionnelles', type: 'array', required: false }
      ]
    },
    geometre: {
      title: 'Qualifications Techniques',
      fields: [
        { key: 'technical_specializations', label: 'Spécialisations techniques', type: 'array', required: true },
        { key: 'surveying_tools', label: 'Outils de mesure maîtrisés', type: 'array', required: true },
        { key: 'software_expertise', label: 'Logiciels maîtrisés', type: 'array', required: false },
        { key: 'project_experience', label: 'Expérience projets (description)', type: 'textarea', required: true }
      ]
    },
    mairie: {
      title: 'Qualifications Administratives',
      fields: [
        { key: 'administrative_experience', label: 'Expérience administrative', type: 'textarea', required: true },
        { key: 'municipal_services', label: 'Services municipaux gérés', type: 'array', required: true },
        { key: 'population_served', label: 'Population desservie', type: 'number', required: false }
      ]
    }
  };

  const currentRole = formData.role?.toLowerCase() || 'particulier';
  const qualifications = qualificationFields[currentRole];

  if (!qualifications) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Qualifications Techniques
          </h2>
          <p className="text-gray-600">
            Aucune qualification technique spécifique requise pour ce rôle.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Précédent
          </button>
          
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
          <Award className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {qualifications.title}
        </h2>
        <p className="text-gray-600">
          Renseignez vos qualifications et compétences techniques
        </p>
      </div>

      <div className="space-y-6">
        {qualifications.fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'array' ? (
              <div className="space-y-2">
                {(formData[field.key] || ['']).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayUpdate(field.key, index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`${field.label} ${index + 1}`}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeItem(field.key, index)}
                        className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem(field.key)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Ajouter {field.label.toLowerCase()}
                </button>
              </div>
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Décrivez votre ${field.label.toLowerCase()}`}
              />
            ) : field.type === 'number' ? (
              <input
                type="number"
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={field.label}
              />
            ) : (
              <input
                type="text"
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={field.label}
              />
            )}

            {errors[field.key] && (
              <p className="text-sm text-red-600">{errors[field.key]}</p>
            )}
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Conseils pour remplir ce formulaire
              </h3>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Soyez précis dans la description de vos compétences</li>
                <li>• Mentionnez vos certifications et formations pertinentes</li>
                <li>• Indiquez votre niveau d'expérience pour chaque domaine</li>
                <li>• Ces informations aideront à mieux vous identifier sur la plateforme</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Précédent
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default TechnicalQualificationsStep;

