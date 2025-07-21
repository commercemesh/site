---
sidebar_position: 3
title: Well-Known URIs
---

# Well-Known URIs for CMP

The Commerce Mesh Protocol uses the `.well-known` URI path for standardized discovery of feeds and protocol information. This follows [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615.html) for well-known URIs.

## Standard Feed Location

All CMP participants should host their product feed index at:

```
https://yourdomain.com/.well-known/cmp/feed.json
```

## Benefits of Standardized Location

1. **Automatic Discovery**: AI agents and discovery nodes can find feeds without configuration
2. **Simplified Integration**: No need to register feed URLs separately
3. **Consistent Experience**: All CMP participants use the same pattern
4. **Protocol Compliance**: Follows web standards for metadata discovery

## Directory Structure

```
/.well-known/
└── cmp/
    ├── feed.json          # Main feed index
    ├── feed-001.json      # Shard file 1
    ├── feed-002.json      # Shard file 2
    └── ...                # Additional shards
```

## Implementation Examples

### Apache Configuration
```apache
# Ensure .well-known is accessible
<Directory /var/www/html/.well-known>
    Require all granted
    Options -Indexes
</Directory>

# Set correct content type
<FilesMatch "\.json$">
    Header set Content-Type "application/json"
</FilesMatch>
```

### Nginx Configuration
```nginx
location /.well-known/cmp/ {
    alias /var/www/cmp/;
    add_header Content-Type application/json;
    add_header Access-Control-Allow-Origin *;
}
```

### Express.js Route
```javascript
app.use('/.well-known/cmp', express.static('feeds', {
    setHeaders: (res, path) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=3600');
    }
}));
```

## CORS Configuration

Enable CORS for your `.well-known/cmp/` directory to allow cross-origin access:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
Access-Control-Max-Age: 86400
```

## Discovery Process

Here's how discovery nodes find your feed:

1. **Domain Resolution**: Start with your registered domain (e.g., `example.com`)
2. **Well-Known Path**: Append `/.well-known/cmp/feed.json`
3. **HTTPS Request**: Make secure request to `https://example.com/.well-known/cmp/feed.json`
4. **Parse Index**: Read feed index to find shard locations
5. **Fetch Shards**: Download individual shard files as needed

## Testing Your Setup

Verify your feed is accessible:

```bash
# Test feed accessibility
curl -I https://yourdomain.com/.well-known/cmp/feed.json

# Check CORS headers
curl -H "Origin: https://example.com" \
     -I https://yourdomain.com/.well-known/cmp/feed.json

# Validate JSON
curl https://yourdomain.com/.well-known/cmp/feed.json | jq .
```

## Security Considerations

1. **HTTPS Only**: Always serve feeds over HTTPS
2. **No Authentication**: Well-known feeds should be publicly accessible
3. **Rate Limiting**: Implement reasonable rate limits to prevent abuse
4. **Cache Headers**: Use appropriate cache headers to reduce load

## Future Extensions

The `.well-known/cmp/` directory may be extended with:

- `manifest.json` - Protocol capabilities and versions
- `trust.json` - Trust signals and certifications
- `webhooks.json` - Real-time update endpoints

## See Also

- [Feed Specification](/docs/feeds/specification)
- [Implementation Guide](/docs/feeds/implementation)
- [RFC 8615 - Well-Known URIs](https://www.rfc-editor.org/rfc/rfc8615.html)