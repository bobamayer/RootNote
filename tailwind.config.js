/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: '#3F6664',
        'teal-hover': '#355453',
        'teal-deep': '#26403F',
        plum: '#6B5361',
        brick: '#9C4B3D',
        fog: '#E3E4DC',
        paper: '#ECEBE2',
        moss: '#292E26',
        'moss-muted': '#5B6358',
        line: 'rgba(41,46,38,0.12)',
        'line-strong': 'rgba(41,46,38,0.18)',
        'tag-teal-bg': '#DEE0D8',
        'tag-plum-bg': '#E2DFD8',
        'tag-brick-bg': '#E6DED5',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        rest: '0 1px 2px rgba(41,46,38,0.06), 0 8px 16px rgba(41,46,38,0.08)',
        raised: '0 4px 8px rgba(41,46,38,0.10), 0 16px 32px rgba(41,46,38,0.14)',
        floating: '0 8px 16px rgba(41,46,38,0.14), 0 32px 64px rgba(41,46,38,0.18)',
      },
      borderRadius: {
        DEFAULT: '10px',
        card: '10px',
      },
    },
  },
  plugins: [],
}
