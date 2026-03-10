---
name: n8n
description: This skill should be used when the user asks to "create an n8n workflow", "build automation with n8n", "configure n8n nodes", "deploy n8n", "use n8n API", "set up n8n triggers", "work with n8n expressions", "integrate AI in n8n", "configure n8n credentials", "set up n8n Docker", "use n8n CLI commands", "check n8n version", "n8n changelog", "n8n release notes", "update n8n", or mentions workflow automation with n8n, n8n hosting, LangChain integration, or n8n MCP support.
---

# n8n Workflow Automation

n8n is a fair-code licensed workflow automation platform that enables connecting anything to everything. It provides a visual workflow editor, 300+ integrations, and supports self-hosting.

## When to Use This Skill

Use this skill when working with n8n for:
- Creating and configuring workflows
- Setting up nodes (triggers, actions, core nodes)
- Deploying n8n (Docker, npm, cloud)
- Using the REST API or CLI
- Working with expressions and Code node
- Building AI-powered workflows with LangChain
- Managing credentials and security

## Quick Reference

### Essential CLI Commands
```bash
n8n start                    # Start n8n server
n8n execute --id=<id>        # Execute workflow by ID
n8n export:workflow --id=<id> --output=file.json
n8n import:workflow --input=file.json
n8n user:password --email=user@example.com --password=newpass
```

### Docker Quick Start
```bash
docker run -it --rm --name n8n -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

### Expression Syntax
```
{{ $json.field }}                      # Current item field
{{ $node["NodeName"].json.field }}     # Reference another node
{{ $execution.id }}                    # Execution ID
{{ $workflow.name }}                   # Workflow name
```

## Workflow Development

### Core Workflow Concepts

A workflow consists of connected nodes that process data. Each node receives input, performs an operation, and produces output.

**Data Structure:** n8n uses an array of items where each item has a `json` object and optional `binary` data:
```json
[
  { "json": { "name": "Item 1", "value": 100 } },
  { "json": { "name": "Item 2", "value": 200 } }
]
```

### Creating Workflows

1. Add a trigger node (Manual Trigger, Webhook, Schedule, etc.)
2. Connect action nodes to process data
3. Configure node parameters and expressions
4. Test the workflow manually
5. Activate for production use

### Workflow Settings

- **Error Workflow:** Attach an error trigger node to handle failures
- **Timezone:** Set workflow timezone for scheduled triggers
- **Save Execution Progress:** Enable for debugging (higher storage)
- **Save Manual Executions:** Control whether test runs are saved

## Node Essentials

### Node Types

| Type | Purpose | Examples |
|------|---------|----------|
| Trigger | Start workflow | Webhook, Schedule, Manual, App triggers |
| Action | Perform operations | HTTP Request, Slack, Google Sheets |
| Core | Data manipulation | Code, Set, Filter, Merge, If, Switch |
| Cluster | AI/ML operations | AI Agent, LLM Chain, Vector Store |

### Essential Core Nodes

- **Webhook:** Receive HTTP requests, create API endpoints
- **HTTP Request:** Make API calls to external services
- **Code:** Execute JavaScript/Python for custom logic
- **Set (Edit Fields):** Add, modify, or remove fields
- **Filter:** Filter items based on conditions
- **Merge:** Combine data from multiple branches
- **If/Switch:** Conditional branching
- **Split In Batches:** Loop over items in batches
- **Execute Sub-workflow:** Call other workflows

### Trigger Nodes

Triggers start workflow execution:
- **Manual Trigger:** Test workflows manually
- **Webhook:** HTTP endpoint triggers
- **Schedule Trigger:** Cron-based scheduling
- **App Triggers:** Poll or webhook-based (Slack, GitHub, Gmail, etc.)

For detailed node documentation, consult **`references/nodes-reference.md`**.

## Data Handling

### Expressions

Use expressions to dynamically reference and transform data:

```
{{ $json.field }}                          # Current item
{{ $node["HTTP Request"].json.data[0] }}   # Specific node output
{{ $items() }}                             # All items from current node
{{ $item(0).json.name }}                   # First item
```

### Built-in Variables

| Variable | Description |
|----------|-------------|
| `$json` | Current item's JSON data |
| `$execution` | Execution metadata (id, mode, url) |
| `$workflow` | Workflow metadata (id, name, active) |
| `$vars` | Custom workflow variables |
| `$now` | Current timestamp (Luxon) |
| `$today` | Today's date |

### Code Node

Execute custom JavaScript or Python:

```javascript
// Access input data
const items = $input.all();
const firstItem = $input.first();

