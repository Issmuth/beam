'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BeamTimeline from '../components/BeamTimeline';
import ModuleDetailPanel from '../components/ModuleDetailPanel';
import { ModalCard } from '../components';
import AuthGuard from '../components/auth/AuthGuard';
import { useAuth } from '../contexts/AuthContext';

/**
 * Roadmap Page - Display generated learning roadmap with glowing beam timeline
 */
export default function RoadmapPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { getIdToken } = useAuth();
    const [roadmap, setRoadmap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const token = await getIdToken();
                if (!token) {
                    router.push('/auth/signin');
                    return;
                }

                const roadmapId = searchParams.get('id');
                const endpoint = roadmapId
                    ? `/api/roadmaps/${roadmapId}`
                    : '/api/roadmaps/active';

                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        router.push('/?error=no_roadmap');
                        return;
                    }
                    throw new Error('Failed to fetch roadmap');
                }

                const data = await response.json();

                if (!data.roadmap) {
                    router.push('/?error=no_roadmap');
                    return;
                }

                const roadmapData = data.roadmap.roadmapData || data.roadmap;

                if (!roadmapData.goal || !roadmapData.modules || !Array.isArray(roadmapData.modules)) {
                    setLoadError('The roadmap data appears to be corrupted. Please generate a new roadmap.');
                    setIsLoading(false);
                    return;
                }

                setRoadmap(roadmapData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading roadmap:', error);
                setLoadError('Failed to load roadmap data. Please try again.');
                setIsLoading(false);
            }
        };

        fetchRoadmap();
    }, [router, searchParams, getIdToken]);

    const handleModuleClick = (module, index) => {
        setSelectedModule(module);
        setSelectedIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedModule(null);
        setSelectedIndex(null);
    };

    const handleGoToChat = () => {
        router.push('/chat');
    };

    const handleGoHome = () => {
        router.push('/');
    };

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-beam-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-beam-glow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-beam-accent-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-beam-text-secondary">Loading roadmap...</p>
                </div>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md text-center animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Unable to Load Roadmap</h2>
                    <p className="text-beam-text-secondary mb-8">{loadError}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleGoToChat}
                            className="px-6 py-3 bg-beam-gradient text-white font-medium rounded-xl hover:shadow-glow transition-all duration-300"
                            aria-label="Generate new roadmap"
                        >
                            Generate New Roadmap
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="px-6 py-3 glass-card text-white font-medium hover:bg-white/10 transition-all duration-300"
                            aria-label="Go to home"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!roadmap) {
        return null;
    }

    return (
        <AuthGuard>
            <main className="min-h-screen flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-50 px-4 py-3">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-card px-4 py-3 flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-white font-semibold truncate">
                                    {roadmap.goal || 'Your Roadmap'}
                                </h1>
                            </div>
                            {roadmap.duration_estimate && (
                                <span className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-beam-gradient-subtle text-beam-accent-light">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {roadmap.duration_estimate}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Beam Timeline */}
                    <div className="flex-1 lg:flex-none lg:w-1/2 xl:w-3/5 overflow-y-auto">
                        <div className="max-w-xl mx-auto lg:max-w-none lg:mx-0 lg:ml-auto lg:mr-0 lg:pr-8">
                            <BeamTimeline
                                modules={roadmap.modules || []}
                                onModuleClick={handleModuleClick}
                                selectedIndex={selectedIndex}
                            />
                        </div>
                    </div>

                    {/* Detail Panel - Desktop */}
                    <div className="hidden lg:block lg:w-1/2 xl:w-2/5 border-l border-white/10 bg-beam-surface/30">
                        <div className="sticky top-0 h-[calc(100vh-5rem)]">
                            <ModuleDetailPanel
                                module={selectedModule}
                                onClose={handleCloseModal}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Modal */}
                {isMobile && (
                    <ModalCard isOpen={!!selectedModule} onClose={handleCloseModal}>
                        {selectedModule && (
                            <div className="space-y-4 text-white">
                                <h2 className="text-xl font-bold pr-8">
                                    {selectedModule.name}
                                </h2>
                                {selectedModule.weeks && (
                                    <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-beam-gradient-subtle text-beam-accent-light">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {selectedModule.weeks} {selectedModule.weeks === 1 ? 'week' : 'weeks'}
                                    </span>
                                )}
                                {selectedModule.description && (
                                    <p className="text-beam-text-secondary leading-relaxed">{selectedModule.description}</p>
                                )}
                                {selectedModule.milestones && selectedModule.milestones.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-beam-accent-light mb-2">Milestones</p>
                                        <ul className="space-y-2">
                                            {selectedModule.milestones.map((milestone, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-beam-text-secondary">
                                                    <span className="w-5 h-5 rounded-md bg-beam-gradient flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                                                        {index + 1}
                                                    </span>
                                                    {milestone}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {selectedModule.tasks && selectedModule.tasks.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-beam-accent-light mb-2">Tasks</p>
                                        <ul className="space-y-2">
                                            {selectedModule.tasks.map((task, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-beam-text-secondary">
                                                    <span className="w-4 h-4 rounded border border-beam-accent/50 flex-shrink-0 mt-0.5" />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {selectedModule.resources && selectedModule.resources.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-beam-accent-light mb-2">Resources</p>
                                        <ul className="space-y-2">
                                            {selectedModule.resources.map((resource, index) => (
                                                <li key={index}>
                                                    <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                                                    >
                                                        <ResourceTypeIcon type={resource.type} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white truncate">{resource.title}</p>
                                                            <p className="text-xs text-beam-text-secondary capitalize">{resource.type}</p>
                                                        </div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-beam-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalCard>
                )}
            </main>
        </AuthGuard>
    );
}

function ResourceTypeIcon({ type }) {
    const iconClass = "h-5 w-5";
    switch (type?.toLowerCase()) {
        case 'video':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-red-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'documentation':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-blue-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case 'article':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-green-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            );
        case 'course':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-purple-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
            );
        case 'tool':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-yellow-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            );
        default:
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClass} text-beam-accent-light`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            );
    }
}
