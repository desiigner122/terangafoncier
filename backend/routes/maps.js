import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncErrorHandler } from '../middleware/errorHandler.js';
import { logBusiness } from '../utils/logger.js';
import db from '../config/database.js';

const router = express.Router();

// 🗺️ RECHERCHER PROPRIÉTÉS PAR ZONE
router.get('/properties/zone', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { 
    bounds, // "lat1,lng1,lat2,lng2"
    type,
    minPrice,
    maxPrice,
    status = 'active'
  } = req.query;

  let whereClause = 'WHERE status = $1';
  const queryParams = [status];
  let paramCount = 1;

  if (bounds) {
    const [lat1, lng1, lat2, lng2] = bounds.split(',').map(Number);
    whereClause += ` AND latitude BETWEEN $${++paramCount} AND $${++paramCount}`;
    whereClause += ` AND longitude BETWEEN $${++paramCount} AND $${++paramCount}`;
    queryParams.push(Math.min(lat1, lat2), Math.max(lat1, lat2));
    queryParams.push(Math.min(lng1, lng2), Math.max(lng1, lng2));
  }

  if (type) {
    whereClause += ` AND property_type = $${++paramCount}`;
    queryParams.push(type);
  }

  if (minPrice) {
    whereClause += ` AND price >= $${++paramCount}`;
    queryParams.push(minPrice);
  }

  if (maxPrice) {
    whereClause += ` AND price <= $${++paramCount}`;
    queryParams.push(maxPrice);
  }

  const propertiesQuery = `
    SELECT 
      id, title, property_type, price, surface, location,
      latitude, longitude, description, images,
      blockchain_hash IS NOT NULL as is_verified
    FROM properties 
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT 100
  `;

  const propertiesResult = await db.query(propertiesQuery, queryParams);

  const properties = propertiesResult.rows.map(property => ({
    id: property.id,
    title: property.title,
    type: property.property_type,
    price: parseFloat(property.price),
    surface: property.surface,
    location: property.location,
    coordinates: {
      lat: parseFloat(property.latitude),
      lng: parseFloat(property.longitude)
    },
    description: property.description,
    images: property.images ? JSON.parse(property.images) : [],
    isVerified: property.is_verified
  }));

  res.json({
    success: true,
    data: { properties }
  });
}));

// 📍 GÉOCODER UNE ADRESSE
router.post('/geocode', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Adresse requise'
    });
  }

  // Simulation de géocodage (en production, utiliser Google Maps API ou Nominatim)
  const geocodeResults = [
    {
      address: address,
      coordinates: {
        lat: 14.6928 + (Math.random() - 0.5) * 0.1, // Dakar area
        lng: -17.4467 + (Math.random() - 0.5) * 0.1
      },
      formattedAddress: `${address}, Dakar, Sénégal`,
      components: {
        street: address.split(' ')[0],
        city: 'Dakar',
        region: 'Dakar',
        country: 'Sénégal'
      }
    }
  ];

  logBusiness('geocode_request', { 
    userId: req.user.id, 
    address, 
    results: geocodeResults.length 
  });

  res.json({
    success: true,
    data: { results: geocodeResults }
  });
}));

// 🔍 GÉOCODAGE INVERSE
router.post('/reverse-geocode', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: 'Coordonnées requises'
    });
  }

  // Simulation de géocodage inverse
  const reverseResult = {
    coordinates: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
    address: 'Avenue Cheikh Anta Diop, Dakar, Sénégal',
    components: {
      street: 'Avenue Cheikh Anta Diop',
      district: 'Fann',
      city: 'Dakar',
      region: 'Dakar',
      country: 'Sénégal',
      postalCode: '10700'
    }
  };

  logBusiness('reverse_geocode_request', { 
    userId: req.user.id, 
    latitude, 
    longitude 
  });

  res.json({
    success: true,
    data: { result: reverseResult }
  });
}));

// 🛣️ CALCULER ITINÉRAIRE
router.post('/directions', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { origin, destination, mode = 'driving' } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({
      success: false,
      message: 'Origine et destination requises'
    });
  }

  // Simulation d'itinéraire
  const route = {
    origin,
    destination,
    mode,
    distance: '12.5 km',
    duration: '25 min',
    steps: [
      {
        instruction: 'Dirigez-vous vers le nord sur Avenue Cheikh Anta Diop',
        distance: '2.1 km',
        duration: '4 min'
      },
      {
        instruction: 'Tournez à droite sur Route de la Corniche',
        distance: '5.3 km',
        duration: '8 min'
      },
      {
        instruction: 'Continuez tout droit jusqu\'à destination',
        distance: '5.1 km',
        duration: '13 min'
      }
    ],
    polyline: 'encoded_polyline_string_here'
  };

  res.json({
    success: true,
    data: { route }
  });
}));

