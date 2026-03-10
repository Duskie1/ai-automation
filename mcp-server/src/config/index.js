/**
 * Memory MCP Configuration
 *
 * Centralized configuration for the memory knowledge graph system.
 */

export const CONFIG = {
  memory: {
    limits: {
      soft: 700,
      hard: 1000
    },
    archival: {
      protectedTypes: ['lesson_learned', 'success_pattern', 'user_preference', 'workflow_config'],
      protectedKeywords: ['CRITICAL', 'NEVER', 'ALWAYS', 'mistake', 'error', 'loss'],
      staleDays: {
        error_pattern: 90,
        pattern_detected: 90,
        lesson_learned: 365,
        success_pattern: 365
      }
    },
    notableEvents: {
      keywords: ['FAILED', 'ERROR', 'WARNING', 'INVALID', 'mismatch', 'unexpected', 'corrected', 'surprised'],
      minConfidence: 0.6
    },
    metadata: {
      sources: ['automated', 'manual', 'discussion'],
      confidenceLevels: ['high', 'medium', 'low']
    }
  }
};

export default CONFIG;
