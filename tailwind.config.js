module.exports = {
  darkMode: "class",
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: "#E50914",
        ink: "#0C1118",
        "overlay-fg": "#F5F7FA",
        "overlay-fg-muted": "#B7BDC6",
        base: "rgb(var(--color-bg-base) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        "fg-muted": "rgb(var(--color-fg-muted) / <alpha-value>)",
        "fg-faint": "rgb(var(--color-fg-faint) / <alpha-value>)",
        "surface-elevated": "rgb(var(--color-surface-elevated) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
