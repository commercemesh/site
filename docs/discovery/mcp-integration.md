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

## AI Assistant Integration

### Claude Desktop Integration

To use the Discovery Node MCP server with Claude Desktop:

1. **Locate your Claude Desktop configuration file:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Add the MCP server configuration:**

```json
{
  "mcpServers": {
    "commerce-mesh": {
      "url": "http://localhost:3001/sse"
    }
  }
}
```

For a remote server:
```json
{
  "mcpServers": {
    "commerce-mesh": {
      "url": "https://your-discovery-node.com/sse"
    }
  }
}
```

3. **Restart Claude Desktop** to apply the configuration.

4. **Verify the integration** by asking Claude:
   - "Can you search for products?"
   - "What Commerce Mesh tools do you have available?"

### ChatGPT Integration

To use the Discovery Node MCP server with ChatGPT through Custom GPTs:

1. **Create a Custom GPT** in ChatGPT:
   - Go to "Explore" → "Create a GPT"
   - Click on "Configure"

2. **Set up the Custom GPT:**
   - **Name**: Commerce Mesh Discovery
   - **Description**: Search and discover products using the Commerce Mesh Protocol
   - **Instructions**: 
   ```
   You are a product discovery assistant that helps users find products using the Commerce Mesh Protocol. 
   You have access to product search, detailed product information, and category browsing capabilities.
   Always provide helpful product recommendations based on user queries.
   ```

3. **Configure Actions:**
   - Click on "Create new action"
   - **Schema**: Use the OpenAPI specification from your Discovery Node:
   ```yaml
   openapi: 3.0.0
   info:
     title: Commerce Mesh Discovery API
     version: 1.0.0
   servers:
     - url: https://your-discovery-node.com/api
   paths:
     /v1/search:
       get:
         summary: Search for products
         parameters:
           - name: q
             in: query
             required: true
             schema:
               type: string
         responses:
           200:
             description: Search results
     /v1/products/{urn}:
       get:
         summary: Get product details
         parameters:
           - name: urn
             in: path
             required: true
             schema:
               type: string
         responses:
           200:
             description: Product details
   ```

4. **Authentication** (if required):
   - API Key: Add your Discovery Node API key
   - Or use OAuth 2.0 if configured

5. **Test the integration** by asking:
   - "Search for wireless headphones"
   - "Show me details for product URN xyz"

### Alternative: MCP Bridge for ChatGPT

For a more native MCP experience with ChatGPT, you can use an MCP-to-OpenAPI bridge:

1. **Run the MCP Bridge** (requires additional setup):
   ```bash
   # Install the bridge
   npm install -g @anthropic/mcp-bridge
   
   # Run the bridge pointing to your MCP server
   mcp-bridge --mcp-url http://localhost:3001 --port 8080
   ```

2. **Configure Custom GPT** to use the bridge URL:
   ```
   Server URL: http://localhost:8080/openapi
   ```

This provides automatic translation between MCP tools and OpenAPI endpoints.

## Troubleshooting

### Common Issues

#### Claude Desktop

**MCP server not connecting:**
- Verify the MCP server is running and accessible at the configured URL
- Test the SSE endpoint directly: `curl http://localhost:3001/sse`
- Check that the URL includes the `/sse` path
- Check Claude Desktop logs: `~/Library/Logs/Claude/` (macOS)

**"No tools available" error:**
- Restart Claude Desktop after configuration changes
- Verify the MCP server is running: `curl http://localhost:3001/health`
- Check that all required dependencies are installed in the Discovery Node

#### ChatGPT

**Actions not working:**
- Ensure your Discovery Node API is publicly accessible (not localhost)
- Check CORS settings in your Discovery Node configuration
- Verify API authentication is properly configured
- Test endpoints directly using curl or Postman first

**Rate limiting issues:**
- Configure appropriate rate limits in your Discovery Node
- Consider implementing caching for frequent queries
- Use CloudFlare or similar CDN for production deployments

### Debugging Tips

1. **Test MCP server locally:**
   ```bash
   # Check if MCP server is running
   curl http://localhost:3001/health
   
   # Test the SSE endpoint
   curl -N http://localhost:3001/sse
   
   # Test with MCP Inspector (Chrome/Edge)
   # Open: http://localhost:3001/sse in browser
   # Should see SSE events stream
   ```

2. **Enable debug logging:**
   ```bash
   # Set environment variable before running
   export MCP_DEBUG=true
   python run_mcp.py
   ```

3. **Check Discovery Node logs:**
   ```bash
   # View real-time logs
   tail -f logs/discovery-node.log
   ```

## Example Conversations

Once integrated, you can have conversations like:

```
User: Find me the best wireless headphones under $300