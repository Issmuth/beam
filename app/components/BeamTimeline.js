'use client';

/**
 * BeamTimeline component - displays modules along a glowing vertical beam
 * Modules alternate left and right along the beam with modern styling
 */
export default function BeamTimeline({ modules = [], onModuleClick, selectedIndex = null }) {
    return (
        <div className="relative w-full py-12 px-4">
            {/* The glowing vertical beam */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 md:w-1 -translate-x-1/2">
                {/* Beam glow effect - outer */}
                <div className="absolute inset-0 w-4 -translate-x-1/2 bg-gradient-to-b from-beam-accent/0 via-beam-glow/30 to-beam-accent/0 blur-xl" />
                {/* Beam glow effect - inner */}
                <div className="absolute inset-0 w-2 -translate-x-1/4 bg-gradient-to-b from-beam-accent/0 via-beam-accent-light/40 to-beam-accent/0 blur-md" />
                {/* Beam core */}
                <div className="absolute inset-0 bg-gradient-to-b from-beam-accent/50 via-beam-glow to-beam-accent/50 rounded-full" />
            </div>

            {/* Modules along the beam */}
            <div className="relative flex flex-col gap-12 md:gap-16">
                {modules.map((module, index) => {
                    const isLeft = index % 2 === 0;
                    const isSelected = selectedIndex === index;

                    return (
                        <div
                            key={`module-${index}`}
                            className={`flex items-center ${isLeft ? 'justify-start pr-[52%]' : 'justify-end pl-[52%]'} animate-fade-in`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Connection dot on the beam */}
                            <div
                                className={`absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${isSelected
                                        ? 'w-4 h-4 bg-beam-gradient shadow-glow scale-125'
                                        : 'w-3 h-3 bg-beam-accent/60 hover:bg-beam-accent'
                                    }`}
                            />

                            {/* Module card */}
                            <button
                                onClick={() => onModuleClick && onModuleClick(module, index)}
                                className={`
                                    relative px-5 py-3 md:px-6 md:py-3.5
                                    rounded-2xl
                                    text-white font-medium
                                    transition-all duration-300
                                    cursor-pointer
                                    text-sm md:text-base
                                    group
                                    ${isSelected
                                        ? 'bg-beam-gradient shadow-glow scale-105'
                                        : 'glass-card hover:bg-white/10 hover:scale-102 hover:shadow-beam'}
                                `}
                                aria-label={`View details for ${module.name}`}
                            >
                                <span className={`relative z-10 ${isSelected ? '' : 'group-hover:text-beam-accent-light'} transition-colors`}>
                                    {module.name}
                                </span>

                                {/* Week badge */}
                                {module.weeks && (
                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${isSelected
                                            ? 'bg-white/20 text-white'
                                            : 'bg-beam-accent/20 text-beam-accent-light'
                                        }`}>
                                        {module.weeks}w
                                    </span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
