---
sidebar_position: 2
title: Identifiers & URN Hierarchy
---

# Identifiers & URN Hierarchy

The Commerce Mesh Protocol uses a hierarchical URN (Uniform Resource Name) structure to uniquely identify organizations, brands, and products. This hierarchy ensures global uniqueness while maintaining clear relationships between entities.

## URN Hierarchy Structure

CMP follows a strict hierarchy for identifiers:

```
Organization → Brand → SKU
```

Each level in the hierarchy includes the parent's identifier, creating a clear ownership chain.

## URN Formats

### Organization URN

Organizations are identified by a UUID generated from their domain:

```
urn:cmp:org:{org-uuid}
```

Example:
```
urn:cmp:org:123e4567-e89b-12d3-a456-426614174000
```

### Brand URN

Brands are scoped to organizations and include the parent organization's UUID:

```
urn:cmp:org:{org-uuid}:brand:{brand-uuid}
```

Example:
```
urn:cmp:org:123e4567-e89b-12d3-a456-426614174000:brand:550e8400-e29b-41d4-a716-446655440000
```

### Product/SKU URN

Products are scoped to brands and include the full hierarchy:

```
urn:cmp:org:{org-uuid}:brand:{brand-uuid}:sku:{sku-uuid}
```

Example:
```
urn:cmp:org:123e4567-e89b-12d3-a456-426614174000:brand:550e8400-e29b-41d4-a716-446655440000:sku:f47ac10b-58cc-4372-a567-0e02b2c3d479
```

## UUID Generation

All UUIDs in CMP identifiers must be generated using UUID v5 with the CMP namespace:

```
CMP Namespace UUID: 4c2d9653-e971-4093-8d5b-82da447c2e85
```

### UUID v5 Generation Examples

#### Python Example
```python
import uuid

CMP_NAMESPACE = uuid.UUID('4c2d9653-e971-4093-8d5b-82da447c2e85')

# Generate organization UUID from domain
org_domain = "acmecorp.com"
org_uuid = uuid.uuid5(CMP_NAMESPACE, org_domain)
# Result: 123e4567-e89b-12d3-a456-426614174000

# Generate brand UUID
brand_name = "Acme Premium Products"
brand_uuid = uuid.uuid5(CMP_NAMESPACE, brand_name)
# Result: 550e8400-e29b-41d4-a716-446655440000

# Generate SKU UUID
sku_name = "LAPTOP-PRO-15"
sku_uuid = uuid.uuid5(CMP_NAMESPACE, sku_name)
# Result: f47ac10b-58cc-4372-a567-0e02b2c3d479
```

#### JavaScript Example
```javascript
import { v5 as uuidv5 } from 'uuid';

const CMP_NAMESPACE = '4c2d9653-e971-4093-8d5b-82da447c2e85';

// Generate organization UUID from domain
const orgDomain = "acmecorp.com";
const orgUuid = uuidv5(orgDomain, CMP_NAMESPACE);

// Generate brand UUID
const brandName = "Acme Premium Products";
const brandUuid = uuidv5(brandName, CMP_NAMESPACE);

// Generate SKU UUID
const skuName = "LAPTOP-PRO-15";
const skuUuid = uuidv5(skuName, CMP_NAMESPACE);
```

## Complete Example

Here's how the hierarchy works in practice:

### 1. Organization Registration
```json
{
  "@type": "Organization",
  "@id": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000",
  "name": "Acme Corporation",
  "url": "https://acmecorp.com"
}
```

### 2. Brand Registration
```json
{
  "@type": "Brand",
  "@id": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000:brand:550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Premium Products",
  "parentOrganization": {
    "@type": "Organization",
    "@id": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000"
  }
}
```

### 3. Product with Full Hierarchy
```json
{
  "@type": "Product",
  "@id": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000:brand:550e8400-e29b-41d4-a716-446655440000:sku:f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "sku": "LAPTOP-PRO-15",
  "name": "Professional Laptop 15-inch",
  "brand": {
    "@type": "Brand",
    "@id": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000:brand:550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Premium Products"
  },
  "manufacturer": {
    "@type": "Organization",
    "@id": "urn:cmp:org:123e4567-e89b-12d3-a456-426614174000",
    "name": "Acme Corporation"
  }
}
```

## Benefits of Hierarchical URNs

1. **Clear Ownership**: The hierarchy immediately shows which organization owns which brand and which brand owns which product
2. **Collision Prevention**: By including parent identifiers, we prevent naming collisions across different organizations
3. **Simplified Discovery**: Discovery nodes can efficiently filter by organization or brand
4. **Trust Propagation**: Trust signals can flow through the hierarchy (org → brand → product)

## Migration Path

For existing systems migrating to CMP:

1. **Legacy SKUs**: Can be used as the source for UUID v5 generation
2. **Multiple Brands**: Each brand gets its own UUID within the organization's namespace
3. **Private Labels**: Retailers can create their own brand URNs under their organization

## Validation Rules

1. All URNs must follow the exact format specified
2. UUIDs must be valid UUID v5 generated with CMP namespace
3. Organization domains must be valid and owned by the registrant
4. Brand and SKU URNs must include valid parent identifiers

## See Also

- [Brand Registry](/docs/registry/overview) - How to register brands
- [Product Feeds](/docs/feeds/specification) - Using URNs in product feeds
- [Trust Nodes](/docs/trust/overview) - How trust flows through the hierarchy