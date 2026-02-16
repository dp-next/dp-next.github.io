# DP-Next Website

This repository contains the Quarto source for the DP-Next website.

## Structure

The content is split by language:

- `da/` for Danish pages
- `en/` for English pages

Both language trees follow the same section structure:

- `1homepage`
- `2participant`
- `3researcher`
- `4wp`
- `5whoweare`
- `6publications`
- `7support`

## Configuration

The site uses Quarto profiles:

- `_quarto.yml`: shared/base config
- `_quarto-da.yml`: Danish profile (render list + Danish navbar)
- `_quarto-en.yml`: English profile (render list + English navbar)

There is also a mirrored config set under `_quarto/`:

- `_quarto/_quarto.yml`
- `_quarto/_quarto-da.yml`
- `_quarto/_quarto-en.yml`

Language switching is handled via explicit navbar/page links.

## Data and Listings

Who-we-are listing data is sourced from:

- `data/people.yml`

Custom listing template:

- `_templates/wp-grid.ejs`

The listing is configured in:

- `da/5whoweare/who-we-are.qmd`
- `en/5whoweare/who-we-are.qmd`

using Quarto custom listing + `template-params`.

## Styling and Assets

Global styling:

- `settings/style.css`

Other shared assets/settings:

- `images/`
- `settings/references.bib`
- `settings/vancouver.csl`
- `settings/.typos.toml`

## Build and Preview

Run from repository root:

```bash
quarto render --profile da
quarto render --profile en --no-clean
```

Preview with profile-specific navbar/content:

```bash
quarto preview --profile da
quarto preview --profile en
```