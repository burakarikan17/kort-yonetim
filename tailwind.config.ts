import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070b10",
          900: "#0d141c",
          850: "#111a24",
          800: "#172231",
          700: "#243345"
        },
        court: {
          green: "#16a34a",
          red: "#ef4444",
          amber: "#f59e0b"
        }
      },
      boxShadow: {
        panel: "0 18px 55px rgba(0, 0, 0, 0.28)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
