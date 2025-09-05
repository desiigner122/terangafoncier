/**
 * Étape: Zone de couverture (Banque)
 */

import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Plus, 
  X, 
  ChevronRight
} from 'lucide-react';
import { territorialManager } from '../../../lib/territorialManager';

const CoverageAreaStep = ({ data, errors, onNext, isLoading, role }) => {
  const [formData, setFormData] = useState({
    coverage_areas: data.coverage_areas || [],
    coverage_type: data.coverage_type || 'regional',
    ...data
  });

  const [availableRegions, setAvailableRegions] = useState([]);
  const [newArea, setNewArea] = useState('');

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      const result = await territorialManager.getActiveRegions();
      if (result.success) {
        setAvailableRegions(result.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement régions:', error);
    }
  };

  const handleAddArea = () => {
    if (newArea && !formData.coverage_areas.includes(newArea)) {
      setFormData(prev => ({
        ...prev,
        coverage_areas: [...prev.coverage_areas, newArea]
      }));
      setNewArea('');
    }
  };

  const handleRemoveArea = (area) => {
    setFormData(prev => ({
      ...prev,
      coverage_areas: prev.coverage_areas.filter(a => a !== area)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const specificErrors = errors.specific || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Map className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-800">
          Zone de couverture
        </h2>
        <p className="text-gray-600 mt-2">
          Définissez les zones géographiques où votre banque opère
        </p>
      </div>

      <div className="space-y-6">
        {/* Type de couverture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de couverture *
          </label>
          <select
            value={formData.coverage_type}
            onChange={(e) => setFormData(prev => ({ ...prev, coverage_type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="national">Couverture nationale</option>
            <option value="regional">Couverture régionale</option>
            <option value="local">Couverture locale</option>
          </select>
        </div>

        {/* Sélection des zones */}
        {formData.coverage_type !== 'national' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zones de couverture *
            </label>
            <div className="flex space-x-2 mb-3">
              <select
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez une zone</option>
                {availableRegions.map(region => (
                  <option key={region.id} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddArea}
                disabled={!newArea}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Zones sélectionnées */}
            <div className="space-y-2">
              {formData.coverage_areas.map(area => (
                <div key={area} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{area}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {specificErrors.coverage_areas && (
              <p className="text-red-500 text-sm mt-1">{specificErrors.coverage_areas}</p>
            )}
          </div>
        )}
      </div>

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
    </form>
  );
};

export default CoverageAreaStep;
