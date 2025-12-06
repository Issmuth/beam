'use client';

import { memo } from 'react';

/**
 * ChatBubble component with modern styling
 * User: Gradient border bubble, right-aligned
 * System: Glass effect bubble, left-aligned
 * Error: Red-tinted bubble with warning icon
 */
function ChatBubble({ role, content, timestamp, isError = false }) {
    const isUser = role === 'user';

    const formattedTime = timestamp
        ? new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
        : null;

    const getBubbleStyles = () => {
        if (isUser) {
            return 'bg-beam-gradient text-white shadow-glow';
        }
        if (isError) {
            return 'bg-red-500/10 border border-red-500/30 text-white';
        }
        return 'glass-card text-white';
    };

    return (
        <div
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
        >
            <div
                className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl ${getBubbleStyles()}`}
            >
                {isError && (
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <span className="text-xs text-red-400 font-medium">Error</span>
                    </div>
                )}
                <p className="whitespace-pre-wrap break-words leading-relaxed">{content}</p>
                {formattedTime && (
                    <span className={`block text-xs mt-2 ${isUser ? 'text-white/70' : 'text-beam-text-secondary'}`}>
                        {formattedTime}
                    </span>
                )}
            </div>
        </div>
    );
}

export default memo(ChatBubble);
