'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header, InputBar, BeamLogo } from './components';

/**
 * Home Page - Landing page for initial goal input
 */
export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [goal, setGoal] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'no_roadmap') {
            setErrorMessage('No roadmap found. Start a conversation to generate one!');
            window.history.replaceState({}, '', '/');
        }
    }, [searchParams]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleSubmit = (value) => {
        if (value.trim()) {
            router.push(`/chat?goal=${encodeURIComponent(value.trim())}`);
        }
    };

    const handleDismissError = () => {
        setErrorMessage(null);
    };

    return (
        <main className="min-h-screen flex flex-col">
            <Header />

            {/* Error message banner */}
            {errorMessage && (
                <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 animate-slide-up">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card border-amber-500/30 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-amber-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-white text-sm">{errorMessage}</p>
                            </div>
                            <button
                                onClick={handleDismissError}
                                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                aria-label="Dismiss message"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Centered content area */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 animate-fade-in">
                    {/* Decorative element */}
                    <div className="mx-auto mb-8 animate-float">
                        <BeamLogo className="w-16 h-24" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                        What do you want to{' '}
                        <span className="gradient-text">learn</span>?
                    </h1>
                    <p className="text-beam-text-secondary text-lg sm:text-xl max-w-lg mx-auto">
                        Enter your learning goal and let AI create a personalized roadmap for you.
                    </p>
                </div>
            </div>

            {/* Input bar at bottom */}
            <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                <div className="max-w-2xl mx-auto animate-slide-up">
                    <InputBar
                        value={goal}
                        onChange={setGoal}
                        onSubmit={handleSubmit}
                        placeholder="e.g., Learn React in 3 months..."
                    />

                    {/* Quick suggestions */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {['Learn Python', 'Master React', 'Data Science', 'Machine Learning'].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setGoal(suggestion)}
                                className="px-4 py-2 text-sm rounded-full bg-white/5 text-beam-text-secondary hover:bg-white/10 hover:text-white transition-all duration-200 border border-white/10"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
