/**
 * @file Database seeding script for the CACA API.
 * Establishes a temporary connection to MongoDB Atlas to initialize or restore 
 * the administrative root user account using secure cryptographic hashing and idempotent mutations.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';

// Loads environment variables from the server root context into process.env before connection triggers.
dotenv.config();

/**
 * The target database connection URI pulled from the configured environment variables.
 * @type {string|undefined}
 */
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Executes the database seeding routing sequence asynchronously.
 * Connects to the database, hashes the fallback admin credentials using bcrypt, performs an
 * idempotent upsert mutation, and disconnects cleanly to prevent terminal lifecycle hangs.
 *
 * @async
 * @function seed
 * @returns {Promise<void>} Resolves once the administration document is seeded and the connection pool closes.
 */
async function seed() {
  try {
    // Connects to the MongoDB target storage engine using the system URI string.
    await mongoose.connect(MONGODB_URI);

    // Generates a one-way secure cryptographic password hash using a cost factor iteration of 12.
    const password = await bcrypt.hash('Admin1234!', 12);

    // Performs an atomic update-or-insert mutation to ensure structural identity without duplication crashes.
    await User.findOneAndUpdate(
      { email: 'admin@caca.pt' },
      {
        nome: 'Administrador CACA',
        email: 'admin@caca.pt',
        password,
        role: 'admin',
      },
      { upsert: true, runValidators: true } // Upsert forces creation if missing; runValidators enforces schema enums on updates.
    );

    console.log('Admin criado/atualizado com sucesso: admin@caca.pt');
    
    // Explicitly tears down the active socket pool connection so the Node event loop can close naturally.
    await mongoose.disconnect();
    process.exit(0); // Exits the runtime thread signaling standard system success code 0.
  } catch (error) {
    // Captures connection or validation mapping exceptions during seed execution runtime blocks.
    console.error('Erro ao executar seed:', error.message);
    
    // Safety disconnect layer ensuring the cluster pool drops resources even during script execution failures.
    await mongoose.disconnect();
    process.exit(1); // Halts processing routines returning system operational failure code 1.
  }
}

// Launches the data populating engine sequence.
seed();