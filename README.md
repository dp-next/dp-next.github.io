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

## Data and Member Listings

Member information for work packages is stored in:

- `data/people.yml`

The “Who We Are” pages use Quarto custom listings and EJS templates:

- `_templates/wp-grid.ejs`

This setup is fully Quarto-native (no JavaScript pre-render step). Listing behavior is configured with `template-params` in each language's `who-we-are.qmd`.

A future extension can add publication data under `data/` (for example `data/publications/`) when relevant.

## Rendering and Navigation

Quarto config files control what is rendered and how the navbar is built:

- `_quarto.yml`: shared base website config
- `_quarto-da.yml`: Danish profile config
- `_quarto-en.yml`: English profile config

Language switching behavior is handled by links defined in Quarto config and page-level href references.

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
quarto render --profile da
quarto render --profile en --no-clean
```