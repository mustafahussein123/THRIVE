import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all locations
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const { search, limit = 10, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM locations';
    const queryParams = [];
    
    // Add search functionality
    if (search) {
      query += ' WHERE city ILIKE $1 OR state ILIKE $1 OR country ILIKE $1';
      queryParams.push(`%${search}%`);
    }
    
    // Add pagination
    query += ' ORDER BY affordability_score DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);
    
    const result = await db.query(query, queryParams);
    
    // Get total count for pagination
    const countQuery = search 
      ? 'SELECT COUNT(*) FROM locations WHERE city ILIKE $1 OR state ILIKE $1 OR country ILIKE $1'
      : 'SELECT COUNT(*) FROM locations';
    
    const countParams = search ? [`%${search}%`] : [];
    const countResult = await db.query(countQuery, countParams);
    
    res.json({
      locations: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Server error fetching locations' });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    
    const result = await db.query('SELECT * FROM locations WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching location:', err);
    res.status(500).json({ error: 'Server error fetching location' });
  }
});

// Get recommended locations based on user profile
router.get('/recommendations/profile', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    
    // Get user profile
    const profileResult = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    const profile = profileResult.rows[0];
    
    // Calculate monthly income
    const monthlyIncome = profile.income / 12;
    
    // Calculate housing budget based on preference
    let housingBudgetPercentage;
    switch (profile.housing_budget_preference) {
      case 'less-than-30':
        housingBudgetPercentage = 0.25;
        break;
      case '30-40':
        housingBudgetPercentage = 0.35;
        break;
      default:
        housingBudgetPercentage = 0.45;
    }
    
    const housingBudget = monthlyIncome * housingBudgetPercentage;
    
    // Query for locations that match user preferences
    const locationsQuery = `
      SELECT l.*, 
        (
          CASE 
            WHEN l.cost_housing <= $1 THEN 30
            WHEN l.cost_housing <= $1 * 1.2 THEN 20
            WHEN l.cost_housing <= $1 * 1.5 THEN 10
            ELSE 0
          END +
          CASE
            WHEN $2 = true AND l.healthcare_score >= 75 THEN 15
            WHEN $2 = true AND l.healthcare_score >= 60 THEN 10
            WHEN $2 = true THEN 5
            ELSE 0
          END +
          CASE
            WHEN $3 = 'public-transit' AND l.public_transit_score >= 70 THEN 15
            WHEN $3 = 'bike-walking' AND l.walkability_score >= 70 THEN 15
            WHEN $3 = 'car' AND l.traffic_score >= 70 THEN 15
            ELSE 0
          END +
          CASE
            WHEN $4 = 'very-important' AND l.safety_score >= 80 THEN 20
            WHEN $4 = 'somewhat-important' AND l.safety_score >= 70 THEN 10
            ELSE 0
          END
        ) as match_score
      FROM locations l
      ORDER BY match_score DESC
      LIMIT 10
    `;
    
    const locationsResult = await db.query(locationsQuery, [
      housingBudget,
      profile.requires_healthcare,
      profile.transportation_preference,
      profile.safety_importance
    ]);
    
    res.json({
      recommendations: locationsResult.rows,
      userProfile: {
        monthlyIncome,
        housingBudget,
        requiresHealthcare: profile.requires_healthcare,
        transportationPreference: profile.transportation_preference,
        safetyImportance: profile.safety_importance
      }
    });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Server error fetching recommendations' });
  }
});

// Compare locations
router.post('/compare', async (req, res) => {
  try {
    const db = req.db;
    const { locationIds } = req.body;
    
    if (!locationIds || !Array.isArray(locationIds) || locationIds.length === 0) {
      return res.status(400).json({ error: 'Location IDs are required' });
    }
    
    // Get locations
    const placeholders = locationIds.map((_, i) => `$${i + 1}`).join(',');
    const query = `SELECT * FROM locations WHERE id IN (${placeholders})`;
    
    const result = await db.query(query, locationIds);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error comparing locations:', err);
    res.status(500).json({ error: 'Server error comparing locations' });
  }
});

// Save location for a user
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { locationId } = req.body;
    
    // Check if already saved
    const checkResult = await db.query(
      'SELECT * FROM saved_locations WHERE user_id = $1 AND location_id = $2',
      [userId, locationId]
    );
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'Location already saved' });
    }
    
    // Save location
    await db.query(
      'INSERT INTO saved_locations (user_id, location_id, saved_at) VALUES ($1, $2, NOW())',
      [userId, locationId]
    );
    
    res.status(201).json({ message: 'Location saved successfully' });
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).json({ error: 'Server error saving location' });
  }
});

// Get saved locations for a user
router.get('/saved/user', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT l.* FROM locations l JOIN saved_locations sl ON l.id = sl.location_id WHERE sl.user_id = $1 ORDER BY sl.saved_at DESC',
      [userId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching saved locations:', err);
    res.status(500).json({ error: 'Server error fetching saved locations' });
  }
});

// Remove saved location
router.delete('/saved/:locationId', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { locationId } = req.params;
    
    await db.query(
      'DELETE FROM saved_locations WHERE user_id = $1 AND location_id = $2',
      [userId, locationId]
    );
    
    res.json({ message: 'Location removed from saved' });
  } catch (err) {
    console.error('Error removing saved location:', err);
    res.status(500).json({ error: 'Server error removing saved location' });
  }
});

export default router;