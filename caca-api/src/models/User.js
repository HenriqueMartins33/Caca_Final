/**
 * @file Data model definition for application users using Mongoose.
 * Maps out the MongoDB collection constraints, establishes data validation rules, 
 * secures sensitive data properties, and configures automated document lifecycle options.
 */

import mongoose from 'mongoose';

/**
 * Mongoose schema defining the database structural layout and validation layers for a User document.
 * Enforces field types, required bounds, uniqueness indices, and lifecycle automation rules.
 * * @type {mongoose.Schema}
 * @property {string} nome - Full name of the user; required, formatted with a 2-character floor limit and auto-trimmed.
 * @property {string} email - Unique email identifier; normalized to lowercase, required, and validated via indexing constraints.
 * @property {string} password - Cryptographically hashed password signature; marked as un-selectable by default queries for security isolation.
 * @property {string} role - System permission privilege state; strictly restricted to explicit 'admin' or 'user' enumerations.
 */
const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password é obrigatória'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

/**
 * Global lifecycle transformation rules configured when mutating database documents directly into JSON notation payloads.
 * Explicitly blocks sensitive parameters and query indicators from escaping into application API data flows.
 *
 * @name toJSON
 * @memberof userSchema
 * @inner
 */
userSchema.set('toJSON', {
  /**
   * Hook executed automatically during JSON serialization (e.g., res.json() transmissions).
   * Strips internal metadata properties and security hashes right before shipping data arrays to the client.
   *
   * @param {mongoose.Document} doc - The original Mongoose document representation context.
   * @param {Object} ret - The decoupled clear text object copy slated to undergo data streaming serialization.
   * @returns {Object} The stripped and sanitized object instance containing only public profile metadata.
   */
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

/**
 * Mongoose operational model compilation acting as the structural data execution hook interface for MongoDB collections.
 * Exposes full collection query mechanics and mutation routines mapped over a 'users' storage partition layout.
 * * @module User
 * @type {mongoose.Model<mongoose.Document>}
 */
export default mongoose.model('User', userSchema);