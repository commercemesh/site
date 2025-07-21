---
sidebar_position: 2
title: Registration Guide
---

# Brand Registration Guide

This guide walks you through registering your organization in the CMP Brand Registry.

## Prerequisites

Before registering, ensure you have:

- ✅ A verified organization website with HTTPS
- ✅ Product catalog ready for feed creation
- ✅ Organization logo URL (preferably SVG or high-resolution PNG)
- ✅ GitHub account for submission
- ✅ Node.js or Python for generating URN identifiers

## Step 1: Generate Your URN Identifier

CMP uses UUID v5 with a specific namespace to generate unique organization identifiers. You must generate your URN using your canonical domain.

### CMP Namespace
```
4c2d9653-e971-4093-8d5b-82da447c2e85
```

### JavaScript Method
```javascript
import { v5 as uuid } from 'uuid';

const CMP_NAMESPACE = '4c2d9653-e971-4093-8d5b-82da447c2e85'; 
                       
const generateOrgId = (domain) => {
  const orgUuid = uuid(domain, CMP_NAMESPACE);
  return `urn:cmp:orgid:${orgUuid}`;
};

// Example
const orgId = generateOrgId('example.com');
// Returns: urn:cmp:orgid:123e4567-e89b-12d3-a456-426614174000
```

### Python Method
```python
import uuid

CMP_NAMESPACE = uuid.UUID("4c2d9653-e971-4093-8d5b-82da447c2e85")

def generate_org_id(domain):
    urn_id = uuid.uuid5(CMP_NAMESPACE, domain)
    return f"urn:cmp:orgid:{urn_id}"

# Example
org_id = generate_org_id("example.com")
# Returns: urn:cmp:orgid:123e4567-e89b-12d3-a456-426614174000
```

## Step 2: Prepare Your Organization Information

Gather the following required information:

- **Organization name** - As it appears officially
- **Description** - Brief description of your organization
- **URL** - Your canonical domain (must match URN generation)
- **Logo** - Direct URL to your logo image
- **Categories** - Business categories (e.g., "fashion", "electronics", "books")
- **Product Feed URL** - Where your CMP product feed will be hosted

Optional information:
- **Brand details** - Specific brand name and logo if different from organization
- **Contact point** - Customer service email
- **Social profiles** - Links to social media
- **Physical address** - Business location

## Step 3: Create Your Registry Entry

Create your organization entry following the CMP schema:

```json
{
  "@context": {
    "schema": "https://schema.org",
    "cmp": "https://schema.commercemesh.ai/ns#"
  },
  "@type": "Organization",
  "name": "Your Organization Name",
  "description": "Brief description of your organization and what you offer",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "cmp:orgId",
    "value": "urn:cmp:orgid:YOUR-GENERATED-UUID"
  },
  "brand": {
    "@type": "Brand",
    "name": "Your Brand Name",
    "logo": "https://example.com/brand-logo.png"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@example.com"
  },
  "sameAs": [
    "https://twitter.com/yourbrand",
    "https://instagram.com/yourbrand",
    "https://linkedin.com/company/yourbrand"
  ],
  "cmp:category": ["electronics", "computers"],
  "cmp:productFeed": "https://example.com/cmp/products/feed.json"
}
```

## Step 4: Validate Your Entry

Before submission, validate your organization entry:

### Required Fields Checklist
- ✅ `@type` is "Organization"
- ✅ `name` is provided
- ✅ `description` is meaningful
- ✅ `url` matches domain used for URN
- ✅ `logo` URL is accessible
- ✅ `identifier` contains valid URN
- ✅ `cmp:category` is an array
- ✅ `cmp:productFeed` URL is planned/ready

### JSON Validation
```bash
# Check JSON syntax
cat your-org.json | jq .

# Validate all URLs are HTTPS
cat your-org.json | jq -r '.. | strings | select(startswith("http://"))'
```

## Step 5: Fork the Repository

1. Go to [github.com/commercemesh/commercemesh](https://github.com/commercemesh/commercemesh)
2. Click "Fork" in the top right
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/commercemesh.git
cd commercemesh
```

## Step 6: Add Your Organization

1. Open `/registry/brands.json`
2. Add your organization entry to the JSON array
3. Maintain proper JSON formatting (comma after previous entry)

Example addition:
```json
[
  {
    // ... existing organization
  },
  {
    "@context": {
      "schema": "https://schema.org",
      "cmp": "https://schema.commercemesh.ai/ns#"
    },
    "@type": "Organization",
    "name": "Your Organization",
    // ... your complete entry
  }
]
```

## Step 7: Test Your Changes

Validate the updated registry:

```bash
# Validate JSON syntax
jq . registry/brands.json > /dev/null

# Check for duplicate organization IDs
jq -r '.[].identifier.value' registry/brands.json | sort | uniq -d

# Verify your entry
jq '.[] | select(.name == "Your Organization")' registry/brands.json
```

## Step 8: Submit Pull Request

1. Commit your changes:
```bash
git add registry/brands.json
git commit -m "Add [Your Organization Name] to brand registry"
git push origin main
```

2. Create pull request:
   - Go to your fork on GitHub
   - Click "Pull Request"
   - Title: "Add [Organization Name] to registry"
   - Description: Include your organization details and product feed status

## Step 9: Review Process

Your submission will undergo review for:

- ✅ Valid JSON-LD format
- ✅ Unique organization identifier
- ✅ Domain ownership (future automation)
- ✅ Accessible URLs
- ✅ Appropriate content
- ✅ Product feed validation (when available)

## Post-Registration

After approval:

1. **Implement Product Feed** - Create your feed at the specified URL
2. **Test Discovery** - Verify your products appear in CMP searches
3. **Monitor Feed Health** - Ensure feed stays accessible
4. **Update as Needed** - Submit PRs for any changes

## Fetching Registry Data

To access the registry programmatically:

```javascript
// Fetch all organizations
const organizations = await fetch(
  'https://raw.githubusercontent.com/commercemesh/commercemesh/main/registry/brands.json'
).then(r => r.json());

// Find specific category
const bookPublishers = organizations.filter(org => 
  org['cmp:category']?.includes('books')
);

// Find by domain
const myOrg = organizations.find(org => 
  org.url === 'https://example.com'
);
```

## Common Issues

### Invalid URN
Ensure you use your canonical domain (without www or subdomains) when generating the URN.

### Duplicate Organization
Check if your organization is already registered before submitting.

### Feed Not Ready
You can register before your feed is live, but implement it soon after approval.

## Need Help?

- Check [Schema Reference](/docs/registry/schema)
- Join [Discord](https://discord.gg/commercemesh)
- Email specs@commercemesh.ai