---
sidebar_position: 4
title: MCP Server Integration
---

# Model Context Protocol (MCP) Integration

The Discovery Node includes a Model Context Protocol (MCP) server that enables AI assistants like Claude to interact with the Commerce Mesh Protocol through standardized tools, resources, and prompts.

## What is MCP?

The Model Context Protocol is an open standard that allows AI assistants to interact with external systems through:
- **Tools**: Functions the AI can call to perform actions
- **Resources**: Data the AI can access
- **Prompts**: Templates for common workflows

## Running the MCP Server

The Discovery Node MCP server runs alongside the FastAPI application:

```bash
# Start the MCP server (default port: 3001)
python run_mcp.py

# Or with custom port
python run_mcp.py --port 8080
```

The MCP server will be available at:
```
http://localhost:3001
```

## Available Tools

### search-products

Search for products using the Discovery Node's hybrid vector search.

**Parameters:**
- `query` (required, string): Search query
- `limit` (optional, integer): Maximum results (default: 10)

**Example Usage:**
```json
{
  "tool": "search-products",
  "arguments": {
    "query": "wireless noise canceling headphones",
    "limit": 5
  }
}
```

**Returns:** JSON-LD formatted search results with schema.org vocabulary.

### get-product-details

Retrieve detailed information about a specific product or product group.

**Parameters:**
- `urn` (required, string): Product or ProductGroup URN

**Example Usage:**
```json
{
  "tool": "get-product-details",
  "arguments": {
    "urn": "urn:cmp:org:apple:brand:apple:productgroup:iphone15pro"
  }
}
```

### get-products-by-category

Get products filtered by a specific category.

**Parameters:**
- `category` (required, string): Product category to filter by
- `limit` (optional, integer): Maximum results (default: 20)

**Example Usage:**
```json
{
  "tool": "get-products-by-category",
  "arguments": {
    "category": "Electronics > Computers > Laptops",
    "limit": 10
  }
}
```

## Available Resources

### cmp://products/sample
- **Type**: `application/ld+json`
- **Description**: Sample of products to understand data structure
- **Updates**: Real-time based on search activity

### cmp://products/schema
- **Type**: `application/json`
- **Description**: Complete field definitions for CMP product data
- **Content**: Field names, types, descriptions, and examples

### cmp://node/info
- **Type**: `application/json`
- **Description**: Basic information about the Discovery Node instance
- **Content**: Version, features, limits

## Available Prompts

### product-search
Template for effective product searching.

**Arguments:**
- `query`: What to search for

**Workflow:**
1. Parse search intent
2. Execute search with appropriate query
3. Analyze results
4. Present findings with recommendations

### search-analysis
Analyze search results and understand product data patterns.

**Arguments:**
- `search_term`: Term to analyze

**Workflow:**
1. Search for products
2. Analyze pricing distribution
3. Identify key features
4. Summarize market insights

### product-lookup
Get detailed information about a specific product.

**Arguments:**
- `urn`: Product identifier

**Workflow:**
1. Retrieve product details
2. Check variant availability
3. Compare with similar products
4. Provide comprehensive overview

## Claude Desktop Integration

To use the Discovery Node MCP server with Claude Desktop, add to your configuration:

```json
{
  "mcpServers": {
    "commerce-mesh": {
      "command": "python",
      "args": ["/path/to/discovery-node/run_mcp.py"],
      "env": {
        "DATABASE_URL": "postgresql://...",
        "PINECONE_API_KEY": "..."
      }
    }
  }
}
```

## Example Conversations

Once integrated, you can have conversations like:

```
User: Find me the best wireless headphones under $300