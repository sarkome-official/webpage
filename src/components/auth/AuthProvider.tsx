import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    GoogleAuthProvider,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Map Firebase user to our app's User interface
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || 'User',
                    picture: firebaseUser.photoURL || undefined
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    async function login() {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // onAuthStateChanged will handle the state update
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    }

    async function logout() {
        try {
            await signOut(auth);
            // onAuthStateChanged will handle the state update
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
