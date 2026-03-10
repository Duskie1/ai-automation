# n8n Release Notes and Changelog

## Official Sources

### Documentation Release Notes
https://docs.n8n.io/release-notes/

Contains detailed release notes for current versions with feature descriptions and bug fixes.

### GitHub Releases
https://github.com/n8n-io/n8n/releases

Full commit history, detailed changes, and contributor information for each release.

## Version Information

**Current Versions:**
- Stable: `2.10.4`
- Beta: `2.11.2`

### Semantic Versioning

n8n uses semantic versioning (`MAJOR.MINOR.PATCH`):

| Type | Description |
|------|-------------|
| **MAJOR** | Breaking changes requiring user action |
| **MINOR** | New features (backward-compatible) |
| **PATCH** | Bug fixes (backward-compatible) |

### Release Cadence

n8n releases a new minor version most weeks:
- **Stable** - Production-ready, recommended for production use
- **Beta** - Most recent release, may be unstable

## Older Versions

| Version | Release Notes URL |
|---------|-------------------|
| 2.x | https://docs.n8n.io/release-notes/ |
| 1.x | https://docs.n8n.io/release-notes/1-x/ |
| 0.x | https://docs.n8n.io/release-notes/0-x/ |

## Major Version Milestones

### n8n 2.0.0 (December 2025)

A hardening release focused on enterprise-grade security and stability:

**Breaking Changes:**
- Task runners enabled by default (Code node runs in isolated environments)
- Environment variable access blocked from Code nodes by default
- ExecuteCommand and LocalFileTrigger nodes disabled by default
- In-memory binary data mode removed

**New Features:**
- Publish/Save workflow paradigm (separate save from publish)
- Canvas and navigation improvements
- Migration Report tool for upgrade assessment

**Migration:** Use the [v2.0 migration tool](https://docs.n8n.io/self-hosted/installation/updating/) before upgrading.

## Notable Recent Features (2.x)

### Human-in-the-Loop for AI Tool Calls (v1.73.0)
Require explicit human approval before AI Agent executes specific tools:
- Gate tools at the connection level
- Route approvals across users and channels
- Add safety checks for destructive operations

### Chat Node HITL Actions (v1.72.0)
New Chat node actions for human interaction:
- Send a message (continue workflow)
- Send a message and wait for response (pause until reply)

### Time Saved Node (v1.69.0)
Dynamic time savings tracking:
- Calculate savings per execution path
- Per-item or fixed calculations
- Integrated with insights dashboard

### Personal Space Policies (Enterprise) (v1.68.0)
Security & policies settings section:
- Control sharing from personal space
- Control workflow publishing from personal space

### Custom Roles Improvements (v1.68.0)
- System roles and custom roles in separate sections
- Hover to view permission summaries
- Granular workflow permissions (publish/unpublish separated)

### External Secrets Validation (v1.67.0)
- Verify vault access before saving credentials
- Prevent secret exposure through guessed paths

### API Auditability Improvements (v1.67.0)
- `GET /projects/{projectId}/users` returns members with roles
- `GET /credentials` returns paginated credentials with project info

### TLS Support for Syslog Log Streaming (v1.60.0)
Encrypted connections to enterprise SIEM platforms.

### Update Credentials via API (v1.60.0)
- `PATCH /credentials/:id` endpoint for updating existing credentials
- Partial or full updates supported

## Deprecated Nodes

### Motorhead Node (v1.67.0)
Deprecated due to project no longer being maintained:
- Hidden from node panel for new selections
- Existing workflows continue to work

## Checking Your Version

### In n8n UI
Settings → About (bottom of sidebar)

### Via CLI
```bash
n8n --version
```

### Via API
```bash
curl -H "X-N8N-API-KEY: your-key" https://your-instance/api/v1/info
```

## Updating n8n

### Docker
```bash
docker pull n8nio/n8n
docker stop n8n && docker rm n8n
# Restart with your configuration
```

### npm
```bash
npm update -g n8n
```

### n8n Cloud
Automatic updates (check Cloud admin dashboard for version)

## Breaking Changes Best Practices

Before upgrading to a new major version:

1. **Review release notes** for breaking changes
2. **Use Migration Report tool** (for v2.0+)
3. **Backup workflows and credentials**
4. **Test in staging environment** first
5. **Check community forum** for reported issues

## Reporting Issues

- **Forum:** https://community.n8n.io/
- **GitHub Issues:** https://github.com/n8n-io/n8n/issues
- **Security Issues:** security@n8n.io
