import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        abby: {
          black: "var(--abby-black)",
          "black-soft": "var(--abby-black-soft)",
          "black-card": "var(--abby-black-card)",
          "off-white": "var(--abby-off-white)",
          cream: "var(--abby-cream)",
          stone: "var(--abby-stone)",
          gold: "var(--abby-gold)",
          "gold-light": "var(--abby-gold-light)",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
