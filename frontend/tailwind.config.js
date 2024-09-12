/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      first: 'Bricolage Grotesque',
      second: 'Hedvig Letters Serif',
      third: 'Instrument Serif',
      fourth : 'Inter',
      fifth : 'Space Mono',
      sixth : 'Tulpen One',
      seven : 'Silkscreen',
      eight : 'Outfit',
      nine : 'Maven Pro',
      ten:'Montserrat',
      eleven:'Kristi',
      twelve:'Macondo',
      thirteen:'Teko',
      fourteen:'New Amsterdam',
      fifteen:'Acme',
      sixteen:'Carter One'
    },
    extend: {
      
      
      textShadow: {
        'default': '2px 2px 4px rgba(0, 0, 0, 0.45)',
        'md': '4px 4px 6px rgba(0, 0, 0, 0.5)',
        'lg': '6px 6px 8px rgba(0, 0, 0, 0.6)',
      },
    },
    
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.45)',
        },
        '.text-shadow-md': {
          textShadow: '4px 4px 6px rgba(0, 0, 0, 1.50)',
        },
        '.text-shadow-lg': {
          textShadow: '6px 6px 8px rgba(0, 0, 0, 0.6)',
        },
      });
    },
  ],
}

