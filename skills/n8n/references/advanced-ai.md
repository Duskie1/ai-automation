# n8n Advanced AI Features

## Overview

n8n provides extensive AI/ML capabilities through LangChain integration, enabling creation of intelligent automation workflows with chatbots, document processing, and AI agents.

## LangChain Integration

### Architecture

n8n implements LangChain concepts through **cluster nodes**:

```
Root Node (AI Agent/Chain)
├── Chat Model (OpenAI, Anthropic, etc.)
├── Memory (Optional)
└── Tools (Optional)
```

### Root Nodes

#### AI Agent

The AI Agent is the primary node for building conversational AI:

**Agent Types:**

| Agent | Description | Best For |
|-------|-------------|----------|
| **Conversational Agent** | General conversation | Chatbots, Q&A |
| **OpenAI Functions Agent** | Function calling | Tool use, API integration |
| **Plan and Execute Agent** | Multi-step planning | Complex tasks |
| **ReAct Agent** | Reasoning + Acting | Research, analysis |
| **SQL Agent** | Database queries | Data exploration |
| **Tools Agent** | Tool-focused | Custom tool chains |

**Configuration:**
```
AI Agent
├── Agent: OpenAI Functions Agent
├── Chat Model: OpenAI Chat Model
│   └── Model: gpt-4
├── Memory: Simple Memory
│   └── Session ID: {{ $json.userId }}
└── Tools:
    ├── Calculator
    ├── Wikipedia
    └── Custom Code Tool
```

#### Basic LLM Chain

Simple prompt-response pattern:

```
[Trigger] → [Basic LLM Chain]
              ├── Prompt: "Summarize: {{ $json.text }}"
              └── Model: OpenAI Chat Model
```

#### Question and Answer Chain

RAG-based Q&A with document retrieval:

```
[Trigger] → [Q&A Chain]
              ├── Model: OpenAI Chat Model
              ├── Vector Store: Pinecone
              └── Document Loader: Default Data Loader
```

#### Summarization Chain

Summarize long documents:

```
[Document] → [Summarization Chain]
               ├── Model: OpenAI Chat Model
               └── Type: Map-Reduce / Refine
```

### Sub-Nodes

#### Chat Models

**OpenAI Chat Model:**
```
Model: gpt-4 / gpt-3.5-turbo
Temperature: 0.7
Max Tokens: 2000
```

**Anthropic Chat Model:**
```
Model: claude-3-opus / claude-3-sonnet
Temperature: 0.7
Max Tokens: 4096
```

**Ollama Chat Model (Local):**
```
Base URL: http://localhost:11434
Model: llama2 / mistral
```

**Other Providers:**
- Google Gemini Chat Model
- Azure OpenAI Chat Model
- Cohere Chat Model
- Groq Chat Model
- Mistral Cloud Chat Model
- xAI Grok Chat Model

#### Embeddings

Generate vector embeddings for text:

```
[Text] → [Embeddings OpenAI]
           └── Model: text-embedding-3-small
```

**Providers:**
- OpenAI Embeddings
- Cohere Embeddings
- Google Gemini Embeddings
- Ollama Embeddings (local)
- Hugging Face Inference

#### Memory

Maintain conversation context:

| Memory Type | Description | Use Case |
|-------------|-------------|----------|
| **Simple Memory** | In-memory buffer | Development, simple chat |
| **Redis Chat Memory** | Redis-backed | Production, distributed |
| **MongoDB Chat Memory** | MongoDB-backed | MongoDB infrastructure |
| **Postgres Chat Memory** | PostgreSQL-backed | PostgreSQL infrastructure |
| **Zep** | Zep service | Long-term memory |

**Configuration:**
```
Simple Memory
├── Session ID: {{ $json.userId }}
└── Memory Key: chat_history
```

#### Tools

Extend agent capabilities:

**Built-in Tools:**
- **Calculator:** Math operations
- **Wikipedia:** Wikipedia search
- **SerpAPI:** Google search
- **Wolfram|Alpha:** Computational knowledge

**Custom Code Tool:**
```javascript
// Define tool function
function customAction(query) {
  // Custom logic
  return result;
}
```

**Call n8n Workflow Tool:**
- Invoke other n8n workflows as tools
- Pass parameters from agent
- Return results to agent

#### Output Parsers

Structure LLM outputs:

- **Structured Output Parser:** JSON schema validation
- **Auto-fixing Output Parser:** Auto-retry on parse failures
- **Item List Output Parser:** Array outputs

## Vector Stores

### Overview

Vector stores enable semantic search and RAG workflows:

```
Documents → [Splitter] → [Embeddings] → [Vector Store]
                                                ↓
Query → [Embeddings] → [Vector Store Search] → Results
```

### Supported Vector Stores

