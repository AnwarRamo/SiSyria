/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {'user' | 'admin'} role
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user
 * @property {string} token
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} username
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {number} [statusCode]
 */
