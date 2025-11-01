/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                'accent': {
                    50: "#f4f7fd",
                    200: "#9a75e4",
                    500: "#0e123e"
                },
                'input' : {
                    600 : '#EAEFF9'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
                'large': '0 8px 24px rgba(0, 0, 0, 0.12)',
                'card': '0 2px 4px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.08)',
                'hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
                'purple': '0 4px 12px rgba(154, 117, 228, 0.25)',
                'purple-lg': '0 8px 24px rgba(154, 117, 228, 0.3)',
                'input': '0 4px 20px rgba(0,0,0,0.05)'
            },
        },
    },
    plugins: [],
}