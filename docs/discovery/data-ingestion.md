---
sidebar_position: 2
title: Data Ingestion
description: Learn how to configure data sources and ingestion for Discovery Node
---

# Data Ingestion

Discovery Node supports flexible data ingestion from multiple sources through the `ingestion.yaml` configuration file. This guide covers how to set up and configure data sources for your product discovery engine.

## Overview

The ingestion system:
- Supports multiple data sources running in parallel
- Provides scheduled ingestion with cron expressions
- Handles both local files and remote feeds
- Automatically processes brand registries and product feeds
- Updates vector embeddings for semantic search

## Configuration File

The ingestion configuration is defined in `ingestion.yaml`. By default, Discovery Node looks for this file at the path specified by the `INGESTION_CONFIG_PATH` environment variable.

### Basic Structure

```yaml
ingestion:
  - name: "source-name"
    source_type: "local"
    registry: "/path/to/brand-registry.json"
    feed_path: "/path/to/product-feed.json"
    schedule: "0 */4 * * *"  # Cron expression
```

## Supported Source Types

Discovery Node supports multiple source types for data ingestion:

### 1. Local Sources

Local sources read data from files on the local filesystem. This is ideal for:
- Development and testing
- Static product catalogs
- Batch imports from other systems

**Configuration example:**

```yaml
ingestion:
  - name: "acme-corp"
    source_type: "local"
    registry: "/data/acme/brand-registry.json"
    feed_path: "/data/acme/feed.json"
    schedule: "0 */6 * * *"  # Every 6 hours
```

**Required fields:**
- `name`: Unique identifier for this source
- `source_type`: Must be `"local"`
- `registry`: Absolute path to the brand registry JSON file
- `feed_path`: Absolute path to the product feed JSON file
- `schedule`: Cron expression for ingestion frequency

### 2. CMP Sources

CMP sources fetch data directly from the Commerce Mesh Protocol's official brand registry and associated feeds. This enables automatic synchronization with registered organizations.

**Configuration example:**

```yaml
ingestion:
  - name: "insight-editions"
    source_type: "cmp"
    registry: "https://github.com/commercemesh/commercemesh/blob/main/registry/brands.json"
    filter:
      organization: ["urn:cmp:org:11cdde9b-6a0c-5c18-8d01-11f701089cc2"]
    schedule: "0 */4 * * *"  # Every 4 hours
```

**Required fields:**
- `name`: Unique identifier for this source
- `source_type`: Must be `"cmp"`
- `registry`: URL to the CMP brand registry (typically the GitHub registry)
- `filter`: Filter criteria for selecting data
  - `organization`: Array of organization URNs to ingest
- `schedule`: Cron expression for ingestion frequency

**How it works:**
1. Fetches the brand registry from the specified GitHub URL
2. Filters brands belonging to the specified organizations
3. Automatically discovers and fetches product feeds for each brand
4. Processes and indexes all products from the filtered organizations

**Upcoming filter options:**
- `categories`: Filter by specific product categories
- `brands`: Filter by specific brand URNs
- `regions`: Filter by geographic regions

### 3. Remote Sources (Coming Soon)

Additional remote sources are planned for future releases:
- Direct HTTP/HTTPS endpoints
- S3 buckets
- FTP servers
- Custom API endpoints

## Data Format Requirements

### Brand Registry Format

The brand registry must be a JSON file with the following structure:

```json
{
  "organization": {
    "id": "org-123",
    "name": "ACME Corporation",
    "url": "https://acme.com"
  },
  "brands": [
    {
      "id": "brand-456",
      "name": "ACME Pro",
      "description": "Professional tools and equipment",
      "url": "https://acme.com/pro"
    }
  ]
}
```

### Product Feed Format

The product feed must be a JSON array of products:

```json
[
  {
    "sku": "PROD-001",
    "name": "Professional Drill",
    "description": "High-performance cordless drill",
    "brand": "ACME Pro",
    "category": "Tools",
    "price": 199.99,
    "currency": "USD",
    "availability": "InStock",
    "images": [
      {
        "url": "https://example.com/drill.jpg",
        "caption": "Product image"
      }
    ],
    "attributes": {
      "voltage": "20V",
      "battery": "Lithium-ion"
    }
  }
]
```

## Scheduling Ingestion

