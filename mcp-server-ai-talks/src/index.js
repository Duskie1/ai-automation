#!/usr/bin/env node

/**
 * AI-Talks MCP Server
 *
 * Provides customer management operations for AI automation.
 * Stores customer configurations in JSONL format for git-friendly persistence.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  getCustomersFilePath,
  listCustomers,
  getCustomer,
  getKnowledgeBase,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers
} from './customers/index.js';

// Tool definitions
const TOOL_DEFINITIONS = [
  // READ Operations
  {
    name: "ai_talks_list_customers",
    description: "List all customers with summary information (name, type, locations).",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "ai_talks_get_customer",
    description: "Get full configuration for a specific customer by name.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer name (slug, e.g., 'royaldent')" }
      },
      required: ["name"]
    }
  },
  {
    name: "ai_talks_get_knowledge",
    description: "Get the knowledge base content for a specific customer. Use this to retrieve context about a business for AI responses.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer name (slug, e.g., 'royaldent')" }
      },
      required: ["name"]
    }
  },
  {
    name: "ai_talks_search_customers",
    description: "Search customers by keyword. Searches across name, business type, locations, services, knowledge base, and keywords.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (case-insensitive)" }
      },
      required: ["query"]
    }
  },

  // CREATE Operation
  {
    name: "ai_talks_create_customer",
    description: "Create a new customer with configuration.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer name slug (e.g., 'royaldent')" },
        config: {
          type: "object",
          description: "Customer configuration object",
          properties: {
            customer_name: { type: "string", description: "Display name" },
            business_type: { type: "string", description: "Type of business" },
            locations: { type: "array", items: { type: "string" }, description: "Business locations" },
            services: { type: "array", items: { type: "string" }, description: "Services offered" },
            cal_api_key: { type: "string", description: "Cal.com API key (can use env var)" },
            cal_event_type_id: { type: "string", description: "Cal.com event type ID" },
            knowledge_base: { type: "string", description: "Knowledge base text for AI context" },
            boosted_keywords: { type: "array", items: { type: "string" }, description: "SEO keywords" }
          },
          required: ["customer_name", "business_type"]
        }
      },
      required: ["name", "config"]
    }
  },

  // UPDATE Operation
  {
    name: "ai_talks_update_customer",
    description: "Update an existing customer's configuration.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer name (slug)" },
        updates: {
          type: "object",
          description: "Fields to update in the customer config",
          properties: {
            customer_name: { type: "string" },
            business_type: { type: "string" },
            locations: { type: "array", items: { type: "string" } },
            services: { type: "array", items: { type: "string" } },
            cal_api_key: { type: "string" },
            cal_event_type_id: { type: "string" },
            knowledge_base: { type: "string" },
            boosted_keywords: { type: "array", items: { type: "string" } }
          }
        }
      },
      required: ["name", "updates"]
    }
  },

  // DELETE Operation
  {
    name: "ai_talks_delete_customer",
    description: "Delete a customer by name.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer name (slug) to delete" }
      },
      required: ["name"]
    }
  },

  // Utility
  {
    name: "ai_talks_get_file_path",
    description: "Get the path to the customers.jsonl file for debugging.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

// Create server
const server = new Server(
  {
    name: "ai-talks-mcp",
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
      // READ Operations
      case "ai_talks_list_customers":
        result = listCustomers();
        break;

      case "ai_talks_get_customer":
        result = getCustomer(args.name);
        if (result === null) {
          return {
            content: [{ type: "text", text: `Error: Customer '${args.name}' not found` }],
            isError: true
          };
        }
        break;

      case "ai_talks_get_knowledge":
        result = getKnowledgeBase(args.name);
        if (result.error) {
          return {
            content: [{ type: "text", text: `Error: ${result.error}` }],
            isError: true
          };
        }
        break;

      case "ai_talks_search_customers":
        result = searchCustomers(args.query);
        break;

      // CREATE Operation
      case "ai_talks_create_customer":
        result = createCustomer(args.name, args.config);
        if (result.error) {
          return {
            content: [{ type: "text", text: `Error: ${result.error}` }],
            isError: true
          };
        }
        break;

      // UPDATE Operation
      case "ai_talks_update_customer":
        result = updateCustomer(args.name, args.updates);
        if (result.error) {
          return {
            content: [{ type: "text", text: `Error: ${result.error}` }],
            isError: true
          };
        }
        break;

      // DELETE Operation
      case "ai_talks_delete_customer":
        result = deleteCustomer(args.name);
        if (result.error) {
          return {
            content: [{ type: "text", text: `Error: ${result.error}` }],
            isError: true
          };
        }
        break;

      // Utility
      case "ai_talks_get_file_path":
        result = { path: getCustomersFilePath() };
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
  console.error("AI-Talks MCP server running on stdio");
}

main().catch(console.error);
