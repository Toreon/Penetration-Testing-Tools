# Contributing to Pentest Tools Catalogue

Thank you for your interest in contributing to the Pentest Tools Catalogue! This document provides guidelines and instructions for contributing.

## How to Contribute

### Adding a New Tool

1. **Create a YAML file**: Create a new file in the `data/tools/` directory
   - Filename should match the tool's ID (e.g., `my-tool.yml`)
   - Use lowercase letters, numbers, and hyphens only

2. **Fill in the required fields**: See the YAML Schema section below

3. **Test locally**: 
   ```bash
   npm run convert-yaml
   npm start
   ```
   Verify your tool appears correctly in the catalogue

4. **Submit a Pull Request**: 
   - Fork the repository
   - Create a new branch for your changes
   - Commit your changes
   - Push to your fork
   - Open a pull request

### Updating an Existing Tool

1. Find the tool's YAML file in `data/tools/`
2. Make your changes
3. Test locally to ensure everything works
4. Submit a pull request

Common updates include:
- Fixing broken links
- Adding new tags or categories
- Updating descriptions
- Correcting license information
- Adding related tools or similar tools
- Updating GitHub repository information
- Adding installation instructions
- Updating pricing information
- Adding tool images/logos
- Updating maintainers and authors

## YAML Schema

Each tool must be defined in a YAML file with the following structure:

### Required Fields

```yaml
id: unique-tool-id              # URL-safe identifier (lowercase, hyphens)
name: Tool Name                 # Human-readable name
summary: Short description      # One-paragraph description
categories:                     # List of categories
  - category1
  - category2
tags:                           # List of tags
  - tag1
  - tag2
platforms:                      # Supported platforms
  - linux
  - windows
  - macos
license: License Name           # License identifier or name
maturity: stable                # One of: stable, active, experimental, archived
```

### Optional Fields

```yaml
description: |                  # Longer multi-paragraph description
  Detailed description here
  Can span multiple lines

website: https://example.com
docs_url: https://docs.example.com
download_url: https://download.example.com
github_repo: owner/repo         # Format: owner/repository-name
stars: 12345                    # Cached GitHub star count (auto-updated via utility)

image_url: https://example.com/logo.png  # URL to tool logo/image (optional)
                                         # Recommended: Use GitHub raw URLs or CDN links
                                         # Example: https://raw.githubusercontent.com/owner/repo/main/logo.png

pricing:                         # Pricing information (optional)
  type: open_source             # One of: free, paid, freemium, open_source
  price: "$99/year"             # Optional: Price string
  currency: USD                 # Optional: Currency code
  notes: Additional pricing details  # Optional: Additional notes

installation:                   # Installation information (optional)
  methods:                      # List of installation methods
    - Git clone
    - pip install
    - Package manager
  commands:                     # Optional: Installation commands
    - git clone https://github.com/owner/repo.git
    - pip install tool-name
  package_managers:             # Optional: Supported package managers
    - pip
    - apt
    - brew
    - gem
    - docker

maintainers:                    # List of maintainer GitHub usernames (optional)
  - maintainer1                 # Can be auto-updated via utility script
  - maintainer2

authors:                        # List of author GitHub usernames (optional)
  - author1                     # Can be auto-updated via utility script
  - author2

use_cases:                      # List of primary use cases
  - Use case 1
  - Use case 2

compliance_mapping:             # Optional compliance standards mapping
  ISO_27001:
    - A.12.6.1
    - A.14.2.1

related_tools:                  # List of related tool IDs
  - tool-id-1
  - tool-id-2

similar_tools:                  # List of similar tool IDs (optional)
  - tool-id-1                   # Tools with similar functionality
  - tool-id-2

added_at: "2024-01-15"         # ISO date string (YYYY-MM-DD)
```

## Categories

Available categories include:
- `web_app_scanner`
- `password_cracker`
- `vulnerability_scanner`
- `cloud_enumeration`
- `cloud_security`
- `active_directory`
- `network_scanner`
- `static_analysis`
- `code_scanner`
- `database_exploitation`
- `network_attack`
- `wordlist_generator`
- `reconnaissance`

If you need a new category, please open an issue to discuss it first.

## Maturity Levels

- **stable**: Production-ready, well-maintained tool
- **active**: Actively developed and maintained
- **experimental**: Early stage or experimental tool
- **archived**: No longer actively maintained

## Platforms

Common platform values:
- `linux`
- `windows`
- `macos`
- `aws`
- `azure`
- `gcp`
- `docker`

## Example Tool Entry

Here's a complete example:

