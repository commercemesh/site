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
      "schema": "https://schema.org",
      "cmp": "https://schema.commercemesh.ai/ns#"
    },
    "@type": "Organization",
    "name": "TechFlow Solutions",
    "description": "TechFlow Solutions is a leading technology company specializing in software development and digital innovation.",
    "url": "https://techflowsolutions.com",
    "logo": "https://example.com/logos/techflow-logo.png",
    "brand": {
        "@type": "Brand",
        "name": "TechFlow",
        "logo": "https://example.com/logos/techflow-brand-logo.png",
        "identifier": {
            "@type": "PropertyValue",
            "propertyID": "cmp:brandId",
            "value": "urn:cmp:brand:987fcdeb-51a2-43d1-b789-987654321000"
        }
    },
    "sameAs": [
      "https://www.instagram.com/techflowsolutions",
      "https://www.facebook.com/TechFlowSolutions",
      "https://www.linkedin.com/company/techflow-solutions"
    ],
    "cmp:category": [
      "technology",
      "software",
      "digital-services"
    ],
    "cmp:productFeed": {
      "@type": "DataFeed",
      "url": "https://techflowsolutions.com/.well-known/cmp/feed-index.json"
    },
    "identifier": {
        "@type": "PropertyValue",
        "propertyID": "cmp:orgId",
        "value": "urn:cmp:orgid:987fcdeb-51a2-43d1-b789-987654321000"
    }
  }
