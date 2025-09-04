// Composants simplifiés pour compléter le système

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const SurveyorOfficeStep = ({ data, errors, onNext, isLoading }) => {
  const [formData, setFormData] = useState({
    office_name: data.office_name || '',
    surveyor_license: data.surveyor_license || '',
    specializations: data.specializations || [],
    equipment_list: data.equipment_list || '',
    ...data
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const surveyorErrors = errors.surveyor || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Cabinet de géométrie</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du cabinet *</label>
          <input
            type="text"
            value={formData.office_name}
            onChange={(e) => setFormData(prev => ({ ...prev, office_name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg ${surveyorErrors.office_name ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Licence géomètre *</label>
          <input
            type="text"
            value={formData.surveyor_license}
            onChange={(e) => setFormData(prev => ({ ...prev, surveyor_license: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg ${surveyorErrors.surveyor_license ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Équipements *</label>
          <textarea
            value={formData.equipment_list}
            onChange={(e) => setFormData(prev => ({ ...prev, equipment_list: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg ${surveyorErrors.equipment_list ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Suivant <ChevronRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </form>
  );
};

export const LegalAuthorizationsStep = ({ data, errors, onNext, isLoading }) => {
  const [formData, setFormData] = useState({
    legal_authorizations: data.legal_authorizations || [],
    ...data
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Habilitations légales</h2>
      
      <div className="space-y-4">
        {['Authentification d\'actes', 'Conseil juridique', 'Rédaction de contrats'].map(auth => (
          <label key={auth} className="flex items-center">
            <input
              type="checkbox"
              checked={formData.legal_authorizations.includes(auth)}
              onChange={(e) => {
                const auths = e.target.checked 
                  ? [...formData.legal_authorizations, auth]
                  : formData.legal_authorizations.filter(a => a !== auth);
                setFormData(prev => ({ ...prev, legal_authorizations: auths }));
              }}
              className="mr-2"
            />
            {auth}
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Suivant <ChevronRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </form>
  );
};

export const TechnicalQualificationsStep = ({ data, errors, onNext, isLoading }) => {
  const [formData, setFormData] = useState({
    certifications: data.certifications || [],
    ...data
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Qualifications techniques</h2>
      
      <div className="space-y-4">
        {['Topographie', 'Cadastre', 'SIG', 'Photogrammétrie'].map(cert => (
          <label key={cert} className="flex items-center">
            <input
              type="checkbox"
              checked={formData.certifications.includes(cert)}
              onChange={(e) => {
                const certs = e.target.checked 
                  ? [...formData.certifications, cert]
                  : formData.certifications.filter(c => c !== cert);
                setFormData(prev => ({ ...prev, certifications: certs }));
              }}
              className="mr-2"
            />
            {cert}
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Suivant <ChevronRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </form>
  );
};

export default SurveyorOfficeStep;
