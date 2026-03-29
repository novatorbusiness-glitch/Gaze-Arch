// Make sure .fade-in-up logic works in main.js
const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');
// Fix global reset opacity issues in main css
// Find any problematic broad selector added recently and remove it
