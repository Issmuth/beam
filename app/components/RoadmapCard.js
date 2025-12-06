'use client';

/**
 * RoadmapCard component for displaying modules and timeline entries
 */
export default function RoadmapCard({ title, content, type = 'module' }) {
    const isModule = type === 'module';

    const renderContent = () => {
        if (typeof content === 'string') {
            return <p className="text-beam-text-secondary leading-relaxed">{content}</p>;
        }

        if (Array.isArray(content)) {
            return (
                <ul className="space-y-2">
                    {content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-beam-text-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-beam-accent mt-2 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            );
        }

        // For module type with full module object
        if (isModule && content && typeof content === 'object') {
            return (
                <div className="space-y-4">
                    {content.description && (
                        <p className="text-beam-text-secondary leading-relaxed">{content.description}</p>
                    )}
                    {content.weeks && (
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-beam-gradient-subtle text-beam-accent-light text-sm">
                                {content.weeks} {content.weeks === 1 ? 'week' : 'weeks'}
                            </span>
                        </div>
                    )}
                    {content.milestones && content.milestones.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-white mb-2">Milestones</p>
                            <ul className="space-y-2">
                                {content.milestones.map((milestone, index) => (
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
                    {content.resources && content.resources.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-white mb-2">Resources</p>
                            <ul className="space-y-2">
                                {content.resources.map((resource, index) => (
                                    <li key={index}>
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-beam-accent-light hover:text-beam-accent transition-colors group"
                                        >
                                            <span className="text-beam-text-secondary">[{resource.type}]</span>
                                            <span className="group-hover:underline">{resource.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }

        // For timeline type with full timeline object
        if (!isModule && content && typeof content === 'object') {
            return (
                <div className="space-y-2">
                    {content.tasks && content.tasks.length > 0 && (
                        <ul className="space-y-2">
                            {content.tasks.map((task, index) => (
                                <li key={index} className="flex items-start gap-2 text-beam-text-secondary">
                                    <span className="w-1.5 h-1.5 rounded-full bg-beam-accent mt-2 flex-shrink-0" />
                                    {task}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="glass-card p-5 hover:shadow-beam transition-all duration-300">
            <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
            {renderContent()}
        </div>
    );
}
