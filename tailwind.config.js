/** @type {import('tailwindcss').Config} */
const notionColors =
  "(default|gray|brown|orange|yellow|green|blue|purple|pink|red)";

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // 동적 색상 유틸 전부 커버
    { pattern: new RegExp(`^bg-notion-${notionColors}-bg$`) },
    { pattern: new RegExp(`^text-notion-${notionColors}-text$`) },
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "timer-02-bg": "hsl(var(--timer-02-bg))",
        "timer-02-clock-bg": "hsl(var(--timer-02-clock-bg))",
        "timer-02-timer-bg": "hsl(var(--timer-02-timer-bg))",
        "timer-02-timer-text": "hsl(var(--timer-02-timer-text))",
        "timer-02-ring-text": "hsl(var(--timer-02-ring-text))",
        "timer-02-setting-btn": "hsl(var(--timer-02-setting-btn))",
        "notion-default-bg": "hsl(var(--notion-default-bg))",
        "notion-default-text": "hsl(var(--notion-default-text))",
        "notion-gray-bg": "hsl(var(--notion-gray-bg))",
        "notion-gray-text": "hsl(var(--notion-gray-text))",
        "notion-brown-bg": "hsl(var(--notion-brown-bg))",
        "notion-brown-text": "hsl(var(--notion-brown-text))",
        "notion-orange-bg": "hsl(var(--notion-orange-bg))",
        "notion-orange-text": "hsl(var(--notion-orange-text))",
        "notion-yellow-bg": "hsl(var(--notion-yellow-bg))",
        "notion-yellow-text": "hsl(var(--notion-yellow-text))",
        "notion-green-bg": "hsl(var(--notion-green-bg))",
        "notion-green-text": "hsl(var(--notion-green-text))",
        "notion-blue-bg": "hsl(var(--notion-blue-bg))",
        "notion-blue-text": "hsl(var(--notion-blue-text))",
        "notion-purple-bg": "hsl(var(--notion-purple-bg))",
        "notion-purple-text": "hsl(var(--notion-purple-text))",
        "notion-pink-bg": "hsl(var(--notion-pink-bg))",
        "notion-pink-text": "hsl(var(--notion-pink-text))",
        "notion-red-bg": "hsl(var(--notion-red-bg))",
        "notion-red-text": "hsl(var(--notion-red-text))",
        blackwhite: "hsl(var(--blackwhite))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
    screens: {
      "7xs": "150px",
      "6xs": "180px",
      "5xs": "240px",
      "4xs": "300px",
      "3xs": "360px",
      "2xs": "420px",
      xs: "520px",
      sm: "640px",
      md: "720px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
