# Firebase Admin SDK Integration - Complete Implementation

## Overview

This document outlines the complete Firebase Admin SDK integration for the edu-report-v3-nextjs application. The integration provides comprehensive server-side user management capabilities with role-based access control.

## Features Implemented

### 1. Server-Side Authentication & Authorization

#### Authentication Middleware (`src/utils/auth.ts`)
- **`verifyAuthToken(request)`**: Verify Firebase ID tokens from Authorization header
- **`requireAuth(request)`**: Middleware to enforce authentication
- **`requireRole(request, role)`**: Middleware to enforce role-based access control
- **`getUser(request)`**: Optional authentication check

#### Firestore Admin Utilities (`src/utils/firestore-admin.ts`)
- **`getDocument(collection, docId)`**: Get a single document
- **`getCollection(collection, filters?)`**: Get multiple documents with optional filtering
- **`createDocument(collection, data, docId?)`**: Create a new document
- **`updateDocument(collection, docId, data)`**: Update an existing document
- **`deleteDocument(collection, docId)`**: Delete a document
- **`batchWrite(operations)`**: Perform batch write operations

### 2. API Endpoints

#### User Management (`/api/users`)
- **GET /api/users** - List all users (admin only)
- **POST /api/users** - Create new user (admin only)
- **GET /api/users/[uid]** - Get specific user (own profile or admin)
- **PATCH /api/users/[uid]** - Update user (own profile with restrictions or admin)
- **DELETE /api/users/[uid]** - Delete user (admin only)

#### Authentication (`/api/auth`)
- **POST /api/auth/verify** - Verify Firebase ID token
- **POST /api/auth/set-role** - Set custom role claim (admin only)

#### Admin Operations (`/api/admin/users`)
- **POST /api/admin/users/reset-password** - Reset user password (admin only)
- **POST /api/admin/users/generate-password** - Generate secure random password (admin only)

### 3. Client-Side Hooks

#### `useAdminUsers` Hook (`src/hooks/useAdminUsers.tsx`)
Comprehensive hook for admin user management:
- `listUsers()` - List all users
- `getUser(uid)` - Get specific user
- `createUser(userData)` - Create new user
- `updateUser(uid, updates)` - Update user
- `deleteUser(uid)` - Delete user
- `setRole(uid, role)` - Set user role
- `generatePassword(length?)` - Generate secure password
- `resetPassword(uid, newPassword)` - Reset user password

#### `useFirebaseAdmin` Hook (`src/hooks/useFirebaseAdmin.tsx`)
General-purpose Firebase Admin API hook with all CRUD operations

### 4. Admin Dashboard Components

#### Main Page (`src/app/(protected)/(admin)/admin/users/page.tsx`)
- Complete user management interface
- Role-based access control
- Real-time user list with status indicators
- Integrated dialogs for all operations

#### UI Components (`src/app/(protected)/(admin)/admin/users/components/`)

**EnhancedUserTable.tsx**
- Comprehensive user table with sorting
- Status indicators (active/disabled, verified)
- Role badges with color coding
- Creation and last login timestamps
- Quick action buttons

**CreateUserDialog.tsx**
- User creation form
- Email, display name, password, and role fields
- Integrated password generator with show/hide toggle
- Password strength requirements
- Real-time validation

**EditUserDialog.tsx**
- Edit user information
- Email, display name, role
- Email verification toggle
- Account enable/disable toggle
- User metadata display

**ResetPasswordDialog.tsx**
- Password reset functionality
- Integrated password generator
- Password reveal/hide toggle
- Copy to clipboard functionality
- Success state with password display

### 5. Role-Based Access Control (RBAC)

#### Available Roles
- **user** - Standard user with basic permissions
- **moderator** - Enhanced permissions for content moderation
- **admin** - Full system access

#### Permission Levels
1. **Public**: No authentication required
2. **Authenticated**: Valid Firebase token required
3. **Self-Access**: Users can access/modify their own data
4. **Role-Based**: Specific roles required (moderator, admin)
5. **Admin-Only**: Full administrative privileges

### 6. Security Features

#### Token Verification
- Server-side Firebase ID token verification
- Token expiration handling
- Invalid token rejection

#### Authorization
- Role-based access control at API level
- Custom claims for role storage
- Permission validation before operations

#### Password Security
- Minimum 6 character requirement
- Secure random password generation
- Character variety enforcement (uppercase, lowercase, numbers, special)

#### Data Protection
- Users can only view/edit their own profiles (non-admins)
- Admins have full access to all user data
- Sensitive operations require admin role

## API Documentation

### Authentication Header Format
```
Authorization: Bearer <firebase-id-token>
```

### Example API Calls

#### List All Users (Admin)
```bash
curl -X GET https://your-domain.com/api/users \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

#### Create User (Admin)
```bash
curl -X POST https://your-domain.com/api/users \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "displayName": "New User",
    "role": "user"
  }'
```

#### Reset Password (Admin)
```bash
curl -X POST https://your-domain.com/api/admin/users/reset-password \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user-uid-here",
    "newPassword": "NewSecurePass123!"
  }'
```

#### Generate Password (Admin)
```bash
curl -X POST https://your-domain.com/api/admin/users/generate-password \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"length": 12}'
```

## Environment Variables

Add these to your `.env` file:

```env
# Firebase Admin SDK
FIREBASE_ADMIN_TYPE="service_account"
FIREBASE_ADMIN_PROJECT_ID="your-project-id"
FIREBASE_ADMIN_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_ADMIN_CLIENT_ID="your-client-id"
FIREBASE_ADMIN_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_ADMIN_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_ADMIN_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/..."
```

## Testing

### Manual Testing Checklist
- [ ] List all users as admin
- [ ] Create new user with generated password
- [ ] Create new user with custom password
- [ ] Edit user profile
- [ ] Change user role
- [ ] Enable/disable user account
- [ ] Reset user password
- [ ] Delete user
- [ ] Verify non-admin cannot access admin functions
- [ ] Verify users can only edit their own profiles

### API Testing with cURL
See examples in API Documentation section above.

## Best Practices

1. **Always use HTTPS** in production
2. **Rotate Firebase Admin SDK keys** periodically
3. **Audit admin actions** for security compliance
4. **Use role-based access** consistently
5. **Validate input** on both client and server
6. **Handle errors gracefully** with user-friendly messages
7. **Log security events** for monitoring
8. **Test thoroughly** before deploying to production

## Troubleshooting

### Common Issues

**Issue: "Unauthorized - Invalid or missing token"**
- Ensure Authorization header is present
- Verify token hasn't expired
- Check Firebase configuration

**Issue: "Forbidden - Insufficient permissions"**
- Verify user has correct role
- Check custom claims are set
- Ensure role is spelled correctly

**Issue: "Failed to initialize Firebase Admin"**
- Verify all environment variables are set
- Check private key format (newlines properly escaped)
- Ensure Firebase project ID is correct

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review example implementations in `FIREBASE_ADMIN_EXAMPLES.md`
3. Check Firebase Console for user data
4. Review server logs for error messages

---

**Last Updated:** $(date)
**Version:** 1.0.0
**Status:** Production Ready ✅
