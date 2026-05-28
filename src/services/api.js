/**
 * @file Centralized frontend API service layer for the CACA web platform.
 * Manages core network infrastructure communication utilizing fetch pipelines, establishes 
 * global base configurations, appends authorization headers, handles response deserialization, 
 * and maps standardized network error vectors to user-friendly notifications.
 */

/**
 * The base target network server address configuration loaded out of environment parameters.
 * @type {string|undefined}
 */
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Core underlying wrapper orchestrating raw asynchronous fetch transactions targeting local or remote endpoints.
 * Intercepts default header configurations, handles defensive streaming deserialization, evaluates server response 
 * conditions manually, and handles error propagation workflows cleanly.
 *
 * @async
 * @function request
 * @param {string} endpoint - The target path fragment to append directly onto the base system URL string.
 * @param {Object} [options={}] - Standard configurations passing custom methods, body data, or extra connection signals.
 * @throws {Error} An operational application exception packaging parsed database or validation failure details.
 * @returns {Promise<Object>} Mapped JSON representation model returned directly from backend processes.
 */
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Ocorreu um erro. Tente novamente.');
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Enhanced pipeline helper that wraps standard endpoints automatically injecting a client JSON Web Token signature.
 * Builds the appropriate Bearer Authorization payload validation schema into downstream HTTP network headers.
 *
 * @function authFetch
 * @param {string} endpoint - The targeting relative API routing sub-path destination block.
 * @param {string} token - The active user authorization JWT string retrieved from storage structures.
 * @param {Object} [options={}] - Additional data configurations matching the standard request parameter definitions.
 * @returns {Promise<Object>} An executed routing promise returning clean, authenticated JSON payloads.
 */
export function authFetch(endpoint, token, options = {}) {
  return request(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Dispatches an unauthenticated POST login communication query targeting user registration directories.
 *
 * @param {string} email - The input profile search key email string.
 * @param {string} password - The un-hashed verification credential token submitted at login forms.
 * @returns {Promise<Object>} Session data containing success booleans, the issued JWT string, and public user records.
 */
export function loginUser(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Transmits initialization configurations to spawn a new persistent user record within backend storage collections.
 *
 * @param {string} nome - Profile display name tag assigned during registration procedures.
 * @param {string} email - The unique structural email identification handle to assign to the profile structure.
 * @param {string} password - The plaintext target credential password sequence slated to undergo hashing.
 * @returns {Promise<Object>} Successful registration transaction results including contextual operational tokens.
 */
export function registerUser(nome, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nome, email, password }),
  });
}

/**
 * Queries protected backend profile indexes to fetch data arrays matching current user attributes.
 *
 * @param {string} token - The validated session token confirming established user identification boundaries.
 * @returns {Promise<Object>} Data payload wrapping matching profile properties like name, role, and email.
 */
export function getProfile(token) {
  return authFetch('/api/users/profile', token);
}

/**
 * Submits dynamic mutations to modify specific parameters linked to the logged-in user profile identity state.
 *
 * @param {string} token - Active credential token checking interface authorization permissions.
 * @param {Object} profileData - Data wrapper enclosing field mutations slated to apply to the target schema.
 * @param {string} [profileData.nome] - The new optional display name sequence update configuration.
 * @param {string} [profileData.email] - The new unique targeting email handle update parameter.
 * @returns {Promise<Object>} Updated profile state models emitted from validation pipelines.
 */
export function updateProfile(token, { nome, email }) {
  return authFetch('/api/users/profile', token, {
    method: 'PUT',
    body: JSON.stringify({ nome, email }),
  });
}

/**
 * Administrative reporting query that pulls the collection listing of all system application profiles recorded on database tiers.
 *
 * @param {string} token - Administrative clearance signature ensuring current profile role levels permit lookups.
 * @returns {Promise<Object>} Array payload wrapper mapping comprehensive user account configurations.
 */
export function getAllUsers(token) {
  return authFetch('/api/users', token);
}

/**
 * Administrative termination routine executing physical removal of target database nodes mapped underneath an identity string.
 *
 * @param {string} token - Security credential validating the access rights required to execute account termination sweeps.
 * @param {string|number} id - The specific primary object identifier key mapping to the targeting target account collection node.
 * @returns {Promise<Object>} Dispatched backend operation responses indicating transaction status completions.
 */
export function deleteUser(token, id) {
  return authFetch(`/api/users/${id}`, token, {
    method: 'DELETE',
  });
}

/**
 * Analytical conversion mapping utility evaluating incoming network errors to parse specific user feedback messaging loops.
 * Normalizes HTTP structural failure codes securely into clear, localized warning strings suitable for front-end rendering engines.
 *
 * @param {Object|Error} error - Runtime operational failure context containing response status metadata or connection markers.
 * @param {string} [error.message] - Textual exception information emitted during network evaluation loops.
 * @param {number} [error.status] - Standard HTTP tracking failure index flag returned by backend controllers.
 * @returns {string} Fully formatted Portuguese string explanation guiding user interaction steps.
 */
export function parseApiError(error) {
  if (error?.message === 'Failed to fetch') {
    return 'Sem ligação ao servidor.';
  }

  if (error?.status === 401) {
    return 'Email ou password incorretos.';
  }

  if (error?.status === 409) {
    return 'Este email já está registado.';
  }

  if (error?.status === 403) {
    return 'Não tem permissão para esta ação.';
  }

  return 'Ocorreu um erro. Tente novamente.';
}