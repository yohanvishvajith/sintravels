# JWT Authentication Implementation

## Overview

The authentication system has been completely migrated from localStorage-based authentication to secure JWT (JSON Web Token) authentication with httpOnly cookies.

## Key Changes

### 1. **JWT Token Management** (`lib/jwt.ts`)

- Creates and verifies JWT tokens using the `jose` library
- Tokens expire after 24 hours
- Stores user information (userId, username, email, role, profileImg) in the token payload

### 2. **Updated API Endpoints**

#### Login API (`app/api/login/route.ts`)

- Validates user credentials
- Creates JWT token on successful login
- Sets token in httpOnly cookie (secure, cannot be accessed by JavaScript)
- Returns user information

#### Logout API (`app/api/logout/route.ts`)

- Deletes the auth-token cookie
- Effectively logs out the user

#### Get Current User API (`app/api/user/me/route.ts`)

- Retrieves current user from JWT token
- Used by client to check authentication status

### 3. **Authentication Middleware** (`lib/auth-middleware.ts`)

- Protects API routes that require authentication
- Validates JWT tokens from cookies
- Checks user roles (ADMIN access for admin routes)
- Adds user info to request headers

### 4. **Updated Client Components**

#### Admin Layout (`app/[locale]/admin/layout.tsx`)

- Fetches user from `/api/user/me` instead of localStorage
- Shows skeleton loader while checking authentication
- Redirects to login if not authenticated
- Removed SessionTimeout component (JWT has built-in expiration)

#### Admin Login (`components/admin/admin-login.tsx`)

- No longer stores user in localStorage
- Server sets httpOnly cookie with JWT token
- Dispatches authChanged event for UI updates

#### Profile Badge (`components/auth/profile-badge.tsx`)

- Fetches user from `/api/user/me` instead of localStorage
- Calls `/api/logout` endpoint to logout
- Redirects to login page after logout

### 5. **Main Middleware** (`middleware.ts`)

- Routes API requests through auth middleware
- Routes other requests through i18n middleware

## Security Improvements

1. **HttpOnly Cookies**: Tokens are stored in httpOnly cookies, preventing XSS attacks from accessing them
2. **Token Expiration**: JWT tokens automatically expire after 24 hours
3. **Server-side Validation**: All protected routes validate tokens on the server
4. **Role-based Access**: Admin routes check for ADMIN role in JWT payload
5. **No Client Storage**: No sensitive data stored in localStorage

## Environment Variables

Add to your `.env` file:

```
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**IMPORTANT**: Generate a secure random string for production using:

```bash
openssl rand -base64 32
```

## Protected API Routes

The following routes require authentication:

- `/api/admin/*` - Requires ADMIN role
- `/api/user/me` - Requires any authenticated user
- `/api/users/*` - Requires ADMIN role

## Migration Notes

### Removed

- ❌ localStorage user storage
- ❌ SessionTimeout component (replaced by JWT expiration)
- ❌ Manual session timeout tracking

### Added

- ✅ JWT token generation and verification
- ✅ HttpOnly cookie storage
- ✅ Authentication middleware
- ✅ Logout endpoint
- ✅ Get current user endpoint
- ✅ Role-based access control

## Testing

1. **Login**: Visit `/admin/login` and sign in with admin credentials
2. **Token Storage**: Check browser cookies for `auth-token` (httpOnly)
3. **Protected Routes**: Try accessing `/api/admin/*` endpoints
4. **Logout**: Click logout in profile dropdown
5. **Token Expiration**: Wait 24 hours or delete cookie manually

## Development Packages Installed

```json
{
  "jsonwebtoken": "^9.0.2",
  "@types/jsonwebtoken": "^9.0.6",
  "jose": "^5.9.6"
}
```

## Production Checklist

- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Set `NODE_ENV=production`
- [ ] Ensure `secure: true` for cookies in production (HTTPS only)
- [ ] Configure proper CORS settings if using separate frontend
- [ ] Set up token refresh mechanism if needed (optional)
- [ ] Configure session monitoring/logging

## API Flow

```
1. User submits login form
   ↓
2. Server validates credentials
   ↓
3. Server creates JWT token
   ↓
4. Server sets httpOnly cookie
   ↓
5. Client receives success response
   ↓
6. Client fetches user from /api/user/me
   ↓
7. Middleware validates token on each API request
   ↓
8. User can access protected routes
```

## Logout Flow

```
1. User clicks logout
   ↓
2. Client calls /api/logout
   ↓
3. Server deletes auth-token cookie
   ↓
4. Client dispatches authChanged event
   ↓
5. Client redirects to /admin/login
```
