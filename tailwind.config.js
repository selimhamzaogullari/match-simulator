/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pitch: {
          lowest: '#050913',
          dark: '#080e1c',
          surface: '#0d1321',
          card: '#121929',
          lighter: '#1a2338',
          border: '#1f2d47',
          highlight: '#2a3b5c'
        },
        stadium: {
          950: '#050811',
          900: '#090e1a',
          850: '#0c1322',
          800: '#11192b',
          700: '#1c273e'
        },
        turf: {
          dark: '#051b14',
          mid: '#08261d',
          light: '#0c3327',
          line: 'rgba(52, 211, 153, 0.22)',
          glow: 'rgba(16, 185, 129, 0.15)'
        },
        amber: {
          accent: '#f59e0b',
          glow: '#fbbf24',
          soft: '#d97706'
        },
        pulse: {
          emerald: '#10b981',
          neon: '#00f59b',
          amber: '#f59e0b',
          crimson: '#dc2626'
        },
        electric: {
          400: '#38bdf8',
          500: '#0ea5e9'
        },
        gs: {
          red: '#ea1b2e',
          gold: '#fdb913',
          glow: 'rgba(234, 27, 46, 0.45)'
        },
        fb: {
          navy: '#002d72',
          yellow: '#ffed00',
          glow: 'rgba(0, 45, 114, 0.5)'
        }
      },
      fontFamily: {
        athletic: ['"Barlow Condensed"', 'sans-serif'],
        display: ['"Chakra Petch"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif']
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-neon': '0 0 25px -5px rgba(0, 245, 155, 0.5)',
        'glow-gs': '0 0 25px -5px rgba(234, 27, 46, 0.4)',
        'glow-fb': '0 0 25px -5px rgba(255, 237, 0, 0.3)',
        'inner-subtle': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.06)' }
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.9' },
          '50%': { transform: 'scale(1.15)', opacity: '0.4' },
          '100%': { transform: 'scale(0.95)', opacity: '0.9' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'shimmer': 'shimmer 2.2s infinite ease-in-out',
        'pulse-ring': 'pulseRing 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite'
      }
    }
  },
  plugins: []
}
