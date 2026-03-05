# Pentest Tools Catalogue

A comprehensive reference platform for penetration testing tools and technologies used by Vulnerability Assessment centers, pentesting experts, and related organizations across Europe.

This platform serves as a collective representation of common tools used in the field, building upon recommendations and tools being used by experts throughout Europe.

## Features

- **Comprehensive Tool Database**: Browse a curated collection of penetration testing tools
- **Advanced Filtering**: Filter tools by category, platform, license, and maturity
- **Search Functionality**: Search tools by name, description, or tags
- **Detailed Tool Pages**: View comprehensive information about each tool including use cases, related tools, and links
- **GitHub Integration**: Live GitHub star counts with caching
- **Community-Driven**: Easy to contribute new tools or update existing ones via YAML files

## Add a New Tool

Want to add a tool to the catalogue? It's easy! Use our template to get started.

- **[View Template](https://github.com/Toreon/Penetration-Testing-Tools/blob/main/data/tools/tool_template.yml)** - See the template file
- **[Create New File](https://github.com/Toreon/Penetration-Testing-Tools/new/main/data/tools)** - Open GitHub's editor

### How it works

1. **View the template** - Click the link above to see `tool_template.yml`
2. **Create a new file** - Click "Create New File" to open GitHub's editor
3. **Copy the template** - Copy the content from the template into your new file
4. **Change the filename** - Rename it to match your tool's ID (e.g., `my-tool.yml`)
5. **Fill in your tool info** - Complete the required fields and add optional details
6. **Commit and open a pull request** - GitHub will guide you through creating a PR

That's it! Your contribution will be reviewed and merged. For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Tech Stack

- **Angular**: Modern SPA framework with standalone components
- **Angular Material**: UI component library with dark theme
- **TypeScript**: Type-safe development
- **YAML**: Human-readable data format for tool definitions
- **GitHub Pages**: Free hosting with CI/CD

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Angular CLI (installed globally or via npx)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Penetration-Testing-Tools.git
cd Penetration-Testing-Tools
```

2. Install dependencies:
```bash
npm install
```

3. Convert YAML data to JSON:
```bash
npm run convert-yaml
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Auto-Updating Tools from GitHub

The project includes a utility script that can automatically update tool metadata from GitHub:

```bash
npm run update-tools
```

This script will:
- ✅ Fetch the latest star count from GitHub
- ✅ Update maintainers/authors from repository owner and top contributors
- ✅ Add missing descriptions, websites, and licenses from GitHub
- ✅ Respect GitHub API rate limits (1 second delay between requests)

**Note**: The script only updates tools that have a `github_repo` field. Tools without GitHub repositories will be skipped.

**Rate Limits**: The script uses the GitHub API without authentication, which has a rate limit of 60 requests per hour. For higher limits, you can set a `GITHUB_TOKEN` environment variable:

```bash
GITHUB_TOKEN=your_token_here npm run update-tools
```

To get a GitHub token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `public_repo` scope
3. Use it as shown above

## Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD workflow
├── data/
│   └── tools/                  # YAML files for each tool
│       ├── sqlmap.yml
│       ├── nessus.yml
│       └── ...
├── scripts/
│   └── convert-yaml-to-json.js # YAML to JSON conversion script
├── src/
│   ├── app/
│   │   ├── components/         # Angular components
│   │   ├── services/           # Angular services
│   │   ├── models/             # TypeScript interfaces
│   │   └── ...
│   ├── assets/
│   │   └── data/
│   │       └── tools.json      # Generated JSON file (gitignored)
│   └── styles/
│       └── theme.scss          # Angular Material theme
├── angular.json
├── package.json
└── README.md
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to:

- Add new tools to the catalogue
- Update existing tool entries
- Propose new categories or tags
- Report issues or suggest improvements

## Tool Categories

- **Web Application Scanners**: Tools for scanning and testing web applications
- **Password Crackers**: Tools for password recovery and hash cracking
- **Vulnerability Scanners**: Comprehensive vulnerability assessment tools
- **Cloud Security**: Tools for cloud infrastructure security
- **Active Directory**: Tools for AD analysis and testing
- **Static Analysis**: Code analysis tools
- **OSINT (Open Source Intelligence)**: Tools for gathering and analyzing open source intelligence
- **Fuzzing**: Tools for automated software testing and vulnerability discovery
- **Firmware Analysis**: Tools for analyzing, extracting, and reverse engineering firmware
- **Operating Systems**: Specialized operating systems and distributions for penetration testing
- **Web Utilities**: Online web-based tools and utilities for encoding, decoding, and data transformation
- **Linux Utilities**: Common Linux command-line utilities frequently used in penetration testing
- **Guides & Cheat Sheets**: Public guides, cheat sheets, and reference materials

## License

This project is open source. Please check individual tool licenses in their respective entries.

## Acknowledgments

This catalogue is built upon recommendations and tools being used by security experts throughout Europe. We thank all contributors and the security community for their support.
