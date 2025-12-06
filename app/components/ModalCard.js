'use client';

import { useEffect, useCallback } from 'react';

/**
 * ModalCard component with glass morphism effect
 */
export default function ModalCard({ children, isOpen, onClose }) {
    const handleEscape = useCallback(
        (e) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative glass-card p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-beam-lg">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl text-beam-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200"
                        aria-label="Close modal"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
