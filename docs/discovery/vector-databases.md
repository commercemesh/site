---
sidebar_position: 3
title: Vector Databases
description: Configure and optimize vector storage backends for semantic search
---

# Vector Databases

Discovery Node supports multiple vector database backends for storing and searching embeddings. This guide covers the configuration, features, and trade-offs of each supported backend.

## Overview

Vector databases enable semantic search by storing and efficiently searching high-dimensional embeddings. Discovery Node uses these embeddings to understand the meaning of search queries and find semantically similar products.

## Supported Backends

### PGVector (PostgreSQL Extension)

PGVector is the default and recommended backend for most deployments. It adds vector similarity search directly to PostgreSQL.

**Advantages:**
- No additional infrastructure required
- Unified data and vector storage
- Full ACID compliance
- Cost-effective for small to medium datasets
- Simple backup and recovery
- Native PostgreSQL features (joins, transactions, etc.)

**Configuration:**

```bash
# .env configuration
VECTOR_STORAGE_BACKEND=pgvector
DATABASE_URL=postgresql://user:password@localhost:5432/discovery_db

# No additional configuration needed - uses the main database
```

**Installation:**

```sql
-- Enable the extension (run as superuser)
CREATE EXTENSION IF NOT EXISTS vector;
```

**Performance considerations:**
- Best for datasets up to 1M products
- Supports HNSW indexing for faster searches
- Can leverage PostgreSQL query optimization

### Pinecone (Cloud Vector Database)

Pinecone is a fully-managed vector database service optimized for production scale.

**Advantages:**
- Highly scalable (billions of vectors)
- Managed service (no maintenance)
- Real-time updates
- Advanced filtering capabilities
- Global deployment options
- Optimized for similarity search

**Configuration:**

```bash
# .env configuration
VECTOR_STORAGE_BACKEND=pinecone
PINECONE_API_KEY=your-api-key-here
PINECONE_ENVIRONMENT=your-environment
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
PINECONE_DENSE_INDEX=discovery-dense
PINECONE_SPARSE_INDEX=discovery-sparse
PINECONE_BATCH_SIZE=96
```

**Index setup:**

```python
# The setup script creates these indexes automatically
# Dense index: For semantic embeddings
# Sparse index: For keyword-based search
```

**Performance considerations:**
- Best for large-scale production deployments
- Sub-50ms query latency at any scale
- Automatic scaling and optimization

## How Vector Storage Affects Search

### Search Quality

**PGVector:**
- Uses cosine similarity for semantic matching
- Supports exact and approximate nearest neighbor search
- Quality depends on index type and parameters
- Can combine with PostgreSQL full-text search

**Pinecone:**
- Optimized similarity algorithms
- Hybrid search combining dense and sparse vectors
- Built-in re-ranking capabilities
- Consistent quality at scale

### Search Performance

| Aspect | PGVector | Pinecone |
|--------|----------|----------|
| Query latency (1K products) | ~5-10ms | ~20-30ms |
| Query latency (1M products) | ~50-200ms | ~20-40ms |
| Query latency (10M+ products) | ~1-5s | ~30-50ms |
| Indexing speed | Fast | Moderate |
| Real-time updates | Immediate | Near real-time |

### Hybrid Search Implementation

Discovery Node implements hybrid search differently based on the backend:

**With PGVector:**
```sql
-- Combines vector similarity with metadata filtering
SELECT * FROM products
WHERE category = 'Electronics'
AND embedding <=> query_embedding < 0.5
ORDER BY embedding <=> query_embedding
LIMIT 20;
```

**With Pinecone:**
```python
# Uses Pinecone's native hybrid search
results = index.query(
    vector=query_embedding,
    sparse_vector=sparse_query,
    filter={"category": "Electronics"},
    top_k=20,
    include_metadata=True
)
```

## Embedding Models

Both backends work with the same embedding models:

```bash
# Configure embedding model
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_API_KEY=your-openai-api-key

# Model dimensions
# text-embedding-3-small: 1536 dimensions
# text-embedding-3-large: 3072 dimensions
```

## Migration Between Backends

### PGVector to Pinecone

```bash
# Use the migration script
python scripts/migrate_vectors.py --from pgvector --to pinecone

# Or re-ingest all data
python main.py ingest --force-regenerate-embeddings
```

### Pinecone to PGVector

```bash
# Export from Pinecone and import to PGVector
python scripts/migrate_vectors.py --from pinecone --to pgvector
```

## Choosing the Right Backend

### Use PGVector when:
- Starting a new project
- Dataset is under 1M products
- Want simplified architecture
- Need transactional consistency
- Cost is a primary concern
- Already using PostgreSQL

### Use Pinecone when:
- Scaling beyond 1M products
- Need consistent sub-50ms latency
- Require global distribution
- Want managed infrastructure
- Need advanced search features
- Have dedicated search traffic

## Performance Optimization

### PGVector Optimization

```sql
-- Create HNSW index for better performance
CREATE INDEX ON products 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Tune PostgreSQL for vector workloads
-- postgresql.conf
shared_buffers = 25% of RAM
work_mem = 256MB
maintenance_work_mem = 2GB
```

### Pinecone Optimization

```python
# Optimize batch processing
PINECONE_BATCH_SIZE=96  # Tune based on your data

# Use metadata filtering to reduce search space
filter = {
    "category": {"$in": ["Electronics", "Computers"]},
    "price": {"$gte": 100, "$lte": 1000}
}
```

## Monitoring and Debugging

### PGVector Monitoring

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE indexname LIKE '%embedding%';

-- Monitor query performance
EXPLAIN ANALYZE
SELECT * FROM products
ORDER BY embedding <=> '[...]'::vector
LIMIT 10;
```

### Pinecone Monitoring

```python
# Check index statistics
stats = pinecone_index.describe_index_stats()
print(f"Total vectors: {stats.total_vector_count}")
print(f"Dimensions: {stats.dimension}")

# Monitor API usage in Pinecone console
```

## Cost Considerations

### PGVector Costs
- **Infrastructure**: PostgreSQL server costs only
- **Storage**: ~4KB per product (with 1536-dim embeddings)
- **Compute**: Scales with your PostgreSQL instance
- **Example**: 100K products ≈ 400MB additional storage

### Pinecone Costs
- **Storage**: $0.096/GB/month (as of 2024)
- **Queries**: Included in plan limits
- **Example**: 100K products ≈ $0.04/month storage
- **Plans**: Free tier available for testing

## Best Practices

1. **Start with PGVector** for proof of concept
2. **Monitor query latency** as dataset grows
3. **Plan migration path** if expecting rapid growth
4. **Test both backends** with your actual data
5. **Use appropriate embedding models** for your domain
6. **Implement caching** for frequent queries
7. **Regular maintenance** (reindexing, optimization)

## Troubleshooting

### Common PGVector Issues

**Slow queries:**
- Check if HNSW index exists
- Increase work_mem
- Consider partitioning large tables

**Out of memory:**
- Reduce embedding dimensions
- Increase server memory
- Use approximate search (lower ef_search)

### Common Pinecone Issues

**Rate limits:**
- Implement exponential backoff
- Use batch operations
- Consider upgrading plan

**Inconsistent results:**
- Check if all embeddings are indexed
- Verify metadata filters
- Ensure consistent embedding model

## Next Steps

- Configure [Data Ingestion](./data-ingestion) for your sources
- Understand [How Search Works](./search-configuration) with each backend
- Learn about [MCP Integration](./mcp-integration) for AI assistants