/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'primary-dark': '#4338CA',
        'primary-light': '#EEF2FF',
        accent: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-1': 'float1 3.6s ease-in-out infinite',
        'float-2': 'float2 4.3s ease-in-out infinite 0.7s',
        'float-3': 'float3 3.9s ease-in-out infinite 1.2s',
        'blob-1': 'blob1 11s ease-in-out infinite',
        'blob-2': 'blob2 14s ease-in-out infinite 1.5s',
        'blob-3': 'blob3 12s ease-in-out infinite 3s',
        'fade-up': 'fadeUp 0.5s ease both',
      },
      keyframes: {
        float1: { '0%,100%': { transform: 'translateY(0) rotate(-3deg)' }, '50%': { transform: 'translateY(-14px) rotate(-3deg)' } },
        float2: { '0%,100%': { transform: 'translateY(0) rotate(4deg)' }, '50%': { transform: 'translateY(-18px) rotate(4deg)' } },
        float3: { '0%,100%': { transform: 'translateY(0) rotate(-2deg)' }, '50%': { transform: 'translateY(-10px) rotate(-2deg)' } },
        blob1: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(40px,-30px) scale(1.12)' } },
        blob2: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(-28px,32px) scale(0.9)' } },
        blob3: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(22px,18px) scale(1.07)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}