import React from 'react';
import { AlertTriangle, FileText, CheckCircle } from 'lucide-react';

const LegalAuthorizationsStep = ({ 
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

  const handleFileUpload = (field, file) => {
    updateFormData({ [field]: file });
  };

  const requiredDocuments = {
    mairie: [
      { key: 'deliberation_conseil', name: 'Délibération du Conseil Municipal', required: true },
      { key: 'arrete_nomination', name: 'Arrêté de nomination', required: true },
      { key: 'certificat_residence', name: 'Certificat de résidence', required: false }
    ],
    banque: [
      { key: 'licence_bancaire', name: 'Licence bancaire', required: true },
      { key: 'agrement_bceao', name: 'Agrément BCEAO', required: true },
      { key: 'certificat_conformite', name: 'Certificat de conformité', required: false }
    ],
    notaire: [
      { key: 'diplome_notariat', name: 'Diplôme de notariat', required: true },
      { key: 'serment_professionnel', name: 'Serment professionnel', required: true },
      { key: 'assurance_professionnelle', name: 'Assurance professionnelle', required: true }
    ],
    geometre: [
      { key: 'diplome_geometre', name: 'Diplôme de géomètre', required: true },
      { key: 'ordre_geometres', name: 'Inscription à l\'Ordre des Géomètres', required: true },
      { key: 'certificat_competence', name: 'Certificat de compétence', required: false }
    ]
  };

  const currentRole = formData.role?.toLowerCase() || 'particulier';
  const documents = requiredDocuments[currentRole] || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Autorisations Légales
        </h2>
        <p className="text-gray-600">
          Téléchargez les documents requis pour votre rôle
        </p>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Documents requis pour {formData.role}
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Veuillez télécharger tous les documents obligatoires marqués d'un astérisque (*)
                </p>
              </div>
            </div>
          </div>

          {documents.map((doc) => (
            <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {doc.name}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {formData[doc.key] && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {formData[doc.key] && (
                <p className="text-sm text-green-600 mt-1">
                  Fichier sélectionné: {formData[doc.key].name}
                </p>
              )}
              
              {errors[doc.key] && (
                <p className="text-sm text-red-600 mt-1">{errors[doc.key]}</p>
              )}
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Notes importantes
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Les documents doivent être au format PDF, JPG, PNG, DOC ou DOCX</li>
              <li>• Taille maximale par fichier: 10 MB</li>
              <li>• Les documents seront vérifiés avant l'activation du compte</li>
              <li>• Assurez-vous que tous les documents sont lisibles et à jour</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun document requis
          </h3>
          <p className="text-gray-600">
            Votre rôle ne nécessite pas de documents d'autorisation spécifiques.
          </p>
        </div>
      )}

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

export default LegalAuthorizationsStep;
