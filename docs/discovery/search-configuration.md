---
sidebar_position: 5
title: How Search Works
description: Understanding how Discovery Node search differs between PGVector and Pinecone
---

# How Search Works

Discovery Node's `/api/products` search endpoint uses different strategies depending on your configured vector backend. This guide explains how search works with each backend.

## Search Flow Overview

When you make a search request to `/api/products?q=laptop`, Discovery Node:

1. **Generates an embedding** from your query using OpenAI's embedding model
2. **Performs vector similarity search** using your configured backend
3. **Applies metadata filters** (category, brand, price)
4. **Returns results** in Schema.org JSON-LD format

## PGVector Search Implementation

When using PGVector, the search happens entirely within PostgreSQL:

```sql
-- Simplified example of what happens internally
SELECT 
    p.*,
    1 - (p.embedding <=> query_embedding) as similarity_score
FROM products p
WHERE 
    p.embedding <=> query_embedding < 0.5  -- Similarity threshold
    AND p.category = 'Electronics'          -- Optional filters
ORDER BY p.embedding <=> query_embedding    -- Cosine distance
LIMIT 20;
```

### Key Characteristics:

- **Single Query**: Everything happens in one PostgreSQL query
- **Cosine Similarity**: Uses `<=>` operator for cosine distance
- **Index Support**: Can use HNSW or IVFFlat indexes for speed
- **Filtering**: SQL WHERE clauses for metadata filtering
- **Transactional**: Results are always consistent with your data

### Performance Profile:

```
Query: "gaming laptop"
Dataset: 50,000 products
Index: HNSW (m=16, ef_construction=64)

Execution time: ~25ms
- Embedding generation: 15ms
- Vector search: 8ms
- Result formatting: 2ms
```

## Pinecone Search Implementation

When using Pinecone, search involves API calls to Pinecone's service:

```python
# Simplified example of what happens internally
results = pinecone_index.query(
    vector=query_embedding,
    top_k=20,
    filter={
        "category": {"$eq": "Electronics"},
        "price": {"$gte": 100, "$lte": 1000}
    },
    include_metadata=True
)
```

### Key Characteristics:

- **API Call**: Network request to Pinecone's servers
- **Hybrid Search**: Can combine dense and sparse vectors
- **Advanced Filtering**: Pinecone's query language for metadata
- **Distributed**: Automatically scales across Pinecone's infrastructure
- **Eventually Consistent**: Small delay after updates

### Performance Profile:

```
Query: "gaming laptop"
Dataset: 1,000,000 products
Index: Pinecone serverless

Execution time: ~35ms
- Embedding generation: 15ms
- API request to Pinecone: 18ms
- Result formatting: 2ms
```

## Key Differences

| Aspect | PGVector | Pinecone |
|--------|----------|----------|
| **Latency** | Lower for small datasets | Consistent at any scale |
| **Filtering** | SQL WHERE clauses | Pinecone filter syntax |
| **Updates** | Immediate visibility | ~1 second delay |
| **Batching** | Not needed | Recommended for writes |
| **Cost** | PostgreSQL hosting only | Per-vector pricing |

## Search Quality Comparison

Both backends use the same embeddings and similarity metrics, so search quality is comparable. The differences are:

### PGVector
- Exact nearest neighbor search available
- Can combine with PostgreSQL full-text search
- Custom scoring with SQL expressions

### Pinecone
- Approximate nearest neighbor (very accurate)
- Built-in hybrid search capabilities
- Automatic optimization for large scales

## API Response Example

Regardless of backend, the `/api/products` endpoint returns the same format:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "numberOfItems": 2,
  "itemListElement": [
    {
      "@type": "Product",
      "name": "Gaming Laptop Pro",
      "description": "High-performance laptop for gaming",
      "brand": {
        "@type": "Brand",
        "name": "TechCorp"
      },
      "offers": {
        "@type": "Offer",
        "price": 1299.99,
        "priceCurrency": "USD"
      },
      "_relevance_score": 0.92
    }
  ]
}
```

## Choosing Based on Search Requirements

### Use PGVector when:
- You need consistent, predictable latency
- Your dataset is under 1M products  
- You want to combine with SQL queries
- You need immediate consistency

### Use Pinecone when:
- You have millions of products
- You need consistent sub-50ms search at scale
- You want managed infrastructure
- You need advanced filtering capabilities

## Configuration

Set your backend in `.env`:

```bash
# For PGVector
VECTOR_STORAGE_BACKEND=pgvector

# For Pinecone
VECTOR_STORAGE_BACKEND=pinecone
PINECONE_API_KEY=your-key-here
```

The search API works identically regardless of backend - the implementation details are abstracted away.