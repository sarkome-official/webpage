import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        async function initializeAuth() {
            try {
                // First, check if we're returning from a redirect
                // This must complete before we can reliably check auth state
                const redirectResult = await getRedirectResult(auth);

                if (redirectResult?.user) {
                    console.log('[Auth] Redirect login successful for:', redirectResult.user.email);
                    setUser(mapFirebaseUser(redirectResult.user));
                    setIsLoading(false);
                }
            } catch (error: unknown) {
                // Handle specific redirect errors
                const firebaseError = error as { code?: string; message?: string };
                console.error('[Auth] Redirect result error:', firebaseError.code, firebaseError.message);

                // Don't block auth initialization on redirect errors
                // User can try logging in again
            }

            // Now set up the auth state listener
            // This will catch users who are already logged in (session persistence)
            unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                console.log('[Auth] State changed:', firebaseUser?.email || 'no user');

                if (firebaseUser) {
                    setUser(mapFirebaseUser(firebaseUser));
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            });
        }

        initializeAuth();

        // Cleanup subscription
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    async function login() {
        try {
            setIsLoading(true);
            const provider = new GoogleAuthProvider();
            // Add scopes if needed
            provider.addScope('email');
            provider.addScope('profile');

            // Use redirect instead of popup to avoid COOP/COEP policy issues
            await signInWithRedirect(auth, provider);
            // Page will redirect to Google, then back
        } catch (error) {
            console.error('[Auth] Login failed:', error);
            setIsLoading(false);
            alert('Login failed. Please try again.');
        }
    }

    async function logout() {
        try {
            await signOut(auth);
            // onAuthStateChanged will handle the state update
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

