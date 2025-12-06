/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'beam-bg': '#0a0a0f',
                'beam-surface': '#14141f',
                'beam-surface-light': '#1e1e2d',
                'beam-text-secondary': '#a0a0b0',
                'beam-accent': '#6366f1',
                'beam-accent-light': '#818cf8',
                'beam-glow': '#8b5cf6',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'beam-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                'beam-gradient-subtle': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            },
            boxShadow: {
                'beam': '0 0 30px rgba(139, 92, 246, 0.15)',
                'beam-lg': '0 0 60px rgba(139, 92, 246, 0.2)',
                'glow': '0 0 20px rgba(139, 92, 246, 0.4)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
};
