/**
 * Memory Operations - Knowledge graph CRUD
 *
 * Entity types (generic for AI automation):
 * - lesson_learned: General learnings from workflows
 * - pattern_detected: Recurring issues or patterns
 * - workflow_config: Automation settings
 * - user_preference: User-specific settings
 * - success_pattern: Approaches that work reliably
 * - error_pattern: Common failure modes
 *
 * Relation types:
 * - caused_by: Root cause links
 * - prevents: Prevention relationships
 * - applies_to: Applicability scope
 * - related_to: General relationships
 * - supersedes: Version relationships
 */
import { loadGraph, saveGraph } from './storage.js';

// ============================================================
// CREATE Operations
// ============================================================

/**
 * Create entities in the knowledge graph
 * @param {Array<{name: string, entityType: string, observations?: string[]}>} entities
 * @returns {Promise<{created: string[], skipped: string[], count: number}>}
 */
export async function createEntities(entities) {
  const graph = await loadGraph();
  const created = [];
  const skipped = [];

  for (const entity of entities) {
    if (!entity.name || !entity.entityType) {
      skipped.push(entity.name || 'unnamed');
      continue;
    }

    // Check if entity already exists
    const existing = graph.entities.find(e => e.name === entity.name);
    if (existing) {
      skipped.push(entity.name);
      continue;
    }

    // Initialize metadata
    const metadata = {
      createdAt: new Date().toISOString(),
      source: entity.source || 'manual',
      confidence: entity.confidence || 'medium',
      accessCount: 0,
      lastAccessed: null,
      supersededBy: null
    };

    graph.entities.push({
      name: entity.name,
      entityType: entity.entityType,
      observations: entity.observations || [],
      metadata: metadata
    });
    created.push(entity.name);
  }

  if (created.length > 0) {
    await saveGraph(graph);
  }

  return { created, skipped, count: created.length };
}

/**
 * Create relations between entities
 * @param {Array<{from: string, to: string, relationType: string}>} relations
 * @returns {Promise<{created: string[], skipped: string[], count: number}>}
 */
export async function createRelations(relations) {
  const graph = await loadGraph();
  const created = [];
  const skipped = [];

  for (const rel of relations) {
    if (!rel.from || !rel.to || !rel.relationType) {
      skipped.push(`${rel.from || '?'} -> ${rel.to || '?'}`);
      continue;
    }

    // Check if relation already exists
    const exists = graph.relations.find(
      r => r.from === rel.from && r.to === rel.to && r.relationType === rel.relationType
    );
    if (exists) {
      skipped.push(`${rel.from} -[${rel.relationType}]-> ${rel.to}`);
      continue;
    }

    graph.relations.push({
      from: rel.from,
      to: rel.to,
      relationType: rel.relationType
    });
    created.push(`${rel.from} -[${rel.relationType}]-> ${rel.to}`);
  }

  if (created.length > 0) {
    await saveGraph(graph);
  }

  return { created, skipped, count: created.length };
}

/**
 * Add observations to existing entities
 * @param {Array<{entityName: string, contents: string[]}>} observations
 * @returns {Promise<{added: Array<{entity: string, count: number}>, not_found: string[]}>}
 */
export async function addObservations(observations) {
  const graph = await loadGraph();
  const added = [];
  const notFound = [];

  for (const obs of observations) {
    const entity = graph.entities.find(e => e.name === obs.entityName);
    if (entity) {
      // Add only non-duplicate observations
      const newObs = obs.contents.filter(c => !entity.observations.includes(c));
      entity.observations.push(...newObs);
      added.push({ entity: obs.entityName, count: newObs.length });
    } else {
      notFound.push(obs.entityName);
    }
  }

  if (added.length > 0) {
    await saveGraph(graph);
  }

  return { added, not_found: notFound };
}

// ============================================================
// READ Operations
// ============================================================

/**
 * Read the entire knowledge graph
 * @returns {Promise<{entities: Array, relations: Array, stats: Object}>}
 */
export async function readGraph() {
  const graph = await loadGraph();

  // Add stats for convenience
  const stats = {
    total_entities: graph.entities.length,
    total_relations: graph.relations.length,
    entity_types: {},
    relation_types: {}
  };

  for (const e of graph.entities) {
    stats.entity_types[e.entityType] = (stats.entity_types[e.entityType] || 0) + 1;
  }

  for (const r of graph.relations) {
    stats.relation_types[r.relationType] = (stats.relation_types[r.relationType] || 0) + 1;
  }

  return { ...graph, stats };
}

/**
 * Search for entities by name, type, or observation content
 *
 * Uses tokenized OR logic: splits query into words and matches if ANY word appears
 * in the entity. This enables natural language queries.
 *
 * @param {string} query - Search query (case-insensitive)
 * @returns {Promise<{entities: Array, relations: Array, match_count: number}>}
 */
