const fs = require('fs');
const generateTSConfig = (fileName, type) => {
    const json = fs.readFileSync('tsconfig.json', 'utf8')
    const tsconfig = JSON.parse(json);
    const include = fileName;
    tsconfig.include = include;

    fs.writeFileSync('tsconfig.lint.json', JSON.stringify(tsconfig));
    return `${type} --noEmit --project tsconfig.lint.json`;
};

module.exports = {
    'src/**/*{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
    'src/**/*{css,less,scss}': ['stylelint --fix'],
    'src/**/*.{ts,tsx}': [(fileName) => generateTSConfig(fileName, 'tsc')],
    // 'src/**/*.{ts,tsx}': 'tsc --noEmit -p tsconfig.json',
};
