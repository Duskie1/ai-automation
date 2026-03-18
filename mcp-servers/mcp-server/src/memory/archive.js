/**
 * Memory Archive - Entity archival and consolidation
 *
 * Manages memory growth through smart archival and consolidation.
 */
import { loadGraph, saveGraph } from './storage.js';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { CONFIG } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', '..', 'data');

/**
 * Archive stale entities to a dated archive file
 * @param {Object} params - Archive parameters
 * @param {string} params.mode - "dry_run" or "execute"
 * @param {number} params.max_to_archive - Maximum entities to archive
 * @param {boolean} params.override_protection - Allow archiving protected entities
 * @returns {Promise<Object>} - Archive results
 */
export async function archiveStaleEntities({ mode = 'dry_run', max_to_archive = 50, override_protection = false }) {
  const graph = await loadGraph();
  const entities = graph.entities || [];
  const relations = graph.relations || [];

  const protectedTypes = new Set(CONFIG.memory.archival.protectedTypes);
  const protectedKeywords = CONFIG.memory.archival.protectedKeywords;
  const staleDays = CONFIG.memory.archival.staleDays;

  const now = Date.now();
  const wouldArchive = [];
  const protectedList = [];

  for (const entity of entities) {
    const metadata = entity.metadata || {};
    const createdAt = metadata.createdAt ? new Date(metadata.createdAt).getTime() : now;
    const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    const accessCount = metadata.accessCount || 0;

    // Check if protected by type
    const isProtectedType = protectedTypes.has(entity.entityType);

    // Check if protected by keyword content
    const observations = (entity.observations || []).join(' ');
    const hasProtectedKeyword = protectedKeywords.some(kw =>
      observations.toLowerCase().includes(kw.toLowerCase())
    );

    if (isProtectedType && !override_protection) {
      protectedList.push({
        name: entity.name,
        reason: 'protected_type'
      });
      continue;
    }

    if (hasProtectedKeyword && !override_protection) {
      protectedList.push({
        name: entity.name,
        reason: 'contains_protected_keyword'
      });
      continue;
    }

    // Check if stale
    let staleThreshold = staleDays[entity.entityType] || 180;
    const isStale = ageInDays > staleThreshold && accessCount === 0;

    if (isStale && wouldArchive.length < max_to_archive) {
      wouldArchive.push(entity);
    }
  }

  if (mode === 'dry_run') {
    return {
      mode: 'dry_run',
      would_archive: wouldArchive.map(e => e.name),
      archived_count: 0,
      protected_count: protectedList.length,
      protected_entities: protectedList,
      archive_file: null
    };
  }

  // Execute archive
  if (wouldArchive.length === 0) {
    return {
      mode: 'execute',
      would_archive: [],
      archived_count: 0,
      protected_count: protectedList.length,
      protected_entities: protectedList,
      archive_file: null
    };
  }

  // Create archive file
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const archiveFileName = `memory_archive_${currentMonth}.jsonl`;
  const archiveFilePath = join(DATA_DIR, archiveFileName);

  // Ensure data directory exists
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }

  // Read existing archive or create new
  let existingLines = [];
  if (existsSync(archiveFilePath)) {
    const content = await readFile(archiveFilePath, 'utf-8');
    existingLines = content.split('\n').filter(line => line.trim());
  }

  // Append archived entities with archive metadata
  const archivedAt = new Date().toISOString();
  const newLines = wouldArchive.map(entity => {
    const archiveEntry = {
      ...entity,
      archived_at: archivedAt,
      archive_reason: 'stale_unused'
    };
    return JSON.stringify({ type: 'archived_entity', ...archiveEntry });
  });

  await writeFile(archiveFilePath, [...existingLines, ...newLines].join('\n') + '\n', 'utf-8');

  // Remove archived entities from active memory
  const archivedNames = new Set(wouldArchive.map(e => e.name));
  graph.entities = entities.filter(e => !archivedNames.has(e.name));
  graph.relations = relations.filter(r =>
    !archivedNames.has(r.from) && !archivedNames.has(r.to)
  );

  await saveGraph(graph);

  return {
    mode: 'execute',
    would_archive: wouldArchive.map(e => e.name),
    archived_count: wouldArchive.length,
    protected_count: protectedList.length,
    protected_entities: protectedList,
    archive_file: archiveFilePath
  };
}

