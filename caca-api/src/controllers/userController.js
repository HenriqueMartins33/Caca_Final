/**
 * @file Backend user management controller for the CACA API.
 * Handles profile fetching, profile updates, administrative user listings, and secure account deletion.
 */

import User from '../models/User.js';

/**
 * Formats user properties into a clean profile object, explicitly preserving the account creation timestamp.
 *
 * @param {Object} user - The raw user document object from the database.
 * @returns {Object} Structured data containing id, nome, email, role, and createdAt attributes.
 */
function formatProfile(user) {
  return {
    id: user._id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * Retrieves the currently authenticated user's profile information from the request object pipeline.
 *
 * @param {Object} req - Express request object containing the pre-fetched user document injected via requireAuth.
 * @param {Object} res - Express response object utilized to return the formatted profile payload.
 * @param {Function} next - Express next middleware execution handler for handling potential runtime exceptions.
 * @returns {Promise<void>} Resolves when the user profile response has been dispatched.
 */
export async function getProfile(req, res, next) {
  try {
    res.json({
      success: true,
      user: formatProfile(req.user),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Performs a partial update on the logged-in user's profile data, safely evaluating field modifications.
 *
 * @param {Object} req - Express request object containing potentially updated name or email fields in body.
 * @param {Object} res - Express response object sending back the updated and validated data object.
 * @param {Function} next - Express next middleware execution handler for global schema validation errors.
 * @returns {Promise<void>} Resolves when the database persistence and validation pipeline finishes execution.
 */
export async function updateProfile(req, res, next) {
  try {
    const { nome, email } = req.body;

    if (nome !== undefined) req.user.nome = nome;
    if (email !== undefined) req.user.email = email;

    const updatedUser = await req.user.save();

    res.json({
      success: true,
      user: formatProfile(updatedUser),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves an administrative overview list of all registered users ordered by registration date.
 *
 * @param {Object} req - Express request object mapping down administrative endpoint routing rules.
 * @param {Object} res - Express response object outputting the fully mapped user metadata array.
 * @param {Function} next - Express next middleware execution handler for database connection failure errors.
 * @returns {Promise<void>} Resolves when query execution finishes and payload is sent.
 */
export async function getUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users.map(formatProfile),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Administratively terminates and deletes a specific target user account while preventing self-deletion.
 *
 * @param {Object} req - Express request object containing the target user id placeholder as a route parameter.
 * @param {Object} res - Express response object validating successful termination updates.
 * @param {Function} next - Express next middleware execution handler for handling malformed identifier exceptions.
 * @returns {Promise<void>} Resolves when the secure deletion operational routine terminates successfully.
 */
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Não pode eliminar a sua própria conta' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado' });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'Utilizador eliminado',
    });
  } catch (error) {
    next(error);
  }
}