---
sidebar_position: 1
title: Overview
---

# Product Feeds Overview

CMP Product Feeds are JSON-LD formatted catalogs that make your products discoverable across the Commerce Mesh network. They enable AI agents, marketplaces, and applications to access your product data in a standardized format.

> 📄 **Official Specification**: [github.com/commercemesh/commercemesh/tree/main/spec/product-feed/v0.1](https://github.com/commercemesh/commercemesh/tree/main/spec/product-feed/v0.1)

## What are Product Feeds?

Product feeds are:

- **Structured data files** containing your product catalog
- **Self-describing** using Schema.org vocabulary
- **Publicly accessible** via HTTPS URLs
- **Machine-readable** for AI and automated systems
- **Human-friendly** with clear organization

## Feed Architecture

CMP uses a two-tier architecture for scalable product feeds:

### 1. Feed Index
The main entry point (`feed.json`) that provides metadata and references to all shard files:

```
https://example.com/cmp/products/feed.json
```

### 2. Shard Files
Individual catalog files containing the actual product data:

```
https://example.com/cmp/products/feed-001.json
https://example.com/cmp/products/feed-002.json
https://example.com/cmp/products/feed-003.json
```

## Feed Index Format

The feed index provides an overview and links to all shards:

```json
{
  "@context": "https://schema.commercemesh.org/v0.1",
  "@type": "ProductFeedIndex",
  "version": "0.1",
  "lastUpdated": "2025-01-21T12:00:00Z",
  "orgid": "urn:cmp:org:example.com",
  "totalShards": 3,
  "shards": [
    {
      "url": "https://example.com/cmp/products/feed-001.json",
      "lastUpdated": "2025-01-21T12:00:00Z"
    },
    {
      "url": "https://example.com/cmp/products/feed-002.json",
      "lastUpdated": "2025-01-21T12:00:00Z"
    },
    {
      "url": "https://example.com/cmp/products/feed-003.json",
      "lastUpdated": "2025-01-21T12:00:00Z"
    }
  ]
}
```

## Shard File Format

Each shard contains products in an ItemList structure:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
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
        }
      }
    }
  ]
}
```

## Key Concepts

### 1. JSON-LD Format
- Uses `@context` for vocabulary
- `@type` defines entity types
- `@id` provides unique identifiers
- Supports linked data relationships

### 2. Schema.org Vocabulary
- Industry-standard vocabulary
- Rich semantic meaning
- Search engine compatible
- Extensible with CMP namespace

### 3. Product Data Model
Core product fields:
- `sku` - Stock keeping unit
- `name` - Product name
- `description` - Detailed description
- `image` - Product images
- `brand` - Brand reference
- `offers` - Pricing and availability

### 4. Sharding Strategy
For optimal performance:
- **Recommended**: Keep shards under 2MB
- **Maximum**: Never exceed 5MB per shard
- **Naming**: Use zero-padded numbers (`feed-001.json`)
- **Complete replacement**: Each sync replaces all shards

## Feed Requirements

### Technical Requirements
- **Format**: Valid JSON-LD
- **Encoding**: UTF-8
- **Size**: Max 2MB per shard (recommended)
- **Compression**: gzip recommended
- **Protocol**: HTTPS required

### Content Requirements
- **Unique SKUs** across catalog
- **Valid URLs** for images and links
- **Accurate pricing** and availability
- **Complete descriptions**
- **Proper categorization**

## Benefits

### For Brands
- **Direct control** over product data
- **Real-time updates** without intermediaries
- **Rich content** support
- **SEO benefits** from structured data

### For Integrators
- **Standardized format** across brands
- **Predictable structure**
- **Easy parsing** with JSON
- **Semantic understanding**

### For Customers
- **Accurate information** from the source
- **Better discovery** through AI agents
- **Consistent experience** across platforms
- **Trust** in data authenticity

## Feed Lifecycle

1. **Creation** - Generate feed from product database
2. **Sharding** - Split large catalogs into manageable files
3. **Index Generation** - Create feed index referencing all shards
4. **Publication** - Host on public web server
5. **Registration** - Add feed URL to brand registry
6. **Discovery** - Agents and apps find products via index
7. **Updates** - Refresh feed and index regularly
8. **Monitoring** - Track feed health and usage

## Next Steps

- [Feed Specification](/docs/feeds/specification) - Detailed format guide
- [Implementation Guide](/docs/feeds/implementation) - How to create feeds
- [Hosting Guide](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/hosting.md) - Deployment best practices
- [Field Specification](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/field-spec.md) - Complete field reference