| Store | Type | Best For |
|-------|------|----------|
| **Pinecone** | Cloud | Production, scalability |
| **Supabase** | Cloud (Postgres) | Existing Supabase users |
| **PGVector** | Self-hosted | PostgreSQL infrastructure |
| **Chroma** | Self-hosted | Development, lightweight |
| **Redis** | Self-hosted | Existing Redis infrastructure |
| **MongoDB Atlas** | Cloud | MongoDB users |
| **Weaviate** | Self-hosted/Cloud | Enterprise features |
| **Qdrant** | Self-hosted/Cloud | High performance |
| **Milvus** | Self-hosted | Large-scale deployments |
| **Zep** | Cloud | Memory + vector combined |

### RAG Workflow Pattern

```
1. Ingest:
[Documents] → [Text Splitter] → [Embeddings] → [Vector Store: Insert]

2. Query:
[Query] → [Embeddings] → [Vector Store: Search] → [LLM Chain] → Response
```

### Pinecone Example

```
Vector Store: Pinecone
├── Operation: Insert Documents
├── Pinecone Index: my-index
├── Namespace: production
└── Embeddings: OpenAI Embeddings
```

## MCP (Model Context Protocol)

### Overview

n8n supports MCP for standardized AI model interactions:

- **MCP Client:** Connect to external MCP servers
- **MCP Server Trigger:** Expose n8n as MCP server

### MCP Client

Connect to MCP servers and use their tools:

```
[MCP Client Tool]
├── MCP Server URL: http://localhost:3000
└── Tool: file-read
```

### MCP Server Trigger

Expose n8n workflows as MCP tools:

```
[MCP Server Trigger]
├── Path: /mcp
└── Name: my-n8n-tools
```

Other MCP-compatible applications can then call n8n workflows.

## Text Splitters

### Character Text Splitter
```
Split by: \n\n
Chunk Size: 1000
Overlap: 200
```

### Recursive Character Text Splitter
```
Separators: ["\n\n", "\n", " ", ""]
Chunk Size: 1000
Overlap: 200
```

### Token Splitter
```
Encoding: cl100k_base (GPT-4)
Chunk Size: 500 tokens
Overlap: 50 tokens
```

## AI Workflow Examples

### Chatbot with Memory

```
[Chat Trigger] → [AI Agent]
                 ├── OpenAI Chat Model (gpt-4)
                 ├── Simple Memory (session ID: {{ $json.sessionId }})
                 └── Tools: Calculator, Wikipedia
```

### Document Q&A (RAG)

```
[Webhook: Upload Document]
  → [Split Out: Pages]
  → [Text Splitter]
  → [Embeddings]
  → [Pinecone: Insert]

[Webhook: Query]
  → [Embeddings]
  → [Pinecone: Search]
  → [Question and Answer Chain]
     └── Model: GPT-4
```

### AI Data Extraction

```
[Webhook: Unstructured Text]
  → [Information Extractor]
     ├── Model: GPT-4
     └── Schema: { name, email, company, phone }
  → [Database: Insert]
```

### Sentiment Analysis

```
[Social Media Trigger]
  → [Sentiment Analysis]
     └── Model: GPT-3.5
  → [If Negative]
     → [Slack: Alert Support Team]
```

### Multi-Agent Workflow

```
[Trigger]
  → [AI Agent: Researcher]
     ├── Tools: SerpAPI, Wikipedia
     └── Output: Research Summary
  → [AI Agent: Writer]
     ├── Input: {{ $json.research }}
     └── Output: Article Draft
  → [AI Agent: Editor]
     ├── Input: {{ $json.draft }}
     └── Output: Final Article
```

### Human-in-the-Loop

```
[AI Agent with Tool]
  → [Tool requires approval?]
     → [Send Approval Form]
     → [Wait for Response]
        → [If Approved] → [Execute Tool]
        → [If Rejected] → [Return to Agent]
```

## Best Practices

### Token Management

- Monitor token usage
- Use appropriate model sizes
- Implement truncation for long inputs
- Cache embeddings when possible

### Error Handling

- Set up retry logic for API failures
- Handle rate limiting gracefully
- Implement fallback models

### Cost Optimization

- Use GPT-3.5 for simple tasks, GPT-4 for complex
- Cache frequent queries
- Implement streaming for long responses
- Use local models (Ollama) for development

### Security

- Secure API keys in credentials
- Validate inputs before processing
- Implement content moderation
- Use guardrails for sensitive applications

### Performance

- Use streaming for faster perceived response
- Implement parallel tool calls
- Batch embedding requests
- Use appropriate chunk sizes

## LangChain Code Node

For advanced LangChain usage, use the LangChain Code node:

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.7
});

const prompt = PromptTemplate.fromTemplate(
  "Summarize the following: {text}"
);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const result = await chain.invoke({
  text: $json.document
});

return { json: { summary: result } };
```

## Evaluations

n8n provides evaluation tools for AI workflows:

- **Evaluation Trigger:** Start evaluation runs
- **Evaluation Node:** Compare outputs against expected results
- **Metrics:** Accuracy, latency, cost tracking

Configure evaluations to:
- Test prompt variations
- Compare model performance
- Track quality over time
