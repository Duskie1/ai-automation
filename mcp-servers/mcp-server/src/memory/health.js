/**
 * Memory Health - System health monitoring and contradiction detection
 *
 * Provides visibility into memory system health and detects conflicts.
 */
import { loadGraph } from './storage.js';
import { CONFIG } from '../config/index.js';

// Growth projection thresholds
const WARNING_THRESHOLD_WEEKS = 26; // 6 months
const CRITICAL_THRESHOLD_WEEKS = 13; // 3 months
const UTILIZATION_WARNING = 30; // 30%
const UTILIZATION_CRITICAL = 60; // 60%

/**
 * Calculate growth projection based on entity creation history
 * @param {Array} entities - Array of entities with metadata
 * @returns {Object} - Growth projection data
 */
function calculateGrowthProjection(entities) {
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  // Count entities added in last 7 days
  let entitiesAddedLast7Days = 0;
  for (const entity of entities) {
    const metadata = entity.metadata || {};
    if (metadata.createdAt) {
      const createdAt = new Date(metadata.createdAt).getTime();
      if (now - createdAt <= sevenDaysMs) {
        entitiesAddedLast7Days++;
      }
    }
  }

  // Calculate growth rate per week
  const growthRatePerWeek = entitiesAddedLast7Days;

  // Project weeks until limit
  const hardLimit = CONFIG.memory.limits.hard;
  const currentCount = entities.length;
  const remainingCapacity = hardLimit - currentCount;

  let weeksUntilLimit = Infinity;
  if (growthRatePerWeek > 0) {
    weeksUntilLimit = Math.ceil(remainingCapacity / growthRatePerWeek);
  }

  // Calculate projected limit date
  let projectedLimitDate = null;
  if (weeksUntilLimit !== Infinity) {
    const limitDateMs = now + (weeksUntilLimit * 7 * 24 * 60 * 60 * 1000);
    projectedLimitDate = new Date(limitDateMs).toISOString().split('T')[0];
  }

  // Determine warning level
  const utilizationPct = (currentCount / hardLimit) * 100;
  let warningLevel = 'HEALTHY';

  if (utilizationPct >= UTILIZATION_CRITICAL || weeksUntilLimit <= CRITICAL_THRESHOLD_WEEKS) {
    warningLevel = 'CRITICAL';
  } else if (utilizationPct >= UTILIZATION_WARNING || weeksUntilLimit <= WARNING_THRESHOLD_WEEKS) {
    warningLevel = 'WARNING';
  }

  return {
    entities_added_last_7_days: entitiesAddedLast7Days,
    growth_rate_per_week: growthRatePerWeek,
    weeks_until_limit: weeksUntilLimit === Infinity ? null : weeksUntilLimit,
    projected_limit_date: projectedLimitDate,
    warning_level: warningLevel
  };
}

/**
 * Check memory system health
 * @returns {Promise<Object>} - Health metrics and status
 */
