/* eslint-env node */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "var(--border-color)",
        input: "var(--border-color)",
        ring: "var(--accent-red)",
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--accent-red)",
          foreground: "var(--text-primary)",
        },
        secondary: {
          DEFAULT: "var(--accent-gold)",
          foreground: "var(--bg-primary)",
        },
        destructive: {
          DEFAULT: "var(--accent-red)",
          foreground: "var(--text-primary)",
        },
        muted: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-secondary)",
        },
        accent: {
          DEFAULT: "var(--accent-blue)",
          foreground: "var(--text-primary)",
        },
        popover: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        card: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        hud: {
          glow: "var(--accent-red)",
          "glow-secondary": "var(--accent-gold)",
          "glow-accent": "var(--accent-blue)",
          border: "var(--border-color)",
          surface: "var(--bg-surface)",
          "surface-elevated": "var(--bg-surface)",
        },
        sidebar: {
          DEFAULT: "var(--bg-primary)",
          foreground: "var(--text-primary)",
          primary: "var(--accent-red)",
          "primary-foreground": "var(--text-primary)",
          accent: "var(--bg-surface)",
          "accent-foreground": "var(--text-primary)",
          border: "var(--border-color)",
          ring: "var(--accent-red)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'radial-hero': 'radial-gradient(ellipse at center, var(--accent-red) 0%, transparent 60%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "arc-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        scan: {
          "0%, 100%": { top: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "50%": { top: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "arc-spin": "arc-spin 8s linear infinite",
        "arc-spin-slow": "arc-spin 12s linear infinite",
        "arc-spin-reverse": "arc-spin 10s linear infinite reverse",
        flicker: "flicker 3s ease-in-out infinite",
        scan: "scan 4s ease-in-out infinite",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require("tailwindcss-animate"),
    function({ addComponents }) {
      addComponents({
        '.hud-card': {
          position: 'relative',
          borderWidth: '1px',
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          padding: '1.5rem',
          overflow: 'hidden',
          boxShadow: 'var(--glow-shadow)',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: '0',
            left: '0',
            width: '2rem',
            height: '2rem',
            borderTopWidth: '2px',
            borderLeftWidth: '2px',
            pointerEvents: 'none',
            borderColor: 'var(--corner-border-color)',
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '2rem',
            height: '2rem',
            borderBottomWidth: '2px',
            borderRightWidth: '2px',
            pointerEvents: 'none',
            borderColor: 'var(--corner-border-color)',
          },
        },
        '.hud-card-accent': {
          boxShadow: 'var(--glow-shadow-accent)',
          '&::before, &::after': {
            borderColor: 'var(--accent-blue)',
          },
        },
        '.scan-line': {
          position: 'absolute',
          left: '0',
          width: '100%',
          height: '1px',
          pointerEvents: 'none',
          background: 'var(--scanline-gradient)',
          animation: 'scan 4s ease-in-out infinite',
        },
        '.text-glow': {
          textShadow: 'var(--text-glow-shadow)',
        },
        '.text-glow-accent': {
          textShadow: 'var(--text-glow-shadow-accent)',
        },
        '.text-glow-secondary': {
          textShadow: 'var(--text-glow-shadow-secondary)',
        },
        '.hud-grid': {
          backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        },
      })
    }
  ],
}
