/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      opacity: { '12': '0.12' },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        navy: {
          950: '#0a1628',
          900: '#0f1f35',
          800: '#111f30',
          700: '#162840',
        },
        'slate-blue': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 4.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'flow': 'flow 3s linear infinite',
        'flow-reverse': 'flow-reverse 3s linear infinite',
        'glow': 'glow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'draw-line': 'draw-line 1.5s ease-out',
        'breath': 'breath 3s ease-in-out infinite',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '200' },
          '100%': { strokeDashoffset: '0' },
        },
        'flow-reverse': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '200' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(4px)' },
          '50%': { opacity: '1', filter: 'blur(8px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.7)' },
          '70%': { boxShadow: '0 0 0 12px rgba(6, 182, 212, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'breath': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'grid-subtle': `
          linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px)
        `,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(6, 182, 212, 0.12) 0%, transparent 100%)',
        'mesh-gradient': `
          linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(59, 130, 246, 0.03) 25%, rgba(139, 92, 246, 0.02) 50%, rgba(16, 185, 129, 0.02) 75%, rgba(6, 182, 212, 0.05) 100%)
        `,
      },
      backgroundSize: {
        'grid': '64px 64px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'glow-cyan-sm': '0 0 10px rgba(6, 182, 212, 0.25)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
        'glow-indigo': '0 0 20px rgba(129, 140, 248, 0.35)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(6, 182, 212, 0.2)',
        'card-lift': '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(6, 182, 212, 0.3)',
        'portrait-glow': '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 40px rgba(6, 182, 212, 0.1)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
