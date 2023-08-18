/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'project-orange':"#E49D65",
        'project-orange-1':"#EEAF7D",
        'project-black': '#111111',
        'project-navy' : {
          1:'#585b6e',
          2:'#292C39'
        }
      }
    },

  },
  plugins: [],
}