/**
 * Consolidate similar entities into one
 * @param {Object} params - Consolidation parameters
 * @param {string[]} params.source_entities - Entity names to merge
 * @param {string} params.target_entity - Target entity name to keep
 * @param {string} params.mode - "merge", "prefer_target", or "prefer_recent"
 * @returns {Promise<Object>} - Consolidation results
 */
export async function consolidateMemoryEntities({ source_entities, target_entity, mode = 'merge' }) {
  const graph = await loadGraph();
  const entities = graph.entities || [];
  const relations = graph.relations || [];

  // Find entities
  const target = entities.find(e => e.name === target_entity);
  if (!target) {
    return {
      success: false,
      error: `Target entity not found: ${target_entity}`
    };
  }

  const sources = source_entities
    .map(name => entities.find(e => e.name === name))
    .filter(e => e !== undefined);

  if (sources.length === 0) {
    return {
      success: false,
      error: `No valid source entities found`
    };
  }

  // Combine observations (deduplicated)
  const allObservations = new Set([
    ...(target.observations || []),
    ...sources.flatMap(s => s.observations || [])
  ]);

  const observationsBefore = (target.observations || []).length;
  const observationsAfter = allObservations.size;

  // Update target entity
  target.observations = Array.from(allObservations);

  // Update metadata
  const metadata = target.metadata || {};
  metadata.accessCount = (metadata.accessCount || 0) + sources.reduce((sum, s) =>
    sum + (s.metadata?.accessCount || 0), 0
  );
  target.metadata = metadata;

  // Update relations: redirect deleted entity relations to target
  const deletedNames = new Set(source_entities);
  let relationsUpdated = 0;

  for (const rel of relations) {
    if (deletedNames.has(rel.from) && rel.from !== target_entity) {
      rel.from = target_entity;
      relationsUpdated++;
    }
    if (deletedNames.has(rel.to) && rel.to !== target_entity) {
      rel.to = target_entity;
      relationsUpdated++;
    }
  }

  // Remove source entities
  graph.entities = entities.filter(e => !deletedNames.has(e.name));

  // Remove self-relations that may have been created
  graph.relations = relations.filter(r => r.from !== r.to);

  await saveGraph(graph);

  return {
    success: true,
    merged_entity: {
      name: target_entity,
      observations_before: observationsBefore,
      observations_after: observationsAfter,
      observations_added_from: source_entities
    },
    deleted_entities: source_entities,
    relations_updated: relationsUpdated
  };
}

/**
 * List all archived entities
 * @param {Object} params - List parameters
 * @param {string} params.filter_type - Entity type filter (default "all")
 * @param {string} params.search_query - Optional search term
 * @returns {Promise<Object>} - List of archived entities
 */
export async function listArchivedEntities({ filter_type = 'all', search_query = '' }) {
  const dataDir = DATA_DIR;

  // Ensure data directory exists
  if (!existsSync(dataDir)) {
    return {
      archived_entities: [],
      total_archived: 0,
      by_type: {}
    };
  }

  // Find all archive files
  const entries = await readdir(dataDir, { withFileTypes: true });
  const archiveFiles = entries
    .filter(e => e.isFile() && e.name.startsWith('memory_archive_') && e.name.endsWith('.jsonl'))
    .map(e => join(dataDir, e.name))
    .sort();

  const archivedEntities = [];
  const byType = {};

  for (const archiveFile of archiveFiles) {
    const content = await readFile(archiveFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (item.type === 'archived_entity') {
          const entityType = item.entityType || 'unknown';

          // Filter by type
          if (filter_type !== 'all' && entityType !== filter_type) {
            continue;
          }

          // Filter by search query
          if (search_query) {
            const searchLower = search_query.toLowerCase();
            const nameMatch = (item.name || '').toLowerCase().includes(searchLower);
            const obsMatch = (item.observations || []).some(o =>
              o.toLowerCase().includes(searchLower)
            );
            if (!nameMatch && !obsMatch) {
              continue;
            }
          }

          // Count by type
          byType[entityType] = (byType[entityType] || 0) + 1;

          // Add to results (summary, not full observations)
          archivedEntities.push({
            name: item.name,
            entityType: entityType,
            archive_file: archiveFile.split('/').pop(),
            archived_at: item.archived_at,
            archive_reason: item.archive_reason || 'unknown',
            observations_preview: (item.observations || [])[0]?.substring(0, 100) || ''
          });
        }
      } catch (parseErr) {
        // Skip malformed lines
      }
    }
  }

  return {
    archived_entities: archivedEntities,
    total_archived: archivedEntities.length,
    by_type: byType
  };
}
