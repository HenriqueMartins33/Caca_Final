/**
 * @file Runtime entry point for the CACA API Node.js server.
 * Reconstructs standard directory paths, injects environment variables, 
 * verifies critical configuration tokens, handles the database initialization connection handshake, 
 * and binds the Express application to network socket listeners.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * The absolute path file string designation of the current executing module.
 * Reconstructed manually to emulate CommonJS mechanics inside native ES Modules context environments.
 * @type {string}
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * The absolute path directory string representation location where this entry module is deployed.
 * Implemented alongside fileURLToPath to mitigate execution context path shifts.
 * @type {string}
 */
const __dirname = dirname(__filename);

// Explicitly loads context settings from the targeted local runtime .env file into the node process framework environment.
dotenv.config({ path: join(__dirname, '.env') });

/**
 * The operational TCP network socket channel port number allocated for handling HTTP API request traffic pipelines.
 * Defaults to 3001 if no override value is explicitly provided via global environment bindings.
 * @type {string|number}
 */
const PORT = process.env.PORT;

/**
 * The destination database lookup connection URI string mapped directly out of system environment specifications.
 * Used to establish authorization, network routing, and state pools across distributed MongoDB Atlas setups.
 * @type {string|undefined}
 */
const MONGODB_URI = process.env.MONGODB_URI;

// Fail-fast guard deployment logic validating that mandatory connection configurations exist before allocation triggers.
if (!MONGODB_URI) {
  console.error('MONGODB_URI não definido no .env');
  process.exit(1); // Terminates the current node execution loop context with standard operation error exit flag code 1.
}

/**
 * Boots the server framework orchestration by coordinating external asynchronous state handshakes sequentially.
 * Guarantees established connection storage targets exist before allowing network ports to route inbound traffic profiles.
 *
 * @async
 * @function startServer
 * @returns {Promise<void>} Resolves once the database connection fulfills and the Express server actively listens.
 */
async function startServer() {
  try {
    // Establishes a TCP connection pool to the destination MongoDB cluster utilizing the verified access URI metadata string.
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB ligado com sucesso');

    // Binds the fully mapped and secured Express app instance configuration layer onto the specified local port interface.
    app.listen(PORT, () => {
      console.log(`CACA API a correr em http://localhost:${PORT}`);
    });
  } catch (error) {
    // Logs any unexpected database failure or initial configuration runtime exception errors.
    console.error('Erro ao iniciar servidor:', error.message);
    process.exit(1); // Halts processing routines to prevent unhandled node lifecycle error crashes.
  }
}

// Executes the backend environment initialization startup engine sequence.
startServer();