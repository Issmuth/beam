'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import BeamLogo from './BeamLogo';

/**
 * Header component with logo, optional title, and authentication controls
 */
export default function Header({ showBackButton = false, title = '' }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <header className="sticky top-0 z-50 px-4 py-3">
            <div className="max-w-7xl mx-auto">
                <div className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between">
                    {/* Logo / Back button area */}
                    <div className="flex items-center gap-3">
                        {showBackButton ? (
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
                                aria-label="Go back"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <Link
                                href={user ? '/dashboard' : '/'}
                                className="flex items-center gap-2.5 group"
                                aria-label="Beam logo"
                            >
                                <BeamLogo className="w-6 h-8" />
                                <span className="text-white font-semibold text-lg group-hover:text-beam-accent-light transition-colors">
                                    Beam
                                </span>
                            </Link>
                        )}
                        {title && (
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-beam-text-secondary">/</span>
                                <span className="text-white font-medium">{title}</span>
                            </div>
                        )}
                    </div>

                    {/* Auth controls */}
                    <div className="flex items-center gap-2">
                        {!loading && (
                            <>
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
                                            aria-label="Dashboard"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                                />
                                            </svg>
                                            <span className="hidden sm:inline text-sm">Dashboard</span>
                                        </Link>

                                        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
                                            <div className="w-6 h-6 rounded-full bg-beam-gradient flex items-center justify-center">
                                                <span className="text-white text-xs font-medium">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-beam-text-secondary text-sm max-w-[120px] truncate">
                                                {user.email}
                                            </span>
                                        </div>

                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
                                            aria-label="Sign out"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span className="hidden sm:inline text-sm">Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/signin"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-beam-gradient text-white font-medium hover:shadow-glow transition-all duration-200"
                                        aria-label="Sign in"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <span className="text-sm">Sign In</span>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
