---
sidebar_position: 2
title: Feed Specification
---

# Product Feed Specification

This document defines the complete specification for CMP Product Feeds, including feed index structure, sharding, and product schemas.

> 📄 **Official Specification**: [github.com/commercemesh/commercemesh/tree/main/spec/product-feed/v0.1](https://github.com/commercemesh/commercemesh/tree/main/spec/product-feed/v0.1)

## Feed Architecture

CMP uses a two-tier feed architecture:

1. **Feed Index** - A main `feed.json` file that references all shard files
2. **Shard Files** - Individual product catalog files (e.g., `feed-001.json`, `feed-002.json`)

### Recommended Hosting Location

We strongly recommend hosting the feed index file at:
```
https://yourdomain.com/.well-known/cmp/feed.json
```

The `.well-known` URI path is a standard location for site-wide metadata, making it easy for discovery nodes and AI agents to find your product feed automatically.

## Feed Index Structure

The main feed index (hosted at `/.well-known/cmp/feed.json`) provides metadata and references to all shard files:

```json
{
  "@context": "https://schema.commercemesh.org/v0.1",
  "@type": "ProductFeedIndex",
  "version": "0.1",
  "lastUpdated": "2025-01-21T12:00:00Z",
  "orgid": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000",
  "totalShards": 2,
  "shards": [
    {
      "url": "https://example.com/.well-known/cmp/feed-001.json",
      "lastUpdated": "2025-01-21T12:00:00Z"
    },
    {
      "url": "https://example.com/.well-known/cmp/feed-002.json",
      "lastUpdated": "2025-01-21T12:00:00Z"
    }
  ]
}
```

### Feed Index Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `@context` | string | Schema context URL | Yes |
| `@type` | string | Must be "ProductFeedIndex" | Yes |
| `version` | string | Feed format version | Yes |
| `lastUpdated` | string (ISO 8601) | Last update timestamp | Yes |
| `orgid` | string (URN) | Organization identifier | Yes |
| `totalShards` | integer | Number of shard files | Yes |
| `shards` | array | Array of shard references | Yes |

## Shard File Structure

Each shard file contains products in an ItemList format as defined in the [product catalogue schema](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/schema/product-catalogue-schema.json):

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000:sku:789e0123-e89b-12d3-a456-426614174000",
        "sku": "SKU123",
        "name": "Product Name",
        "description": "Product description",
        "category": "Electronics > Computers > Laptops",
        "image": "https://example.com/images/product.jpg",
        "brand": {
          "@type": "Brand",
          "name": "Example Brand",
          "@id": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000",
          "identifier": {
            "@type": "PropertyValue",
            "propertyID": "cmp:brandId",
            "value": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": "299.99",
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

### Required Shard Fields

| Field | Type | Description |
|-------|------|-------------|
| `@context` | string | Must be "https://schema.org" |
| `@type` | string | Must be "ItemList" |
| `itemListElement` | array | Array of ListItem objects containing products |

## Product Object

Based on the [field specification](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/field-spec.md), each product within a ListItem must include:

### Required Product Fields

| Field | Type | Description |
|-------|------|-------------|
| `@type` | string | Must be "Product" |
| `@id` | string (URN) | Unique product URN |
| `sku` | string | Stock keeping unit |
| `name` | string | Product name |
| `description` | string | Marketing description |
| `category` | string | Category path (breadcrumb format) |
| `brand.name` | string | Brand name |
| `offers.price` | string/number | Selling price |
| `offers.priceCurrency` | string | ISO 4217 currency code |
| `offers.availability` | string (URL) | Schema.org availability |

### Optional Product Fields

| Field | Type | Description |
|-------|------|-------------|
| `image` | string/array | Product image URL(s) |
| `offers.inventoryLevel.value` | number | Available quantity |
| `offers.priceValidUntil` | string (date) | Price expiration |
| `offers.priceSpecification` | object | Detailed pricing |
| `additionalProperty` | array | PropertyValue objects for variants |
| `gtin` | string | Global Trade Item Number |
| `mpn` | string | Manufacturer Part Number |
| `weight` | QuantitativeValue | Product weight |

## ProductGroup with Variants

For products with variants, use ProductGroup structure:

```json
{
  "@type": "ListItem",
  "position": 1,
  "item": {
    "@type": "ProductGroup",
    "@id": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000:productgroup:456e7890-e89b-12d3-a456-426614174000",
    "productGroupID": "GROUP123",
    "name": "T-Shirt Collection",
    "description": "Our classic t-shirt in multiple colors and sizes",
    "variesBy": ["color", "size"],
    "url": "https://example.com/products/t-shirt"
  }
},
{
  "@type": "ListItem",
  "position": 2,
  "item": {
    "@type": "Product",
    "@id": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000:sku:abc12345-e89b-12d3-a456-426614174000",
    "sku": "SKU123-BLK-M",
    "name": "Classic T-Shirt - Black - Medium",
    "isVariantOf": {
      "@type": "ProductGroup",
      "@id": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000:productgroup:456e7890-e89b-12d3-a456-426614174000"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "color",
        "value": "Black"
      },
      {
        "@type": "PropertyValue",
        "name": "size",
        "value": "Medium"
      }
    ],
    "offers": {
      "@type": "Offer",
      "price": "29.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
}
```

## Sharding Guidelines

### When to Shard

- **Recommended**: Keep shard files under **2MB** for optimal performance
- **Maximum**: Never exceed 5MB per shard file
- **Products per shard**: Typically 500-1000 products depending on data richness

### Sharding Strategy

1. **Sequential Sharding**: Products are distributed sequentially across shards
2. **File Naming**: Use zero-padded numbers (`feed-001.json`, `feed-002.json`)
3. **Complete Replacement**: Each sync replaces all existing shards
4. **Index Updates**: Always update the main `feed.json` index after sharding

### Implementation Example

```python
import json
import os

MAX_SHARD_SIZE = 2 * 1024 * 1024  # 2MB

def create_sharded_feed(products, output_dir):
    shard_index = 1
    current_shard = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    }
    shards = []
    
    for position, product in enumerate(products, 1):
        list_item = {
            "@type": "ListItem",
            "position": position,
            "item": product
        }
        
        current_shard["itemListElement"].append(list_item)
        
        # Check size and create new shard if needed
        if len(json.dumps(current_shard)) > MAX_SHARD_SIZE:
            # Save current shard
            filename = f"feed-{shard_index:03d}.json"
            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'w') as f:
                json.dump(current_shard, f)
            
            shards.append({
                "url": f"https://example.com/.well-known/cmp/{filename}",
                "lastUpdated": datetime.utcnow().isoformat() + "Z"
            })
            
            # Start new shard
            shard_index += 1
            current_shard = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": []
            }
    
    # Save final shard
    if current_shard["itemListElement"]:
        filename = f"feed-{shard_index:03d}.json"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w') as f:
            json.dump(current_shard, f)
        
        shards.append({
            "url": f"https://example.com/.well-known/cmp/{filename}",
            "lastUpdated": datetime.utcnow().isoformat() + "Z"
        })
    
    # Create index file
    index = {
        "@context": "https://schema.commercemesh.org/v0.1",
        "@type": "ProductFeedIndex",
        "version": "0.1",
        "lastUpdated": datetime.utcnow().isoformat() + "Z",
        "orgid": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000",
        "totalShards": len(shards),
        "shards": shards
    }
    
    with open(os.path.join(output_dir, "feed.json"), 'w') as f:
        json.dump(index, f)
```

## URN Format

CMP uses a hierarchical URN structure for identifiers. See [Identifiers & URN Hierarchy](/docs/architecture/identifiers) for complete documentation.

### Quick Reference

#### Organization URN
```
urn:cmp:org:{org-uuid}
```

#### Brand URN (includes organization)
```
urn:cmp:org:{org-uuid}:brand:{brand-uuid}
```

#### Product URN (includes full hierarchy)
```
urn:cmp:org:{org-uuid}:brand:{brand-uuid}:sku:{sku-uuid}
```

#### ProductGroup URN
```
urn:cmp:org:{org-uuid}:brand:{brand-uuid}:productgroup:{group-uuid}
```

All UUIDs must be generated using UUID v5 with CMP namespace: `4c2d9653-e971-4093-8d5b-82da447c2e85`

## Validation Rules

### Required Validations
1. Valid JSON syntax
2. Valid JSON-LD structure
3. All required fields present
4. Unique SKUs within feed
5. Valid URN format for @id
6. Valid Schema.org URLs
7. ISO formats (dates, currencies)

### Feed Size Limits
- Maximum 2MB per shard (recommended)
- Maximum 5MB per shard (hard limit)
- Use sharding for larger catalogs
- See [hosting guide](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/hosting.md) for details

## Complete Example

### Feed Index (`feed.json`)
```json
{
  "@context": "https://schema.commercemesh.org/v0.1",
  "@type": "ProductFeedIndex",
  "version": "0.1",
  "lastUpdated": "2025-01-21T12:00:00Z",
  "orgid": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000",
  "totalShards": 1,
  "shards": [
    {
      "url": "https://example.com/.well-known/cmp/feed-001.json",
      "lastUpdated": "2025-01-21T12:00:00Z"
    }
  ]
}
```

### Shard File (`feed-001.json`)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000:sku:def45678-e89b-12d3-a456-426614174000",
        "sku": "LAPTOP-PRO-15",
        "name": "Professional Laptop 15-inch",
        "description": "High-performance laptop for professionals",
        "image": "https://example.com/images/laptop.jpg",
        "brand": {
          "@type": "Brand",
          "name": "TechCorp"
        },
        "category": "Electronics > Computers > Laptops",
        "offers": {
          "@type": "Offer",
          "price": "1299.99",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "inventoryLevel": {
            "@type": "QuantitativeValue",
            "value": 25
          }
        }
      }
    }
  ]
}
```

## Next Steps

- [Implementation Guide](/docs/feeds/implementation) - Build your feed with sharding
- [Hosting Guide](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/hosting.md) - Feed hosting requirements
- [Field Specification](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/field-spec.md) - Complete field reference