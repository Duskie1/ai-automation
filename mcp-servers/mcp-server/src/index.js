#!/usr/bin/env node

/**
 * Memory MCP Server
 *
 * Provides knowledge graph memory operations for AI automation.
 * Stores entities and relations in JSONL format for git-friendly persistence.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  loadGraph,
  saveGraph,
  getMemoryFilePath,
  createEntities,
  createRelations,
  addObservations,
  readGraph,
  searchNodes,
  openNodes,
  deleteEntities,
  deleteObservations,
  deleteRelations,
  checkMemoryHealth,
  checkMemoryContradictions,
  archiveStaleEntities,
  consolidateMemoryEntities,
  listArchivedEntities,
  auditAnalysisLearnings
} from './memory/index.js';

// Tool definitions
const TOOL_DEFINITIONS = [
  // CREATE Operations
  {
    name: "memory_create_entities",
    description: "Create entities in the knowledge graph. Entities have a name, type, and observations array.",
    inputSchema: {
      type: "object",
      properties: {
        entities: {
          type: "array",
          description: "Array of entities to create",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Unique entity name" },
              entityType: { type: "string", description: "Entity type (lesson_learned, pattern_detected, workflow_config, user_preference, success_pattern, error_pattern)" },
              observations: { type: "array", items: { type: "string" }, description: "Array of observation strings" }
            },
            required: ["name", "entityType"]
          }
        }
      },
      required: ["entities"]
    }
  },
  {
    name: "memory_create_relations",
    description: "Create relations between entities in the knowledge graph.",
    inputSchema: {
      type: "object",
      properties: {
        relations: {
          type: "array",
          description: "Array of relations to create",
          items: {
            type: "object",
            properties: {
              from: { type: "string", description: "Source entity name" },
              to: { type: "string", description: "Target entity name" },
              relationType: { type: "string", description: "Relation type (caused_by, prevents, applies_to, related_to, supersedes)" }
            },
            required: ["from", "to", "relationType"]
          }
        }
      },
      required: ["relations"]
    }
  },
  {
    name: "memory_add_observations",
    description: "Add observations to existing entities.",
    inputSchema: {
      type: "object",
      properties: {
        observations: {
          type: "array",
          description: "Array of observations to add",
          items: {
            type: "object",
            properties: {
              entityName: { type: "string", description: "Entity name to add observations to" },
              contents: { type: "array", items: { type: "string" }, description: "Observation strings to add" }
            },
            required: ["entityName", "contents"]
          }
        }
      },
      required: ["observations"]
    }
  },

  // READ Operations
  {
    name: "memory_read_graph",
    description: "Read the entire knowledge graph with statistics.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "memory_search_nodes",
    description: "Search for entities by query. Matches against name, type, and observations using OR logic.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (case-insensitive, tokenized OR matching)" }
      },
      required: ["query"]
    }
  },
  {
    name: "memory_open_nodes",
    description: "Open specific entities by name.",
    inputSchema: {
      type: "object",
      properties: {
        names: {
          type: "array",
          items: { type: "string" },
          description: "Array of entity names to retrieve"
        }
      },
      required: ["names"]
    }
  },

  // DELETE Operations
  {
    name: "memory_delete_entities",
    description: "Delete entities and their associated relations.",
    inputSchema: {
      type: "object",
      properties: {
        entityNames: {
          type: "array",
          items: { type: "string" },
          description: "Array of entity names to delete"
        }
      },
      required: ["entityNames"]
    }
  },
  {
    name: "memory_delete_observations",
    description: "Delete specific observations from entities.",
    inputSchema: {
      type: "object",
      properties: {
        deletions: {
          type: "array",
          description: "Array of observation deletions",
          items: {
            type: "object",
            properties: {
              entityName: { type: "string", description: "Entity name" },
              observations: { type: "array", items: { type: "string" }, description: "Observations to delete" }
            },
            required: ["entityName", "observations"]
          }
        }
      },
      required: ["deletions"]
    }
  },
  {
    name: "memory_delete_relations",
    description: "Delete specific relations.",
    inputSchema: {
      type: "object",
      properties: {
        relations: {
          type: "array",
          description: "Array of relations to delete",
          items: {
            type: "object",
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              relationType: { type: "string" }
            },
            required: ["from", "to", "relationType"]
          }
        }
      },
      required: ["relations"]
    }
  },

  // Health Operations
  {
    name: "check_memory_health",
    description: "Check memory system health metrics including utilization, stale entities, and growth projection.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "check_memory_contradictions",
    description: "Find conflicting or duplicate learnings in memory.",
    inputSchema: {
      type: "object",
      properties: {
        scope: { type: "string", enum: ["all", "recent"], default: "all", description: "Scope to check" },
        recent_days: { type: "number", default: 30, description: "Days to consider for 'recent' scope" }
      }
    }
  },

  // Archive Operations
  {
    name: "archive_stale_entities",
    description: "Archive stale (unused) entities to reduce memory size.",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["dry_run", "execute"], default: "dry_run", description: "dry_run to preview, execute to perform" },
        max_to_archive: { type: "number", default: 50, description: "Maximum entities to archive" },
        override_protection: { type: "boolean", default: false, description: "Allow archiving protected entities" }
      }
    }
  },
  {
    name: "consolidate_memory_entities",
    description: "Merge similar entities into one, preserving all observations.",
    inputSchema: {
      type: "object",
      properties: {
        source_entities: {
          type: "array",
          items: { type: "string" },
          description: "Entity names to merge into target"
        },
        target_entity: { type: "string", description: "Target entity name to keep" }
      },
      required: ["source_entities", "target_entity"]
    }
  },
  {
    name: "list_archived_entities",
    description: "List all entities in archive files.",
    inputSchema: {
      type: "object",
      properties: {
        filter_type: { type: "string", default: "all", description: "Entity type filter" },
        search_query: { type: "string", default: "", description: "Search term" }
      }
    }
  },

  // Audit Operations
  {
    name: "audit_analysis_learnings",
    description: "Extract notable findings from analysis logs and convert to memory entity suggestions.",
    inputSchema: {
      type: "object",
      properties: {
        log_folder: { type: "string", description: "Log folder name (e.g., '20260310')" },
        mode: { type: "string", enum: ["automated", "manual"], default: "automated" },
        notable_events_only: { type: "boolean", default: true }
      },
      required: ["log_folder"]
    }
  },

  // Utility
  {
    name: "get_memory_file_path",
    description: "Get the path to the memory.jsonl file for debugging.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

// Create server
const server = new Server(
  {
    name: "memory-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOL_DEFINITIONS
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      // CREATE Operations
      case "memory_create_entities":
        result = await createEntities(args.entities);
        break;

      case "memory_create_relations":
        result = await createRelations(args.relations);
        break;

      case "memory_add_observations":
        result = await addObservations(args.observations);
        break;

      // READ Operations
      case "memory_read_graph":
        result = await readGraph();
        break;

      case "memory_search_nodes":
        result = await searchNodes(args.query);
        break;

      case "memory_open_nodes":
        result = await openNodes(args.names);
        break;

      // DELETE Operations
      case "memory_delete_entities":
        result = await deleteEntities(args.entityNames);
        break;

      case "memory_delete_observations":
        result = await deleteObservations(args.deletions);
        break;

      case "memory_delete_relations":
        result = await deleteRelations(args.relations);
        break;

      // Health Operations
      case "check_memory_health":
        result = await checkMemoryHealth();
        break;

      case "check_memory_contradictions":
        result = await checkMemoryContradictions({
          scope: args.scope || 'all',
          recent_days: args.recent_days || 30
        });
        break;

      // Archive Operations
      case "archive_stale_entities":
        result = await archiveStaleEntities({
          mode: args.mode || 'dry_run',
          max_to_archive: args.max_to_archive || 50,
          override_protection: args.override_protection || false
        });
        break;

      case "consolidate_memory_entities":
        result = await consolidateMemoryEntities({
          source_entities: args.source_entities,
          target_entity: args.target_entity
        });
        break;

      case "list_archived_entities":
        result = await listArchivedEntities({
          filter_type: args.filter_type || 'all',
          search_query: args.search_query || ''
        });
        break;

      // Audit Operations
      case "audit_analysis_learnings":
        result = await auditAnalysisLearnings({
          log_folder: args.log_folder,
          mode: args.mode || 'automated',
          notable_events_only: args.notable_events_only !== false
        });
        break;

      // Utility
      case "get_memory_file_path":
        result = { path: getMemoryFilePath() };
        break;

      default:
        return {
          content: [{ type: "text", text: `Error: Unknown tool: ${name}` }],
          isError: true
        };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };

  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Memory MCP server running on stdio");
}

main().catch(console.error);
