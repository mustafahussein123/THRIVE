import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a location
router.get('/location/:locationId', async (req, res) => {
  try {
    const db = req.db;
    const { locationId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // Get reviews with user info
    const reviewsQuery = `
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.location_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const reviewsResult = await db.query(reviewsQuery, [locationId, limit, offset]);
    
    // Get total count
    const countResult = await db.query(
      'SELECT COUNT(*) FROM reviews WHERE location_id = $1',
      [locationId]
    );
    
    // Get average ratings
    const ratingsQuery = `
      SELECT 
        AVG(overall_rating) as overall_avg,
        AVG(affordability_rating) as affordability_avg,
        AVG(safety_rating) as safety_avg,
        AVG(transportation_rating) as transportation_avg,
        AVG(amenities_rating) as amenities_avg
      FROM reviews
      WHERE location_id = $1
    `;
    
    const ratingsResult = await db.query(ratingsQuery, [locationId]);
    
    res.json({
      reviews: reviewsResult.rows,
      total: parseInt(countResult.rows[0].count),
      averageRatings: ratingsResult.rows[0],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
});

// Add a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const {
      locationId,
      content,
      overall_rating,
      affordability_rating,
      safety_rating,
      transportation_rating,
      amenities_rating
    } = req.body;
    
    // Check if user already reviewed this location
    const checkResult = await db.query(
      'SELECT * FROM reviews WHERE user_id = $1 AND location_id = $2',
      [userId, locationId]
    );
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this location' });
    }
    
    // Add review
    const insertResult = await db.query(
      `INSERT INTO reviews (
        user_id,
        location_id,
        content,
        overall_rating,
        affordability_rating,
        safety_rating,
        transportation_rating,
        amenities_rating,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *`,
      [
        userId,
        locationId,
        content,
        overall_rating,
        affordability_rating,
        safety_rating,
        transportation_rating,
        amenities_rating
      ]
    );
    
    // Update location ratings
    await db.query(
      `UPDATE locations SET
        review_count = review_count + 1,
        overall_rating = (overall_rating * review_count + $1) / (review_count + 1),
        affordability_rating = (affordability_rating * review_count + $2) / (review_count + 1),
        safety_rating = (safety_rating * review_count + $3) / (review_count + 1),
        transportation_rating = (transportation_rating * review_count + $4) / (review_count + 1),
        amenities_rating = (amenities_rating * review_count + $5) / (review_count + 1)
      WHERE id = $6`,
      [
        overall_rating,
        affordability_rating,
        safety_rating,
        transportation_rating,
        amenities_rating,
        locationId
      ]
    );
    
    // Get user name for response
    const userResult = await db.query(
      'SELECT name FROM users WHERE id = $1',
      [userId]
    );
    
    const reviewWithUser = {
      ...insertResult.rows[0],
      user_name: userResult.rows[0].name
    };
    
    res.status(201).json(reviewWithUser);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ error: 'Server error adding review' });
  }
});

// Update a review
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { reviewId } = req.params;
    const {
      content,
      overall_rating,
      affordability_rating,
      safety_rating,
      transportation_rating,
      amenities_rating
    } = req.body;
    
    // Check if review exists and belongs to user
    const checkResult = await db.query(
      'SELECT * FROM reviews WHERE id = $1',
      [reviewId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (checkResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }
    
    // Get old ratings for location update
    const oldReview = checkResult.rows[0];
    const locationId = oldReview.location_id;
    
    // Update review
    const updateResult = await db.query(
      `UPDATE reviews SET
        content = $1,
        overall_rating = $2,
        affordability_rating = $3,
        safety_rating = $4,
        transportation_rating = $5,
        amenities_rating = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *`,
      [
        content,
        overall_rating,
        affordability_rating,
        safety_rating,
        transportation_rating,
        amenities_rating,
        reviewId
      ]
    );
    
    // Get location info
    const locationResult = await db.query(
      'SELECT review_count FROM locations WHERE id = $1',
      [locationId]
    );
    
    const reviewCount = locationResult.rows[0].review_count;
    
    // Update location ratings
    await db.query(
      `UPDATE locations SET
        overall_rating = (overall_rating * $1 - $2 + $3) / $1,
        affordability_rating = (affordability_rating * $1 - $4 + $5) / $1,
        safety_rating = (safety_rating * $1 - $6 + $7) / $1,
        transportation_rating = (transportation_rating * $1 - $8 + $9) / $1,
        amenities_rating = (amenities_rating * $1 - $10 + $11) / $1
      WHERE id = $12`,
      [
        reviewCount,
        oldReview.overall_rating,
        overall_rating,
        oldReview.affordability_rating,
        affordability_rating,
        oldReview.safety_rating,
        safety_rating,
        oldReview.transportation_rating,
        transportation_rating,
        oldReview.amenities_rating,
        amenities_rating,
        locationId
      ]
    );
    
    // Get user name for response
    const userResult = await db.query(
      'SELECT name FROM users WHERE id = $1',
      [userId]
    );
    
    const reviewWithUser = {
      ...updateResult.rows[0],
      user_name: userResult.rows[0].name
    };
    
    res.json(reviewWithUser);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ error: 'Server error updating review' });
  }
});

// Delete a review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;
    const { reviewId } = req.params;
    
    // Check if review exists and belongs to user
    const checkResult = await db.query(
      'SELECT * FROM reviews WHERE id = $1',
      [reviewId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (checkResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }
    
    // Get old ratings for location update
    const oldReview = checkResult.rows[0];
    const locationId = oldReview.location_id;
    
    // Delete review
    await db.query(
      'DELETE FROM reviews WHERE id = $1',
      [reviewId]
    );
    
    // Get location info
    const locationResult = await db.query(
      'SELECT review_count FROM locations WHERE id = $1',
      [locationId]
    );
    
    const reviewCount = locationResult.rows[0].review_count;
    
    if (reviewCount > 1) {
      // Update location ratings
      await db.query(
        `UPDATE locations SET
          review_count = review_count - 1,
          overall_rating = (overall_rating * $1 - $2) / ($1 - 1),
          affordability_rating = (affordability_rating * $1 - $3) / ($1 - 1),
          safety_rating = (safety_rating * $1 - $4) / ($1 - 1),
          transportation_rating = (transportation_rating * $1 - $5) / ($1 - 1),
          amenities_rating = (amenities_rating * $1 - $6) / ($1 - 1)
        WHERE id = $7`,
        [
          reviewCount,
          oldReview.overall_rating,
          oldReview.affordability_rating,
          oldReview.safety_rating,
          oldReview.transportation_rating,
          oldReview.amenities_rating,
          locationId
        ]
      );
    } else {
      // Reset ratings if this was the only review
      await db.query(
        `UPDATE locations SET
          review_count = 0,
          overall_rating = 0,
          affordability_rating = 0,
          safety_rating = 0,
          transportation_rating = 0,
          amenities_rating = 0
        WHERE id = $1`,
        [locationId]
      );
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Server error deleting review' });
  }
});

export default router;