/**
 * @file Backend authentication and authorization middleware for the CACA API.
 * Intercepts incoming requests to protect endpoints, verify signed JWT headers, 
 * look up validating database profiles, and enforce route access control restrictions based on roles.
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Validates the presence and signature of a 'Bearer' JSON Web Token in incoming request headers.
 * Populates the request pipeline with a fresh database user instance upon successful verification.
 *
 * @param {Object} req - Express request object containing the raw authorization headers.
 * @param {Object} res - Express response object utilized to return HTTP 401 statuses on authentication failure.
 * @param {Function} next - Express next middleware execution callback trigger to proceed down the pipeline.
 * @returns {Promise<void>} Resolves once validation completes and execution is passed forward or terminated.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token de autenticação em falta' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilizador não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
}

/**
 * A middleware factory function that closes over permitted roles to create authorization checks.
 * Restricts downstream controller routing access based on matching properties against user document data hooks.
 *
 * @param {...string} roles - Spread array arguments defining the specific role keys allowed to execute the route.
 * @returns {Function} An Express middleware function matching the (req, res, next) parameter signature.
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Acesso não autorizado' });
    }

    next();
  };
}