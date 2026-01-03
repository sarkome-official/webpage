# Sarkome: Google Single Sign-On (SSO) Implementation Plan

> **Version:** 1.0  
> **Date:** 2026-01-02  
> **Author:** Senior Software Architect  
> **Status:** Planning Phase

---

## 1. Executive Summary

This document outlines a comprehensive, security-first plan for integrating Google Single Sign-On (SSO) into the Sarkome platform. The implementation leverages **Vercel Serverless Functions** to handle the OAuth 2.0 Authorization Code Flow with PKCE, eliminating the need for a dedicated backend server while maintaining enterprise-grade security.

---

## 2. Architecture Overview

### 2.1 High-Level Flow

```
[User] --> [React App] --> [Google OAuth] --> [Vercel Function] --> [JWT Session]
   |                            |                     |
   |  1. Click "Login"          |                     |
   |--------------------------->|                     |
   |                            | 2. Redirect to      |
   |                            |    Google Consent   |
   |<---------------------------|                     |
   |  3. User authorizes        |                     |
   |--------------------------->|                     |
   |                            | 4. Redirect with    |
   |                            |    Auth Code        |
   |                            |-------------------->|
   |                            |    5. Exchange code |
   |                            |    for tokens       |
   |                            |<--------------------|
   |                            |    6. Return JWT    |
   |<------------------------------------------------|
   |  7. Store session cookie   |                     |
```

### 2.2 Technology Stack

| Component               | Technology                          |
|-------------------------|-------------------------------------|
| Frontend                | React + TypeScript (Vite)           |
| OAuth Client            | `@react-oauth/google`               |
| Backend                 | Vercel Serverless Functions         |
| Session Management      | JWT (HttpOnly Secure Cookies)       |
| Token Storage           | Encrypted server-side (Vercel KV)   |

---

## 3. Security Requirements (OWASP Compliant)

### 3.1 Mandatory Security Controls

| Control                         | Implementation                                               |
|---------------------------------|--------------------------------------------------------------|
| Authorization Code Flow + PKCE  | Use `code_challenge` and `code_verifier` in all OAuth flows |
| Secure Token Storage            | Store refresh tokens encrypted in Vercel KV, NOT client-side |
| HttpOnly Secure Cookies         | Session JWT in cookies with `HttpOnly`, `Secure`, `SameSite` |
| Strict Redirect URI Validation  | Exact string matching for callback URLs                      |
| Short-Lived Access Tokens       | Access tokens expire in 15 minutes max                       |
| CSRF Protection                 | Use cryptographic `state` parameter                          |
| HTTPS Everywhere                | Enforce TLS for all endpoints                                |

### 3.2 Forbidden Practices

- **DO NOT** use the Implicit Grant flow.
- **DO NOT** store access/refresh tokens in `localStorage` or `sessionStorage`.
- **DO NOT** log tokens or authorization codes.
- **DO NOT** hardcode `CLIENT_SECRET` in frontend code.

---

## 4. Implementation Phases

### Phase 1: Google Cloud Console Setup

**Objective:** Create and configure OAuth 2.0 credentials.

#### Steps:

