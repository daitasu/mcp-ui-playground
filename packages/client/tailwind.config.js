/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      pc: { min: "580px" },
    },
    fontFamily: {
      sans: [
        "IBM Plex Sans",
        "ヒラギノ角ゴシック",
        "Hiragino Sans",
        "Yu Gothic UI",
        "Yu Gothic",
        "メイリオ",
        "Meiryo",
        "sans-serif",
      ],
    },
    fontWeight: {
      normal: 300,
      bold: 600,
    },
    fontSize: {
      16: ["16px", { lineHeight: "1.6", letterSpacing: "0.02em" }],
      20: ["20px", { lineHeight: "1.6", letterSpacing: "0.02em" }],
      24: ["24px", { lineHeight: "1.6", letterSpacing: "0.02em" }],
      32: ["32px", { lineHeight: "1.6", letterSpacing: "0.02em" }],
    },
    boxShadow: {
      DEFAULT: "0 8px 16px rgba(0, 0, 0, 0.12)",
    },
    spacing: {
      0: "0px",
      0.5: "4px",
      1: "8px",
      1.5: "12px",
      2: "16px",
      2.5: "20px",
      3: "24px",
      4: "32px",
      5: "40px",
      6: "48px",
      7: "56px",
      8: "64px",
      9: "72px",
    },
    borderRadius: {
      0: "0px",
      4: "4px",
      8: "8px",
      12: "12px",
      16: "16px",
      20: "20px",
      full: "9999px",
    },
    height: {
      full: "100%",
      screen: "100vh",
      auto: "auto",
      fit: "fit-content",
    },
    width: {
      full: "100%",
      screen: "100vw",
      auto: "auto",
      fit: "fit-content",
      180: "180px", // Button
      250: "250px",
      420: "420px",
    },
    maxWidth: {
      180: "180px", // Button
      250: "250px",
      420: "420px",
    },
    extend: {
      colors: {
        'green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
    },
  },
  plugins: [],
};