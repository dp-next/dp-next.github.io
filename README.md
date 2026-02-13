# DP-Next Website

This repository contains the Quarto source for the DP-Next website.

## Website Structure

The site is organized by language:

- `da/`: Danish pages
- `en/`: English pages

Each language follows the same section structure:

- `1homepage`
- `2participant`
- `3researcher`
- `4wp`
- `5whoweare`
- `6publications`
- `7support`

## Data and Generated Member Pages

Current data includes member information for work packages:

- `data/people.json`

This JSON is used together with templates in:

- `_templates/person-card.ejs`
- `_templates/wp-column.ejs`
- `_templates/wp-grid.ejs`

The script:

- `render-people.js`

reads `data/people.json` and generates:

- work package people grids (`wp-grid.html`) for Danish and English `5whoweare`
- one profile subpage per member under each language's `5whoweare/people/`

A future extension can add publication data under `data/` (for example `data/publications/`) when relevant.

## Rendering and Navigation

Quarto config files control what is rendered and how the navbar is built:

- `_quarto.yml`: base/Danish website config
- `_quarto-en.yml`: English profile config

Language switching behavior is handled in:

- `language-switch.html`

## Styling

Global website styling is defined in:

- `style.css`

Some page-specific assets/styles may also be located inside section folders.

## Images

Images used by the website are stored in:

- `images/`

Some images are also stored in page-specific subfolders (for example under `4wp`).

## References

Citation sources and style are defined in:

- `references.bib`
- `vancouver.csl`

## Build

From the project root, build the website with:

```bash
quarto render
quarto render --profile en --no-clean
```

Or via `just`:

```bash
just build-website
```