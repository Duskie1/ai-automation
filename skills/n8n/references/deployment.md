# n8n Deployment Guide

## Installation Methods

### Docker (Recommended)

#### Basic Docker Setup
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

#### Docker with Persistent Data
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_ENCRYPTION_KEY="your-encryption-key" \
  n8nio/n8n
```

#### Docker with PostgreSQL
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e DB_TYPE=postgresdb \
  -e DB_POSTGRESDB_HOST=postgres \
  -e DB_POSTGRESDB_PORT=5432 \
  -e DB_POSTGRESDB_DATABASE=n8n \
  -e DB_POSTGRESDB_USER=n8n \
  -e DB_POSTGRESDB_PASSWORD=n8n_password \
  n8nio/n8n
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n_password
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n"]
      interval: 5s
      timeout: 5s
      retries: 10

  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8n_password
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - WEBHOOK_URL=https://n8n.example.com/
      - N8N_HOST=n8n.example.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  n8n_data:
```

### npm Installation

#### Install Globally
```bash
npm install n8n -g
n8n start
```

#### Install with npm (Project)
```bash
mkdir n8n-project && cd n8n-project
npm init -y
npm install n8n
npx n8n start
```

### Cloud Hosting

#### n8n Cloud
Managed hosting by n8n:
- https://n8n.io/cloud
- Free tier available
- Automatic updates and backups

#### Self-Hosted on Cloud Providers
- AWS (EC2, ECS)
- Google Cloud (Cloud Run, GKE)
- Azure (Container Instances, AKS)
- DigitalOcean (Droplet, App Platform)
- Heroku

## Environment Variables

### Server Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_HOST` | Server hostname | `localhost` |
| `N8N_PORT` | Server port | `5678` |
| `N8N_PROTOCOL` | HTTP protocol | `http` |
| `N8N_EDITOR_BASE_URL` | Editor base URL | - |
| `WEBHOOK_URL` | Production webhook URL | - |
| `N8N_LISTEN_ADDRESS` | Listen address | `0.0.0.0` |

### Database Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_TYPE` | Database type | `sqlite` |
| `DB_POSTGRESDB_HOST` | PostgreSQL host | - |
| `DB_POSTGRESDB_PORT` | PostgreSQL port | `5432` |
| `DB_POSTGRESDB_DATABASE` | Database name | - |
| `DB_POSTGRESDB_USER` | Database user | - |
| `DB_POSTGRESDB_PASSWORD` | Database password | - |
| `DB_POSTGRESDB_SCHEMA` | Database schema | `public` |
| `DB_POSTGRESDB_SSL_ENABLED` | Enable SSL | `false` |

### MySQL Configuration

| Variable | Description |
|----------|-------------|
| `DB_MYSQLDB_HOST` | MySQL host |
| `DB_MYSQLDB_PORT` | MySQL port (3306) |
| `DB_MYSQLDB_DATABASE` | Database name |
| `DB_MYSQLDB_USER` | Database user |
| `DB_MYSQLDB_PASSWORD` | Database password |

### Security Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_ENCRYPTION_KEY` | Credential encryption key | auto-generated |
| `N8N_USER_MANAGEMENT_DISABLED` | Disable user management | `false` |
| `N8N_API_KEY_DISABLED` | Disable API key auth | `false` |
| `N8N_API_DISABLED` | Disable public API | `false` |

### Execution Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `EXECUTIONS_MODE` | Execution mode | `own` |
| `EXECUTIONS_PROCESS` | Process type | `main` |
| `EXECUTIONS_DATA_SAVE_ON_ERROR` | Save error data | `all` |
| `EXECUTIONS_DATA_SAVE_ON_SUCCESS` | Save success data | `all` |
| `EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS` | Save manual executions | `true` |
| `EXECUTIONS_TIMEOUT` | Execution timeout (ms) | `-1` (no limit) |
| `EXECUTIONS_TIMEOUT_MAX` | Max timeout (ms) | `-1` |

