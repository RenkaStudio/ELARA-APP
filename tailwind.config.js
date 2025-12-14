module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1e3a8a', // ELARA Primary Blue
        'primary-dark': '#1e293b', // Darker ELARA Blue
        'secondary': '#3b82f6', // ELARA Secondary Blue
        'accent': '#60a5fa', // ELARA Blue Accent (replacing orange accent)
        'accent-light': '#dbeafe', // Light blue (replacing light orange)
        'warning': '#93c5fd', // Blue for warnings (replacing orange)
        'danger': '#ef4444', // Red for errors
        'bg-light': '#f8fafc', // ELARA Light Background
        'bg-card': '#FFFFFF', // Card background
        'text-dark': '#1e293b', // ELARA Dark Text
        'text-light': '#64748b', // ELARA Light Text
        'text-lighter': '#94a3b8', // Lighter text
        'border-color': '#e2e8f0', // ELARA Border color
        'success': '#10b981', // Green success color
        'error': '#ef4444', // Red error color
        'gradient-start': '#1e3a8a',
        'gradient-end': '#3b82f6',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}