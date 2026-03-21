export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#f5f0e8',
        ink: '#2c2416',
        sienna: '#a0522d',
        sage: '#7c9a7e',
        rust: '#b5451b',
        cream: '#fdf8f0',
        darkbg: '#1a1510',
        darkcard: '#2a2118',
        darkmuted: '#3d3020',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
