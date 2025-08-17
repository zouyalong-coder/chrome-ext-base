import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// 修复构建后的HTML文件中的脚本路径
const htmlPath = resolve('dist/src/sidepanel.html');
let htmlContent = readFileSync(htmlPath, 'utf-8');

// 将绝对路径替换为相对路径
htmlContent = htmlContent.replace('src="/sidepanel.js"', 'src="../sidepanel.js"');

writeFileSync(htmlPath, htmlContent);
console.log('✅ HTML文件路径已修复');
