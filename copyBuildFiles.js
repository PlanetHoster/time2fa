const path = require('path');
const fs = require('fs');

const rootDir  = path.resolve(__dirname);
const buildDir = `${rootDir}/.build`;

const packageJsonPath = `${rootDir}/package.json`;
const readmePath = `${rootDir}/README.md`;

const pjContent = JSON.parse(fs.readFileSync(packageJsonPath).toString());
delete pjContent.scripts;
delete pjContent.devDependencies;

fs.writeFileSync(`${buildDir}/package.json`, JSON.stringify(pjContent, null, 2));
fs.copyFileSync(readmePath, `${buildDir}/README.md`);