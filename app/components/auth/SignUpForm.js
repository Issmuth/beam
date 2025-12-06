'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    return errorMessages[errorCode] || 'An error occurred during registration. Please try again.';
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password.length >= 6;
};

export default function SignUpForm({ onSuccess }) {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
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
        if (!isValidPassword(password)) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
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
            await signUp(email, password, displayName || null);
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
                    htmlFor="displayName"
                    className="block text-white text-sm font-medium mb-2"
                >
                    Display Name <span className="text-beam-text-secondary font-normal">(optional)</span>
                </label>
                <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-beam-text-secondary/60 focus:outline-none focus:border-beam-accent focus:ring-1 focus:ring-beam-accent/50 transition-all duration-200"
                    placeholder="Enter your name"
                    disabled={loading}
                />
            </div>

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
                    placeholder="Min. 6 characters"
                    required
                    disabled={loading}
                    minLength={6}
                />
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-white text-sm font-medium mb-2"
                >
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-beam-text-secondary/60 focus:outline-none focus:border-beam-accent focus:ring-1 focus:ring-beam-accent/50 transition-all duration-200"
                    placeholder="Confirm your password"
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
                        Creating Account...
                    </>
                ) : (
                    'Sign Up'
                )}
            </button>
        </form>
    );
}
