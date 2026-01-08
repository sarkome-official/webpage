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

// Only log in development
const log = import.meta.env.DEV ? console.log.bind(console, '[Auth]') : () => { };
const logError = console.error.bind(console, '[Auth]');

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
        let isSubscribed = true;

        // Fallback timeout - if nothing happens in 5 seconds, stop loading
        const timeout = setTimeout(() => {
            if (isSubscribed && isLoading) {
                console.warn('[Auth] Timeout: forcing isLoading to false');
                setIsLoading(false);
            }
        }, 5000);

        // Handle redirect result on page load
        getRedirectResult(auth)
            .then((result) => {
                console.log('[Auth] getRedirectResult:', result ? 'got user' : 'no result');
                if (result?.user) {
                    console.log('[Auth] Redirect login successful:', result.user.email);
                    // User will be set by onAuthStateChanged
                }
            })
            .catch((error) => {
                console.error('[Auth] Redirect error:', error.code, error.message);
            });

        // Listen for Firebase Auth state changes - this is the main source of truth
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log('[Auth] onAuthStateChanged:', firebaseUser?.email || 'no user');

            if (firebaseUser) {
                setUser(mapFirebaseUser(firebaseUser));
            } else {
                setUser(null);
            }

            if (isSubscribed) {
                setIsLoading(false);
                clearTimeout(timeout);
            }
        });

        return () => {
            isSubscribed = false;
            clearTimeout(timeout);
            unsubscribe();
        };
    }, []);

    async function login() {
        try {
            setIsLoading(true);
            log('Starting redirect login...');

            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            // signInWithRedirect works better with COOP/COEP policies
            await signInWithRedirect(auth, provider);
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            logError('Login error:', firebaseError.code);
            setIsLoading(false);
        }
    }

    async function logout() {
        try {
            await signOut(auth);
        } catch (error) {
            logError('Logout failed:', error);
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
