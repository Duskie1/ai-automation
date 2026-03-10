# n8n Nodes Reference

## Node Types Overview

n8n provides four main categories of nodes:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Triggers** | Start workflow execution | Webhook, Schedule, Manual, App triggers |
| **Actions** | Perform operations on external services | Slack, GitHub, Google Sheets, HTTP Request |
| **Core** | Data manipulation and flow control | Code, Set, Filter, Merge, If, Switch |
| **Cluster** | AI/ML operations with LangChain | AI Agent, LLM Chain, Vector Store |

## Core Nodes

### Webhook
Receive HTTP requests and create API endpoints.

**Configuration:**
- **HTTP Method:** GET, POST, PUT, DELETE, PATCH
- **Path:** URL path (e.g., `/webhook/my-endpoint`)
- **Authentication:** None, Basic Auth, Header Auth, JWT
- **Response Mode:** On Received, Last Node, Response Webhook

**Output Data:**
```json
{
  "headers": { "content-type": "application/json" },
  "params": { "id": "123" },
  "body": { "data": "value" },
  "query": { "search": "term" }
}
```

### HTTP Request
Make HTTP requests to external APIs.

**Configuration:**
- **Method:** GET, POST, PUT, DELETE, PATCH, HEAD
- **URL:** Target endpoint
- **Authentication:** None, Basic, Digest, OAuth2, Header, Query
- **Headers:** Custom headers as key-value pairs
- **Query Parameters:** URL parameters
- **Body:** JSON, Form, Binary, Raw

**Pagination Support:**
- URL-based pagination
- Link header pagination
- Custom pagination with expressions

### Code Node
Execute custom JavaScript or Python code.

**JavaScript Example:**
```javascript
// Access all input items
const items = $input.all();

// Process and return
return items.map(item => ({
  json: {
    original: item.json.value,
    doubled: item.json.value * 2
  }
}));
```

**Python Example:**
```python
# Access input data
items = _input.all()

# Return processed items
return [{"json": {"processed": item.json["value"] * 2}} for item in items]
```

### Set (Edit Fields)
Add, modify, or remove fields from items.

**Operations:**
- **Add:** Create new fields
- **Update:** Modify existing fields
- **Remove:** Delete fields

**Include Options:**
- Include all input fields
- Include only specified fields
- Exclude specified fields

### Filter
Filter items based on conditions.

**Conditions:**
- Equal, Not Equal
- Greater Than, Less Than
- Contains, Does Not Contain
- Is Empty, Is Not Empty
- Regex Match

**Mode:**
- Pass through matching items
- Remove matching items

### Merge
Combine data from multiple input branches.

**Merge Modes:**
| Mode | Description |
|------|-------------|
| **Append** | Combine all items from all inputs |
| **Keep Key Matches** | Join on matching field values |
| **Merge By Index** | Pair items by position |
| **Multiplex** | All combinations |
| **Passthrough** | Pass one input, discard others |
| **Remove Key Matches** | Exclude items with matching keys |
| **Wait** | Wait for all inputs before merging |

### If
Conditional branching based on a condition.

**Outputs:**
- **True:** Items matching condition
- **False:** Items not matching condition

### Switch
Route items to different outputs based on conditions.

**Configuration:**
- Multiple output branches
- Each branch with its own condition
- Fallback output for unmatched items

### Split In Batches (Loop Over Items)
Process items in batches for looping.

**Configuration:**
- **Batch Size:** Number of items per batch
- **Reset:** Clear state between executions

**Use Case:** Process large datasets without overwhelming APIs.

### Execute Sub-workflow
Call another workflow as a node.

**Configuration:**
- **Workflow ID:** Target workflow
- **Parameters:** Data to pass to sub-workflow
- **Wait for Completion:** Block until sub-workflow finishes

### Wait
Pause workflow execution.

**Wait Modes:**
- **Time:** Wait for specified duration
- **Webhook:** Wait for external webhook call
- **Form:** Wait for form submission

## Trigger Nodes

### Manual Trigger
Start workflow manually from the editor.

Use for testing and development.