export async function searchNodes(query) {
  const graph = await loadGraph();
  const now = new Date().toISOString();
  let needsSave = false;

  // Tokenize query: split on whitespace, lowercase, filter short tokens
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token.length >= 2);

  // If no valid tokens, return empty
  if (tokens.length === 0) {
    return { entities: [], relations: [], match_count: 0 };
  }

  // Match if ANY token appears in entity (OR logic)
  const matchingEntities = graph.entities.filter(entity => {
    const nameLower = entity.name.toLowerCase();
    const typeLower = entity.entityType.toLowerCase();

    return tokens.some(token =>
      nameLower.includes(token) ||
      typeLower.includes(token) ||
      entity.observations.some(obs => obs.toLowerCase().includes(token))
    );
  });

  // Track access for matching entities
  for (const entity of matchingEntities) {
    if (!entity.metadata) {
      entity.metadata = {
        createdAt: now,
        source: 'manual',
        confidence: 'medium',
        accessCount: 0,
        lastAccessed: null,
        supersededBy: null
      };
    }
    entity.metadata.accessCount = (entity.metadata.accessCount || 0) + 1;
    entity.metadata.lastAccessed = now;
    needsSave = true;
  }

  if (needsSave) {
    await saveGraph(graph);
  }

  // Get relations involving matched entities
  const entityNames = new Set(matchingEntities.map(e => e.name));
  const relatedRelations = graph.relations.filter(
    r => entityNames.has(r.from) || entityNames.has(r.to)
  );

  return {
    entities: matchingEntities,
    relations: relatedRelations,
    match_count: matchingEntities.length
  };
}

/**
 * Open specific entities by name
 * @param {string[]} names - Entity names to retrieve
 * @returns {Promise<{entities: Array, relations: Array, found_count: number, not_found: string[]}>}
 */
export async function openNodes(names) {
  const graph = await loadGraph();
  const now = new Date().toISOString();
  let needsSave = false;

  const entities = graph.entities.filter(e => names.includes(e.name));

  // Track access for opened entities
  for (const entity of entities) {
    if (!entity.metadata) {
      entity.metadata = {
        createdAt: now,
        source: 'manual',
        confidence: 'medium',
        accessCount: 0,
        lastAccessed: null,
        supersededBy: null
      };
    }
    entity.metadata.accessCount = (entity.metadata.accessCount || 0) + 1;
    entity.metadata.lastAccessed = now;
    needsSave = true;
  }

  if (needsSave) {
    await saveGraph(graph);
  }

  const found = entities.map(e => e.name);
  const notFound = names.filter(n => !found.includes(n));

  // Get relations between found entities
  const entityNames = new Set(found);
  const relations = graph.relations.filter(
    r => entityNames.has(r.from) && entityNames.has(r.to)
  );

  return {
    entities,
    relations,
    found_count: entities.length,
    not_found: notFound
  };
}

// ============================================================
// DELETE Operations
// ============================================================

/**
 * Delete entities and their relations
 * @param {string[]} entityNames - Entity names to delete
 * @returns {Promise<{deleted_entities: string[], deleted_relations: number}>}
 */
export async function deleteEntities(entityNames) {
  const graph = await loadGraph();

  const toDelete = new Set(entityNames);
  const originalEntityCount = graph.entities.length;
  const originalRelationCount = graph.relations.length;

  // Remove entities
  graph.entities = graph.entities.filter(e => !toDelete.has(e.name));

  // Remove relations involving deleted entities
  graph.relations = graph.relations.filter(
    r => !toDelete.has(r.from) && !toDelete.has(r.to)
  );

  await saveGraph(graph);

  return {
    deleted_entities: entityNames.filter(n =>
      graph.entities.every(e => e.name !== n)
    ),
    deleted_relations: originalRelationCount - graph.relations.length
  };
}

/**
 * Delete specific observations from entities
 * @param {Array<{entityName: string, observations: string[]}>} deletions
 * @returns {Promise<{deleted: Array<{entity: string, count: number}>, not_found: string[]}>}
 */
export async function deleteObservations(deletions) {
  const graph = await loadGraph();
  const deleted = [];
  const notFound = [];

  for (const del of deletions) {
    const entity = graph.entities.find(e => e.name === del.entityName);
    if (entity) {
      const toRemove = new Set(del.observations);
      const originalCount = entity.observations.length;
      entity.observations = entity.observations.filter(o => !toRemove.has(o));
      deleted.push({
        entity: del.entityName,
        count: originalCount - entity.observations.length
      });
    } else {
      notFound.push(del.entityName);
    }
  }

  await saveGraph(graph);

  return { deleted, not_found: notFound };
}

/**
 * Delete specific relations
 * @param {Array<{from: string, to: string, relationType: string}>} relations
 * @returns {Promise<{deleted: string[], not_found: string[]}>}
 */
export async function deleteRelations(relations) {
  const graph = await loadGraph();
  const deleted = [];
  const notFound = [];

  for (const rel of relations) {
    const relStr = `${rel.from} -[${rel.relationType}]-> ${rel.to}`;
    const idx = graph.relations.findIndex(
      r => r.from === rel.from && r.to === rel.to && r.relationType === rel.relationType
    );

    if (idx !== -1) {
      graph.relations.splice(idx, 1);
      deleted.push(relStr);
    } else {
      notFound.push(relStr);
    }
  }

  await saveGraph(graph);

  return { deleted, not_found: notFound };
}
