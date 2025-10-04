# Role-Based Authentication

This directory contains components and utilities for role-based authentication using Firebase.

## User Roles

- **ADMIN**: Full access to all features
- **USER**: Standard user access

## Components

### `RoleProtected`
Protects routes based on user role. Redirects unauthorized users.

```tsx
import { RoleProtected } from "@/components/auth";
import { UserRole } from "@/types/user";

export default function AdminPage() {
  return (
    <RoleProtected requiredRole={UserRole.ADMIN} redirectTo="/">
      <div>Admin-only content</div>
    </RoleProtected>
  );
}
```

### `AdminOnly`
Conditionally renders content for admin users only.

```tsx
import { AdminOnly } from "@/components/auth";

export default function Page() {
  return (
    <div>
      <h1>Public content</h1>
      <AdminOnly>
        <button>Admin-only button</button>
      </AdminOnly>
    </div>
  );
}
```

## Hooks

### `useUser()`
Access user authentication state and role data.

```tsx
import { useUser } from "@/hooks/useUser";

export default function Component() {
  const { user, userData, loading, isAdmin } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Role: {userData?.role}</p>
      {isAdmin && <p>You are an admin!</p>}
    </div>
  );
}
```

### `useIsAdmin()`
Quick check if current user is admin.

```tsx
import { useIsAdmin } from "@/hooks/useUser";

export default function Component() {
  const isAdmin = useIsAdmin();
  
  return isAdmin ? <AdminPanel /> : <UserPanel />;
}
```

### `useHasRole(role)`
Check if user has a specific role.

```tsx
import { useHasRole } from "@/hooks/useUser";
import { UserRole } from "@/types/user";

export default function Component() {
  const isAdmin = useHasRole(UserRole.ADMIN);
  
  return isAdmin ? <div>Admin view</div> : <div>User view</div>;
}
```

## Services

### `userService.ts`
Functions for managing user data in Firestore.

```tsx
import { 
  getUserData, 
  createUserData, 
  updateUserRole, 
  isUserAdmin 
} from "@/services/userService";
import { UserRole } from "@/types/user";

// Get user data
const userData = await getUserData(uid);

// Create new user (automatically done on first login)
await createUserData(uid, email, UserRole.USER);

// Update user role (admin only)
await updateUserRole(uid, UserRole.ADMIN);

// Check if user is admin
const isAdmin = await isUserAdmin(uid);
```

## Firestore Structure

Users collection structure:
```json
{
  "users": {
    "userId123": {
      "uid": "userId123",
      "email": "user@example.com",
      "role": "user",
      "displayName": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

## Making Your First Admin User

Since new users default to `USER` role, you'll need to manually promote your first admin:

1. Register a new user through your app
2. Go to Firebase Console > Firestore
3. Find the user document in the `users` collection
4. Change the `role` field from `"user"` to `"admin"`
5. Save the changes

Alternatively, use Firebase Admin SDK or Cloud Functions to automate this.

## Example: Admin Page

```tsx
// app/(protected)/admin/page.tsx
import { RoleProtected } from "@/components/auth";
import { UserRole } from "@/types/user";

export default function AdminDashboard() {
  return (
    <RoleProtected requiredRole={UserRole.ADMIN}>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Only admins can see this page</p>
      </div>
    </RoleProtected>
  );
}
```

## Example: Mixed Content Page

```tsx
import { AdminOnly } from "@/components/auth";
import { useUser } from "@/hooks/useUser";

export default function MixedPage() {
  const { user, userData } = useUser();
  
  return (
    <div>
      <h1>Welcome, {userData?.displayName}</h1>
      
      {/* Everyone can see this */}
      <section>
        <h2>Public Section</h2>
        <p>All users see this content</p>
      </section>
      
      {/* Only admins can see this */}
      <AdminOnly>
        <section>
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
          <button>System Settings</button>
        </section>
      </AdminOnly>
    </div>
  );
}
```
