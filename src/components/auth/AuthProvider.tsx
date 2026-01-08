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
        // Handle redirect result on page load
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    log('Login successful:', result.user.email);
                }
            })
            .catch((error) => {
                logError('Redirect error:', error.code);
            });

        // Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            log('State changed:', firebaseUser?.email || 'no user');

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
