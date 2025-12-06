'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BeamTimeline from '../components/BeamTimeline';
import ModuleDetailPanel from '../components/ModuleDetailPanel';
import { ModalCard } from '../components';
import AuthGuard from '../components/auth/AuthGuard';
import { useAuth } from '../contexts/AuthContext';

function RoadmapContent() {
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
                if (!token) { router.push('/auth/signin'); return; }

                const roadmapId = searchParams.get('id');
                const endpoint = roadmapId ? `/api/roadmaps/${roadmapId}` : '/api/roadmaps/active';
                const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });

                if (!response.ok) {
                    if (response.status === 404) { router.push('/?error=no_roadmap'); return; }
                    throw new Error('Failed to fetch roadmap');
                }

                const data = await response.json();
                if (!data.roadmap) { router.push('/?error=no_roadmap'); return; }

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

    const handleModuleClick = (module, index) => { setSelectedModule(module); setSelectedIndex(index); };
    const handleCloseModal = () => { setSelectedModule(null); setSelectedIndex(null); };

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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Unable to Load Roadmap</h2>
                    <p className="text-beam-text-secondary mb-8">{loadError}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={() => router.push('/chat')} className="px-6 py-3 bg-beam-gradient text-white font-medium rounded-xl hover:shadow-glow transition-all duration-300">Generate New Roadmap</button>
                        <button onClick={() => router.push('/')} className="px-6 py-3 glass-card text-white font-medium hover:bg-white/10 transition-all duration-300">Go Home</button>
                    </div>
                </div>
            </main>
        );
    }

    if (!roadmap) return null;

    return (
        <main className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 px-4 py-3">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card px-4 py-3 flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200" aria-label="Go back">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-white font-semibold truncate">{roadmap.goal || 'Your Roadmap'}</h1>
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
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 lg:flex-none lg:w-1/2 xl:w-3/5 overflow-y-auto">
                    <div className="max-w-xl mx-auto lg:max-w-none lg:mx-0 lg:ml-auto lg:mr-0 lg:pr-8">
                        <BeamTimeline modules={roadmap.modules || []} onModuleClick={handleModuleClick} selectedIndex={selectedIndex} />
                    </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 xl:w-2/5 border-l border-white/10 bg-beam-surface/30">
                    <div className="sticky top-0 h-[calc(100vh-5rem)]">
                        <ModuleDetailPanel module={selectedModule} onClose={handleCloseModal} />
                    </div>
                </div>
            </div>
            {isMobile && (
                <ModalCard isOpen={!!selectedModule} onClose={handleCloseModal}>
                    {selectedModule && (
                        <div className="space-y-4 text-white">
                            <h2 className="text-xl font-bold pr-8">{selectedModule.name}</h2>
                            {selectedModule.weeks && (
                                <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-beam-gradient-subtle text-beam-accent-light">
                                    {selectedModule.weeks} {selectedModule.weeks === 1 ? 'week' : 'weeks'}
                                </span>
                            )}
                            {selectedModule.description && <p className="text-beam-text-secondary leading-relaxed">{selectedModule.description}</p>}
                            {selectedModule.milestones?.length > 0 && (
                                <div>
                                    <p className="font-semibold text-beam-accent-light mb-2">Milestones</p>
                                    <ul className="space-y-2">
                                        {selectedModule.milestones.map((m, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-beam-text-secondary">
                                                <span className="w-5 h-5 rounded-md bg-beam-gradient flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">{i + 1}</span>
                                                {m}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedModule.resources?.length > 0 && (
                                <div>
                                    <p className="font-semibold text-beam-accent-light mb-2">Resources</p>
                                    <ul className="space-y-2">
                                        {selectedModule.resources.map((r, i) => (
                                            <li key={i}>
                                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white truncate">{r.title}</p>
                                                        <p className="text-xs text-beam-text-secondary capitalize">{r.type}</p>
                                                    </div>
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
    );
}

function LoadingFallback() {
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

export default function RoadmapPage() {
    return (
        <AuthGuard>
            <Suspense fallback={<LoadingFallback />}>
                <RoadmapContent />
            </Suspense>
        </AuthGuard>
    );
}
