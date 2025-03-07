import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'thrive_secret_key');
    
    // Add user from payload
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};