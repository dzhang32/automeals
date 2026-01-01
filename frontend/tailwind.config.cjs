/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#181c28',
        'bg-secondary': '#1e2433',
        'bg-card': '#232938',
        'bg-card-hover': '#2a3142',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a8b8',
        'text-muted': '#6b7280',
        'accent-coral': '#e07066',
        'accent-coral-hover': '#c85c52',
        'accent-mint': '#7ec89b',
        'accent-mint-hover': '#6ab587',
        'border-color': '#2d3548',
        'border-light': '#3a4358',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
