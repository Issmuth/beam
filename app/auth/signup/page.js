'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SignUpForm from '../../components/auth/SignUpForm';
import Link from 'next/link';
import BeamLogo from '../../components/BeamLogo';

export default function SignUpPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleSuccess = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-beam-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-beam-glow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-beam-accent-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </main>
        );
    }

    if (user) {
        return null;
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Back to home link */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Back</span>
            </Link>

            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
                        <BeamLogo className="w-7 h-10" />
                        <span className="text-white font-semibold text-xl group-hover:text-beam-accent-light transition-colors">
                            Beam
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-beam-text-secondary">
                        Sign up to save your learning roadmaps
                    </p>
                </div>

                <div className="glass-card p-6 sm:p-8">
                    <SignUpForm onSuccess={handleSuccess} />
                </div>

                <p className="mt-6 text-center text-beam-text-secondary">
                    Already have an account?{' '}
                    <Link
                        href="/auth/signin"
                        className="text-beam-accent-light hover:text-beam-accent transition-colors font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
