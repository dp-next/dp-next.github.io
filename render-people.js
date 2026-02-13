const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// Paths
const peoplePath = path.join(__dirname, 'data', 'people.json');
const templatePath = path.join(__dirname, '_templates', 'wp-grid.ejs');
const outputPath = path.join(__dirname, '4who_we_are', 'wp-grid.html');
const templatesDir = path.join(__dirname, '_templates');
const peoplePagesDir = path.join(__dirname, '4who_we_are', 'people');

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function withSlugs(people) {
  return people.map((person) => ({
    ...person,
    slug: person.slug || slugify(person.name),
  }));
}

function escapeYaml(value) {
  return String(value).replace(/"/g, '\\"');
}

function buildDescription(person) {
  if (person.bio) return person.bio;

  const wps = person.wps && person.wps.length ? person.wps.join(', ') : 'the project team';
  const role = person.role || 'researcher';
  const affiliation = person.affiliation || 'DP-Next';

  return `${person.name} is ${role} at ${affiliation}. Within DP-Next, ${person.name} is affiliated with ${wps}.`;
}

function renderPersonPage(person) {
  const description = buildDescription(person);
  const wpText = person.wps && person.wps.length ? person.wps.join(', ') : 'Not specified';
  const orcid = person.orcid ? `https://orcid.org/${person.orcid}` : '';

  return `---
title: "${escapeYaml(person.name)}"
css: ../style.css
---

[Back to Who We Are](../who-we-are.html)

::: {.person-profile}
![${person.name}](${person.image}){.person-profile-image fig-alt="${person.name} profile picture."}

## Role
${person.role || 'Not specified'}

## Affiliation
${person.affiliation || 'Not specified'}

## Work Packages
${wpText}

## ORCID
${orcid ? `[${person.orcid}](${orcid})` : 'Not specified'}

## Description
${description}
:::
`;
}

// Read data and template
const people = withSlugs(JSON.parse(fs.readFileSync(peoplePath, 'utf8')));
const template = fs.readFileSync(templatePath, 'utf8');

// Render HTML with views option for includes
const html = ejs.render(template, { people }, { views: [templatesDir] });

// Write output
fs.writeFileSync(outputPath, html);

if (!fs.existsSync(peoplePagesDir)) {
  fs.mkdirSync(peoplePagesDir, { recursive: true });
}

for (const entry of fs.readdirSync(peoplePagesDir)) {
  if (entry.endsWith('.qmd')) {
    fs.unlinkSync(path.join(peoplePagesDir, entry));
  }
}

for (const person of people) {
  const personFile = path.join(peoplePagesDir, `${person.slug}.qmd`);
  fs.writeFileSync(personFile, renderPersonPage(person));
}

console.log('Rendered wp-grid.html and person profile pages.');
