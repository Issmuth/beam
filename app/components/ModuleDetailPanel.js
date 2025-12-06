'use client';

/**
 * ModuleDetailPanel - Desktop side panel for showing module details
 */
export default function ModuleDetailPanel({ module, onClose }) {
    if (!module) {
        return (
            <div className="h-full flex items-center justify-center text-beam-text-secondary p-8">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-beam-gradient-subtle flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-beam-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-white mb-2">Select a Module</p>
                    <p className="text-sm">Click on any module in the timeline to view its details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 animate-fade-in">
            {/* Close button for tablet view */}
            <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 p-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close panel"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="space-y-6">
                {/* Module name */}
                <div>
                    <h2 className="text-2xl font-bold text-white pr-8 mb-2">
                        {module.name}
                    </h2>
                    {module.weeks && (
                        <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-beam-gradient-subtle text-beam-accent-light">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {module.weeks} {module.weeks === 1 ? 'week' : 'weeks'}
                        </span>
                    )}
                </div>

                {/* Description */}
                {module.description && (
                    <div className="glass-card p-4">
                        <p className="text-white/90 leading-relaxed">
                            {module.description}
                        </p>
                    </div>
                )}

                {/* Milestones */}
                {module.milestones && module.milestones.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-beam-accent-light uppercase tracking-wider mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Milestones
                        </h3>
                        <ul className="space-y-2">
                            {module.milestones.map((milestone, index) => (
                                <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <span className="w-6 h-6 rounded-lg bg-beam-gradient flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-glow">
                                        {index + 1}
                                    </span>
                                    <span className="text-white/90 pt-0.5">{milestone}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Tasks */}
                {module.tasks && module.tasks.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-beam-accent-light uppercase tracking-wider mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Tasks
                        </h3>
                        <ul className="space-y-2">
                            {module.tasks.map((task, index) => (
                                <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                    <span className="w-5 h-5 rounded-md border-2 border-beam-accent/50 flex-shrink-0 mt-0.5 group-hover:border-beam-accent transition-colors" />
                                    <span className="text-white/90">{task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Learning Resources */}
                {module.resources && module.resources.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-beam-accent-light uppercase tracking-wider mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Learning Resources
                        </h3>
                        <ul className="space-y-2">
                            {module.resources.map((resource, index) => (
                                <li key={index}>
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group border border-transparent hover:border-beam-accent/30"
                                    >
                                        <span className="w-10 h-10 rounded-xl bg-beam-gradient-subtle flex items-center justify-center flex-shrink-0">
                                            <ResourceIcon type={resource.type} />
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium group-hover:text-beam-accent-light transition-colors truncate">
                                                {resource.title}
                                            </p>
                                            <p className="text-xs text-beam-text-secondary capitalize mt-0.5">
                                                {resource.type}
                                            </p>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-beam-text-secondary group-hover:text-beam-accent-light transition-colors flex-shrink-0 mt-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * ResourceIcon - Returns appropriate icon based on resource type
 */
function ResourceIcon({ type }) {
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
