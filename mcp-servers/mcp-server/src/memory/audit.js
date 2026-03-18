/**
 * Memory Audit - Automated learning extraction from logs
 *
 * Scans log files for notable events and converts them to memory entities.
 */
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGS_BASE_DIR = join(__dirname, '..', '..', '..', '..', 'logs');

/**
 * Audit analysis logs for notable learnings
 * @param {Object} params - Audit parameters
 * @param {string} params.log_folder - Log folder name (e.g., "20260310")
 * @param {string} params.mode - "automated" or "manual"
 * @param {boolean} params.notable_events_only - Only extract notable events
 * @returns {Promise<Object>} - Audit results with learning suggestions
 */
export async function auditAnalysisLearnings({ log_folder, mode = 'automated', notable_events_only = true }) {
  const logDir = join(LOGS_BASE_DIR, log_folder);

  // Check if log directory exists
  if (!existsSync(logDir)) {
    return {
      error: `Log directory not found: ${log_folder}`,
      learnings_found: [],
      skipped_count: 0,
      logs_scanned: 0
    };
  }

  const notableKeywords = ['FAILED', 'ERROR', 'WARNING', 'INVALID', 'mismatch', 'unexpected', 'corrected', 'surprised'];

  const learnings = [];
  let skippedCount = 0;
  let logsScanned = 0;

  try {
    const entries = await readdir(logDir, { withFileTypes: true });
    const logFiles = entries
      .filter(e => e.isFile() && (e.name.endsWith('.log.md') || e.name.endsWith('.md')))
      .map(e => join(logDir, e.name));

    for (const logFile of logFiles) {
      logsScanned++;
      const content = await readFile(logFile, 'utf-8');
      const fileName = logFile.split('/').pop();

      // Scan for notable events
      const lines = content.split('\n');
      for (const line of lines) {
        const lowerLine = line.toLowerCase();

        // Check for notable keywords
        const hasNotableKeyword = notableKeywords.some(kw =>
          lowerLine.includes(kw.toLowerCase())
        );

        if (!notable_events_only || hasNotableKeyword) {
          // Extract learning from this line
          const learning = extractLearningFromLine(line, fileName);
          if (learning && isNotable(learning, notableKeywords, notable_events_only)) {
            // Check for duplicates
            const isDuplicate = learnings.some(l =>
              l.name_suggestion === learning.name_suggestion ||
              l.observations.some(o => learning.observations.includes(o))
            );

            if (!isDuplicate) {
              learnings.push(learning);
            } else {
              skippedCount++;
            }
          }
        }
      }
    }

    return {
      learnings_found: learnings,
      skipped_count: skippedCount,
      skipped_reasons: notable_events_only ? ['not_notable', 'duplicate_existing'] : ['duplicate_existing'],
      logs_scanned: logsScanned,
      mode: mode
    };

  } catch (err) {
    return {
      error: err.message,
      learnings_found: learnings,
      skipped_count: skippedCount,
      logs_scanned: logsScanned
    };
  }
}

/**
 * Extract a learning from a log line
 */
function extractLearningFromLine(line, sourceFile) {
  const trimmed = line.trim();

  // Skip empty lines or headers
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('```')) {
    return null;
  }

  // Determine learning type based on content
  let entityType = 'lesson_learned';
  if (trimmed.includes('validation') || trimmed.includes('invalid')) {
    entityType = 'error_pattern';
  } else if (trimmed.includes('pattern') || trimmed.includes('recurrent')) {
    entityType = 'pattern_detected';
  } else if (trimmed.includes('workflow') || trimmed.includes('automation')) {
    entityType = 'workflow_config';
  } else if (trimmed.includes('assumption')) {
    entityType = 'lesson_learned';
  }

  // Generate name suggestion
  const nameSuggestion = generateEntityName(trimmed, entityType, sourceFile);

  return {
    type: entityType,
    name_suggestion: nameSuggestion,
    observations: [trimmed.substring(0, 500)], // Limit length
    confidence: 0.7,
    source_log: sourceFile,
    suggested_relations: []
  };
}

/**
 * Generate a unique entity name from content
 */
function generateEntityName(content, entityType, sourceFile) {
  // Extract key phrase (first 50 chars, sanitized)
  const keyPhrase = content
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .substring(0, 50)
    .trim()
    .replace(/\s+/g, '_')
    .toLowerCase();

  const timestamp = Date.now().toString(36);
  const sourceBase = sourceFile.replace('.log.md', '').replace('.md', '');

  return `lesson_${entityType}_${sourceBase}_${timestamp}`;
}

/**
 * Check if learning is notable
 */
function isNotable(learning, notableKeywords, notableOnly) {
  if (!notableOnly) return true;

  const obs = learning.observations[0]?.toLowerCase() || '';
  return notableKeywords.some(kw => obs.includes(kw.toLowerCase()));
}
