/**
 * ðŸŽ¯ INTERFACE AI DASHBOARD - INTÉGRATION TERANGA AI
 * =================================================
 * 
 * Interface utilisateur pour services IA dans les dashboards
 */

import React, { useState, useEffect } from 'react';
import { terangaAI } from '../services/TerangaAIService.js';

export const AIEstimationWidget = ({ className = '' }) => {
  const [estimation, setEstimation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: 'Dakar-Plateau',
    type: 'villa',
    surface: 300
  });

  const locations = [
    'Dakar-Plateau', 'Almadies', 'Mermoz', 'Ouakam', 'Yoff',
    'Pikine', 'Guediawaye', 'Mbour', 'Centre-Ville', 'Centre'
  ];

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const result = await terangaAI.getQuickEstimate(
        formData.location, 
        formData.type, 
        formData.surface
      );
      setEstimation(result);
    } catch (error) {
      console.error('Erreur estimation IA:', error);
    }
    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        ðŸ¤– Estimation IA Teranga
      </h3>

      {/* Formulaire */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ðŸ“ Localisation
          </label>
          <select 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ðŸ  Type de propriété
          </label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="terrain">ðŸžï¸ Terrain</option>
            <option value="villa">ðŸ˜ï¸ Villa</option>
            <option value="appartement">ðŸ¢ Appartement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ðŸ“ Surface (mÂ²)
          </label>
          <input 
            type="number"
            value={formData.surface}
            onChange={(e) => setFormData({...formData, surface: parseInt(e.target.value)})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            YOUR_API_KEY="300"
            min="1"
          />
        </div>

        <button 
          onClick={handleEstimate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'â³ Calcul en cours...' : 'ðŸ’° Estimer le prix'}
        </button>
      </div>

      {/* Résultats */}
      {estimation && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4 text-green-700">
            ðŸ“Š Résultat de l'estimation
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Prix estimé</p>
              <p className="text-2xl font-bold text-green-700">
                {estimation.prix_estime_fcfa.toLocaleString()} FCFA
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Prix par mÂ²</p>
              <p className="text-xl font-bold text-blue-700">
                {estimation.prix_au_m2.toLocaleString()} FCFA/mÂ²
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Tendance marché</p>
              <p className="font-semibold text-orange-700 capitalize">
                {estimation.tendance === 'hausse' ? 'ðŸ“ˆ' : 'ðŸ“Š'} {estimation.tendance}
              </p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Niveau demande</p>
              <p className="font-semibold text-purple-700 capitalize">
                {estimation.demande === 'très_forte' ? 'ðŸ”¥' : 'ðŸ“Š'} {estimation.demande}
              </p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Estimation basée sur données marché Sénégal â€¢ Zone: {estimation.zone}
          </div>
        </div>
      )}
    </div>
  );
};

export const AIMarketInsights = ({ region = 'Dakar', className = '' }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const result = await terangaAI.getMarketInsights(region);
        setInsights(result);
      } catch (error) {
        console.error('Erreur insights IA:', error);
      }
      setLoading(false);
    };

    loadInsights();
  }, [region]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          âŒ Impossible de charger les insights marché
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        ðŸ“ˆ Insights Marché {region}
      </h3>

      <div className="space-y-6">
        {/* Tendances générales */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            ðŸŽ¯ Tendances Générales
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Croissance annuelle:</span>
              <span className="font-bold text-green-600 ml-2">
                {(insights.tendances_generales.croissance_annuelle * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Zones expansion:</span>
              <span className="font-bold text-blue-600 ml-2">
                {insights.tendances_generales.zones_expansion.length}
              </span>
            </div>
          </div>
        </div>

        {/* Top zones */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">ðŸ† Top Zones Prix</h4>
          <div className="space-y-2">
            {Object.entries(insights.zones)
              .sort(([,a], [,b]) => (b.terrain_fcfa_m2 || 0) - (a.terrain_fcfa_m2 || 0))
              .slice(0, 3)
              .map(([zoneName, zoneData]) => (
                <div key={zoneName} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span className="font-medium">{zoneName}</span>
                  <span className="text-green-600 font-bold">
                    {zoneData.terrain_fcfa_m2?.toLocaleString()} FCFA/mÂ²
                  </span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Zones expansion */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">ðŸš€ Zones d'Expansion</h4>
          <div className="flex flex-wrap gap-2">
            {insights.tendances_generales.zones_expansion.map(zone => (
              <span key={zone} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {zone}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Dernière mise Ï  jour: {new Date(insights.derniere_maj).toLocaleDateString()}
      </div>
    </div>
  );
};

export default { AIEstimationWidget, AIMarketInsights };
