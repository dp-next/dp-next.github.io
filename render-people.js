const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// Paths
const peoplePath = path.join(__dirname, 'data', 'people.json');
const templatePath = path.join(__dirname, '_templates', 'wp-grid.ejs');
const outputPath = path.join(__dirname, '4who_we_are', 'wp-grid.html');
const templatesDir = path.join(__dirname, '_templates');

// Read data and template
const people = JSON.parse(fs.readFileSync(peoplePath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

// Render HTML with views option for includes
const html = ejs.render(template, { people }, { views: [templatesDir] });

// Write output
fs.writeFileSync(outputPath, html);

console.log('Rendered wp-grid.html');