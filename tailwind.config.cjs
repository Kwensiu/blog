/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
      backdropBlur: {
        xs: '2px',
        lg: '40px',
      },
      // 添加backdropBlur相关功能
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(12px)',
      },
      height: {
        '17': '4.25rem',  // 68px
        '18': '4.5rem',   // 72px
        '19': '4.75rem',  // 76px
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