### Schedule Trigger
Execute workflows on a schedule.

**Configuration:**
- **Trigger Rules:** Cron expressions
- **Timezone:** Schedule timezone

**Examples:**
```
0 9 * * *      # Every day at 9 AM
*/15 * * * *   # Every 15 minutes
0 0 * * 0      # Every Sunday at midnight
```

### Webhook Trigger
Create HTTP endpoints for external integrations.

**Production URL:** `{WEBHOOK_URL}/webhook/{path}`

### App-Specific Triggers

Each app trigger can use:
- **Polling:** Check for new items at intervals
- **Webhook:** Receive push notifications

**Common App Triggers:**
- Gmail Trigger (new emails)
- Slack Trigger (new messages)
- GitHub Trigger (new issues, PRs)
- Google Sheets Trigger (row changes)
- Stripe Trigger (new payments)
- HubSpot Trigger (new contacts)

## Action Nodes

n8n provides 300+ action nodes for external services. Categories include:

### Communication
- Slack, Discord, Telegram, Microsoft Teams
- Gmail, Outlook, SendGrid, Mailgun
- Twilio, MessageBird

### Data & Storage
- Google Sheets, Airtable, Notion
- PostgreSQL, MySQL, MongoDB
- S3, Google Cloud Storage, Dropbox

### Development
- GitHub, GitLab, Bitbucket
- Jira, Linear, Trello, Asana
- Jenkins, CircleCI

### AI & ML
- OpenAI, Anthropic, Google Gemini
- Hugging Face, Cohere
- LangChain cluster nodes

### CRM & Sales
- Salesforce, HubSpot, Pipedrive
- Zendesk, Freshdesk
- Stripe, PayPal

### Social Media
- Twitter/X, LinkedIn, Facebook
- Instagram, YouTube

## Cluster Nodes (AI/ML)

Cluster nodes use a root + sub-node architecture for AI workflows.

### Root Nodes

#### AI Agent
Build conversational AI agents.

**Agent Types:**
- **Conversational Agent:** General conversation
- **OpenAI Functions Agent:** Function calling
- **Plan and Execute Agent:** Multi-step planning
- **ReAct Agent:** Reasoning and acting
- **SQL Agent:** Database queries
- **Tools Agent:** Tool-focused

#### Basic LLM Chain
Simple prompt-response chain.

#### Question and Answer Chain
RAG-based Q&A with document retrieval.

#### Summarization Chain
Summarize long texts.

#### Vector Store Nodes
Manage vector databases:
- Pinecone, Chroma, PGVector
- Supabase, Redis, MongoDB Atlas
- Weaviate, Qdrant, Milvus

### Sub-Nodes

#### Chat Models
- OpenAI Chat Model
- Anthropic Chat Model
- Google Gemini Chat Model
- Azure OpenAI Chat Model
- Ollama Chat Model (local)
- Groq Chat Model
- Mistral Cloud Chat Model

#### Embeddings
- OpenAI Embeddings
- Cohere Embeddings
- Google Gemini Embeddings
- Ollama Embeddings (local)

#### Memory
- Simple Memory (in-memory)
- Redis Chat Memory
- MongoDB Chat Memory
- Postgres Chat Memory
- Zep Memory

#### Tools
- Calculator
- Wikipedia
- SerpAPI (Google Search)
- Custom Code Tool
- Call n8n Workflow Tool
- Vector Store QA Tool

## Node Configuration Patterns

### Credential Management
1. Create credentials in Settings → Credentials
2. Select credential type
3. Enter authentication details
4. Reference in node configuration

### Error Handling in Nodes
Most nodes support:
- **Continue On Fail:** Continue with error object
- **Retry On Fail:** Automatic retries with backoff
- **Timeout:** Maximum execution time

### Rate Limiting
Configure in node settings:
- **Batch Size:** Items per request
- **Delay Between Batches:** Milliseconds
- **Max Requests:** Per time window

### Output Parsing
Use expressions to extract data:
```
{{ $json.response.data }}
{{ $json.items[0].name }}
{{ $json.results.map(item => item.id) }}
```
