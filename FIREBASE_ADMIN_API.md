# Firebase Admin SDK API Documentation

This document describes the Firebase Admin SDK integration and available API endpoints.

## Overview

The project uses Firebase Admin SDK for server-side operations including:
- User authentication verification
- User management (CRUD operations)
- Role-based access control (RBAC)
- Firestore database operations

## Configuration

Firebase Admin SDK is configured in `src/firebase/admin.ts` using environment variables from `.env`:

```env
FIREBASE_ADMIN_TYPE="service_account"
FIREBASE_ADMIN_PROJECT_ID="your-project-id"
FIREBASE_ADMIN_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_ADMIN_CLIENT_ID="your-client-id"
FIREBASE_ADMIN_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_ADMIN_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_ADMIN_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/..."
```

## Authentication

All protected API endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### Getting a Token (Client-side)

```typescript
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const token = await user.getIdToken();
  // Use this token in API requests
}
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/verify
Verify a Firebase ID token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "uid": "user-uid",
    "email": "user@example.com",
    "role": "admin",
    "emailVerified": true
  }
}
```

#### POST /api/auth/set-role
Set custom role for a user (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "uid": "user-uid",
  "role": "admin"
}
```

**Response:**
```json
{
  "message": "Role set successfully",
  "uid": "user-uid",
  "role": "admin"
}
```

### User Management Endpoints

#### GET /api/users
List all users (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "users": [
    {
      "uid": "user-uid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "emailVerified": true,
      "customClaims": {
        "role": "user"
      }
    }
  ]
}
```

#### POST /api/users
Create a new user (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "displayName": "New User",
  "role": "user"
}
```

**Response:**
```json
{
  "user": {
    "uid": "new-user-uid",
    "email": "newuser@example.com",
    "displayName": "New User",
    "role": "user"
  }
}
```

#### GET /api/users/[uid]
Get a specific user by UID.

- Users can view their own profile
- Admins can view any profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "uid": "user-uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "emailVerified": true
  }
}
```

#### PATCH /api/users/[uid]
Update a user.

- Users can update their own profile (limited fields: displayName, photoURL)
- Admins can update any profile (all fields)

**Headers:**
```
Authorization: Bearer <token>
```

**Body (regular user):**
```json
{
  "displayName": "Updated Name",
  "photoURL": "https://example.com/photo.jpg"
}
```

**Body (admin):**
```json
{
  "displayName": "Updated Name",
  "email": "newemail@example.com",
  "role": "moderator"
}
```

**Response:**
```json
{
  "user": {
    "uid": "user-uid",
    "email": "user@example.com",
    "displayName": "Updated Name"
  }
}
```

#### DELETE /api/users/[uid]
Delete a user (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Utility Functions

### Authentication Utils (`src/utils/auth.ts`)

#### verifyAuthToken(request: Request)
Verify Firebase ID token from Authorization header.

```typescript
import { verifyAuthToken } from "@/utils/auth";

const user = await verifyAuthToken(request);
if (user) {
  console.log(user.uid, user.email);
}
```

#### requireAuth(request: Request)
Middleware to require authentication.

```typescript
import { requireAuth } from "@/utils/auth";

export async function GET(request: Request) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof NextResponse) {
    return authResult; // Returns 401 error
  }
  
  const { user } = authResult;
  // Continue with authenticated user
}
```

#### requireRole(request: Request, role: string | string[])
Middleware to require specific role(s).

```typescript
import { requireRole } from "@/utils/auth";

export async function POST(request: Request) {
  const authResult = await requireRole(request, "admin");
  
  if (authResult instanceof NextResponse) {
    return authResult; // Returns 401 or 403 error
  }
  
  const { user } = authResult;
  // Continue with authenticated admin user
}
```

### Firestore Utils (`src/utils/firestore-admin.ts`)

#### getDocument(collection: string, docId: string)
Get a single document from Firestore.

```typescript
import { getDocument } from "@/utils/firestore-admin";

const doc = await getDocument("users", "user-id");
```

#### getCollection(collection: string, filters?)
Get all documents from a collection with optional filters.

```typescript
import { getCollection } from "@/utils/firestore-admin";

const users = await getCollection("users", [
  { field: "role", operator: "==", value: "admin" }
]);
```

#### createDocument(collection: string, data: any, docId?: string)
Create a new document.

```typescript
import { createDocument } from "@/utils/firestore-admin";

const newDoc = await createDocument("posts", {
  title: "New Post",
  content: "Content here"
});
```

#### updateDocument(collection: string, docId: string, data: any)
Update an existing document.

```typescript
import { updateDocument } from "@/utils/firestore-admin";

const updated = await updateDocument("posts", "post-id", {
  title: "Updated Title"
});
```

#### deleteDocument(collection: string, docId: string)
Delete a document.

```typescript
import { deleteDocument } from "@/utils/firestore-admin";

await deleteDocument("posts", "post-id");
```

#### batchWrite(operations: Array)
Perform batch write operations.

```typescript
import { batchWrite } from "@/utils/firestore-admin";

await batchWrite([
  { type: "create", collection: "posts", data: { title: "Post 1" } },
  { type: "update", collection: "posts", docId: "post-id", data: { views: 100 } },
  { type: "delete", collection: "posts", docId: "old-post-id" }
]);
```

## Role-Based Access Control

The system supports custom roles through Firebase custom claims:

- **admin**: Full access to all operations
- **moderator**: Limited administrative access
- **user**: Standard user access

### Setting Roles

Roles can be set via:
1. API endpoint: `POST /api/auth/set-role` (admin only)
2. When creating users: `POST /api/users` with `role` field

### Checking Roles in API Routes

```typescript
import { requireRole } from "@/utils/auth";

export async function POST(request: Request) {
  // Allow both admin and moderator
  const authResult = await requireRole(request, ["admin", "moderator"]);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  // Continue with authorized user
}
```

## Error Handling

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized - Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden - Insufficient permissions"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create user"
}
```

## Testing

### Using cURL

```bash
# Get user token first (from client app)
TOKEN="your-firebase-id-token"

# List all users (admin only)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users

# Get specific user
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users/user-uid

# Create user (admin only)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"user"}' \
  http://localhost:3000/api/users

# Update user
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"New Name"}' \
  http://localhost:3000/api/users/user-uid

# Verify token
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/verify

# Set role (admin only)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"uid":"user-uid","role":"admin"}' \
  http://localhost:3000/api/auth/set-role
```

## Security Best Practices

1. **Never expose Firebase Admin credentials** - Keep them in `.env` file and never commit to git
2. **Always verify tokens** - Use `requireAuth` or `requireRole` middleware
3. **Implement rate limiting** - Add rate limiting to prevent abuse
4. **Validate input** - Always validate and sanitize user input
5. **Use HTTPS** - Always use HTTPS in production
6. **Rotate credentials** - Regularly rotate Firebase service account keys
7. **Monitor logs** - Monitor Firebase Admin SDK logs for suspicious activity

## Next Steps

1. Add rate limiting middleware
2. Implement API key authentication for service-to-service calls
3. Add request validation schemas (Zod)
4. Implement pagination for list endpoints
5. Add caching layer (Redis) for frequently accessed data
6. Set up monitoring and alerting
