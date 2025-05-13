import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  // PurgeCSS configuration pour éliminer efficacement les styles inutilisés
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    options: {
      safelist: [
        // Classes à toujours conserver
        'html', 'body', 'root',
        // Modèles dynamiques
        /^bg-/, /^text-/, /^border-/,
        // Classes utilisées dans les Toasts/Alerts
        /^alert-/, /^toast-/
      ],
    },
  },
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    // Optimisation en limitant les valeurs de l'écran
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      maxWidth: {
        'layout': '1140px',
        'content': '800px',
        'sidebar': '280px',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
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
        separator: "#E3E8EF",
        pageBackground: "#edf3fb",
      },
      height: {
        '18': '4.5rem', // Pour la hauteur de la navbar mobile
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "12px",
      },
      fontFamily: {
        sans: ["Poppins", "var(--font-sans)", ...fontFamily.sans],
        serif: ["Times New Roman", "Times", "serif"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25rem' }],
        'sm': ['0.875rem', { lineHeight: '1.375rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.625rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
        '4xl': ['2rem', { lineHeight: '2.5rem' }],
        '5xl': ['2.5rem', { lineHeight: '1.2' }],
      },
      boxShadow: {
        'card': '0 4px 12px rgb(0 0 0 / 0.04)',
        'card-hover': '0 6px 16px rgb(0 0 0 / 0.08)',
        'button-hover': '0 6px 12px rgb(10 140 255 / 0.24)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "sidebar-indicator": {
          "0%": { opacity: "0", transform: "scaleY(0)" },
          "100%": { opacity: "1", transform: "scaleY(1)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "sidebar-indicator": "sidebar-indicator 0.2s ease-out"
      },
    },
  },
  // Optimiser les variants Tailwind pour réduire la taille du CSS généré
  variants: {
    extend: {
      opacity: ['hover', 'focus', 'active', 'group-hover'],
      backgroundColor: ['hover', 'focus', 'active', 'group-hover'],
      textColor: ['hover', 'focus', 'active', 'group-hover'],
      borderColor: ['hover', 'focus', 'active', 'group-hover'],
      scale: ['hover', 'active', 'group-hover'],
      transform: ['hover', 'focus', 'active', 'group-hover'],
      display: ['responsive', 'group-hover', 'group-focus'],
      visibility: ['responsive', 'group-hover', 'group-focus'],
      position: ['responsive'],
      inset: ['responsive'],
      zIndex: ['responsive'],
      padding: ['responsive'],
      margin: ['responsive'],
      width: ['responsive'],
      height: ['responsive'],
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
