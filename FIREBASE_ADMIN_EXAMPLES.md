# Firebase Admin SDK - Usage Examples

This document provides practical examples of using the Firebase Admin SDK integration in your Next.js application.

## Client-Side Usage

### Using the `useFirebaseAdmin` Hook

The `useFirebaseAdmin` hook provides easy access to Firebase Admin API endpoints from client components.

#### Example 1: List All Users (Admin Dashboard)

```tsx
"use client";

import { useEffect, useState } from "react";
import { useFirebaseAdmin } from "@/hooks/useFirebaseAdmin";

export default function UserManagement() {
  const { listUsers, loading, error } = useFirebaseAdmin();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await listUsers();
        setUsers(response.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User Management</h1>
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            {user.displayName || user.email} - {user.customClaims?.role || "user"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Example 2: Create New User Form

```tsx
"use client";

import { useState } from "react";
import { useFirebaseAdmin } from "@/hooks/useFirebaseAdmin";
import { Button, TextField, Select, MenuItem } from "@mui/material";

export default function CreateUserForm() {
  const { createUser, loading, error } = useFirebaseAdmin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createUser(formData);
      alert(`User created successfully: ${response.user.email}`);
      setFormData({ email: "", password: "", displayName: "", role: "user" });
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <TextField
        label="Display Name"
        value={formData.displayName}
        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
      />
      <Select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="moderator">Moderator</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </Select>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
```

#### Example 3: Update User Profile

```tsx
"use client";

import { useState, useEffect } from "react";
import { useFirebaseAdmin } from "@/hooks/useFirebaseAdmin";
import { useUser } from "@/hooks/useUser";

export default function ProfileSettings() {
  const { user } = useUser();
  const { getUser, updateUser, loading, error } = useFirebaseAdmin();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    if (user?.uid) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.uid) return;
    
    try {
      const response = await getUser(user.uid);
      setDisplayName(response.user.displayName || "");
      setPhotoURL(response.user.photoURL || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const handleUpdate = async () => {
    if (!user?.uid) return;

    try {
      await updateUser(user.uid, { displayName, photoURL });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div>
      <h2>Profile Settings</h2>
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Photo URL"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
```

#### Example 4: Role Management (Admin Only)

```tsx
"use client";

import { useState } from "react";
import { useFirebaseAdmin } from "@/hooks/useFirebaseAdmin";

export default function RoleManagement({ userId }: { userId: string }) {
  const { setRole, loading, error } = useFirebaseAdmin();
  const [selectedRole, setSelectedRole] = useState("user");

  const handleSetRole = async () => {
    try {
      await setRole(userId, selectedRole);
      alert(`Role updated to ${selectedRole}`);
    } catch (err) {
      console.error("Failed to set role:", err);
    }
  };

  return (
    <div>
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleSetRole} disabled={loading}>
        {loading ? "Setting..." : "Set Role"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
```

## Server-Side Usage

### Example 1: Protected API Route with Authentication

```typescript
// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/utils/auth";
import { createDocument } from "@/utils/firestore-admin";

export async function POST(request: Request) {
  // Require authentication
  const authResult = await requireAuth(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const { title, content } = await request.json();

    // Create post with user information
    const post = await createDocument("posts", {
      title,
      content,
      authorId: user.uid,
      authorEmail: user.email,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
```

### Example 2: Admin-Only API Route

```typescript
// src/app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { requireRole } from "@/utils/auth";
import { getCollection } from "@/utils/firestore-admin";

export async function GET(request: Request) {
  // Only admins can access analytics
  const authResult = await requireRole(request, "admin");
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    // Get all users
    const users = await getCollection("users");
    
    // Get all posts
    const posts = await getCollection("posts");

    // Calculate analytics
    const analytics = {
      totalUsers: users.length,
      totalPosts: posts.length,
      postsPerUser: posts.length / users.length,
    };

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error("Failed to get analytics:", error);
    return NextResponse.json(
      { error: "Failed to get analytics" },
      { status: 500 }
    );
  }
}
```

### Example 3: Multi-Role Access

```typescript
// src/app/api/moderation/route.ts
import { NextResponse } from "next/server";
import { requireRole } from "@/utils/auth";
import { updateDocument } from "@/utils/firestore-admin";

export async function PATCH(request: Request) {
  // Allow both admin and moderator roles
  const authResult = await requireRole(request, ["admin", "moderator"]);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const { postId, status } = await request.json();

    // Update post moderation status
    const updatedPost = await updateDocument("posts", postId, {
      status,
      moderatedBy: user.uid,
      moderatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Failed to moderate post:", error);
    return NextResponse.json(
      { error: "Failed to moderate post" },
      { status: 500 }
    );
  }
}
```

### Example 4: Firestore Batch Operations

```typescript
// src/app/api/bulk-update/route.ts
import { NextResponse } from "next/server";
import { requireRole } from "@/utils/auth";
import { batchWrite } from "@/utils/firestore-admin";

export async function POST(request: Request) {
  const authResult = await requireRole(request, "admin");
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { operations } = await request.json();

    // Perform batch operations
    await batchWrite(operations);

    return NextResponse.json(
      { message: "Batch operations completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to perform batch operations:", error);
    return NextResponse.json(
      { error: "Failed to perform batch operations" },
      { status: 500 }
    );
  }
}
```

## Testing Examples

### Example 1: Test Token Verification

```typescript
// __tests__/auth.test.ts
import { verifyAuthToken } from "@/utils/auth";

describe("Auth Utilities", () => {
  it("should verify valid token", async () => {
    const mockRequest = new Request("http://localhost:3000/api/test", {
      headers: {
        Authorization: "Bearer valid-token",
      },
    });

    const user = await verifyAuthToken(mockRequest);
    expect(user).toBeTruthy();
    expect(user?.uid).toBeDefined();
  });

  it("should return null for invalid token", async () => {
    const mockRequest = new Request("http://localhost:3000/api/test", {
      headers: {
        Authorization: "Bearer invalid-token",
      },
    });

    const user = await verifyAuthToken(mockRequest);
    expect(user).toBeNull();
  });
});
```

### Example 2: Integration Test

```typescript
// __tests__/api/users.test.ts
import { POST } from "@/app/api/users/route";

describe("POST /api/users", () => {
  it("should create a new user", async () => {
    const request = new Request("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TEST_ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "testpassword123",
        displayName: "Test User",
        role: "user",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user.email).toBe("test@example.com");
  });
});
```

## Common Patterns

### Pattern 1: Check User Role on Client

```tsx
"use client";

import { useEffect, useState } from "react";
import { useFirebaseAdmin } from "@/hooks/useFirebaseAdmin";

export function useUserRole() {
  const { verifyToken } = useFirebaseAdmin();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await verifyToken();
        setRole(response.user.role || "user");
      } catch (error) {
        console.error("Failed to verify token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  return { role, loading, isAdmin: role === "admin" };
}
```

### Pattern 2: Conditional Rendering Based on Role

```tsx
"use client";

import { useUserRole } from "./useUserRole";

export default function AdminPanel() {
  const { isAdmin, loading } = useUserRole();

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access Denied</div>;

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin-only content */}
    </div>
  );
}
```

### Pattern 3: Error Boundary for API Calls

```tsx
"use client";

import { useState } from "react";
import { useFirebaseAdmin } from "@/hooks/useFirebaseAdmin";

export function useApiCall<T>(
  apiCall: () => Promise<T>
): [() => Promise<void>, boolean, string | null, T | null] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return [execute, loading, error, data];
}

// Usage
function MyComponent() {
  const { listUsers } = useFirebaseAdmin();
  const [fetchUsers, loading, error, users] = useApiCall(() => listUsers());

  return (
    <div>
      <button onClick={fetchUsers} disabled={loading}>
        Load Users
      </button>
      {error && <div>Error: {error}</div>}
      {users && <div>Loaded {users.users.length} users</div>}
    </div>
  );
}
```

## Tips and Best Practices

1. **Always handle errors**: Wrap API calls in try-catch blocks
2. **Show loading states**: Provide feedback to users during async operations
3. **Validate on both sides**: Validate input on client and server
4. **Use TypeScript**: Type your API responses for better developer experience
5. **Cache when appropriate**: Use React Query or SWR for data fetching
6. **Implement retry logic**: Handle transient failures gracefully
7. **Log errors**: Use proper error logging for debugging
8. **Test thoroughly**: Write unit and integration tests for your API routes
