# Role-Based Access Control (RBAC) Documentation

## User Roles

The system supports three user roles:
1. **user** - Regular pet owner (default role)
2. **vet** - Veterinarian
3. **admin** - System administrator

## Middleware Functions

### verifyToken
- **Purpose**: Verifies Firebase authentication token
- **Usage**: Required for all protected routes
- **Attaches**: `req.user` with uid, email, emailVerified

### optionalAuth
- **Purpose**: Optionally verifies token (works for both authenticated and guest users)
- **Usage**: Routes that have different behavior for authenticated users but work for guests
- **Attaches**: `req.user` (null if guest)

### checkRole(allowedRoles)
- **Purpose**: Verifies user has required role
- **Usage**: Must be used after verifyToken
- **Parameters**: Array of allowed roles e.g., ['admin'], ['vet', 'admin']
- **Attaches**: `req.userRole` and `req.userDoc`
- **Returns**: 403 if user doesn't have required role

## Route Protection Matrix

### Authentication Routes (/api/auth)
| Endpoint | Method | Protection | Allowed Roles |
|----------|--------|------------|---------------|
| /register | POST | Firebase Token Required | All |
| /login | POST | Firebase Token Required | All |
| /me | GET | verifyToken | All authenticated |
| /profile | PUT | verifyToken | All authenticated |
| /account | DELETE | verifyToken | All authenticated |
| /guest-limit | GET | optionalAuth | All (guest or authenticated) |

### Pet Routes (/api/pets)
| Endpoint | Method | Protection | Allowed Roles | Ownership Check |
|----------|--------|------------|---------------|-----------------|
| / | GET | verifyToken | All authenticated | Owner only |
| /:id | GET | verifyToken | All authenticated | Owner only |
| / | POST | verifyToken | All authenticated | - |
| /:id | PUT | verifyToken | All authenticated | Owner only |
| /:id | DELETE | verifyToken | All authenticated | Owner only |
| /:id/medical-records | POST | verifyToken | All authenticated | Owner only |
| /:id/vaccinations | POST | verifyToken | All authenticated | Owner only |

### Vet Routes (/api/vets)
| Endpoint | Method | Protection | Allowed Roles |
|----------|--------|------------|---------------|
| / | GET | Public | - |
| /specializations | GET | Public | - |
| /cities | GET | Public | - |
| /:id | GET | Public | - |
| / | POST | verifyToken + checkRole(['admin']) | admin only |
| /:id | PUT | verifyToken + checkRole(['admin']) | admin only |
| /:id | DELETE | verifyToken + checkRole(['admin']) | admin only |
| /:id/reviews | POST | verifyToken | All authenticated |

### Appointment Routes (/api/appointments)
| Endpoint | Method | Protection | Allowed Roles | Ownership Check |
|----------|--------|------------|---------------|-----------------|
| / | GET | verifyToken | All authenticated | Owner only |
| /:id | GET | verifyToken | All authenticated | Owner/Vet check |
| / | POST | verifyToken | All authenticated | - |
| /:id | PUT | verifyToken | All authenticated | Owner/Vet check |
| /:id/cancel | POST | verifyToken | All authenticated | Owner only |
| /available-slots | GET | verifyToken | All authenticated | - |

### Symptom Checker Routes (/api/symptom-checker)
| Endpoint | Method | Protection | Allowed Roles |
|----------|--------|------------|---------------|
| /analyze | POST | optionalAuth | All (usage limits for guests) |
| /advice | POST | optionalAuth | All |
| /emergency | POST | optionalAuth | All (unlimited) |
| /usage | GET | verifyToken | All authenticated |

### Resource Routes (/api/resources)
| Endpoint | Method | Protection | Allowed Roles |
|----------|--------|------------|---------------|
| / | GET | optionalAuth | All |
| /popular | GET | Public | - |
| /featured | GET | Public | - |
| /categories | GET | Public | - |
| /category/:category | GET | Public | - |
| /:id | GET | optionalAuth | All (published only for non-admin) |
| /:id/like | POST | verifyToken | All authenticated |
| / | POST | verifyToken + checkRole(['admin']) | admin only |
| /:id | PUT | verifyToken + checkRole(['admin']) | admin only |
| /:id | DELETE | verifyToken + checkRole(['admin']) | admin only |
| /:id/publish | PATCH | verifyToken + checkRole(['admin']) | admin only |

## Security Features

### 1. Token Verification
- All Firebase tokens are verified before granting access
- Expired tokens are rejected with proper error messages
- Invalid token formats are caught and handled

### 2. Role-Based Authorization
- User roles are fetched from database (not from token)
- Role checks are performed at middleware level
- Multiple roles can be specified per route

### 3. Ownership Verification
- Pet operations verify pet ownership
- Appointment operations verify user is participant (owner or vet)
- Proper 403/404 responses for unauthorized access

### 4. Guest Access Control
- Symptom checker has usage limits for guests (3 free uses)
- Emergency assessment has unlimited access
- Article viewing is public but liking requires authentication

### 5. Admin Protections
- All admin operations require admin role
- Vet CRUD operations are admin-only
- Article management is admin-only
- User role modifications (future) will be admin-only

## Implementation Status

✅ **Completed:**
- verifyToken middleware with Firebase integration
- checkRole middleware with database role verification
- optionalAuth middleware for mixed access routes
- All routes properly protected with appropriate middleware
- Ownership verification in pet and appointment controllers
- Admin-only routes for sensitive operations

✅ **Best Practices Applied:**
- Middleware chaining for clean route definitions
- Centralized authentication logic
- Consistent error responses
- Role information attached to request object
- Database role verification (not token-based)

## Testing Checklist

- [ ] Test authenticated user accessing own resources
- [ ] Test authenticated user accessing other user's resources (should fail)
- [ ] Test guest user accessing public routes
- [ ] Test guest user accessing protected routes (should fail)
- [ ] Test admin accessing admin routes
- [ ] Test non-admin accessing admin routes (should fail)
- [ ] Test token expiration handling
- [ ] Test invalid token format handling
- [ ] Test missing authorization header
- [ ] Test role switching (if user role is changed in database)

## Future Enhancements

1. **Granular Permissions**
   - Add permissions array to User model
   - Create permission-based middleware
   - Example: canManageVets, canModerateReviews, canViewAnalytics

2. **Vet-Specific Routes**
   - Add checkRole(['vet', 'admin']) to vet dashboard routes
   - Allow vets to manage their own profile
   - Allow vets to view and respond to their appointments

3. **Multi-Factor Authentication**
   - Add MFA support for admin accounts
   - Require additional verification for sensitive operations

4. **Audit Logging**
   - Log all admin actions
   - Log all role changes
   - Log all sensitive data access

5. **Rate Limiting Per Role**
   - Different rate limits for different roles
   - Higher limits for authenticated users
   - Stricter limits for guests
