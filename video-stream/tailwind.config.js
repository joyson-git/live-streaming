/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure all your React files are included here
    './node_modules/flowbite-react/**/*.js', // Include Flowbite components
  ],
  theme: {
    extend: {},
  },
  plugins: [

    require('flowbite/plugin'),
  ],
  darkMode:"class",
}

