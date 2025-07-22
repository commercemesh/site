---
sidebar_position: 1
title: Discovery Node Overview
---

# Discovery Node

The Discovery Node is a high-performance product discovery engine that enables AI-powered search across Commerce Mesh Protocol feeds. It provides both REST API and MCP (Model Context Protocol) interfaces for seamless integration.

## Key Features

- **Hybrid Vector Search**: Combines semantic understanding with keyword matching
- **Multiple Vector Backends**: Support for both PGVector and Pinecone
- **Schema.org Compliance**: All responses use JSON-LD format with standard vocabulary
- **REST API**: FastAPI-based endpoints with automatic OpenAPI documentation
- **MCP Server**: Enable AI assistants to search and analyze products
- **Flexible Data Ingestion**: Support for local and remote data sources
- **Real-time Updates**: Automatically sync from configured feeds
- **Multi-tenant Support**: Handle multiple organizations and brands

## Architecture

The Discovery Node consists of several components:

```mermaid
graph TB
    API[FastAPI Server]
    MCP[MCP Server]
    DB[(PostgreSQL)]
    VDB[(Vector DB<br/>PGVector/Pinecone)]
    Worker[Celery Worker]
    Search[Search Engine<br/>Tantivy]
    
    API --> DB
    API --> VDB
    API --> Search
    MCP --> DB
    MCP --> VDB
    MCP --> Search
    Worker --> DB
    Worker --> VDB
    Worker --> Search
    
    subgraph External
        Feeds[Data Sources<br/>Local/Remote]
        Client[API Clients]
        AI[AI Assistants]
    end
    
    Feeds --> Worker
    Client --> API
    AI --> MCP
```

## Quick Start

### 1. Prerequisites

- Python 3.10+
- PostgreSQL 14+ (with pgvector extension for PGVector backend)
- Redis
- OpenAI API key (for embeddings)
- Optional: Pinecone account (if using Pinecone backend)

### 2. Installation

```bash
git clone https://github.com/commercemesh/discovery-node
cd discovery-node
pip install -r requirements.txt
```

### 3. Configuration

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/discovery_db

# Vector Storage (choose one)
VECTOR_STORAGE_BACKEND=pgvector  # or 'pinecone'

# If using Pinecone
PINECONE_API_KEY=your_api_key
PINECONE_ENVIRONMENT=your_environment

# Embeddings
EMBEDDING_API_KEY=your_openai_api_key
```

Configure data sources in `ingestion.yaml`:

```yaml
ingestion:
  - name: "my-products"
    source_type: "local"
    registry: "/path/to/brand-registry.json"
    feed_path: "/path/to/product-feed.json"
    schedule: "0 */4 * * *"
```

### 4. Run Services

```bash
# Start API server
python main.py serve

# Start MCP server (in another terminal)
python run_mcp.py

# Start worker (in another terminal)
celery -A app.worker.celery_app worker --loglevel=info
```

## API Documentation

The Discovery Node provides a comprehensive REST API for product search and retrieval. 

**View the full API documentation at: [/api](/api)**

The API includes:
- Product search with natural language queries
- Product detail retrieval by URN
- Health check endpoints
- Full OpenAPI specification

## Configuration Guides

- **[Data Ingestion](./data-ingestion)**: Configure data sources and ingestion schedules
- **[Vector Databases](./vector-databases)**: Choose and optimize your vector storage backend
- **[MCP Integration](./mcp-integration)**: Enable AI assistants to search products

## Deployment

For production deployment instructions, including Docker setup and scaling considerations, see the [Discovery Node repository](https://github.com/commercemesh/discovery-node).

## Source Code

The Discovery Node is open source and available at:
[github.com/commercemesh/discovery-node](https://github.com/commercemesh/discovery-node)