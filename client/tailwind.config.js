/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-purple': '#BFBDF9',
        'medium-purple': '#9D9BEC',
        'dark-purple': '#060872'
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        }
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite'
      },
      boxShadow: {
        'button-shadow': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
      }
    }
  },
  plugins: []
}
