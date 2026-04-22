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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        hud: {
          glow: "hsl(var(--hud-glow))",
          "glow-secondary": "hsl(var(--hud-glow-secondary))",
          "glow-accent": "hsl(var(--hud-glow-accent))",
          border: "hsl(var(--hud-border))",
          surface: "hsl(var(--hud-surface))",
          "surface-elevated": "hsl(var(--hud-surface-elevated))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'radial-hero': 'radial-gradient(ellipse at center, hsl(0 85% 50% / 0.06) 0%, transparent 60%)',
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
    require("tailwindcss-animate"),
    function({ addComponents }) {
      addComponents({
        '.hud-card': {
          position: 'relative',
          borderWidth: '1px',
          borderColor: 'hsl(var(--border))',
          backgroundColor: 'hsl(var(--card))',
          padding: '1.5rem',
          overflow: 'hidden',
          boxShadow: '0 0 15px -3px hsl(var(--hud-glow) / 0.1), inset 0 1px 0 hsl(var(--hud-border) / 0.5)',
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
            borderColor: 'hsl(var(--hud-glow) / 0.6)',
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
            borderColor: 'hsl(var(--hud-glow) / 0.6)',
          },
        },
        '.hud-card-accent': {
          boxShadow: '0 0 20px -3px hsl(var(--hud-glow-accent) / 0.15), inset 0 1px 0 hsl(var(--hud-border) / 0.5)',
          '&::before, &::after': {
            borderColor: 'hsl(var(--hud-glow-accent) / 0.6)',
          },
        },
        '.scan-line': {
          position: 'absolute',
          left: '0',
          width: '100%',
          height: '1px',
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--hud-glow-accent) / 0.4) 50%, transparent 100%)',
          animation: 'scan 4s ease-in-out infinite',
        },
        '.text-glow': {
          textShadow: '0 0 10px hsl(var(--hud-glow) / 0.5), 0 0 30px hsl(var(--hud-glow) / 0.2)',
        },
        '.text-glow-accent': {
          textShadow: '0 0 10px hsl(var(--hud-glow-accent) / 0.5), 0 0 30px hsl(var(--hud-glow-accent) / 0.2)',
        },
        '.text-glow-secondary': {
          textShadow: '0 0 10px hsl(var(--hud-glow-secondary) / 0.5), 0 0 30px hsl(var(--hud-glow-secondary) / 0.2)',
        },
        '.hud-grid': {
          backgroundImage: 'linear-gradient(hsl(var(--hud-border) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--hud-border) / 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        },
      })
    }
  ],
}
