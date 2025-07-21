---
sidebar_position: 3
title: Implementation Guide
---

# Feed Implementation Guide

This guide walks you through implementing a CMP product feed for your brand, from database to deployment.

## Planning Your Feed

### 1. Assess Your Catalog
- **Product count**: Determines if sharding is needed
- **Update frequency**: Influences caching strategy
- **Data sources**: Database, PIM, ERP systems
- **Media assets**: Image hosting and CDN needs

### 2. Choose Implementation Approach

#### Static Generation
Best for:
- Small catalogs (< 1000 products)
- Infrequent updates
- Simple hosting

#### Dynamic Generation
Best for:
- Large catalogs
- Frequent updates
- Real-time inventory

#### Hybrid Approach
Best for:
- Medium catalogs
- Scheduled updates
- Balance of performance and freshness

## Implementation Steps

### Step 1: Set Up Data Pipeline

Create a data extraction pipeline from your systems:

```python
# Example: Python feed generator
import json
from datetime import datetime
import hashlib

class CMPFeedGenerator:
    def __init__(self, org_url, org_id):
        self.org_url = org_url
        self.org_id = org_id
        self.products = []
    
    def add_product(self, product_data):
        product = {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": f"{self.org_url}/products/{product_data['sku']}",
            "sku": product_data['sku'],
            "name": product_data['name'],
            "description": product_data['description'],
            "image": product_data['images'],
            "brand": {
                "@type": "Brand",
                "@id": f"{self.org_url}/brand#brand"
            },
            "organization": {
                "@type": "Organization",
                "identifier": {
                    "@type": "PropertyValue",
                    "propertyID": "cmp:orgId",
                    "value": self.org_id
                }
            },
            "offers": {
                "@type": "Offer",
                "price": str(product_data['price']),
                "priceCurrency": product_data['currency'],
                "availability": self.map_availability(product_data['stock'])
            }
        }
        self.products.append(product)
    
    def map_availability(self, stock_level):
        if stock_level > 0:
            return "https://schema.org/InStock"
        return "https://schema.org/OutOfStock"
    
    def generate_feed(self, feed_url):
        return {
            "@context": "https://schema.org",
            "@type": "DataFeed",
            "@id": feed_url,
            "name": f"Product Feed for {self.org_id}",
            "dateModified": datetime.utcnow().isoformat() + "Z",
            "cmp:shardCount": 1,
            "cmp:shardIndex": 0,
            "dataFeedElement": self.products
        }
```

### Step 2: Connect to Your Database

```python
# Example: Database connection
import psycopg2

def fetch_products_from_db():
    conn = psycopg2.connect(
        host="localhost",
        database="ecommerce",
        user="user",
        password="password"
    )
    
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            p.sku, 
            p.name, 
            p.description,
            p.price,
            i.quantity as stock,
            array_agg(pi.image_url) as images
        FROM products p
        JOIN inventory i ON p.id = i.product_id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.active = true
        GROUP BY p.id, i.quantity
    """)
    
    products = []
    for row in cursor.fetchall():
        products.append({
            'sku': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'stock': row[4],
            'images': row[5] or [],
            'currency': 'USD'
        })
    
    cursor.close()
    conn.close()
    return products
```

### Step 3: Implement Sharding (if needed)

For catalogs > 5MB, implement deterministic sharding:

```python
def calculate_shard(sku, shard_count):
    """Deterministic sharding based on SKU hash"""
    hash_value = int(hashlib.md5(sku.encode()).hexdigest(), 16)
    return hash_value % shard_count

def generate_sharded_feeds(products, shard_count, base_url):
    shards = [[] for _ in range(shard_count)]
    
    # Distribute products across shards
    for product in products:
        shard_index = calculate_shard(product['sku'], shard_count)
        shards[shard_index].append(product)
    
    # Generate feed for each shard
    feeds = []
    for i, shard_products in enumerate(shards):
        generator = CMPFeedGenerator("https://example.com", "urn:cmp:orgid:123e4567-e89b-12d3-a456-426614174000")
        for product in shard_products:
            generator.add_product(product)
        
        feed_url = f"{base_url}/feed-{i}.json"
        feed = generator.generate_feed(feed_url)
        feed['cmp:shardCount'] = shard_count
        feed['cmp:shardIndex'] = i
        feeds.append((i, feed))
    
    return feeds
```

