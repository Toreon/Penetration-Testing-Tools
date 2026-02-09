const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const toolsDir = path.join(__dirname, '..', 'data', 'tools');
const categoriesFile = path.join(__dirname, '..', 'data', 'categories.yml');
const toolsOutputFile = path.join(__dirname, '..', 'src', 'assets', 'data', 'tools.json');
const categoriesOutputFile = path.join(__dirname, '..', 'src', 'assets', 'data', 'categories.json');

// Ensure output directory exists
const outputDir = path.dirname(toolsOutputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert tools
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

// Write tools to JSON file
fs.writeFileSync(toolsOutputFile, JSON.stringify(tools, null, 2), 'utf8');
console.log(`✅ Converted ${tools.length} tool(s) to ${toolsOutputFile}`);

// Convert categories
if (fs.existsSync(categoriesFile)) {
  try {
    const categoriesContents = fs.readFileSync(categoriesFile, 'utf8');
    const categoriesData = yaml.load(categoriesContents);
    
    // Sort categories by order
    if (categoriesData.categories) {
      categoriesData.categories.sort((a, b) => (a.order || 999) - (b.order || 999));
    }
    
    fs.writeFileSync(categoriesOutputFile, JSON.stringify(categoriesData, null, 2), 'utf8');
    console.log(`✅ Converted ${categoriesData.categories?.length || 0} categories to ${categoriesOutputFile}`);
  } catch (error) {
    console.error(`Error parsing categories file:`, error.message);
  }
} else {
  console.log(`⚠️  Categories file not found: ${categoriesFile}`);
}