// 📊 STATISTIQUES GÉOGRAPHIQUES
router.get('/stats/geographic', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { bounds } = req.query;
  
  let whereClause = '';
  const queryParams = [];
  
  if (bounds) {
    const [lat1, lng1, lat2, lng2] = bounds.split(',').map(Number);
    whereClause = `WHERE latitude BETWEEN $1 AND $2 AND longitude BETWEEN $3 AND $4`;
    queryParams.push(Math.min(lat1, lat2), Math.max(lat1, lat2));
    queryParams.push(Math.min(lng1, lng2), Math.max(lng1, lng2));
  }

  const statsQuery = `
    SELECT 
      COUNT(*) as total_properties,
      AVG(price) as avg_price,
      property_type,
      COUNT(*) as type_count
    FROM properties 
    ${whereClause}
    GROUP BY property_type
    ORDER BY type_count DESC
  `;

  const densityQuery = `
    SELECT 
      ROUND(latitude, 2) as lat_zone,
      ROUND(longitude, 2) as lng_zone,
      COUNT(*) as property_count
    FROM properties 
    ${whereClause}
    GROUP BY lat_zone, lng_zone
    HAVING COUNT(*) > 0
    ORDER BY property_count DESC
    LIMIT 50
  `;

  const [statsResult, densityResult] = await Promise.all([
    db.query(statsQuery, queryParams),
    db.query(densityQuery, queryParams)
  ]);

  res.json({
    success: true,
    data: {
      propertyTypes: statsResult.rows.map(row => ({
        type: row.property_type,
        count: parseInt(row.type_count),
        avgPrice: parseFloat(row.avg_price || 0)
      })),
      densityMap: densityResult.rows.map(row => ({
        coordinates: {
          lat: parseFloat(row.lat_zone),
          lng: parseFloat(row.lng_zone)
        },
        count: parseInt(row.property_count)
      }))
    }
  });
}));

// 🏢 ZONES D'INTÉRÊT
router.get('/points-of-interest', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000, category } = req.query;

  // Simulation de points d'intérêt (en production, utiliser une vraie API)
  const pointsOfInterest = [
    {
      id: 'poi_1',
      name: 'Marché Sandaga',
      category: 'commerce',
      coordinates: { lat: 14.6937, lng: -17.4441 },
      distance: 1200,
      description: 'Grand marché traditionnel'
    },
    {
      id: 'poi_2',
      name: 'Hôpital Principal',
      category: 'santé',
      coordinates: { lat: 14.6928, lng: -17.4467 },
      distance: 800,
      description: 'Hôpital principal de Dakar'
    },
    {
      id: 'poi_3',
      name: 'École Primaire Liberté',
      category: 'éducation',
      coordinates: { lat: 14.6945, lng: -17.4423 },
      distance: 950,
      description: 'École primaire publique'
    }
  ];

  let filteredPOIs = pointsOfInterest;
  
  if (category) {
    filteredPOIs = pointsOfInterest.filter(poi => poi.category === category);
  }

  if (latitude && longitude) {
    const maxDistance = parseInt(radius);
    filteredPOIs = filteredPOIs.filter(poi => poi.distance <= maxDistance);
  }

  res.json({
    success: true,
    data: { pointsOfInterest: filteredPOIs }
  });
}));

// 📱 SAUVEGARDER LIEU FAVORI
router.post('/favorites', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { name, address, latitude, longitude, category } = req.body;
  const userId = req.user.id;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: 'Nom et coordonnées requis'
    });
  }

  const favoriteQuery = `
    INSERT INTO user_favorite_places (
      user_id, name, address, latitude, longitude, category, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;

  const favoriteResult = await db.query(favoriteQuery, [
    userId, name, address, latitude, longitude, category
  ]);

  const favorite = favoriteResult.rows[0];

  logBusiness('favorite_place_added', { 
    userId, 
    favoriteId: favorite.id, 
    name 
  });

  res.json({
    success: true,
    data: { favorite: {
      id: favorite.id,
      name: favorite.name,
      address: favorite.address,
      coordinates: {
        lat: parseFloat(favorite.latitude),
        lng: parseFloat(favorite.longitude)
      },
      category: favorite.category
    }}
  });
}));

// 📍 LIEUX FAVORIS
router.get('/favorites', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  const favoritesQuery = `
    SELECT * FROM user_favorite_places 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;

  const favoritesResult = await db.query(favoritesQuery, [userId]);

  const favorites = favoritesResult.rows.map(favorite => ({
    id: favorite.id,
    name: favorite.name,
    address: favorite.address,
    coordinates: {
      lat: parseFloat(favorite.latitude),
      lng: parseFloat(favorite.longitude)
    },
    category: favorite.category,
    createdAt: favorite.created_at
  }));

  res.json({
    success: true,
    data: { favorites }
  });
}));

export default router;