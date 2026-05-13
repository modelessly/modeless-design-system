import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./docs/**/*.md", "./examples/*/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
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
        signal: {
          DEFAULT: "hsl(var(--signal))",
          foreground: "hsl(var(--signal-foreground))",
        },
        terminal: {
          DEFAULT: "hsl(var(--terminal))",
          foreground: "hsl(var(--terminal-foreground))",
        },
        artifact: {
          DEFAULT: "hsl(var(--artifact))",
          foreground: "hsl(var(--artifact-foreground))",
        },
        warning: "hsl(var(--warning))",
        success: "hsl(var(--success))",
        experimental: "hsl(var(--experimental))",
        archived: "hsl(var(--archived))",
        product: {
          privacy: "hsl(var(--product-privacy))",
          finance: "hsl(var(--product-finance))",
          design: "hsl(var(--product-design))",
          workflow: "hsl(var(--product-workflow))",
          experimental: "hsl(var(--product-experimental))",
          infrastructure: "hsl(var(--product-infrastructure))",
        },
        "grid-line": "hsl(var(--grid-line))",
        scanline: "hsl(var(--scanline))",
        noise: "hsl(var(--noise))",
      },
      borderRadius: {
        sharp: "0",
        panel: "calc(var(--radius) - 2px)",
        artifact: "var(--radius)",
        soft: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        display: "var(--font-display)",
        ui: "var(--font-ui)",
        mono: "var(--font-mono)",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-label": {
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          lineHeight: "1rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        },
        ".text-caption": {
          fontFamily: "var(--font-ui)",
          fontSize: "0.8125rem",
          lineHeight: "1.25rem",
        },
        ".text-micro": {
          fontFamily: "var(--font-mono)",
          fontSize: "0.625rem",
          lineHeight: "0.875rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        },
        ".text-terminal": {
          fontFamily: "var(--font-mono)",
          color: "hsl(var(--terminal-foreground))",
        },
        ".text-machine": {
          fontFamily: "var(--font-mono)",
          fontSize: "0.6875rem",
          lineHeight: "1rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
