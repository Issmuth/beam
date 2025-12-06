'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
    };
    return errorMessages[errorCode] || 'An error occurred during sign in. Please try again.';
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function SignInForm({ onSuccess }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required.');
            return false;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!password) {
            setError('Password is required.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await signIn(email, password);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            const errorCode = err.code || '';
            setError(getErrorMessage(errorCode));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            <div>
                <label
                    htmlFor="email"
                    className="block text-white text-sm font-medium mb-2"
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-beam-text-secondary/60 focus:outline-none focus:border-beam-accent focus:ring-1 focus:ring-beam-accent/50 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    aria-describedby={error ? 'error-message' : undefined}
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-white text-sm font-medium mb-2"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-beam-text-secondary/60 focus:outline-none focus:border-beam-accent focus:ring-1 focus:ring-beam-accent/50 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-beam-gradient text-white font-medium rounded-xl hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing In...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
    );
}
