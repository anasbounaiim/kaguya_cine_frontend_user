export default {
  theme: {
    extend: {
      colors: {
        primary: "#E50914",
        surface: { DEFAULT: "#0D0D0D", light: "#1c1c1c" },
      },
      borderRadius: { card: "0.75rem", hero: "1.75rem" },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
