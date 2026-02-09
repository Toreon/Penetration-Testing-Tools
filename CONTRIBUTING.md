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
- Adding related tools
- Updating GitHub repository information

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
stars: 12345                    # Cached GitHub star count (optional)

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

use_cases:
  - Web application scanning
  - Vulnerability detection
  - Security auditing
  - Penetration testing

related_tools:
  - sqlmap
  - nessus

added_at: "2024-01-15"
```

## Validation

Before submitting:

1. **YAML Syntax**: Ensure your YAML file is valid (no syntax errors)
2. **Required Fields**: All required fields must be present
3. **Format**: Follow the schema exactly
4. **Test**: Run `npm run convert-yaml` and verify no errors
5. **Preview**: Start the dev server and verify the tool displays correctly

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
