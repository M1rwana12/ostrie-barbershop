/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0c0c0d',
        bg2: '#111113',
        bg3: '#17171a',
        ink: '#ece7df',
        'ink-dim': '#9b958c',
        'ink-faint': '#5a554e',
        accent: '#c9742d',
        'accent-hi': '#e08e3f',
        'accent-lo': '#8a4d1c',
        line: '#262428',
      },
      fontFamily: {
        display: ['Anton', 'Arial Narrow', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1320px' },
    },
  },
  plugins: [],
}
