import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Create or update user profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const {
      income,
      savings,
      household_size,
      housing_preference,
      housing_budget_preference,
      requires_healthcare,
      transportation_preference,
      entertainment_importance,
      needs_bike_lanes,
      safety_importance,
      relocation_timeframe,
      remote_work,
      languages,
      amenities
    } = req.body;
    
    // Check if profile exists
    const checkResult = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    );
    
    if (checkResult.rows.length > 0) {
      // Update existing profile
      const updateResult = await db.query(
        `UPDATE user_profiles SET 
          income = $1,
          savings = $2,
          household_size = $3,
          housing_preference = $4,
          housing_budget_preference = $5,
          requires_healthcare = $6,
          transportation_preference = $7,
          entertainment_importance = $8,
          needs_bike_lanes = $9,
          safety_importance = $10,
          relocation_timeframe = $11,
          remote_work = $12,
          languages = $13,
          amenities = $14,
          updated_at = NOW()
        WHERE user_id = $15
        RETURNING *`,
        [
          income,
          savings,
          household_size,
          housing_preference,
          housing_budget_preference,
          requires_healthcare,
          transportation_preference,
          entertainment_importance,
          needs_bike_lanes,
          safety_importance,
          relocation_timeframe,
          remote_work,
          languages,
          amenities,
          userId
        ]
      );
      
      res.json(updateResult.rows[0]);
    } else {
      // Create new profile
      const insertResult = await db.query(
        `INSERT INTO user_profiles (
          user_id,
          income,
          savings,
          household_size,
          housing_preference,
          housing_budget_preference,
          requires_healthcare,
          transportation_preference,
          entertainment_importance,
          needs_bike_lanes,
          safety_importance,
          relocation_timeframe,
          remote_work,
          languages,
          amenities,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        RETURNING *`,
        [
          userId,
          income,
          savings,
          household_size,
          housing_preference,
          housing_budget_preference,
          requires_healthcare,
          transportation_preference,
          entertainment_importance,
          needs_bike_lanes,
          safety_importance,
          relocation_timeframe,
          remote_work,
          languages,
          amenities
        ]
      );
      
      res.status(201).json(insertResult.rows[0]);
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Update notification preferences
router.post('/notifications', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { preferences } = req.body;
    
    // Check if preferences exist
    const checkResult = await db.query(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    );
    
    if (checkResult.rows.length > 0) {
      // Update existing preferences
      const updateResult = await db.query(
        `UPDATE notification_preferences SET 
          price_changes = $1,
          new_locations = $2,
          service_updates = $3,
          weekly_digest = $4,
          updated_at = NOW()
        WHERE user_id = $5
        RETURNING *`,
        [
          preferences.price_changes,
          preferences.new_locations,
          preferences.service_updates,
          preferences.weekly_digest,
          userId
        ]
      );
      
      res.json(updateResult.rows[0]);
    } else {
      // Create new preferences
      const insertResult = await db.query(
        `INSERT INTO notification_preferences (
          user_id,
          price_changes,
          new_locations,
          service_updates,
          weekly_digest,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *`,
        [
          userId,
          preferences.price_changes,
          preferences.new_locations,
          preferences.service_updates,
          preferences.weekly_digest
        ]
      );
      
      res.status(201).json(insertResult.rows[0]);
    }
  } catch (err) {
    console.error('Error updating notification preferences:', err);
    res.status(500).json({ error: 'Server error updating notification preferences' });
  }
});

// Get notification preferences
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      // Return default preferences if none exist
      return res.json({
        price_changes: true,
        new_locations: true,
        service_updates: true,
        weekly_digest: false
      });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching notification preferences:', err);
    res.status(500).json({ error: 'Server error fetching notification preferences' });
  }
});

export default router;