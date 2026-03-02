import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#FF0000", // Bright Red seen in the text
                "background-light": "#FFFFFF",
                "background-dark": "#0A0A0A",
                "secondary-dark": "#1A1A1A",
                brand: {
                    cream: "#F4F1E9",
                    charcoal: "#060708",
                    red: "#FF0000",
                    grey: "#CCCCCC",
                },
                "text-dark": "#1A1A1A",
                "text-light": "#EDEDED",
                "card-light": "#FFFFFF",
                "card-dark": "#171717",
            },
            fontFamily: {
                sans: ['Montserrat', 'TT Runs', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                script: ['Dancing Script', 'cursive'],
                display: ["var(--font-playfair)", "serif"],
                logo: ["var(--font-cinzel)", "serif"],
                tt: ['TT Runs', 'sans-serif'],
                metropolis: ['Metropolis', 'sans-serif'],
            },
            fontSize: {
                '10xl': '10rem',
                '11xl': '12rem',
            },
            borderRadius: {
                DEFAULT: "0px", // The design is very sharp/boxy
                'sm': '2px',
            },
            letterSpacing: {
                widest: '.15em',
                tighter: '-.04em',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
};
export default config;
