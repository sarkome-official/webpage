import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
    GoogleAuthProvider,
    signInWithCredential,
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

    // Handle the Google credential response
    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            setIsLoading(true);
            console.log('[Auth] Received Google credential');

            // Create Firebase credential from Google ID token
            const credential = GoogleAuthProvider.credential(response.credential);

            // Sign in to Firebase with the credential
            const result = await signInWithCredential(auth, credential);
            console.log('[Auth] Firebase sign-in successful:', result.user.email);

            // onAuthStateChanged will handle setting the user
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
        document.head.appendChild(script);

        return () => {
            // Cleanup: don't remove script as it might be needed
        };
    }, []);

    // Initialize Google Identity Services when loaded
    useEffect(() => {
        if (!googleLoaded || !GOOGLE_CLIENT_ID) return;

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false, // Don't auto-sign-in, let user click
                cancel_on_tap_outside: true,
            });
            console.log('[Auth] Google Identity Services initialized');
        } catch (error) {
            console.error('[Auth] Failed to initialize Google Identity Services:', error);
        }
    }, [googleLoaded, handleCredentialResponse]);

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
        if (!googleLoaded || !GOOGLE_CLIENT_ID) {
            console.error('[Auth] Google Identity Services not loaded');
            alert('Google Sign-In is not ready. Please try again.');
            return;
        }

        try {
            setIsLoading(true);

            // Prompt the user to select a Google account
            // This opens the native Google account picker - no third-party cookies needed!
            window.google.accounts.id.prompt((notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean; isDismissedMoment: () => boolean }) => {
                if (notification.isNotDisplayed()) {
                    console.log('[Auth] Prompt not displayed, falling back to button flow');
                    // If prompt fails (e.g., blocked by browser), try the popup flow
                    window.google.accounts.id.renderButton(
                        document.createElement('div'),
                        { theme: 'outline', size: 'large' }
                    );
                    // Trigger the button click programmatically via popup
                    window.google.accounts.oauth2.initCodeClient({
                        client_id: GOOGLE_CLIENT_ID,
                        scope: 'email profile',
                        ux_mode: 'popup',
                        callback: (response: { code: string }) => {
                            console.log('[Auth] OAuth code received');
                            // For code flow, we'd need a backend. For now, use ID token flow.
                        }
                    });
                    setIsLoading(false);
                }
                if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
                    console.log('[Auth] User skipped or dismissed the prompt');
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('[Auth] Login error:', error);
            setIsLoading(false);
        }
    }

    async function logout() {
        try {
            await signOut(auth);
            // Also sign out from Google to allow account switching
            if (googleLoaded) {
                window.google.accounts.id.disableAutoSelect();
            }
        } catch (error) {
            console.error('[Auth] Logout failed:', error);
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

// Type declarations for Google Identity Services
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
                    renderButton: (parent: HTMLElement, options: { theme: string; size: string }) => void;
                    disableAutoSelect: () => void;
                };
                oauth2: {
                    initCodeClient: (config: {
                        client_id: string;
                        scope: string;
                        ux_mode: string;
                        callback: (response: { code: string }) => void;
                    }) => void;
                };
            };
        };
    }
}
