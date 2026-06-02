/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-dark':   '#0F5C32',
        'green-main':   '#1B8A4C',
        'green-vivid':  '#22A85C',
        'green-light':  '#D4F5E2',
        'green-xlight': '#EDFAF3',
        'offwhite':     '#F7FDF4',
        'text-dark':    '#0D2818',
        'text-muted':   '#5A8A6A',
        'border-green': '#C8EDD8',
        'amber':        '#F59E0B',
        'amber-dark':   '#D97706',
        'amber-light':  '#FEF3C7',
        'mint-glow':    '#6EE9A8',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        dm:       ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-hero':    'clamp(40px, 6.5vw, 80px)',
        'fluid-section': 'clamp(26px, 4vw, 46px)',
        'fluid-h2':      'clamp(24px, 3.5vw, 40px)',
      },
      boxShadow: {
        'glow-green': '0 6px 20px rgba(34,168,92,0.4)',
        'glow-green-lg': '0 10px 40px rgba(34,168,92,0.35)',
        'card': '0 8px 32px rgba(15,92,50,0.08)',
        'card-hover': '0 24px 60px rgba(27,138,76,0.18)',
      },
      backgroundImage: {
        'radial-green': 'radial-gradient(ellipse at center, rgba(34,168,92,0.07) 0%, transparent 70%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-slow': 'pulse 5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
