import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    googleButtonRef: React.RefObject<HTMLDivElement | null>;
    isGoogleReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to map Firebase user to our app's User interface
function mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        picture: firebaseUser.photoURL || undefined
    };
}

// Google Client ID from environment
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [isGoogleReady, setIsGoogleReady] = useState(false);
    const googleButtonRef = useRef<HTMLDivElement | null>(null);
    const tokenClientRef = useRef<GoogleTokenClient | null>(null);

    // Handle the Google credential response (for ID token flow)
    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            setIsLoading(true);
            console.log('[Auth] Received Google credential');

            // Create Firebase credential from Google ID token
            const credential = GoogleAuthProvider.credential(response.credential);

            // Sign in to Firebase with the credential
            const result = await signInWithCredential(auth, credential);
            console.log('[Auth] Firebase sign-in successful:', result.user.email);
        } catch (error) {
            console.error('[Auth] Sign-in error:', error);
            setIsLoading(false);
            alert('Login failed. Please try again.');
        }
    }, []);

    // Load Google Identity Services script
    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) {
            console.error('[Auth] Missing VITE_GOOGLE_CLIENT_ID environment variable');
            setIsLoading(false);
            return;
        }

        // Check if script already loaded
        if (window.google?.accounts) {
            setGoogleLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('[Auth] Google Identity Services loaded');
            setGoogleLoaded(true);
        };
        script.onerror = () => {
            console.error('[Auth] Failed to load Google Identity Services');
            setIsLoading(false);
        };
        document.head.appendChild(script);
    }, []);

    // Initialize Google Identity Services when loaded
    useEffect(() => {
        if (!googleLoaded || !GOOGLE_CLIENT_ID) return;

        try {
            // Initialize the ID token flow (for One Tap and button)
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            // Initialize OAuth2 token client for popup flow (more reliable)
            tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                callback: async (tokenResponse: GoogleTokenResponse) => {
                    if (tokenResponse.error) {
                        console.error('[Auth] OAuth error:', tokenResponse.error);
                        setIsLoading(false);
                        return;
                    }

                    console.log('[Auth] OAuth token received, signing into Firebase...');

                    try {
                        // Use Firebase popup as fallback since we have the OAuth consent
                        const provider = new GoogleAuthProvider();
                        const result = await signInWithPopup(auth, provider);
                        console.log('[Auth] Firebase sign-in successful:', result.user.email);
                    } catch (error) {
                        console.error('[Auth] Firebase sign-in error:', error);
                        setIsLoading(false);
                    }
                },
            });

            setIsGoogleReady(true);
            console.log('[Auth] Google Identity Services initialized');
        } catch (error) {
            console.error('[Auth] Failed to initialize Google Identity Services:', error);
        }
    }, [googleLoaded, handleCredentialResponse]);

    // Render Google button when ref is available
    useEffect(() => {
        if (!isGoogleReady || !googleButtonRef.current) return;

        try {
            window.google.accounts.id.renderButton(googleButtonRef.current, {
                type: 'standard',
                theme: 'filled_black',
                size: 'large',
                text: 'continue_with',
                shape: 'pill',
                logo_alignment: 'left',
                width: 280,
            });
            console.log('[Auth] Google button rendered');
        } catch (error) {
            console.error('[Auth] Failed to render Google button:', error);
        }
    }, [isGoogleReady]);

    // Listen for Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log('[Auth] State changed:', firebaseUser?.email || 'no user');

            if (firebaseUser) {
                setUser(mapFirebaseUser(firebaseUser));
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    async function login() {
        if (!GOOGLE_CLIENT_ID) {
            alert('Google Sign-In is not configured.');
            return;
        }

        try {
            setIsLoading(true);
            console.log('[Auth] Starting login flow...');

            // Use Firebase's signInWithPopup directly - it's the most reliable
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            const result = await signInWithPopup(auth, provider);
            console.log('[Auth] Login successful:', result.user.email);
            // onAuthStateChanged will handle the rest
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error('[Auth] Login error:', firebaseError.code, firebaseError.message);
            setIsLoading(false);

            // Only show alert for non-cancellation errors
            if (firebaseError.code !== 'auth/popup-closed-by-user' &&
                firebaseError.code !== 'auth/cancelled-popup-request') {
                alert('Login failed. Please try again.');
            }
        }
    }

    async function logout() {
        try {
            await signOut(auth);
            // Also disable auto-select from Google
            if (googleLoaded && window.google?.accounts?.id) {
                window.google.accounts.id.disableAutoSelect();
            }
        } catch (error) {
            console.error('[Auth] Logout failed:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, googleButtonRef, isGoogleReady }}>
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

// Type declarations for Google Identity Services
interface GoogleTokenResponse {
    access_token?: string;
    error?: string;
    error_description?: string;
}

interface GoogleTokenClient {
    requestAccessToken: (options?: { prompt?: string }) => void;
}

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                    }) => void;
                    prompt: (callback?: (notification: {
                        isNotDisplayed: () => boolean;
                        isSkippedMoment: () => boolean;
                        isDismissedMoment: () => boolean;
                    }) => void) => void;
                    renderButton: (parent: HTMLElement, options: {
                        type?: string;
                        theme?: string;
                        size?: string;
                        text?: string;
                        shape?: string;
                        logo_alignment?: string;
                        width?: number;
                    }) => void;
                    disableAutoSelect: () => void;
                };
                oauth2: {
                    initTokenClient: (config: {
                        client_id: string;
                        scope: string;
                        callback: (response: GoogleTokenResponse) => void;
                    }) => GoogleTokenClient;
                };
            };
        };
    }
}

