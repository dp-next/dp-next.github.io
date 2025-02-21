@_default:
    just --list --unsorted

# Run all recipes
run-all: build-website

# Generate PNG images from PlantUML files
generate-puml:
  docker run --rm -v $(pwd):/puml -w /puml ghcr.io/plantuml/plantuml:latest -tsvg "**/*.puml"

# Build the website using Quarto
build-website:
  quarto render
