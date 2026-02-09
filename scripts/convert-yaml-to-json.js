const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const toolsDir = path.join(__dirname, '..', 'data', 'tools');
const outputFile = path.join(__dirname, '..', 'src', 'assets', 'data', 'tools.json');

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all YAML files from data/tools directory
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));

const tools = [];

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const tool = yaml.load(fileContents);
    
    if (tool && tool.id) {
      tools.push(tool);
    } else {
      console.warn(`Warning: ${file} does not have a valid 'id' field, skipping...`);
    }
  } catch (error) {
    console.error(`Error parsing ${file}:`, error.message);
  }
}

// Sort tools by name for consistency
tools.sort((a, b) => a.name.localeCompare(b.name));

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(tools, null, 2), 'utf8');

console.log(`Successfully converted ${tools.length} tool(s) from YAML to JSON`);
console.log(`Output written to: ${outputFile}`);
