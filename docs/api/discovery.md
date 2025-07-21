---
sidebar_position: 1
title: Discovery API
---

# Discovery API

The CMP Discovery API enables searching and retrieving products across all participating brands in the Commerce Mesh network.

> 📄 **Official Specification**: [github.com/commercemesh/commercemesh/tree/main/spec/discovery/v0.1](https://github.com/commercemesh/commercemesh/tree/main/spec/discovery/v0.1)

## Base URL

```
https://api.commercemesh.com/v1
```

## Authentication

All API requests require authentication via API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.commercemesh.com/v1/products
```

## Endpoints

### Search Products

Search for products across all brands based on the [OpenAPI specification](https://github.com/commercemesh/commercemesh/blob/main/spec/discovery/v0.1/openapi.yaml).

```http
GET /products
```

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `q` | string | Search query | - |
| `filter` | object | Filter criteria (JSON object) | - |
| `limit` | integer | Results per page (max 100) | 20 |
| `nextPageToken` | string | Token for pagination | - |

#### Filter Object

The `filter` parameter accepts a JSON object with these fields:

```json
{
  "brand": "Brand Name",
  "category": "Electronics",
  "minPrice": 10.00,
  "maxPrice": 1000.00,
  "availability": "InStock"
}
```

#### Response

```json
{
  "products": [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "urn:cmp:product:123e4567-e89b-12d3-a456-426614174000:SKU123",
      "sku": "SKU123",
      "name": "Product Name",
      "description": "Product description",
      "brand": {
        "@type": "Brand",
        "name": "Brand Name"
      },
      "offers": {
        "@type": "Offer",
        "price": "29.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "inventoryLevel": {
          "@type": "QuantitativeValue",
          "value": 50
        }
      },
      "image": ["https://example.com/image.jpg"],
      "category": "Electronics > Accessories"
    }
  ],
  "nextPageToken": "eyJvZmZzZXQiOiAyMH0="
}
```

#### Example

```bash
# Simple search
curl "https://api.commercemesh.com/v1/products?q=laptop&limit=10"

# Search with filters
curl -G "https://api.commercemesh.com/v1/products" \
  --data-urlencode 'q=laptop' \
  --data-urlencode 'filter={"category":"Electronics","minPrice":500}'

# Pagination
curl "https://api.commercemesh.com/v1/products?q=laptop&nextPageToken=eyJvZmZzZXQiOiAyMH0="
```

### Get Product by SKU

Retrieve a specific product by its SKU URN.

```http
GET /products/{skuUrn}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `skuUrn` | string | SKU URN in format `urn:cmp:product:{brandId}:{sku}` |

#### Response

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "urn:cmp:product:123e4567-e89b-12d3-a456-426614174000:SKU123",
  "sku": "SKU123",
  "gtin": "1234567890123",
  "name": "Product Name",
  "description": "Detailed product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/products/SKU123",
    "inventoryLevel": {
      "@type": "QuantitativeValue",
      "value": 50
    }
  },
  "image": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "category": "Electronics > Accessories",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Color",
      "value": "Black"
    }
  ]
}
```

#### Example

```bash
# Get specific product
curl "https://api.commercemesh.com/v1/products/urn:cmp:product:123e4567-e89b-12d3-a456-426614174000:9781683833897"
```

## Events API

Send telemetry events for analytics based on the [events schema](https://github.com/commercemesh/commercemesh/blob/main/spec/discovery/v0.1/schema/events_schema.json).

```http
POST /events
```

#### Request Body

```json
[
  {
    "event": "view",
    "subject": "urn:cmp:product:123e4567-e89b-12d3-a456-426614174000:SKU123",
    "timestamp": "2025-01-21T12:00:00Z",
    "meta": {
      "referrer": "https://example.com",
      "userAgent": "Mozilla/5.0..."
    }
  }
]
```

#### Event Types

| Event | Description |
|-------|-------------|
| `view` | Product page viewed |
| `add_to_cart` | Product added to cart |
| `purchase` | Product purchased |

#### Response

```http
202 Accepted
```

## Webhooks

Subscribe to real-time updates via webhooks as defined in the [webhooks specification](https://github.com/commercemesh/commercemesh/blob/main/spec/discovery/v0.1/webhooks.yaml).

### Register Webhook

```http
POST /webhooks/register
```

#### Request Body

```json
{
  "url": "https://yourapp.com/webhooks/cmp",
  "events": ["product.viewed", "product.addedToCart", "product.purchased"],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

Events are delivered with HMAC-SHA256 signatures:

```json
{
  "event": "product.viewed",
  "data": {
    "productId": "urn:cmp:product:123e4567-e89b-12d3-a456-426614174000:SKU123",
    "timestamp": "2025-01-21T12:00:00Z",
    "metadata": {}
  }
}
```

#### Event Types

| Event | Description |
|-------|-------------|
| `product.viewed` | Product view event |
| `product.addedToCart` | Add to cart event |
| `product.purchased` | Purchase event |

#### Signature Verification

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}
```

## MCP Tools

For LLM integration, CMP provides Model Context Protocol tools as defined in [mcp.yaml](https://github.com/commercemesh/commercemesh/blob/main/spec/discovery/v0.1/mcp.yaml):

### Available Tools

1. **search_products** - Search the product catalog
2. **get_product** - Retrieve product details
3. **compare_products** - Compare multiple products

### Tool Usage Example

```yaml
- name: search_products
  arguments:
    query: "laptop"
    filter:
      category: "Electronics"
      maxPrice: 1500
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid search query",
    "details": {
      "field": "q",
      "reason": "Query cannot be empty"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

- **Rate limit**: 1000 requests per hour
- **Burst limit**: 50 requests per minute
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Best Practices

1. **Use pagination** for large result sets with `nextPageToken`
2. **Cache responses** appropriately using ETags
3. **Send events** for analytics and recommendations
4. **Verify webhooks** using HMAC signatures
5. **Handle errors** gracefully with exponential backoff

## Next Steps

- [OpenAPI Specification](https://github.com/commercemesh/commercemesh/blob/main/spec/discovery/v0.1/openapi.yaml) - Complete API reference
- [Webhook Integration](https://github.com/commercemesh/commercemesh/blob/main/spec/discovery/v0.1/webhooks.yaml) - Webhook details
- [MCP Tools](https://github.com/commercemesh/commercemesh/blob/main/spec/discovery/v0.1/mcp.yaml) - LLM integration