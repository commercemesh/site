---
sidebar_position: 1
title: Discovery Node Overview
---

# Discovery Node

The Discovery Node is a high-performance product discovery engine that enables AI-powered search across Commerce Mesh Protocol feeds. It provides both REST API and MCP (Model Context Protocol) interfaces for seamless integration.

## Key Features

- **Hybrid Vector Search**: Combines semantic understanding with keyword matching
- **Schema.org Compliance**: All responses use JSON-LD format with standard vocabulary
- **REST API**: FastAPI-based endpoints with automatic OpenAPI documentation
- **MCP Server**: Enable AI assistants to search and analyze products
- **Real-time Ingestion**: Automatically sync from CMP feeds
- **Multi-tenant Support**: Handle multiple organizations and brands

## Architecture

The Discovery Node consists of several components:

```mermaid
graph TB
    API[FastAPI Server]
    MCP[MCP Server]
    DB[(PostgreSQL)]
    VDB[(Pinecone)]
    Worker[Celery Worker]
    
    API --> DB
    API --> VDB
    MCP --> DB
    MCP --> VDB
    Worker --> DB
    Worker --> VDB
    
    subgraph External
        Feeds[CMP Feeds]
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
- PostgreSQL
- Redis
- Pinecone account

### 2. Installation

```bash
git clone https://github.com/commercemesh/discovery-node
cd discovery-node
pip install -r requirements.txt
```

### 3. Configuration

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/discovery_db
PINECONE_API_KEY=your_api_key
PINECONE_ENVIRONMENT=your_environment
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

## MCP Integration

For AI assistants and advanced integrations, see our [MCP Server Integration guide](./mcp-integration).

## Deployment

For production deployment instructions, including Docker setup and scaling considerations, see the [Discovery Node repository](https://github.com/commercemesh/discovery-node).

## Source Code

The Discovery Node is open source and available at:
[github.com/commercemesh/discovery-node](https://github.com/commercemesh/discovery-node)