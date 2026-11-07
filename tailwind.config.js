/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#173E35',
          'forest-deep': '#0D2520',
          'forest-soft': '#205045',
          ivory: '#F6F2E9',
          'ivory-light': '#FAF8F3',
          'ivory-warm': '#EFE9DC',
          gold: '#B99554',
          'gold-subtle': '#D8C39A',
          'gold-deep': '#8F7138',
          text: '#243C34',
          secondary: '#596B61',
          divider: '#D8DED2',
          'divider-subtle': '#E8EDE3',
          surface: '#FFFFFF',
        }
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
        'serif-bn': ['"Noto Serif Bengali"', 'serif'],
        editorial: ['"Newsreader"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'tight-bn': '-0.015em',
        'wide-editorial': '0.08em',
      },
      backgroundImage: {
        'subtle-grain': "radial-gradient(rgba(23, 62, 53, 0.04) 1px, transparent 0)",
      }
    },
  },
  plugins: [],
}
