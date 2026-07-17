/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                ink: {
                    950: '#060608',
                    900: '#0b0b10',
                    850: '#101017',
                    800: '#16161f',
                    700: '#1f1f2b',
                },
                iris: {
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                },
            },
            boxShadow: {
                'glow': '0 0 40px -8px rgba(99, 102, 241, 0.45)',
                'glow-sm': '0 0 24px -6px rgba(99, 102, 241, 0.35)',
                'lift': '0 20px 50px -16px rgba(0, 0, 0, 0.65)',
                'card': '0 4px 24px -8px rgba(0, 0, 0, 0.5)',
            },
            keyframes: {
                aurora: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(40px, -30px) scale(1.1)' },
                    '66%': { transform: 'translate(-30px, 25px) scale(0.95)' },
                },
                'aurora-alt': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '40%': { transform: 'translate(-45px, 20px) scale(1.08)' },
                    '75%': { transform: 'translate(30px, -25px) scale(0.92)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                aurora: 'aurora 18s ease-in-out infinite',
                'aurora-alt': 'aurora-alt 22s ease-in-out infinite',
                float: 'float 6s ease-in-out infinite',
                shimmer: 'shimmer 2.2s linear infinite',
                'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
            },
        },
    },
    plugins: [],
}
