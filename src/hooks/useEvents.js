/**
 * @file Frontend state management hook and persistent storage utility for the CACA events system.
 * Wraps the callback-based browser IndexedDB API with JavaScript Promises to support asynchronous
 * async/await CRUD operations and synchronize persistent storage with declarative React state.
 */

import { useCallback, useEffect, useState } from 'react';

/**
 * IndexedDB configuration options for database initialization.
 * @type {Object}
 * @property {string} name - The absolute name identifier of the events database partition.
 * @property {number} version - Integer tracker controlling schema state and structure migration triggers.
 * @property {string} storeName - The targeting key identifier representing the active object table.
 */
const DB_CONFIG = {
  name: 'CACA_EventosDB',
  version: 1,
  storeName: 'eventos',
};

/**
 * Initializes and establishes an open socket connection handshake to the browser's IndexedDB environment.
 * Handles initial schema setup and database migrations safely inside the onupgradeneeded event boundary.
 *
 * @returns {Promise<IDBDatabase>} A promise resolving to the established, open database connection instance.
 */
function openEventsDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(DB_CONFIG.storeName)) {
        db.createObjectStore(DB_CONFIG.storeName, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

/**
 * Higher-order transaction abstraction wrapper designed to handle boilerplate operations on IndexedDB partitions uniformly.
 * Manages atomic pipeline scopes, automatically releasing locks or isolating errors across execution callbacks.
 *
 * @param {IDBDatabase} db - An active, open database instance pool token.
 * @param {string} mode - Execution transaction mode block; either 'readonly' or 'readwrite'.
 * @param {Function} callback - The targeting executable database script callback taking an IDBObjectStore parameter.
 * @returns {Promise<*>} A promise returning the payload result generated from executing the storage query request.
 */
function runTransaction(db, mode, callback) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([DB_CONFIG.storeName], mode);
    const store = transaction.objectStore(DB_CONFIG.storeName);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Private reading utility pulling all records synchronously stored across active database allocations.
 *
 * @param {IDBDatabase} database - An open connection instance referencing the events database structure.
 * @returns {Promise<Array<Object>>} Resolves with an array containing all event objects found in storage.
 */
async function readEvents(database) {
  return runTransaction(database, 'readonly', (store) => store.getAll());
}

/**
 * React state hook utility managing asynchronous CRUD transactions over local browser database infrastructure.
 * Isolates side effects, optimizes execution memory through function memoization, and encapsulates structural integrity constraints.
 *
 * @returns {Object} State payloads and operations hook interface.
 * @returns {Array<Object>} return.events - Mapped collection array reflecting all persistent event records.
 * @returns {boolean} return.loading - Flag indicating if an un-fulfilled storage fetch loop is actively running on mount.
 * @returns {Error|null} return.error - Exception metadata context thrown during transaction handshake loops.
 * @returns {Function} return.addEvent - Async operation appending fresh event structures to the local database.
 * @returns {Function} return.updateEvent - Async modification routine merging modified records onto matching keys.
 * @returns {Function} return.deleteEvent - Async operational handler dropping targeted identifier objects from memory rows.
 */
export function useEvents() {
  const [db, setDb] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Synchronizes internal React hook state memory with physical record data currently mapped across database rows.
   * Memoized using useCallback to mitigate cascade re-render loops down component nesting trees.
   *
   * @async
   * @param {IDBDatabase|null} [database=db] - Explicit database instance target fallback option.
   * @returns {Promise<void>} Resolves once state hooks capture updated data arrays from memory storage blocks.
   */
  const loadEvents = useCallback(async (database = db) => {
    if (!database) return;

    try {
      const result = await readEvents(database);
      setEvents(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  // Initializes database infrastructure hooks sequentially on component integration lifecycles.
  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const database = await openEventsDatabase();

        if (!active) {
          database.close();
          return;
        }

        setDb(database);
        const result = await readEvents(database);

        if (active) {
          setEvents(result);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    }

    init();

    // Cleanup hook deploying stale closure guard variables to suppress state updates on unmounted structures.
    return () => {
      active = false;
    };
  }, []);

  /**
   * Appends an event structure sequentially into persistent browser object store partitions.
   *
   * @async
   * @param {Object} eventData - Property parameters object detailing the new event layout properties.
   * @returns {Promise<void>} Resolves once records register and local state hook arrays sync completely.
   */
  const addEvent = useCallback(async (eventData) => {
    if (!db) return;

    await runTransaction(db, 'readwrite', (store) => store.add(eventData));
    await loadEvents(db);
  }, [db, loadEvents]);

  /**
   * Modifies or completely upserts an event configuration object index entry in matching database rows.
   *
   * @async
   * @param {Object} eventData - Targeting object signature key containing the updated parameters and valid primary identifier key.
   * @returns {Promise<void>} Resolves once upsert operations validate and internal hook scopes reload arrays.
   */
  const updateEvent = useCallback(async (eventData) => {
    if (!db) return;

    await runTransaction(db, 'readwrite', (store) => store.put(eventData));
    await loadEvents(db);
  }, [db, loadEvents]);

  /**
   * Locates and physically removes a primary record mapping node out of local database memory row entries.
   *
   * @async
   * @param {number|string} id - The specific primary index key auto-allocated onto the target entity.
   * @returns {Promise<void>} Resolves once deletion updates commit to disk and local hooks re-read arrays.
   */
  const deleteEvent = useCallback(async (id) => {
    if (!db) return;

    await runTransaction(db, 'readwrite', (store) => store.delete(id));
    await loadEvents(db);
  }, [db, loadEvents]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}