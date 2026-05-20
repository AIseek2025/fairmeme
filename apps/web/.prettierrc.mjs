/** @type {import("prettier").Config} */
const config = {
    printWidth: 120,
    tabWidth: 4,
    singleQuote: true,
    semi: true,
    useTabs: false,
    htmlWhitespaceSensitivity: 'ignore',
    plugins: ['prettier-plugin-tailwindcss'],
    endOfLine: 'lf',
    htmlWhitespaceSensitivity: 'ignore',
};
export default config;