```yaml
id: example-tool
name: Example Security Tool
summary: A powerful tool for security testing and analysis of web applications.

description: |
  This tool provides comprehensive security testing capabilities for web applications
  and networks. It supports multiple protocols and includes advanced features for
  vulnerability detection and exploitation.

categories:
  - web_app_scanner
  - vulnerability_scanner

tags:
  - security
  - testing
  - oss
  - cli
  - python

platforms:
  - linux
  - windows
  - macos

license: MIT
maturity: stable

website: https://example.com
docs_url: https://docs.example.com
download_url: https://github.com/owner/example-tool/releases
github_repo: owner/example-tool
stars: 5000
image_url: https://raw.githubusercontent.com/owner/example-tool/main/logo.png

pricing:
  type: open_source

installation:
  methods:
    - Git clone
    - pip install
  commands:
    - git clone https://github.com/owner/example-tool.git
    - pip install example-tool
  package_managers:
    - pip
    - apt

maintainers:
  - owner

authors:
  - owner
  - contributor1

use_cases:
  - Web application scanning
  - Vulnerability detection
  - Security auditing
  - Penetration testing

related_tools:
  - sqlmap
  - nessus

similar_tools:
  - sqlmap

added_at: "2024-01-15"
```

## Field Details

### Image URL (`image_url`)

The `image_url` field should be placed after `stars` and before `pricing`. It's an optional field that points to a tool's logo or image.

**Best Practices:**
- Use GitHub raw URLs for images stored in the repository: `https://raw.githubusercontent.com/owner/repo/branch/path/to/image.png`
- Use CDN links for better performance
- Recommended image size: 200x200px to 400x400px
- Supported formats: PNG, SVG, JPG
- Ensure the image is publicly accessible

**Example:**
```yaml
stars: 5000
image_url: https://raw.githubusercontent.com/owner/tool/main/docs/logo.png
pricing:
  type: open_source
```

### Pricing (`pricing`)

The pricing field provides information about the tool's cost model.

**Types:**
- `free`: Completely free to use
- `open_source`: Open source (may have commercial support)
- `freemium`: Free tier available, paid plans exist
- `paid`: Requires payment to use

**Example for freemium:**
```yaml
pricing:
  type: freemium
  price: "Starting at $99/year"
  currency: USD
  notes: "Free tier for personal use, commercial licenses available"
```

### Installation (`installation`)

Provides installation methods and commands for the tool.

**Fields:**
- `methods`: List of installation methods (e.g., "Git clone", "pip install", "Docker")
- `commands`: Optional list of installation commands
- `package_managers`: Optional list of supported package managers (e.g., pip, apt, brew, gem, docker)

**Example:**
```yaml
installation:
  methods:
    - Git clone
    - pip install
  commands:
    - git clone https://github.com/owner/tool.git
    - pip install tool-name
  package_managers:
    - pip
    - apt
    - brew
```

### Maintainers and Authors

- `maintainers`: List of GitHub usernames of current maintainers
- `authors`: List of GitHub usernames of original authors/contributors

**Note:** These can be auto-updated using the `npm run update-tools` utility script, which fetches data from GitHub.

**Example:**
```yaml
maintainers:
  - owner
  - maintainer1

authors:
  - original-author
  - contributor1
  - contributor2
```

### Similar Tools (`similar_tools`)

List of tool IDs that have similar functionality. This helps users discover alternatives.

**Example:**
```yaml
similar_tools:
  - alternative-tool-1
  - alternative-tool-2
```

## Auto-Updating Tools

You can use the built-in utility to automatically update tool metadata from GitHub:

```bash
npm run update-tools
```

This script will:
- Update GitHub star counts
- Fetch maintainers from repository owner
- Add authors from top contributors
- Fill in missing descriptions, websites, and licenses

**Note:** Only tools with a `github_repo` field will be updated.

## Validation

Before submitting:

1. **YAML Syntax**: Ensure your YAML file is valid (no syntax errors)
2. **Required Fields**: All required fields must be present
3. **Format**: Follow the schema exactly
4. **Test**: Run `npm run convert-yaml` and verify no errors
5. **Preview**: Start the dev server and verify the tool displays correctly
6. **Image URLs**: Verify image URLs are accessible and display correctly

## Code of Conduct

- Be respectful and professional
- Provide accurate information
- Follow the existing format and style
- Test your changes before submitting

## Questions?

If you have questions or need help:
- Open an issue on GitHub
- Check existing issues and pull requests
- Review the documentation in the `/contribute` page of the website

Thank you for contributing to the Pentest Tools Catalogue!
