/**
 * @file Backend authentication controller for the CACA API.
 * Handles user registration, login operations, password hashing, and JWT creation.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Creates a cryptographically signed JSON Web Token (JWT) for a authenticated user session.
 *
 * @param {Object} user - The Mongoose user document instance.
 * @returns {string} The signed JWT string encoded with user credentials.
 */
function createToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Formats user properties into a sanitized object configuration safe for client transmission.
 *
 * @param {Object} user - The raw user document fetched from MongoDB.
 * @returns {Object} Clean user object containing id, nome, email, and role.
 */
function formatAuthUser(user) {
  return {
    id: user._id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  };
}

/**
 * Handles new user account creation, data validation, and automated authentication sign-in.
 *
 * @param {Object} req - Express request object containing nome, email, and plaintext password in body.
 * @param {Object} res - Express response object used to yield HTTP 201 status on success.
 * @param {Function} next - Express next middleware execution handler for global error forwarding.
 * @returns {Promise<void>} Resolves when registration response is dispatched asynchronously.
 */
export async function register(req, res, next) {
  try {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nome, email e password são obrigatórios' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email já registado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      nome,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      token: createToken(user),
      user: formatAuthUser(user),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Authenticates an existing user session by validating credentials against stored security hashes.
 *
 * @param {Object} req - Express request object containing login email and password string keys.
 * @param {Object} res - Express response object yielding token payloads on validated credentials.
 * @param {Function} next - Express next middleware execution handler for error propagation.
 * @returns {Promise<void>} Resolves when the login processing stream completes execution.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email e password são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    res.json({
      success: true,
      token: createToken(user),
      user: formatAuthUser(user),
    });
  } catch (error) {
    next(error);
  }
}