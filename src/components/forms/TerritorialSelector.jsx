import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ChevronDown
} from 'lucide-react';
import { localTerritorialManager } from '@/lib/localTerritorialManager';

const TerritorialSelector = ({ 
  formData, 
  updateFormData, 
  errors = {},
  showRegion = true,
  showDepartment = true,
  showCommune = true,
  label = "Localisation territoriale"
}) => {
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState({
    regions: false,
    departments: false,
    communes: false
  });

  // Charger les régions au montage
  useEffect(() => {
    loadRegions();
  }, []);

  // Charger les départements quand une région est sélectionnée
  useEffect(() => {
    if (formData.region_id) {
      loadDepartments(formData.region_id);
    } else {
      setDepartments([]);
      setCommunes([]);
    }
  }, [formData.region_id]);

  // Charger les communes quand un département est sélectionné
  useEffect(() => {
    if (formData.department_id) {
      loadCommunes(formData.department_id);
    } else {
      setCommunes([]);
    }
  }, [formData.department_id]);

  const loadRegions = async () => {
    setLoading(prev => ({ ...prev, regions: true }));
    try {
      const regionsData = await localTerritorialManager.getRegions();
      setRegions(regionsData);
    } catch (error) {
      console.error('Erreur chargement régions:', error);
    } finally {
      setLoading(prev => ({ ...prev, regions: false }));
    }
  };

  const loadDepartments = async (regionId) => {
    setLoading(prev => ({ ...prev, departments: true }));
    try {
      const departmentsData = await localTerritorialManager.getDepartmentsByRegion(regionId);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Erreur chargement départements:', error);
    } finally {
      setLoading(prev => ({ ...prev, departments: false }));
    }
  };

  const loadCommunes = async (departmentId) => {
    setLoading(prev => ({ ...prev, communes: true }));
    try {
      const communesData = await localTerritorialManager.getCommunesByDepartment(departmentId);
      setCommunes(communesData);
    } catch (error) {
      console.error('Erreur chargement communes:', error);
    } finally {
      setLoading(prev => ({ ...prev, communes: false }));
    }
  };

  const handleRegionChange = (regionId) => {
    updateFormData({
      region_id: regionId,
      department_id: '',
      commune_id: ''
    });
  };

  const handleDepartmentChange = (departmentId) => {
    updateFormData({
      department_id: departmentId,
      commune_id: ''
    });
  };

  const handleCommuneChange = (communeId) => {
    updateFormData({
      commune_id: communeId
    });
  };

  const SelectField = ({ 
    id, 
    label, 
    value, 
    onChange, 
    options, 
    loading, 
    YOUR_API_KEY,
    error,
    disabled = false
  }) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            appearance-none
          `}
        >
          <option value="">
            {loading ? 'Chargement...' : YOUR_API_KEY}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">{label}</h3>
      </div>

      {showRegion && (
        <SelectField
          id="region"
          label="Région"
          value={formData.region_id || ''}
          onChange={handleRegionChange}
          options={regions}
          loading={loading.regions}
          YOUR_API_KEY="Sélectionnez une région"
          error={errors.region_id}
        />
      )}

      {showDepartment && (
        <SelectField
          id="department"
          label="Département"
          value={formData.department_id || ''}
          onChange={handleDepartmentChange}
          options={departments}
          loading={loading.departments}
          YOUR_API_KEY={formData.region_id ? "Sélectionnez un département" : "Sélectionnez d'abord une région"}
          error={errors.department_id}
          disabled={!formData.region_id}
        />
      )}

      {showCommune && (
        <SelectField
          id="commune"
          label="Commune"
          value={formData.commune_id || ''}
          onChange={handleCommuneChange}
          options={communes}
          loading={loading.communes}
          YOUR_API_KEY={formData.department_id ? "Sélectionnez une commune" : "Sélectionnez d'abord un département"}
          error={errors.commune_id}
          disabled={!formData.department_id}
        />
      )}

      {/* Affichage de la sélection actuelle */}
      {(formData.region_id || formData.department_id || formData.commune_id) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Sélection actuelle :</h4>
          <div className="text-sm text-blue-700">
            {formData.region_id && (
              <div>
                <span className="font-medium">Région:</span> {
                  regions.find(r => r.id === formData.region_id)?.name || formData.region_id
                }
              </div>
            )}
            {formData.department_id && (
              <div>
                <span className="font-medium">Département:</span> {
                  departments.find(d => d.id === formData.department_id)?.name || formData.department_id
                }
              </div>
            )}
            {formData.commune_id && (
              <div>
                <span className="font-medium">Commune:</span> {
                  communes.find(c => c.id === formData.commune_id)?.name || formData.commune_id
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message d'aide */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          💡 <strong>Conseil:</strong> Sélectionnez dans l'ordre : Région → Département → Commune. 
          Chaque sélection détermine les options disponibles pour le niveau suivant.
        </p>
      </div>
    </div>
  );
};

export default TerritorialSelector;
