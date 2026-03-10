/**
 * Memory Module - Knowledge Graph for Persistent Learning
 *
 * Exports all memory operations for use in MCP tool handler.
 *
 * Benefits:
 * - Full control over storage path
 * - Git-synced memory file
 * - No external dependency
 */

export {
  // Storage
  loadGraph,
  saveGraph,
  getMemoryFilePath
} from './storage.js';

export {
  // CREATE
  createEntities,
  createRelations,
  addObservations,

  // READ
  readGraph,
  searchNodes,
  openNodes,

  // DELETE
  deleteEntities,
  deleteObservations,
  deleteRelations
} from './operations.js';

export {
  // Health
  checkMemoryHealth,
  checkMemoryContradictions
} from './health.js';

export {
  // Archive
  archiveStaleEntities,
  consolidateMemoryEntities,
  listArchivedEntities
} from './archive.js';

export {
  // Audit
  auditAnalysisLearnings
} from './audit.js';
