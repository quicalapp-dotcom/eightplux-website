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
                primary: "#D32F2F", // Red accent from the logo
                "background-light": "#F8F8F8",
                "background-dark": "#0A0A0A",
                "text-dark": "#1A1A1A",
                "text-light": "#EDEDED",
                "card-light": "#FFFFFF",
                "card-dark": "#171717",
            },
            fontFamily: {
                display: ["var(--font-playfair)", "serif"],
                sans: ["var(--font-inter)", "sans-serif"],
                logo: ["var(--font-cinzel)", "serif"],
            },
            borderRadius: {
                DEFAULT: "0px",
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
};
export default config;
