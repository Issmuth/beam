'use client';

/**
 * Auth Context Provider
 * 
 * Manages authentication state using Firebase Authentication.
 * Provides signUp, signIn, and signOut functions.
 * Persists authentication state across page refreshes.
 * 
 * Requirements: 1.1, 2.1, 3.1, 6.1
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../lib/firebase/config';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider component
 * Wraps the application and provides authentication state and methods.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Sign up a new user with email and password
     * Creates user in Firebase and registers in the database
     * Requirements: 1.1
     */
    const signUp = async (email, password, displayName = null) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Get the ID token for API authentication
        const idToken = await firebaseUser.getIdToken();

        // Register user in the database
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ displayName })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register user in database');
        }

        return userCredential;
    };

    /**
     * Sign in an existing user with email and password
     * Authenticates with Firebase and updates last login in database
     * Requirements: 2.1
     */
    const signIn = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Get the ID token for API authentication
        const idToken = await firebaseUser.getIdToken();

        // Update last login in the database
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (!response.ok) {
            // Log warning but don't fail - user is still authenticated
            console.warn('Failed to update last login in database');
        }

        return userCredential;
    };

    /**
     * Sign out the current user
     * Invalidates the Firebase session
     * Requirements: 3.1
     */
    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
    };

    /**
     * Get the current user's ID token for API authentication
     * @returns {Promise<string|null>} The ID token or null if not authenticated
     */
    const getIdToken = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return null;
        }
        return currentUser.getIdToken();
    };

    /**
     * Listen for authentication state changes
     * Restores authentication state on page refresh
     * Requirements: 6.1
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        getIdToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth hook
 * Provides access to authentication context
 * Requirements: 6.1
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthContext };
