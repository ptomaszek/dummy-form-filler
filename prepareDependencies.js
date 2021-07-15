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

copyFile('node_modules/chance/dist/chance.min.js', jsDependenciesDir  + 'chance.min.js');
