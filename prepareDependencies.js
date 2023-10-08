let fs = require('fs');
let jsDependenciesDir = 'src/js-ext/';

if (!fs.existsSync(jsDependenciesDir)) {
    fs.mkdirSync(jsDependenciesDir);
}

function copyFile(filePath, destDir) {
    fs.copyFile(filePath, destDir, (err) => {
        if (err) {
            throw err
        }
    });
}

function copyAndTransformFile(filePath, destPath, transformer) {
    const data = fs.readFileSync(filePath, 'utf-8');
    fs.writeFileSync(destPath, transformer(data), 'utf-8');
}

copyFile('node_modules/chance/dist/chance.min.js', jsDependenciesDir  + 'chance.min.js');
copyAndTransformFile(
    'node_modules/reregexp/lib/index.js',
    jsDependenciesDir + 'reregexp.js',
    // Our CommonJS emulation hack only makes `exports` available temporarily
    // so we need to change references to it to variables in real scope.
    data => data.replaceAll(/^exports\.((?!default)\w+)\b(\s*)=((?!\s*\1|.+void 0).+)$/mg, 'var $1$2=$3\nexports\.$1 = $1;').replaceAll(/exports.(\w+)\b(?!\s*=)/g, '$1')
);