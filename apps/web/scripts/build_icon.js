const fs = require('fs');
const path = require('path');

function buildImage() {
    const imagePath = path.resolve(__dirname, '../public/images');
    const dirs = fs.readdirSync(imagePath).filter((x) => !x.startsWith('.'));
    const dirCode = dirs
        .map((dir) => {
            const dirPath = path.resolve(imagePath, dir);
            const files = fs.readdirSync(dirPath).filter((x) => !x.startsWith('.'));
            return `const ${dir.toUpperCase()} = {
  ${files
      .map((file) => {
          if (file.indexOf('.') >= 0) {
              return `${(/^\d/.test(file) ? 'D_' + file : file).toUpperCase().replace('.', '_')}: '/images/${dir}/${file}'`;
          } else {
              const dirPath = path.resolve(imagePath, dir, file);
              const files1 = fs.readdirSync(dirPath).filter((x) => !x.startsWith('.'));
              return files1
                  .map((x) => `${(file + '_' + x).toUpperCase().replace('.', '_')}: '/images/${dir}/${file}/${x}'`)
                  .join(',\n  ');
          }
      })
      .join(',\n  ')},
}`;
        })
        .join('\n');
    const imageCode = `
export const Images = {
  ${dirs.map((dir) => dir.toUpperCase()).join(',\n  ')},
}
`;
    const code = dirCode + imageCode;
    const outFile = path.resolve(__dirname, '../src/utils/imagesMap.ts');
    fs.writeFileSync(outFile, code);
}

buildImage();
