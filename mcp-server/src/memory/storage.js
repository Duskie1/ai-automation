/**
 * Memory Storage - JSONL file operations
 *
 * Stores knowledge graph in JSONL format (one JSON object per line).
 * Path: mcp-server/data/memory.jsonl
 *
 * Why JSONL:
 * - Human readable
 * - Git-friendly (line-based diffs)
 * - Append-friendly for future optimizations
 */
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MEMORY_FILE = join(__dirname, '..', '..', 'data', 'memory.jsonl');

/**
 * Load the knowledge graph from JSONL file
 * @returns {Promise<{entities: Array, relations: Array}>}
 */
export async function loadGraph() {
  try {
    const content = await readFile(MEMORY_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    const entities = [];
    const relations = [];

    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (item.type === 'entity') {
          entities.push({
            name: item.name,
            entityType: item.entityType,
            observations: item.observations || [],
            metadata: item.metadata || {
              createdAt: new Date().toISOString(),
              source: 'manual',
              confidence: 'medium',
              accessCount: 0,
              lastAccessed: null,
              supersededBy: null
            }
          });
        } else if (item.type === 'relation') {
          relations.push({
            from: item.from,
            to: item.to,
            relationType: item.relationType
          });
        }
      } catch (parseErr) {
        // Skip malformed lines
        console.error(`Skipping malformed line: ${line.substring(0, 50)}...`);
      }
    }

    return { entities, relations };
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet - return empty graph
      return { entities: [], relations: [] };
    }
    throw err;
  }
}

/**
 * Save the knowledge graph to JSONL file
 * @param {Object} graph - {entities: Array, relations: Array}
 */
export async function saveGraph(graph) {
  // Ensure data directory exists
  const dataDir = dirname(MEMORY_FILE);
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }

  const lines = [
    ...graph.entities.map(e => JSON.stringify({
      type: 'entity',
      name: e.name,
      entityType: e.entityType,
      observations: e.observations || [],
      metadata: e.metadata || null
    })),
    ...graph.relations.map(r => JSON.stringify({
      type: 'relation',
      from: r.from,
      to: r.to,
      relationType: r.relationType
    }))
  ];

  await writeFile(MEMORY_FILE, lines.join('\n') + '\n', 'utf-8');
}

/**
 * Get the path to the memory file (for debugging/testing)
 */
export function getMemoryFilePath() {
  return MEMORY_FILE;
}
