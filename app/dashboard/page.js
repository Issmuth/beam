'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';
import BeamLogo from '../components/BeamLogo';

/**
 * Dashboard Page - User's central hub for managing roadmaps
 */
export default function DashboardPage() {
    const router = useRouter();
    const { user, getIdToken, signOut } = useAuth();
    const [roadmaps, setRoadmaps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const token = await getIdToken();
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await fetch('/api/roadmaps', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoadmaps(data.roadmaps || []);
                }
            } catch (error) {
                console.error('Error fetching roadmaps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoadmaps();
    }, [getIdToken]);

    const handleViewRoadmap = (id) => {
        router.push(`/roadmap?id=${id}`);
    };

    const handleDeleteRoadmap = async (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this roadmap?')) {
            try {
                const token = await getIdToken();
                const response = await fetch(`/api/roadmaps/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setRoadmaps(roadmaps.filter(r => r.id !== id));
                }
            } catch (error) {
                console.error('Error deleting roadmap:', error);
            }
        }
    };

    const handleStartNewChat = () => {
        router.push('/chat');
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <AuthGuard>
            <main className="min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-50 px-4 py-3">
                    <div className="max-w-6xl mx-auto">
                        <div className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <BeamLogo className="w-6 h-8" />
                                <span className="text-white font-semibold text-lg group-hover:text-beam-accent-light transition-colors">
                                    Beam
                                </span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
                                    <div className="w-6 h-6 rounded-full bg-beam-gradient flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">
                                            {user?.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-beam-text-secondary text-sm max-w-[150px] truncate">
                                        {user?.email}
                                    </span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline text-sm">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-10 animate-fade-in">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
                        </h1>
                        <p className="text-beam-text-secondary text-lg">
                            Track your learning progress and start new journeys.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        <button
                            onClick={handleStartNewChat}
                            className="flex items-center gap-4 p-5 bg-beam-gradient rounded-2xl hover:shadow-glow transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">New Roadmap</p>
                                <p className="text-white/70 text-sm">Start a learning journey</p>
                            </div>
                        </button>

                        <Link
                            href="/chat"
                            className="flex items-center gap-4 p-5 glass-card hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 bg-beam-gradient-subtle rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beam-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">Continue Chat</p>
                                <p className="text-beam-text-secondary text-sm">Resume conversation</p>
                            </div>
                        </Link>

                        <div className="flex items-center gap-4 p-5 glass-card">
                            <div className="w-12 h-12 bg-beam-gradient-subtle rounded-xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beam-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-white">{roadmaps.length}</p>
                                <p className="text-beam-text-secondary text-sm">Total Roadmaps</p>
                            </div>
                        </div>
                    </div>

                    {/* Roadmaps Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Your Roadmaps</h2>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-16">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 bg-beam-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-3 h-3 bg-beam-glow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-3 h-3 bg-beam-accent-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        ) : roadmaps.length === 0 ? (
                            <div className="text-center py-16 glass-card animate-fade-in">
                                <div className="w-20 h-20 bg-beam-gradient-subtle rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-beam-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">No roadmaps yet</h3>
                                <p className="text-beam-text-secondary mb-8 max-w-sm mx-auto">
                                    Start a conversation to create your first personalized learning roadmap.
                                </p>
                                <button
                                    onClick={handleStartNewChat}
                                    className="px-8 py-3 bg-beam-gradient text-white font-medium rounded-xl hover:shadow-glow transition-all duration-300"
                                >
                                    Create Your First Roadmap
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roadmaps.map((roadmap, index) => (
                                    <div
                                        key={roadmap.id}
                                        onClick={() => handleViewRoadmap(roadmap.id)}
                                        className="glass-card p-5 hover:bg-white/10 hover:shadow-beam transition-all duration-300 cursor-pointer group animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-beam-gradient rounded-xl flex items-center justify-center shadow-glow">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteRoadmap(roadmap.id, e)}
                                                className="p-2 rounded-lg text-beam-text-secondary hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                aria-label="Delete roadmap"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-beam-accent-light transition-colors">
                                            {roadmap.goal || 'Untitled Roadmap'}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-beam-text-secondary mb-3">
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                {roadmap.roadmapData?.modules?.length || 0} modules
                                            </span>
                                            {roadmap.durationEstimate && (
                                                <>
                                                    <span>•</span>
                                                    <span>{roadmap.durationEstimate}</span>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-xs text-beam-text-secondary/70">
                                            Created {formatDate(roadmap.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}
