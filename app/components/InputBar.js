'use client';

import { useState } from 'react';

/**
 * InputBar component with modern pill-shaped styling and gradient accent
 */
export default function InputBar({
    value = '',
    onChange,
    onSubmit,
    placeholder = 'Type your message...',
    disabled = false,
}) {
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    const currentValue = onChange ? value : internalValue;

    const handleChange = (e) => {
        const newValue = e.target.value;
        if (onChange) {
            onChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentValue.trim() && onSubmit) {
            onSubmit(currentValue);
            if (!onChange) {
                setInternalValue('');
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className={`relative flex items-center rounded-full transition-all duration-300 ${isFocused ? 'shadow-beam' : ''
                }`}>
                {/* Gradient border effect */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-beam-accent via-beam-glow to-beam-accent-light opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-100' : ''
                    }`} style={{ padding: '1px' }}>
                    <div className="w-full h-full rounded-full bg-beam-surface" />
                </div>

                <input
                    type="text"
                    value={currentValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="relative w-full px-6 py-4 bg-beam-surface text-white placeholder-beam-text-secondary/60 rounded-full border border-white/10 focus:outline-none focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-14"
                    aria-label={placeholder}
                />
                <button
                    type="submit"
                    disabled={disabled || !currentValue.trim()}
                    className={`absolute right-2 p-2.5 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${currentValue.trim()
                            ? 'bg-beam-gradient text-white shadow-glow hover:scale-105'
                            : 'text-beam-text-secondary hover:text-white hover:bg-white/5'
                        }`}
                    aria-label="Submit"
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
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                </button>
            </div>
        </form>
    );
}