export async function checkMemoryHealth() {
  const graph = await loadGraph();
  const entities = graph.entities || [];

  const softLimit = CONFIG.memory.limits.soft;
  const hardLimit = CONFIG.memory.limits.hard;
  const totalCount = entities.length;
  const utilizationPct = (totalCount / hardLimit) * 100;

  // Calculate growth projection
  const growthProjection = calculateGrowthProjection(entities);

  // Determine status (incorporating growth projection)
  let status = 'HEALTHY';
  if (totalCount >= hardLimit || growthProjection.warning_level === 'CRITICAL') {
    status = 'CRITICAL';
  } else if (totalCount >= softLimit || growthProjection.warning_level === 'WARNING') {
    status = 'ATTENTION';
  }

  // Categorize entities
  const permanent = [];
  const archivable = [];

  const protectedTypes = new Set(CONFIG.memory.archival.protectedTypes);

  for (const entity of entities) {
    if (protectedTypes.has(entity.entityType)) {
      permanent.push(entity);
    } else {
      archivable.push(entity);
    }
  }

  // Count by type
  const permanentTypes = {};
  const archivableTypes = {};

  for (const e of permanent) {
    permanentTypes[e.entityType] = (permanentTypes[e.entityType] || 0) + 1;
  }
  for (const e of archivable) {
    archivableTypes[e.entityType] = (archivableTypes[e.entityType] || 0) + 1;
  }

  // Find stale entities
  const staleEntities = [];
  const staleDays = CONFIG.memory.archival.staleDays;
  const now = Date.now();

  for (const entity of entities) {
    const metadata = entity.metadata || {};
    const createdAt = metadata.createdAt ? new Date(metadata.createdAt).getTime() : now;
    const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    const accessCount = metadata.accessCount || 0;

    // Check staleness based on entity type
    let staleThreshold = staleDays[entity.entityType] || 180;

    if (ageInDays > staleThreshold && accessCount === 0) {
      staleEntities.push({
        name: entity.name,
        entityType: entity.entityType,
        age_days: Math.round(ageInDays),
        access_count: accessCount
      });
    }
  }

  // Archive candidates (stale entities that aren't protected)
  const archiveCandidates = staleEntities
    .filter(e => !protectedTypes.has(e.entityType))
    .map(e => e.name)
    .slice(0, 50); // Limit to 50 candidates

  // Warnings
  const warnings = [];
  if (totalCount >= hardLimit) {
    warnings.push(`Memory at hard limit (${totalCount}/${hardLimit}). Archive required before new entities.`);
  } else if (totalCount >= softLimit) {
    warnings.push(`Memory approaching limit (${totalCount}/${hardLimit}). Consider archiving.`);
  }
  if (staleEntities.length > 0) {
    warnings.push(`${staleEntities.length} stale entities found (unused for >90 days).`);
  }

  // Growth projection warnings
  if (growthProjection.warning_level === 'CRITICAL') {
    if (growthProjection.weeks_until_limit !== null) {
      warnings.push(`Growth projection: ${growthProjection.weeks_until_limit} weeks until limit (CRITICAL < 13 weeks).`);
    } else {
      warnings.push(`Growth projection: CRITICAL utilization level (${Math.round(utilizationPct)}%).`);
    }
  } else if (growthProjection.warning_level === 'WARNING') {
    if (growthProjection.weeks_until_limit !== null) {
      warnings.push(`Growth projection: ${growthProjection.weeks_until_limit} weeks until limit (WARNING < 26 weeks). Schedule archival.`);
    }
  }

  return {
    total_entities: totalCount,
    soft_limit: softLimit,
    hard_limit: hardLimit,
    utilization_pct: Math.round(utilizationPct * 10) / 10,
    status: status,
    breakdown: {
      permanent: {
        count: permanent.length,
        types: permanentTypes
      },
      archivable: {
        count: archivable.length,
        types: archivableTypes
      }
    },
    stale_entities: staleEntities,
    archive_candidates: archiveCandidates,
    warnings: warnings,
    growth_projection: growthProjection
  };
}

/**
 * Check for contradictions and duplicates in memory
 * @param {Object} params - Check parameters
 * @param {string} params.scope - "all" or "recent"
 * @param {number} params.recent_days - Days to consider for "recent" scope
 * @returns {Promise<Object>} - Contradictions and duplicates found
 */