1.  **Access Google Cloud Console:**
    - Navigate to [Google Cloud Console](https://console.cloud.google.com/).
    - Select or create a project for Sarkome.

2.  **Configure OAuth Consent Screen:**
    - Go to `APIs & Services` > `OAuth consent screen`.
    - Select `External` user type (for public access).
    - Fill in application details:
      - App name: `Sarkome`
      - User support email: `your-email@sarkome.com`
      - Developer contact: `your-email@sarkome.com`
    - Add scopes:
      - `openid` (required for OIDC)
      - `email`
      - `profile`
    - Add test users if in "Testing" mode.

3.  **Create OAuth Client ID:**
    - Go to `APIs & Services` > `Credentials`.
    - Click `Create Credentials` > `OAuth client ID`.
    - Application type: `Web application`.
    - Name: `Sarkome Web Client`.
    - **Authorized JavaScript Origins:**
      ```
      http://localhost:5173
      https://sarkome.vercel.app
      https://your-custom-domain.com
      ```
    - **Authorized Redirect URIs:**
      ```
      http://localhost:5173/api/auth/callback/google
      https://sarkome.vercel.app/api/auth/callback/google
      https://your-custom-domain.com/api/auth/callback/google
      ```
    - Download and securely store the `client_id` and `client_secret`.

4.  **Publish OAuth Consent Screen** (when ready for production):
    - Submit for Google verification if requesting sensitive scopes.

---

### Phase 2: Vercel Environment Configuration

**Objective:** Securely store all secrets in Vercel.

#### Steps:

1.  **Add Environment Variables in Vercel Dashboard:**
    - Navigate to your Vercel project > `Settings` > `Environment Variables`.
    - Add the following variables for **Production**, **Preview**, and **Development**:

    | Variable Name         | Value                                      | Scope        |
    |-----------------------|--------------------------------------------|--------------|
    | `GOOGLE_CLIENT_ID`    | Your Google Client ID                      | All          |
    | `GOOGLE_CLIENT_SECRET`| Your Google Client Secret                  | All          |
    | `AUTH_SECRET`         | Random 32+ char string (use `openssl rand -hex 32`) | All |
    | `NEXT_PUBLIC_APP_URL` | `https://sarkome.vercel.app`               | Production   |
    | `NEXT_PUBLIC_APP_URL` | `http://localhost:5173`                    | Development  |

2.  **Generate AUTH_SECRET:**
    ```bash
    openssl rand -hex 32
    ```

3.  **(Optional) Enable Vercel KV for Refresh Token Storage:**
    - Go to Vercel Dashboard > `Storage` > Create a `KV` database.
    - Link it to your project.

---

### Phase 3: Frontend Implementation

**Objective:** Implement the Google Login UI component.

#### Dependencies:

```bash
npm install @react-oauth/google jose
```

#### File Structure:

```
src/
  components/
    auth/
      GoogleLoginButton.tsx    # Login button component
      AuthProvider.tsx         # Context provider for auth state
  hooks/
    useAuth.ts                 # Custom hook for auth logic
  lib/
    auth.ts                    # Auth utility functions
```

#### Implementation Files:

**`src/components/auth/AuthProvider.tsx`**
```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function login() {
    // Redirect to Google OAuth via our Vercel function
    window.location.href = '/api/auth/login';
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**`src/components/auth/GoogleLoginButton.tsx`**
```tsx
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function GoogleLoginButton() {
  const { login, isLoading } = useAuth();

  return (
    <Button
      onClick={login}
      disabled={isLoading}
      variant="outline"
      className="w-full gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      Continue with Google
    </Button>
  );
}
```

---

### Phase 4: Vercel Serverless Functions (API Routes)

**Objective:** Create secure OAuth endpoints.

#### File Structure:

```
api/
  auth/
    login.ts          # Initiates OAuth flow with PKCE
    callback/
      google.ts       # Handles Google callback, exchanges code for tokens
    session.ts        # Returns current user session
    logout.ts         # Clears session cookie
```

#### Implementation Files:

**`api/auth/login.ts`**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;
  
  // Generate PKCE code verifier and challenge
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  
  // Generate state for CSRF protection
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store code_verifier and state in HttpOnly cookie (encrypted in production)
  const cookieValue = JSON.stringify({ codeVerifier, state });
  res.setHeader('Set-Cookie', [
    `oauth_state=${cookieValue}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`
  ]);
  
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  });
  
  res.redirect(302, `${GOOGLE_AUTH_URL}?${params.toString()}`);
}
```

**`api/auth/callback/google.ts`**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SignJWT } from 'jose';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code, state } = req.query;
    
    // Parse stored OAuth state from cookie
    const oauthStateCookie = req.cookies.oauth_state;
    if (!oauthStateCookie) {
      return res.status(400).json({ error: 'Missing OAuth state cookie' });
    }
    
    const { codeVerifier, state: storedState } = JSON.parse(oauthStateCookie);
    
    // Validate state parameter (CSRF protection)
    if (state !== storedState) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: code as string,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
      }),
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token exchange failed:', error);
      return res.status(400).json({ error: 'Token exchange failed' });
    }
    
    const tokens = await tokenResponse.json();
    
    // Fetch user info
    const userResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    if (!userResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch user info' });
    }
    
    const userInfo = await userResponse.json();
    
    // Create session JWT
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const sessionToken = await new SignJWT({
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);
    
    // Clear OAuth state cookie and set session cookie
    res.setHeader('Set-Cookie', [
      `oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
      `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
    ]);
    
    // Redirect to platform
    res.redirect(302, '/platform');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
```

**`api/auth/session.ts`**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { jwtVerify } from 'jose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sessionCookie = req.cookies.session;
    
    if (!sessionCookie) {
      return res.status(401).json({ user: null });
    }
    
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(sessionCookie, secret);
    
    return res.status(200).json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    });
  } catch (error) {
    // Token invalid or expired
    return res.status(401).json({ user: null });
  }
}
```

**`api/auth/logout.ts`**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Clear session cookie
  res.setHeader('Set-Cookie', [
    `session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  ]);
  
  return res.status(200).json({ success: true });
}
```

---

### Phase 5: Route Protection

**Objective:** Implement middleware for protected routes.

#### Implementation:

**`src/components/auth/ProtectedRoute.tsx`**
```tsx
import { useAuth } from './AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to landing with return URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

**Update `App.tsx`:**
```tsx
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Wrap platform routes with ProtectedRoute
<Route path="/platform" element={
  <ProtectedRoute>
    <div className="max-w-4xl mx-auto h-full">
      {/* ... existing code ... */}
    </div>
  </ProtectedRoute>
} />
```

---

### Phase 6: Vite Configuration for API Routes

**Objective:** Configure Vite to proxy API routes to Vercel functions during development.

**`vite.config.ts`** (add proxy):
```typescript
export default defineConfig({
  // ... existing config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Local Vercel dev server
        changeOrigin: true,
      },
    },
  },
});
```

**Run Vercel dev server locally:**
```bash
npm install -g vercel
vercel dev --listen 3001
```

---

## 5. Security Checklist

Before deploying to production, verify:

- [ ] `GOOGLE_CLIENT_SECRET` is stored ONLY in Vercel environment variables
- [ ] `AUTH_SECRET` is a cryptographically random 32+ character string
- [ ] Session cookies have `HttpOnly`, `Secure`, and `SameSite=Lax` flags
- [ ] PKCE (`code_challenge` and `code_verifier`) is implemented
- [ ] `state` parameter is validated to prevent CSRF
- [ ] Redirect URIs are whitelisted in Google Cloud Console (exact match)
- [ ] No tokens are logged in serverless function console
- [ ] HTTPS is enforced for all production endpoints
- [ ] OAuth consent screen is published and verified (if using sensitive scopes)

---

## 6. Testing Plan

### 6.1 Manual Testing

1.  **Happy Path:**
    - Click "Login with Google" on Landing Page.
    - Authorize Sarkome in Google consent screen.
    - Verify redirect to `/platform` with user session.
    - Verify user info is displayed in UI.
    - Logout and verify session is cleared.

2.  **Error Cases:**
    - Attempt callback with invalid `state` parameter.
    - Attempt callback with expired `code_verifier`.
    - Attempt to access `/platform` without session.

### 6.2 Automated Testing (Jest)

```typescript
// __tests__/auth/session.test.ts
describe('Session Endpoint', () => {
  it('returns 401 when no session cookie is present', async () => {
    const res = await fetch('/api/auth/session');
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.user).toBeNull();
  });
});
```

---

## 7. Rollout Plan

| Phase       | Action                                    | Timeline |
|-------------|-------------------------------------------|----------|
| Development | Implement all components                  | Week 1   |
| Staging     | Deploy to Vercel Preview, test OAuth flow | Week 2   |
| Production  | Deploy to main branch after QA approval   | Week 3   |

---

## 8. References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OWASP OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Auth.js (NextAuth) Security Model](https://authjs.dev/concepts/security)
- [RFC 7636 - PKCE](https://datatracker.ietf.org/doc/html/rfc7636)

---

## 9. Appendix: Environment Variables Summary

```env
# .env.local (DO NOT COMMIT)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
AUTH_SECRET=your-random-32-char-secret
NEXT_PUBLIC_APP_URL=http://localhost:5173
```

---

**Document End**