// Return array of items
return items.map(item => ({
  json: {
    processed: true,
    value: item.json.number * 2
  }
}));
```

For expression patterns and Code node details, consult **`references/expressions-code.md`**.

## Deployment & Configuration

### Docker (Recommended)

```bash
# Basic setup
docker run -d --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# With PostgreSQL
docker-compose up -d
```

### Key Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `N8N_HOST` | Server hostname | localhost |
| `N8N_PORT` | Server port | 5678 |
| `WEBHOOK_URL` | Production webhook base URL | - |
| `DB_TYPE` | Database type | sqlite |
| `N8N_ENCRYPTION_KEY` | Credential encryption | generated |
| `EXECUTIONS_MODE` | Execution mode | own |

For full deployment guide, consult **`references/deployment.md`**.

## API & CLI

### REST API Authentication

```bash
# API Key header
curl -H "X-N8N-API-KEY: your-api-key" \
  https://n8n.example.com/api/v1/workflows
```

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/workflows` | GET, POST | List/create workflows |
| `/workflows/{id}` | GET, PUT, DELETE | Manage specific workflow |
| `/executions` | GET | List executions |
| `/executions/{id}` | GET | Get execution details |

For complete API and CLI reference, consult **`references/cli-api-reference.md`**.

## AI Integration

n8n provides extensive AI/ML capabilities through LangChain integration.

### Cluster Nodes Architecture

Cluster nodes use a root + sub-node pattern:
- **Root Nodes:** AI Agent, LLM Chain, Vector Store
- **Sub-nodes:** Chat Models, Tools, Memory, Embeddings

### AI Agent Configuration

```
AI Agent (root)
├── Chat Model (OpenAI, Anthropic, Ollama)
├── Memory (Simple, Redis, Postgres)
└── Tools (Calculator, Wikipedia, Custom Code)
```

### MCP Support

n8n supports Model Context Protocol:
- **MCP Client:** Connect to external MCP servers
- **MCP Server Trigger:** Expose n8n as MCP server

For AI/ML features, LangChain, and MCP details, consult **`references/advanced-ai.md`**.

## Version & Updates

### Checking Version
```bash
n8n --version                           # CLI
# Or in UI: Settings → About
```

### Current Versions
- **Stable:** 2.10.4 (production use)
- **Beta:** 2.11.2 (may be unstable)

### Official Changelog Sources
- **Docs:** https://docs.n8n.io/release-notes/
- **GitHub:** https://github.com/n8n-io/n8n/releases

### Semantic Versioning
n8n uses `MAJOR.MINOR.PATCH` - major versions may include breaking changes.

For full changelog, version history, and upgrade guidance, consult **`references/release-notes.md`**.

## Error Handling

### Error Trigger Node

Create a dedicated error workflow:

```
[Error Trigger] → [Slack] → [Log to Database]
```

Attach to workflows via Settings → Error Workflow.

### Try-Catch Pattern

Use sub-workflows for error isolation:

```
[Main Flow] → [Execute Sub-workflow (on error continues)]
```

For error handling patterns, consult **`references/workflow-patterns.md`**.

## Credentials

Store credentials securely in n8n:
- Encrypted at rest with `N8N_ENCRYPTION_KEY`
- Shared via credential sharing (Enterprise)
- Managed per-instance or per-project

Credential types: API Key, OAuth2, Basic Auth, Header Auth, and service-specific credentials.

## Reference Files

For detailed information, consult these reference files:

- **`references/nodes-reference.md`** - Complete node types, core nodes, triggers, actions, cluster nodes
- **`references/workflow-patterns.md`** - Common patterns, error handling, flow control, debugging
- **`references/cli-api-reference.md`** - CLI commands and REST API documentation
- **`references/deployment.md`** - Docker, npm, environment variables, security hardening
- **`references/advanced-ai.md`** - LangChain, AI agents, vector stores, MCP integration
- **`references/expressions-code.md`** - Expression syntax, Code node patterns, data transformation
- **`references/release-notes.md`** - Version info, changelog sources, breaking changes, update guide
