# CORS Configuration Guide

## Overview

Cross-Origin Resource Sharing (CORS) is configured in the HappyTails backend to allow the frontend application to make API requests from a different origin (domain/port).

## Current Configuration

### Development Environment

The backend is configured to accept requests from the following origins by default:

```
http://localhost:8080  (Vite default dev server)
http://localhost:3000  (Create React App default)
http://localhost:5173  (Vite alternate port)
```

### Configuration Location

CORS is configured in `backend/server.js` at lines 89-109:

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
}));
```

## Environment Variables

### Backend (.env)

```env
# Development - allows multiple local dev servers
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000,http://localhost:5173

# Production - add your production domain(s)
ALLOWED_ORIGINS=https://happytails.vercel.app,https://www.happytails.com
```

### Frontend (.env)

The frontend must point to a backend URL that has allowed the frontend's origin:

```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api

# Production
VITE_API_BASE_URL=https://api.happytails.com/api
```

## Production Deployment

### Step 1: Deploy Frontend

1. Deploy your frontend to a hosting service (Vercel, Netlify, etc.)
2. Note the production URL (e.g., `https://happytails.vercel.app`)

### Step 2: Update Backend CORS

1. Add the production frontend URL to `ALLOWED_ORIGINS` in backend `.env`:
   ```env
   ALLOWED_ORIGINS=https://happytails.vercel.app
   ```

2. If you have multiple domains (www, non-www, staging), add them all:
   ```env
   ALLOWED_ORIGINS=https://happytails.vercel.app,https://www.happytails.com,https://staging.happytails.com
   ```

### Step 3: Update Frontend API URL

Update the frontend `.env.production` or deployment environment variables:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Testing CORS

### Test with curl

```bash
# Test CORS preflight (OPTIONS request)
curl -X OPTIONS http://localhost:5000/api/auth/me \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v

# Should return:
# Access-Control-Allow-Origin: http://localhost:8080
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization
```

### Test from Browser Console

```javascript
// In your frontend app's browser console
fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Authorization': 'Bearer your_token_here'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('CORS Error:', error));
```

## Troubleshooting

### Error: "CORS policy does not allow access from the specified origin"

**Cause:** The frontend origin is not in the `ALLOWED_ORIGINS` list.

**Solution:**
1. Check the frontend URL in the browser (e.g., `http://localhost:8080`)
2. Add it to `ALLOWED_ORIGINS` in backend `.env`
3. Restart the backend server

### Error: "No 'Access-Control-Allow-Origin' header is present"

**Cause:** CORS middleware is not applied or backend is not running.

**Solution:**
1. Ensure backend server is running
2. Check that CORS middleware is loaded in `server.js`
3. Verify the request is reaching the backend (check backend logs)

### Error: "Preflight request failed"

**Cause:** OPTIONS request is being blocked or not handled correctly.

**Solution:**
1. Ensure OPTIONS method is included in CORS methods
2. Check that no middleware is blocking OPTIONS requests
3. Verify `credentials: true` is set if using cookies/auth headers

## Security Considerations

### Development
- Allow multiple localhost ports for flexibility
- Credentials are enabled for authentication testing

### Production
- **Only allow your actual production domain(s)**
- Never use wildcards (`*`) in production with credentials
- Use HTTPS for all production origins
- Regularly audit allowed origins list

### Best Practices
1. **Explicit Origins**: Always list specific origins, never use `*` with credentials
2. **Environment-Specific**: Different `ALLOWED_ORIGINS` for dev, staging, production
3. **HTTPS Only**: In production, only allow HTTPS origins
4. **Minimal Exposure**: Only allow necessary headers and methods
5. **Regular Updates**: Remove old/unused origins from the list

## Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Package](https://www.npmjs.com/package/cors)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)

## Support

If you encounter CORS issues:
1. Check browser console for specific error messages
2. Verify environment variables are set correctly
3. Ensure both frontend and backend are running
4. Check network tab to see if requests are being sent
5. Contact the development team with error logs
