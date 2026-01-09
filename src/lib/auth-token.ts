/**
 * Firebase Auth Token Utilities
 * -----------------------------
 * Helper functions to retrieve Firebase ID tokens for authenticated API requests.
 * Used by useAgent.ts and knowledge-graph-api.ts to inject Authorization headers.
 */

import { auth } from './firebase';

/**
 * Get the current user's Firebase ID Token.
 * Returns null if user is not authenticated.
 * 
 * @param forceRefresh - If true, forces a token refresh from Firebase servers
 * @returns The ID token string or null
 */
export async function getAuthToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
        return null;
    }

    try {
        const token = await user.getIdToken(forceRefresh);
        return token;
    } catch (error) {
        console.error('[Auth] Failed to get ID token:', error);
        return null;
    }
}

/**
 * Creates an Authorization header object if user is authenticated.
 * Returns empty object if not authenticated.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getAuthToken();
    if (!token) {
        return {};
    }
    return {
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Checks if the current user is authenticated.
 */
export function isAuthenticated(): boolean {
    return auth.currentUser !== null;
}
