@_default:
    just --list --unsorted

# Run all necessary build commands.
run-all: check-spelling build-website build-readme

# Install the pre-commit hooks
install-precommit:
  # Install pre-commit hooks
  uvx pre-commit install
  # Run pre-commit hooks on all files
  uvx pre-commit run --all-files
  # Update versions of pre-commit hooks
  uvx pre-commit autoupdate

# Check spelling
check-spelling:
  uvx typos

# Build the website using Quarto
build-website:
  quarto render

# Re-build the README file
build-readme:
  quarto render README.qmd --to gfm
