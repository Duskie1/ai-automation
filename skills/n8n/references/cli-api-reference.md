# n8n CLI and API Reference

## CLI Commands

### Server Management

#### Start n8n
```bash
n8n start
```

**Options:**
- `--tunnel`: Use n8n tunnel for local webhooks
- `--configuration`: Configuration file path

#### Start with Custom Configuration
```bash
n8n start --configuration=/path/to/config.json
```

### Workflow Execution

#### Execute Workflow by ID
```bash
n8n execute --id=<workflow-id>
```

**Options:**
- `--data`: JSON data to pass to workflow
- `--raw`: Output raw JSON

#### Execute with Custom Data
```bash
n8n execute --id=123 --data='{"name": "test", "value": 100}'
```

### Workflow Import/Export

#### Export Workflow
```bash
n8n export:workflow --id=<id>
n8n export:workflow --id=<id> --output=workflow.json
n8n export:workflow --all --outputDir=./workflows
```

**Options:**
- `--id`: Workflow ID to export
- `--all`: Export all workflows
- `--output`: Output file path
- `--outputDir`: Output directory for multiple workflows

#### Import Workflow
```bash
n8n import:workflow --input=workflow.json
n8n import:workflow --input=workflow.json --separate
```

**Options:**
- `--input`: Input file path
- `--separate**: Import file with multiple workflows separately

### Credentials Management

#### Export Credentials
```bash
n8n export:credentials --all --outputDir=./credentials
```

#### Import Credentials
```bash
n8n import:credentials --input=credentials.json
```

**Note:** Credentials must be encrypted with the same `N8N_ENCRYPTION_KEY`.

### User Management

#### Reset User Password
```bash
n8n user:password --email=user@example.com --password=newpassword
```

#### Create Owner (Self-hosted)
```bash
n8n user:create --email=admin@example.com --password=password --firstname=Admin --lastname=User --globalRole=owner
```

### Update n8n

```bash
n8n update
n8n update --force
```

### Deactivate Workflows

```bash
n8n workflow:deactivate --all
n8n workflow:deactivate --id=<workflow-id>
```

### List Workflows

```bash
n8n workflow:list
n8n workflow:list --active
n8n workflow:list --inactive
```

## REST API

### Authentication

#### API Key
```bash
curl -H "X-N8N-API-KEY: your-api-key" \
  https://n8n.example.com/api/v1/workflows
```

#### Create API Key
1. Go to Settings → API
2. Click "Create API Key"
3. Copy and store securely

### Endpoints

#### Workflows

**List Workflows**
```bash
GET /api/v1/workflows
```

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "My Workflow",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "nextCursor": "abc123"
}
```

**Get Workflow**
```bash
GET /api/v1/workflows/{id}
```

**Create Workflow**
```bash
POST /api/v1/workflows
Content-Type: application/json

{
  "name": "New Workflow",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

**Update Workflow**
```bash
PUT /api/v1/workflows/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "active": true
}
```

**Delete Workflow**
```bash
DELETE /api/v1/workflows/{id}
```

**Activate/Deactivate Workflow**
```bash
POST /api/v1/workflows/{id}/activate
POST /api/v1/workflows/{id}/deactivate
```

#### Executions

**List Executions**
```bash
GET /api/v1/executions
GET /api/v1/executions?workflowId=1&status=success
```

**Query Parameters:**
- `workflowId`: Filter by workflow
- `status`: success, error, running, waiting
- `limit`: Number of results
- `cursor`: Pagination cursor

**Get Execution**
```bash
GET /api/v1/executions/{id}
```

**Delete Execution**
```bash
DELETE /api/v1/executions/{id}
```

#### Credentials

**List Credentials**
```bash
GET /api/v1/credentials
```

**Get Credential Schema**
```bash
GET /api/v1/credentials/schema/{credentialType}
```

**Create Credential**
```bash
POST /api/v1/credentials
Content-Type: application/json

{
  "name": "My API Key",
  "type": "httpHeaderAuth",
  "data": {
    "name": "Authorization",
    "value": "Bearer token123"
  }
}
```

#### Execute Workflow

**Trigger Webhook**
```bash
POST /webhook/{path}
POST /webhook-test/{path}  # Test webhooks
```

### Pagination

API uses cursor-based pagination:

```bash
GET /api/v1/workflows?limit=10
GET /api/v1/workflows?limit=10&cursor=abc123
```

**Response includes:**
```json
{
  "data": [...],
  "nextCursor": "def456"
}
```

### API Playground

Access the interactive API documentation:

```
https://your-n8n-instance/api/v1/docs
```

Use the playground to:
- Explore available endpoints
- Test API calls
- View request/response schemas

### Error Responses

```json
{
  "message": "Workflow not found",
  "code": 404,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Common Error Codes:**
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid/missing API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Using API in Workflows

### n8n Node

Use the n8n node to interact with the API within workflows:

```
[n8n Node] → Operation: Get Workflow → ID: 123
```

**Operations:**
- Get workflow
- Get many workflows
- Create workflow
- Update workflow
- Delete workflow
- Activate/Deactivate

### HTTP Request to API

Call the API via HTTP Request node:

```
[HTTP Request]
  - Method: GET
  - URL: https://n8n.example.com/api/v1/workflows
  - Headers:
    - X-N8N-API-KEY: {{ $credentials.n8nApiKey }}
```

## Webhook Integration

### Production Webhooks

Production webhook URLs use the configured `WEBHOOK_URL`:

```
POST https://your-domain.com/webhook/my-endpoint
```

### Test Webhooks

Test webhooks use a different path:

```
POST https://your-domain.com/webhook-test/my-endpoint
```

Test webhooks only work when the workflow is open in the editor.

### Webhook Node Configuration

```json
{
  "httpMethod": "POST",
  "path": "my-endpoint",
  "authentication": "headerAuth",
  "responseMode": "onReceived",
  "responseData": "allEntries"
}
```

## Rate Limiting

API rate limits depend on n8n Cloud plan or self-hosted configuration.

For self-hosted, configure via environment variables:
```bash
N8N_API_RATE_LIMIT_MAX=100
N8N_API_RATE_LIMIT_WINDOW=60000  # ms
```
