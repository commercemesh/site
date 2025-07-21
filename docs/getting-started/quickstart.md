---
sidebar_position: 1
title: Quick Start
---

# Quick Start Guide

Get up and running with Commerce Mesh Protocol in 5 minutes.

> 📄 **Official Specifications**: [github.com/commercemesh/commercemesh/tree/main/spec](https://github.com/commercemesh/commercemesh/tree/main/spec)

## Prerequisites

Before you begin, ensure you have:

- A public web server to host your product feed
- Basic knowledge of JSON and web APIs
- Your brand information ready
- Node.js or Python for generating URN identifiers

## Step 1: Generate Your Brand ID

Generate a unique identifier for your brand using the CMP namespace:

```javascript
import { v5 as uuid } from 'uuid';

const CMP_NAMESPACE = '4c2d9653-e971-4093-8d5b-82da447c2e85';
const brandId = `urn:cmp:brandid:${uuid('example.com', CMP_NAMESPACE)}`;
```

## Step 2: Register Your Organization

Create your organization entry following the [brand registry schema](https://github.com/commercemesh/commercemesh/blob/main/spec/brand-registry/v0.1/schema/brand-registry-schema.jsonld):

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "cmp": "https://schema.commercemesh.ai/ns#"
  },
  "@type": "Organization",
  "name": "Your Organization",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "Brief description of your organization",
  "cmp:brandId": "urn:cmp:brandid:YOUR-GENERATED-ID",
  "cmp:productFeed": {
    "@type": "DataFeed",
    "url": "https://example.com/cmp/products/feed.json"
  },
  "cmp:category": ["electronics", "computers"],
  "brand": {
    "@type": "Brand",
    "name": "Your Brand",
    "logo": "https://example.com/brand-logo.png",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "cmp:brandId",
      "value": "urn:cmp:brandid:YOUR-GENERATED-ID"
    }
  }
}
```

## Step 3: Create Your Product Feed

Create a product feed following the [product feed specification](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/README.md):

```json
{
  "@context": "https://schema.org",
  "@type": "DataFeed",
  "@id": "https://example.com/cmp/products/feed.json",
  "name": "Your Brand Product Feed",
  "dateModified": "2025-01-21T12:00:00Z",
  "cmp:shardCount": 1,
  "cmp:shardIndex": 0,
  "dataFeedElement": [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "urn:cmp:product:YOUR-BRAND-ID:SKU123",
      "sku": "SKU123",
      "name": "Product Name",
      "description": "Product description",
      "category": "Electronics > Accessories",
      "image": ["https://example.com/product-image.jpg"],
      "brand": {
        "@type": "Brand",
        "name": "Your Brand"
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
      }
    }
  ]
}
```

## Step 4: Host Your Feed

Host your product feed at a publicly accessible URL:

1. Upload your feed JSON file to your web server
2. Ensure it's accessible via HTTPS
3. Set appropriate CORS headers if needed
4. Verify the feed is valid JSON-LD
5. Follow the [hosting guide](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/hosting.md) for best practices

## Step 5: Submit to Registry

Submit a pull request to add your organization to the official CMP registry:

1. Fork the [CMP repository](https://github.com/commercemesh/commercemesh)
2. Add your organization entry to `/registry/brands.json`
3. Submit a pull request with your organization information

## Step 6: Test Your Integration

Test your integration using the CMP Discovery API:

```bash
# Search for your products
curl "https://api.commercemesh.com/v1/products?q=your+product"

# Get a specific product
curl "https://api.commercemesh.com/v1/products/urn:cmp:product:YOUR-BRAND-ID:SKU123"

# Send a view event
curl -X POST "https://api.commercemesh.com/v1/events" \
  -H "Content-Type: application/json" \
  -d '[{
    "event": "view",
    "subject": "urn:cmp:product:YOUR-BRAND-ID:SKU123",
    "timestamp": "2025-01-21T12:00:00Z"
  }]'
```

## Next Steps

Congratulations! You've successfully integrated with CMP. Next, explore:

- [Brand Registry Specification](https://github.com/commercemesh/commercemesh/tree/main/spec/brand-registry/v0.1) - Complete registry details
- [Product Feed Specification](https://github.com/commercemesh/commercemesh/tree/main/spec/product-feed/v0.1) - Advanced feed features
- [Discovery API](https://github.com/commercemesh/commercemesh/tree/main/spec/discovery/v0.1) - Full API documentation
- [Implementation Examples](https://github.com/commercemesh/commercemesh/tree/main/spec) - Reference implementations

## Need Help?

- Join our [Discord community](https://discord.gg/commercemesh)
- Check the [FAQ](/docs/faq)
- Email us at specs@commercemesh.ai