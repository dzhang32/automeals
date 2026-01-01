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
        'accent-coral': '#b8663c',
        'accent-coral-hover': '#a05530',
        'accent-mint': '#3b82f6',
        'accent-mint-hover': '#2563eb',
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
