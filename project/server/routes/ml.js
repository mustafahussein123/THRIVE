import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import MLService from '../ml-integration.js';

const router = express.Router();

// Initialize ML environment
router.get('/initialize', async (req, res) => {
  try {
    const result = await MLService.initialize();
    res.json({ success: result });
  } catch (err) {
    console.error('ML initialization error:', err);
    res.status(500).json({ error: 'Error initializing ML environment' });
  }
});

// Train ML models
router.post('/train', async (req, res) => {
  try {
    const result = await MLService.trainModels();
    res.json(result);
  } catch (err) {
    console.error('ML training error:', err);
    res.status(500).json({ error: 'Error training ML models' });
  }
});

// Get affordability prediction for a location
router.get('/affordability/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await MLService.predictAffordability(locationId);
    res.json(result);
  } catch (err) {
    console.error('Affordability prediction error:', err);
    res.status(500).json({ error: 'Error predicting affordability' });
  }
});

// Get location recommendations for current user
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await MLService.generateRecommendations(userId);
    res.json(result);
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Error generating recommendations' });
  }
});

// Get location recommendations for a specific user (admin only)
router.get('/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (would need to be implemented)
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ error: 'Not authorized' });
    // }
    
    const { userId } = req.params;
    const result = await MLService.generateRecommendations(userId);
    res.json(result);
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Error generating recommendations' });
  }
});

export default router;