### Queue Mode Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `QUEUE_BULL_REDIS_HOST` | Redis host | `localhost` |
| `QUEUE_BULL_REDIS_PORT` | Redis port | `6379` |
| `QUEUE_BULL_REDIS_DB` | Redis database | `0` |
| `QUEUE_BULL_REDIS_PASSWORD` | Redis password | - |

### Logging Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_LOG_LEVEL` | Log level | `info` |
| `N8N_LOG_OUTPUT` | Log output | `console` |
| `N8N_LOG_FILE_COUNT` | Log file count | `20` |
| `N8N_LOG_FILE_SIZE_MAX` | Max log file size | `16mb` |

### Workflow Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `WORKFLOWS_DEFAULT_NAME` | Default workflow name | `My workflow` |
| `N8N_WORKFLOW_CALLER_POLICY_DEFAULT_OPTION` | Sub-workflow policy | `workflowsFromAList` |

## Security Hardening

### SSL/TLS Configuration

#### Using Reverse Proxy (Recommended)

**nginx:**
```nginx
server {
    listen 443 ssl;
    server_name n8n.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Caddy:**
```
n8n.example.com {
    reverse_proxy localhost:5678
}
```

### Authentication

#### Basic Auth
```bash
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password
```

#### JWT Authentication
```bash
N8N_JWT_AUTH_ACTIVE=true
N8N_JWT_AUTH_HEADER=Authorization
N8N_JWT_AUTH_HEADER_VALUE_PREFIX=Bearer
JWT_SIGNATURE_ALGORITHM=RS256
```

### Encryption Key

**Important:** Back up your encryption key!

```bash
# Generate secure key
openssl rand -hex 32

# Set in environment
export N8N_ENCRYPTION_KEY="your-generated-key"
```

### Network Security

- Use firewall rules to restrict access
- Enable HTTPS only
- Configure CORS settings
- Use VPN for internal access

## Scaling n8n

### Queue Mode

For high-load deployments, use queue mode with Redis:

```yaml
# docker-compose.yml with queue mode
services:
  redis:
    image: redis:7
    restart: always

  n8n-main:
    image: n8nio/n8n
    command: start
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis

  n8n-worker:
    image: n8nio/n8n
    command: worker
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
    deploy:
      replicas: 3
```

### Concurrency Control

```bash
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168  # hours
EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
```

### Binary Data Storage

For large file handling:

```bash
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
N8N_BINARY_DATA_STORAGE_PATH=/var/lib/n8n/binary
```

Or use external storage (S3):

```bash
N8N_EXTERNAL_BINARY_DATA_MODE=s3
S3_ENDPOINT=s3.amazonaws.com
S3_BUCKET=n8n-binary-data
```

## Backup and Recovery

### Backup Data

```bash
# Backup SQLite database
cp ~/.n8n/database.sqlite ~/.n8n/backup/

# Backup credentials and workflows
cp -r ~/.n8n ~/.n8n_backup_$(date +%Y%m%d)
```

### Backup with PostgreSQL

```bash
pg_dump -U n8n -d n8n > n8n_backup_$(date +%Y%m%d).sql
```

### Restore

```bash
# Restore from backup
cp -r ~/.n8n_backup_20240101 ~/.n8n

# Restore PostgreSQL
psql -U n8n -d n8n < n8n_backup_20240101.sql
```

## Updating n8n

### Docker Update

```bash
docker pull n8nio/n8n
docker stop n8n
docker rm n8n
# Start with new image using previous configuration
```

### npm Update

```bash
npm update -g n8n
```

### Zero-Downtime Updates

1. Deploy new version alongside old
2. Switch traffic to new instance
3. Shut down old instance

## Health Checks

### Docker Health Check

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5678/healthz"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Health Endpoint

```bash
curl http://localhost:5678/healthz
# Returns: {"status": "ok"}
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -i :5678
kill -9 <PID>
```

**Permission denied:**
```bash
chown -R node:node ~/.n8n
```

**Database connection failed:**
- Check database credentials
- Verify network connectivity
- Check database logs

**Out of memory:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" n8n start
```

### Logs

```bash
# Docker logs
docker logs n8n
docker logs -f n8n  # Follow logs

# npm logs (check location)
# Usually in ~/.n8n/logs/
```
