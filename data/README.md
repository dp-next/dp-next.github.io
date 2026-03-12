This folder is the location for data on people and outputs

## People

If you don't see that your listed on the people's page,
you can add yourself by opening the `people-*.yml` for the Work Package
you are part of. Inside that file, add the following content
to the bottom of the page, filling in the relevant details as necessary.
You can either paste a URL link to your picture in the `image:` tag, or
upload an image of yourself to this repository under the `/images/profiles/` folder.

```
- name: Your Name
  role: Package Leader or Member
  affiliation: Steno Diabetes Center X
  orcid: https://orcid.org/YOURIDHERE
  image: /path/to/image.jpeg # Where is your image located?
  description: Short description of your function on the specific work package
```

## Outputs

When adding another output, we expect the following fields, depending on output type:

### Podcasts

```
- title: Title of podcasts
  year: YYYY
  host: Who is hosting the podcast
  link: https://example.com
```

### Protocols

```
- title: "TITLE"
  doi: DOI
```

### Publications

```
- title: "TITLE"
  doi: DOI
```