### Step 4: Add Rich Content

Enhance your products with additional fields:

```python
def enrich_product(product):
    """Add rich content to product data"""
    enriched = product.copy()
    
    # Add GTIN if available
    if 'gtin' in product:
        enriched['gtin'] = product['gtin']
    
    # Add categories
    if 'category_path' in product:
        enriched['category'] = ' > '.join(product['category_path'])
    
    # Add physical dimensions
    if 'weight' in product:
        enriched['weight'] = {
            "@type": "QuantitativeValue",
            "value": product['weight'],
            "unitCode": "KGM"
        }
    
    # Add custom properties
    if 'attributes' in product:
        enriched['additionalProperty'] = [
            {
                "@type": "PropertyValue",
                "name": attr['name'],
                "value": attr['value']
            }
            for attr in product['attributes']
        ]
    
    return enriched
```

### Step 5: Validate Your Feed

```python
import jsonschema

def validate_feed(feed):
    """Validate feed against CMP schema"""
    # Basic structure validation
    required_fields = ['@context', '@type', '@id', 'dataFeedElement']
    for field in required_fields:
        if field not in feed:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate products
    for product in feed['dataFeedElement']:
        validate_product(product)
    
    return True

def validate_product(product):
    """Validate individual product"""
    required = ['@type', 'sku', 'name', 'description', 'brand', 'offers']
    for field in required:
        if field not in product:
            raise ValueError(f"Product {product.get('sku', 'unknown')} missing: {field}")
    
    # Validate offer
    offer = product['offers']
    if 'price' not in offer or 'priceCurrency' not in offer:
        raise ValueError(f"Invalid offer for product {product['sku']}")
```

### Step 6: Deploy Your Feed

#### Option 1: Static Hosting

```bash
# Generate and upload to S3
python generate_feed.py > feed.json
aws s3 cp feed.json s3://yourbucket/cmp/products/feed.json \
  --content-type application/json \
  --cache-control "public, max-age=3600"
```

#### Option 2: Dynamic API

```python
# Flask example
from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/cmp/products/feed.json')
def product_feed():
    products = fetch_products_from_db()
    generator = CMPFeedGenerator("example-brand", "https://example.com")
    
    for product_data in products:
        generator.add_product(enrich_product(product_data))
    
    feed = generator.generate_feed(request.url)
    
    response = jsonify(feed)
    response.headers['Cache-Control'] = 'public, max-age=3600'
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/cmp/products/feed-<int:shard>.json')
def sharded_feed(shard):
    # Implementation for sharded feeds
    pass
```

### Step 7: Set Up Monitoring

Monitor your feed health:

```python
# Health check endpoint
@app.route('/cmp/health')
def health_check():
    try:
        # Check database connection
        products_count = get_products_count()
        
        # Check feed generation
        test_feed = generate_sample_feed()
        
        return jsonify({
            "status": "healthy",
            "products_count": products_count,
            "last_updated": datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500
```

## Best Practices

### Performance
- Cache feeds with appropriate TTL
- Use CDN for global distribution
- Implement ETags for efficiency
- Compress with gzip

### Reliability
- Implement retry logic
- Use health checks
- Monitor feed availability
- Set up alerts

### Updates
- Update feeds regularly
- Use webhooks for real-time updates
- Implement incremental updates
- Version your feed format

## Common Issues

### Large Catalogs
- Implement sharding
- Use streaming JSON generation
- Consider pagination

### Real-time Inventory
- Use webhooks for updates
- Implement cache invalidation
- Consider event streaming

### Image Optimization
- Use CDN for images
- Provide multiple resolutions
- Implement lazy loading

## Testing Checklist

- [ ] Valid JSON syntax
- [ ] Correct JSON-LD structure
- [ ] All required fields present
- [ ] Unique SKUs
- [ ] Valid URLs (HTTPS)
- [ ] Accessible images
- [ ] Proper sharding (if used)
- [ ] Performance (< 3s load time)
- [ ] Monitoring in place

## Next Steps

- [Validation Guide](/docs/feeds/validation) - Test your feed
- [Webhook Integration](/docs/feeds/webhooks) - Real-time updates
- [Performance Optimization](/docs/feeds/performance) - Speed tips