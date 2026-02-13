const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const peoplePath = path.join(__dirname, '..', 'data', 'people.json');
const templatePath = path.join(__dirname, 'wp-grid.ejs');
const templatesDir = __dirname;

const enOutputPath = path.join(__dirname, '..', 'en', '5whoweare', 'wp-grid.html');
const daOutputPath = path.join(__dirname, '..', 'da', '5whoweare', 'wp-grid.html');
const enPeoplePagesDir = path.join(__dirname, '..', 'en', '5whoweare', 'people');
const daPeoplePagesDir = path.join(__dirname, '..', 'da', '5whoweare', 'people');

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
css: /settings/style.css
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

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function clearQmdFiles(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry.endsWith('.qmd')) {
      fs.unlinkSync(path.join(dir, entry));
    }
  }
}

const people = withSlugs(JSON.parse(fs.readFileSync(peoplePath, 'utf8')));
const template = fs.readFileSync(templatePath, 'utf8');
const baseHtml = ejs.render(template, { people }, { views: [templatesDir] });
const enHtml = baseHtml.replaceAll('/4who_we_are/people/', '/en/5whoweare/people/');
const daHtml = baseHtml.replaceAll('/4who_we_are/people/', '/da/5whoweare/people/');

ensureDir(path.dirname(enOutputPath));
ensureDir(path.dirname(daOutputPath));
ensureDir(enPeoplePagesDir);
ensureDir(daPeoplePagesDir);

fs.writeFileSync(enOutputPath, enHtml);
fs.writeFileSync(daOutputPath, daHtml);

clearQmdFiles(enPeoplePagesDir);
clearQmdFiles(daPeoplePagesDir);

for (const person of people) {
  const content = renderPersonPage(person);
  fs.writeFileSync(path.join(enPeoplePagesDir, `${person.slug}.qmd`), content);
  fs.writeFileSync(path.join(daPeoplePagesDir, `${person.slug}.qmd`), content);
}

console.log('Rendered language-scoped wp-grid and person profile pages.');