Discovery Node uses cron expressions for scheduling. Common patterns:

| Schedule | Cron Expression | Description |
|----------|----------------|-------------|
| Every hour | `0 * * * *` | At minute 0 of every hour |
| Every 4 hours | `0 */4 * * *` | At minute 0, every 4 hours |
| Daily at 2 AM | `0 2 * * *` | At 2:00 AM every day |
| Weekly on Sunday | `0 0 * * 0` | At midnight on Sundays |
| Every 30 minutes | `*/30 * * * *` | Every 30 minutes |

## Multiple Sources

You can configure multiple sources to ingest data from different providers and source types:

```yaml
ingestion:
  # CMP Source - Organizations from official registry
  - name: "cmp-organizations"
    source_type: "cmp"
    registry: "https://github.com/commercemesh/commercemesh/blob/main/registry/brands.json"
    filter:
      organization: [
        "urn:cmp:org:11cdde9b-6a0c-5c18-8d01-11f701089cc2",
        "urn:cmp:org:22bcce8a-5b0d-4d27-9e02-22e802178dd3"
      ]
    schedule: "0 */4 * * *"
  
  # Local source - Development/testing data
  - name: "local-test-data"
    source_type: "local"
    registry: "/data/test/brand-registry.json"
    feed_path: "/data/test/feed.json"
    schedule: "0 */6 * * *"
  
  # Another local source - Partner data
  - name: "partner-catalog"
    source_type: "local"
    registry: "/data/partner/brand-registry.json"
    feed_path: "/data/partner/feed.json"
    schedule: "0 0 * * *"  # Daily at midnight
```

This configuration demonstrates:
- **CMP source**: Automatically syncs with multiple organizations from the official registry
- **Local sources**: For testing data and partner catalogs
- **Different schedules**: Each source can have its own update frequency

## Ingestion Process

When ingestion runs, Discovery Node:

1. **Reads the brand registry** to establish organization and brand relationships
2. **Processes the product feed** to extract product information
3. **Generates embeddings** for semantic search using the configured embedding model
4. **Stores data** in PostgreSQL and the configured vector database
5. **Updates search indices** for fast retrieval

## Environment Variables

Configure ingestion behavior with these environment variables:

```bash
# Path to ingestion configuration file
INGESTION_CONFIG_PATH=/path/to/ingestion.yaml

# Trigger ingestion on startup (useful for development)
TRIGGER_INGESTION_ON_STARTUP=true

# Maximum concurrent ingestion tasks
MAX_CONCURRENT_INGESTION_TASKS=5

# Batch size for processing products
INGESTION_BATCH_SIZE=100

# Data directory for temporary files
DATA_DIR=/var/discovery-node/data
```

## Monitoring Ingestion

### Logs

Monitor ingestion progress through logs:

```bash
# Check worker logs
tail -f logs/worker.log

# Filter for ingestion tasks
grep "ingestion" logs/worker.log
```

### Database Queries

Check ingestion status in the database:

```sql
-- View recent ingestion runs
SELECT * FROM ingestion_runs 
ORDER BY created_at DESC 
LIMIT 10;

-- Count products by source
SELECT source_name, COUNT(*) as product_count 
FROM products 
GROUP BY source_name;
```

## Best Practices

1. **Start with small batches** during initial setup to verify data format
2. **Use appropriate schedules** - balance freshness with system load
3. **Monitor disk space** when using local sources
4. **Implement data validation** in your feed generation process
5. **Use absolute paths** for local file sources
6. **Test with sample data** before full production deployment

## Troubleshooting

### Common Issues

**Ingestion not starting:**
- Check that Celery worker and beat are running
- Verify cron expression is valid
- Check file permissions for local sources

**Products not appearing in search:**
- Verify embedding generation completed
- Check vector database connectivity
- Ensure search indices are updated

**Performance issues:**
- Reduce `INGESTION_BATCH_SIZE` for memory constraints
- Adjust `MAX_CONCURRENT_INGESTION_TASKS` based on system resources
- Consider scheduling ingestion during off-peak hours

## Next Steps

- Learn about [Vector Databases](./vector-databases) for semantic search
- Understand [How Search Works](./search-configuration) with different backends
- Check the [MCP Integration](./mcp-integration) for AI assistants