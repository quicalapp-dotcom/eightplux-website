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
                primary: "#C72F32", // Updated red color
                brand: {
                    cream: "#F4F1E9",
                    charcoal: "#060708",
                    red: "#C72F32",
                    grey: "#CCCCCC",
                },
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
