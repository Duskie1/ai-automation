# n8n Workflow Patterns

## Common Automation Patterns

### Data Synchronization

Sync data between systems on schedule:

```
[Schedule Trigger] → [Source DB/API] → [Transform] → [Filter Changes] → [Destination]
```

**Best Practices:**
- Store last sync timestamp
- Filter only changed records
- Handle duplicates with Merge node

### Event-Driven Notifications

Notify on external events:

```
[App Trigger] → [Filter] → [Format Message] → [Slack/Email]
```

**Examples:**
- New GitHub issue → Slack notification
- Stripe payment → Email receipt
- HubSpot contact → Add to Mailchimp

### Scheduled Reports

Generate and send reports:

```
[Schedule Trigger] → [Query Data] → [Aggregate] → [Format] → [Send Email]
```

### Webhook API

Create API endpoints:

```
[Webhook] → [Validate Input] → [Process] → [Respond to Webhook]
```

## Error Handling Patterns

### Error Trigger Node

Dedicated error workflow:

```
[Error Trigger] → [Log Error] → [Notify Team]
```

**Setup:**
1. Create error workflow with Error Trigger node
2. In target workflow, go to Settings → Error Workflow
3. Select the error workflow

**Error Trigger Output:**
```json
{
  "workflow": { "id": "1", "name": "My Workflow" },
  "execution": { "id": "123", "url": "https://..." },
  "error": { "message": "Node failed", "stack": "..." }
}
```

### Continue On Fail

Handle errors within workflow:

```
[HTTP Request (Continue On Fail)] → [If Error?] → [Error Branch / Success Branch]
```

**Configuration:**
- Enable "Continue On Fail" in node settings
- Check `$json.error` to detect failures

### Try-Catch with Sub-workflows

Isolate risky operations:

```
[Main Flow] → [Execute Sub-workflow (on error continues)] → [Check Result]
```

The sub-workflow handles its own errors, returning success/failure status.

### Retry Logic

Implement custom retries:

```
[HTTP Request] → [If Failed?] → [Wait] → [Loop Back] → [Max Retries?]
```

## Flow Control Patterns

### Branching with If

Conditional execution paths:

```
           ┌── [Path A] ──┐
[If Node] ─┤              ├── [Merge]
           └── [Path B] ──┘
```

### Branching with Switch

Multiple output routes:

```
                ┌── [Route A]
                ├── [Route B]
[Switch Node] ──┼── [Route C]
                └── [Default]
```

### Looping with Split In Batches

Process items in batches:

```
[Split In Batches] → [Process Batch] → [If More Items?] → [Loop Back]
```

**Use Cases:**
- API rate limiting
- Large dataset processing
- Bulk operations

### Parallel Processing

Execute branches simultaneously:

```
           ┌── [Process A] ──┐
[Trigger] ─┼── [Process B] ──┼── [Merge Results]
           └── [Process C] ──┘
```

### Sequential Processing

Execute nodes in order:

```
[Start] → [Step 1] → [Step 2] → [Step 3] → [End]
```

## Data Processing Patterns

### Transform and Enrich

Clean and augment data:

```
[Source] → [Set (Add Fields)] → [Filter] → [Remove Duplicates] → [Output]
```

### Aggregate Data

Combine multiple items:

```
[Multiple Items] → [Summarize/Aggregate] → [Single Summary Item]
```

### Split Data

Break apart complex data:

```
[Complex Object] → [Split Out (array field)] → [Process Each]
```

### Join Data

Combine from multiple sources:

```
[Source A] ──┐
             ├── [Merge (Keep Key Matches)] → [Combined]
[Source B] ──┘
```

## Sub-workflow Patterns

### Reusable Components

Create reusable logic:

```
Main Workflow:
[Trigger] → [Execute Sub-workflow] → [Process Result]

Sub-workflow:
[Execute Workflow Trigger] → [Logic] → [Return Result]
```

### Parameter Passing

Pass data to sub-workflows:

**Main Workflow:**
```
[Execute Sub-workflow]
  - Workflow: "Process Order"
  - Parameters:
    - orderId: {{ $json.id }}
    - amount: {{ $json.total }}
```

**Sub-workflow:**
```
[Execute Workflow Trigger] → Access via {{ $json.orderId }}
```

### Error Propagation

Sub-workflow errors bubble up to parent unless handled.

## Debugging Patterns

### Data Inspection

Use Edit Fields (Set) to log intermediate data:

```
[Process] → [Set (debug = $json)] → [Continue]
```

### Execution Data

Store execution data for analysis:

```
[Process] → [Execution Data] → [Continue]
```

### Debug Helper Node

Inspect data at any point:

```
[Node] → [Debug Helper] → [Continue]
```

### Partial Execution

Test from any node:
1. Click node to test
2. Select "Execute Node" or "Execute from Here"
3. View output data

### Dirty Nodes

Nodes with modified but untested data show as "dirty":
- Orange outline indicates changes
- Re-execute to validate changes

## Performance Patterns

### Batch Processing

Process in chunks:

```
[Split In Batches (size=100)] → [API Call] → [Wait] → [Loop]
```

### Caching

Cache expensive operations:

```
[Check Cache] → [If Miss] → [Compute] → [Store Cache]
             → [If Hit] → [Return Cached]
```

### Rate Limiting

Respect API limits:

```
[Limit (Max Items=100)] → [Split In Batches (size=10)] → [Wait (1s)] → [API Call]
```

### Parallel API Calls

Use multiple HTTP Request nodes in parallel branches.

## Production Patterns

### Idempotency

Ensure workflows can be safely re-run:

- Check for existing records before creating
- Use unique identifiers
- Store processed item IDs

### Data Validation

Validate input early:

```
[Webhook] → [If Invalid?] → [Stop And Error]
         → [If Valid] → [Process]
```

### Monitoring

Monitor workflow health:

- Set up error notifications
- Track execution counts and times
- Use the Executions view for auditing

### Version Control

Export workflows for version control:

```bash
n8n export:workflow --id=123 --output=workflow-v1.json
```

## Common Workflow Templates

### Simple Notification

```
[Trigger] → [Format] → [Send Message]
```

### ETL Pipeline

```
[Extract] → [Transform] → [Validate] → [Load] → [Notify]
```

### Approval Workflow

```
[Trigger] → [Create Approval Form] → [Wait for Response] → [If Approved] → [Execute]
                                                              → [If Rejected] → [Notify]
```

### Multi-Step Onboarding

```
[Trigger] → [Create Account] → [Send Welcome Email] → [Add to CRM] → [Schedule Follow-up]
```
