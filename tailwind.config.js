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
        posh: {
          bg: '#081712',
          deep: '#040C09',
          card: '#0D241C',
          surface: '#122D23',
          'surface-light': '#1A3B2F',
          border: '#1F4738',
          'border-light': '#2F614E',
          'border-gold': 'rgba(201, 166, 107, 0.35)',
          gold: '#C9A66B',
          'gold-light': '#E5CE9F',
          'gold-dark': '#9A773F',
          sand: '#EDE4D5',
          sage: '#7DA594',
          'sage-light': '#A7C4B6',
          'text-primary': '#F5EFE8',
          'text-secondary': '#A7BEB2',
          'text-muted': '#6A8778',
        },
        // Keep brand aliases
        brand: {
          forest: '#122D23',
          ivory: '#081712',
          gold: '#C9A66B',
          text: '#F5EFE8',
          secondary: '#A7BEB2',
          divider: '#1E4536',
          surface: '#0D241C',
        }
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
        'serif-bn': ['"Noto Serif Bengali"', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-radial': 'radial-gradient(circle at 50% 0%, #153A2C 0%, #081712 70%)',
        'gold-gradient': 'linear-gradient(135deg, #EAD7B2 0%, #C9A66B 50%, #9A773F 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(20, 48, 37, 0.75) 0%, rgba(10, 24, 18, 0.9) 100%)',
        'card-glow': 'radial-gradient(ellipse at top, rgba(201, 166, 107, 0.12) 0%, transparent 70%)',
        'glow-pill': 'linear-gradient(135deg, rgba(201, 166, 107, 0.15) 0%, rgba(31, 71, 56, 0.3) 100%)',
      },
      boxShadow: {
        'luxury-glow': '0 0 40px -10px rgba(201, 166, 107, 0.18)',
        'emerald-glow': '0 0 50px -12px rgba(31, 71, 56, 0.4)',
        'button-gold': '0 4px 25px -4px rgba(201, 166, 107, 0.4)',
      }
    },
  },
  plugins: [],
}