export async function checkMemoryContradictions({ scope = 'all', recent_days = 30 }) {
  const graph = await loadGraph();
  const entities = graph.entities || [];

  const contradictions = [];
  const duplicates = [];

  const now = Date.now();
  const recentMs = recent_days * 24 * 60 * 60 * 1000;

  // Filter entities by scope
  let filteredEntities = entities;
  if (scope === 'recent') {
    filteredEntities = entities.filter(e => {
      const metadata = e.metadata || {};
      const createdAt = metadata.createdAt ? new Date(metadata.createdAt).getTime() : now;
      return (now - createdAt) <= recentMs;
    });
  }

  // Check for direct contradictions
  for (let i = 0; i < filteredEntities.length; i++) {
    for (let j = i + 1; j < filteredEntities.length; j++) {
      const e1 = filteredEntities[i];
      const e2 = filteredEntities[j];

      // Skip if same type or different types
      if (e1.entityType !== e2.entityType) continue;

      const contradictionsFound = checkForContradictions(e1, e2);
      for (const contradiction of contradictionsFound) {
        contradictions.push({
          entity_a: e1.name,
          entity_b: e2.name,
          type: contradiction.type,
          observation_a: contradiction.obs1,
          observation_b: contradiction.obs2,
          confidence: 0.8,
          resolution_suggestion: `Keep ${getMoreRecent(e1, e2)}, archive the other`
        });
      }

      // Check for duplicates
      const similarity = calculateSimilarity(e1, e2);
      if (similarity > 0.8) {
        duplicates.push({
          entities: [e1.name, e2.name],
          similarity_score: Math.round(similarity * 100) / 100,
          merge_suggestion: `Consolidate into ${e1.name}`
        });
      }
    }
  }

  return {
    contradictions_found: contradictions,
    duplicates_found: duplicates,
    scope: scope,
    entities_checked: filteredEntities.length
  };
}

/**
 * Check for contradictions between two entities
 */
function checkForContradictions(e1, e2) {
  const contradictions = [];
  const obs1 = (e1.observations || []).join(' ').toLowerCase();
  const obs2 = (e2.observations || []).join(' ').toLowerCase();

  // NEVER vs ALWAYS contradiction
  if (obs1.includes('never') && obs2.includes('always')) {
    const context1 = extractContext(obs1, 'never');
    const context2 = extractContext(obs2, 'always');
    if (context1 === context2) {
      contradictions.push({
        type: 'direct_contradiction',
        obs1: e1.observations[0] || '',
        obs2: e2.observations[0] || ''
      });
    }
  }

  // Same pattern with different conclusions
  if (obs1.includes('should') && obs2.includes('should')) {
    const conclusion1 = extractConclusion(obs1);
    const conclusion2 = extractConclusion(obs2);
    if (conclusion1 && conclusion2 && conclusion1 !== conclusion2 &&
        obs1.includes(obs2.substring(0, 20))) {
      contradictions.push({
        type: 'partial_conflict',
        obs1: e1.observations[0] || '',
        obs2: e2.observations[0] || ''
      });
    }
  }

  return contradictions;
}

/**
 * Extract context around a keyword
 */
function extractContext(text, keyword) {
  const idx = text.indexOf(keyword);
  if (idx === -1) return '';
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + keyword.length + 20);
  return text.substring(start, end).trim();
}

/**
 * Extract conclusion from text
 */
function extractConclusion(text) {
  const patterns = ['do', 'avoid', 'use', 'skip', 'enable', 'disable'];
  for (const pattern of patterns) {
    if (text.includes(`should ${pattern}`)) {
      return pattern;
    }
  }
  return null;
}

/**
 * Calculate similarity between two entities
 */
function calculateSimilarity(e1, e2) {
  const name1 = e1.name.toLowerCase();
  const name2 = e2.name.toLowerCase();

  // Check name similarity
  if (name1.includes(name2) || name2.includes(name1)) {
    return 0.9;
  }

  // Check observation similarity
  const obs1 = (e1.observations || []).join(' ').toLowerCase();
  const obs2 = (e2.observations || []).join(' ').toLowerCase();

  // Simple word overlap
  const words1 = new Set(obs1.split(/\s+/));
  const words2 = new Set(obs2.split(/\s+/));

  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word) && word.length > 3) {
      intersection++;
    }
  }

  const union = new Set([...words1, ...words2]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Get the more recent entity
 */
function getMoreRecent(e1, e2) {
  const m1 = e1.metadata || {};
  const m2 = e2.metadata || {};
  const t1 = m1.createdAt ? new Date(m1.createdAt).getTime() : 0;
  const t2 = m2.createdAt ? new Date(m2.createdAt).getTime() : 0;
  return t1 >= t2 ? e1.name : e2.name;
}
