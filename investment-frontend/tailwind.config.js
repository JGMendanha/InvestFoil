/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0f172a",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f8fafc",
                    foreground: "#0f172a",
                },
                background: "#ffffff",
                foreground: "#0f172a",
                border: "#e2e8f0",
                input: "#e2e8f0",
                ring: "#0f172a",
            },
            borderRadius: {
                lg: "0.5rem",
                md: "0.375rem",
                sm: "0.25rem",
            },
        },
    },
    plugins: [],
}