---
sidebar_position: 1
title: Overview
---

# Brand Registry Overview

The CMP Brand Registry is a decentralized directory of brands participating in the Commerce Mesh Protocol. It serves as the foundation for product discovery and trust across the network.

> 📄 **Official Specification**: [github.com/commercemesh/commercemesh/tree/main/spec/brand-registry/v0.1](https://github.com/commercemesh/commercemesh/tree/main/spec/brand-registry/v0.1)

## What is the Brand Registry?

The Brand Registry is a JSON-LD formatted collection of brand entries that:

- **Identifies** brands uniquely across the network using URNs
- **Links** to product feeds and brand information
- **Establishes** trust through verified brand data
- **Enables** discovery by AI agents and applications

## Registry Structure

The registry is maintained as a simple JSON array in the CMP repository:

```
/registry/
  ├── brands.json          # Main registry file
  ├── example/            # Example entries
  │   └── brands.json     # Sample brand entry
  └── schema/             # Schema documentation
      └── schema.md       # Field specifications
```

## Brand Entry Format

Based on the [official schema](https://github.com/commercemesh/commercemesh/blob/main/spec/brand-registry/v0.1/schema/brand-registry-schema.jsonld), each entry follows this structure:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "cmp": "https://schema.commercemesh.ai/ns#"
  },
  "@type": "Organization",
  "name": "Example Brand",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "Brief description of the organization",
  "cmp:brandId": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000",
  "cmp:productFeed": {
    "@type": "DataFeed",
    "url": "https://example.com/cmp/products/feed.json"
  },
  "cmp:category": ["electronics", "computers"],
  "brand": {
    "@type": "Brand",
    "name": "Example Brand",
    "logo": "https://example.com/brand-logo.png",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "cmp:brandId",
      "value": "urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000"
    }
  },
  "sameAs": [
    "https://twitter.com/example",
    "https://linkedin.com/company/example"
  ]
}
```

## Required Fields

According to the [brand registry schema](https://github.com/commercemesh/commercemesh/blob/main/spec/brand-registry/v0.1/README.md):

| Field | Type | Description |
|-------|------|-------------|
| `@context` | object/string | Schema context (can be string "https://schema.org" or object with namespaces) |
| `@type` | string | Must be "Organization" |
| `name` | string | Brand's display name |
| `url` | string | Canonical domain URL |
| `logo` | string (URI) | URL to brand logo |
| `cmp:productFeed` | object | DataFeed object with url property |
| `cmp:brandId` | string (URN) | Unique brand identifier |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Organization description |
| `cmp:category` | array | Business category slugs |
| `cmp:did` | string | Decentralized Identifier |
| `brand` | object | Nested brand information |
| `sameAs` | array | Social media profile URLs |
| `identifier` | object | Additional identifiers (e.g., cmp:orgId) |

## Key Concepts

### URN Identifiers

CMP uses a hierarchical URN (Uniform Resource Name) format for unique identification. See [Identifiers & URN Hierarchy](/docs/architecture/identifiers) for complete documentation.

Quick reference:
- Organization: `urn:cmp:org:{domain}`
- Brand: `urn:cmp:org:{domain}:brand:{uuid}`
- Product: `urn:cmp:org:{domain}:brand:{uuid}:sku:{uuid}`

All UUIDs are generated using UUID v5 with the CMP namespace: `4c2d9653-e971-4093-8d5b-82da447c2e85`

### Product Feed Reference

The `cmp:productFeed` field is an object, not just a URL:

```json
"cmp:productFeed": {
  "@type": "DataFeed",
  "url": "https://example.com/cmp/products/feed.json"
}
```

### Category Taxonomy

Categories use lowercase slugs from a predefined taxonomy:
- `electronics`, `fashion`, `home`, `books`, etc.

## How It Works

1. **Brand Registration** - Brands submit their entry following the schema
2. **Validation** - Entries are validated against the official schema
3. **Publication** - Approved entries are added to brands.json
4. **Discovery** - Applications query the registry to find brands
5. **Integration** - Product feeds are accessed via the registered URLs

## Registry Access

### Fetching the Registry

```javascript
const registry = await fetch(
  'https://raw.githubusercontent.com/commercemesh/commercemesh/main/registry/brands.json'
).then(r => r.json());
```

### Filtering Brands

```javascript
// Find by category
const electronicsbrands = registry.filter(org => 
  org['cmp:category']?.includes('electronics')
);

// Find by brand ID
const brand = registry.find(org => 
  org['cmp:brandId'] === 'urn:cmp:org:example.com:brand:123e4567-e89b-12d3-a456-426614174000'
);
```

## Next Steps

- [Registration Guide](/docs/registry/registration) - Step-by-step registration process
- [Schema Reference](https://github.com/commercemesh/commercemesh/blob/main/spec/brand-registry/v0.1/schema/brand-registry-schema.jsonld) - Official schema definition
- [Example Entry](https://github.com/commercemesh/commercemesh/blob/main/spec/brand-registry/v0.1/schema/example.jsonld) - Complete example from spec