```

## Step 3: Create Your Product Feed

Create a product feed following the [product feed specification](https://github.com/commercemesh/commercemesh/blob/main/spec/product-feed/v0.1/README.md):

```json
{
{
  "@context": {
    "schema": "https://schema.org",
    "cmp": "https://schema.commercemesh.ai/ns#"
  },
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "urn:cmp:sku:WH-1000XM5-BLACK",
        "name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        "sku": "WH-1000XM5-BLACK",
        "description": "Industry-leading noise canceling with Dual Noise Sensor technology. Up to 30-hour battery life with quick charge.",
        "image": "https://example.com/images/wh1000xm5-main.jpg",
        "brand": {
          "@type": "Brand",
          "name": "Sony"
        },
        "category": "Electronics > Audio > Headphones",
        "offers": {
          "@type": "Offer",
          "price": 399.99,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "inventoryLevel": {
            "@type": "QuantitativeValue",
            "value": 25
          },
          "priceValidUntil": "2025-12-31T23:59:59Z",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": 399.99,
            "priceCurrency": "USD"
          }
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Color",
            "value": "Black"
          },
          {
            "@type": "PropertyValue",
            "name": "Wireless Technology",
            "value": "Bluetooth"
          },
          {
            "@type": "PropertyValue",
            "name": "Battery Life",
            "value": "30 hours"
          },
          {
            "@type": "PropertyValue",
            "name": "Weight",
            "value": "250g"
          }
        ],
        "isVariantOf": {
          "@type": "ProductGroup",
          "@id": "urn:cmp:product:WH-1000XM5"
        },
         "image": [
          {
            "@type": "ImageObject",
            "url": "https://example.com/images/wh1000xm5-main.jpg",
            "caption": "Sony WH-1000XM5 headphones front view",
            "name": "Main Product Image",
            "width": 1200,
            "height": 800,
            "encodingFormat": "image/jpeg"
          },
          {
            "@type": "ImageObject",
            "url": "https://example.com/images/wh1000xm5-side.jpg",
            "caption": "Sony WH-1000XM5 headphones side view",
            "name": "Side View",
            "width": 1200,
            "height": 800,
            "encodingFormat": "image/jpeg"
          }
        ]
        "@cmp:media": [
          {
            "@type": "VideoObject",
            "url": "https://example.com/videos/wh1000xm5-demo.mp4",
            "name": "Product Demo Video",
            "description": "Demonstration of noise canceling features",
            "thumbnailUrl": "https://example.com/images/video-thumb.jpg",
            "duration": "PT2M45S",
            "encodingFormat": "video/mp4",
            "uploadDate": "2025-06-01"
          }
        ]
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@context": "https://schema.org",
        "@type": "ProductGroup",
        "@id": "urn:cmp:product:IPHONE-15-PRO",
        "name": "iPhone 15 Pro",
        "description": "iPhone 15 Pro. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system ever.",
        "brand": {
          "@type": "Brand",
          "name": "Apple"
        },
        "category": "Electronics > Mobile Phones > Smartphones",
        "productGroupID": "IPHONE-15-PRO",
        "variesBy": [
          "Color",
          "Storage Capacity"
        ],
        "@cmp:media": [
          {
            "@type": "ImageObject",
            "url": "https://example.com/images/iphone15pro-group.jpg",
            "caption": "iPhone 15 Pro in all available colors",
            "name": "Product Group Image",
            "width": 1400,
            "height": 900,
            "encodingFormat": "image/jpeg"
          },
          {
            "@type": "VideoObject",
            "url": "https://example.com/videos/iphone15pro-features.mp4",
            "name": "iPhone 15 Pro Features Overview",
            "description": "Complete overview of iPhone 15 Pro features and capabilities",
            "thumbnailUrl": "https://example.com/images/iphone-video-thumb.jpg",
            "duration": "PT3M20S",
            "encodingFormat": "video/mp4",
            "width": 1920,
            "height": 1080,
            "uploadDate": "2025-05-15"
          }
        ]
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "urn:cmp:sku:IPHONE-15-PRO-128-NATURAL",
        "name": "iPhone 15 Pro 128GB Natural Titanium",
        "sku": "IPHONE-15-PRO-128-NATURAL",
        "description": "iPhone 15 Pro with 128GB storage in Natural Titanium finish. Features A17 Pro chip and Pro camera system.",
        "image": "https://example.com/images/iphone15pro-natural-main.jpg",
        "brand": {
          "@type": "Brand",
          "name": "Apple"
        },
        "category": "Electronics > Mobile Phones > Smartphones",
        "offers": {
          "@type": "Offer",
          "price": 999.00,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "inventoryLevel": {
            "@type": "QuantitativeValue",
            "value": 15
          },
          "priceValidUntil": "2025-12-31T23:59:59Z"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Color",
            "value": "Natural Titanium"
          },
          {
            "@type": "PropertyValue",
            "name": "Storage Capacity",
            "value": "128GB"
          },
          {
            "@type": "PropertyValue",
            "name": "Display Size",
            "value": "6.1 inches"
          },
          {
            "@type": "PropertyValue",
            "name": "Processor",
            "value": "A17 Pro"
          }
        ],
        "isVariantOf": {
          "@type": "ProductGroup",
          "@id": "urn:cmp:product:IPHONE-15-PRO"
        },
        "@cmp:media": [
          {
            "@type": "ImageObject",
            "url": "https://example.com/images/iphone15pro-natural-front.jpg",
            "caption": "iPhone 15 Pro Natural Titanium front view",
            "name": "Front View",
            "width": 1000,
            "height": 1200,
            "encodingFormat": "image/jpeg"
          },
          {
            "@type": "ImageObject",
            "url": "https://example.com/images/iphone15pro-natural-back.jpg",
            "caption": "iPhone 15 Pro Natural Titanium back view",
            "name": "Back View",
            "width": 1000,
            "height": 1200,
            "encodingFormat": "image/jpeg"
          },
          {
            "@type": "MediaObject",
            "url": "https://example.com/media/iphone15pro-360view.html",
            "name": "360° Interactive View",
            "description": "Interactive 360-degree product view",
            "encodingFormat": "text/html"
          }
        ]
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
curl "https://api.commercemesh.org/v1/products?q=your+product"

# Get a specific product
curl "https://api.commercemesh.org/v1/products/urn:cmp:product:YOUR-BRAND-ID:SKU123"

# Send a view event
curl -X POST "https://api.commercemesh.org/v1/events" \
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

- Join our [Discord community](https://discord.com/channels/1381756773563633786h)
- Check the [FAQ](/docs/faq)
- Email us at specs@commercemesh.ai