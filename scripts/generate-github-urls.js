const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the template file
const templatePath = path.join(__dirname, '..', 'data', 'tools', 'tool_template.yml');

// Read the template file
function readTemplate() {
  try {
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.error(`Error reading template file: ${error.message}`);
    process.exit(1);
  }
}

// Detect the default branch
function getDefaultBranch() {
  try {
    // Try to get the default branch from remote
    const remoteBranch = execSync('git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null', { encoding: 'utf8' }).trim();
    if (remoteBranch) {
      const match = remoteBranch.match(/refs\/remotes\/origin\/(.+)/);
      if (match) {
        return match[1];
      }
    }
  } catch (error) {
    // Fallback to current branch
  }
  
  try {
    // Fallback: get current branch
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return currentBranch;
  } catch (error) {
    console.error('Error detecting branch. Using "main" as default.');
    return 'main';
  }
}

// Detect repository owner and name from git remote
function getRepoInfo() {
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    
    // Handle both SSH and HTTPS formats
    // SSH: git@github.com:owner/repo.git
    // HTTPS: https://github.com/owner/repo.git
    let match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    
    if (match) {
      return {
        owner: match[1],
        repo: match[2]
      };
    }
    
    throw new Error('Could not parse repository URL');
  } catch (error) {
    console.error(`Error detecting repository: ${error.message}`);
    console.error('Please ensure you are in a git repository with a remote named "origin".');
    process.exit(1);
  }
}

// Generate GitHub URLs
function generateUrls(templateContent, branch, owner, repo) {
  // URL-encode the template content
  const encodedContent = encodeURIComponent(templateContent);
  
  // Generate "Add new tool" URL
  const addToolUrl = `https://github.com/${owner}/${repo}/new/${branch}/data/tools?filename=new_tool.yml&value=${encodedContent}`;
  
  // Generate "Edit tool" URL pattern (for documentation)
  // Note: This is a pattern - the actual tool ID will be inserted when used
  const editToolUrlPattern = `https://github.com/${owner}/${repo}/edit/${branch}/data/tools/{tool_id}.yml`;
  
  return {
    addTool: addToolUrl,
    editToolPattern: editToolUrlPattern,
    branch,
    owner,
    repo
  };
}

// Main execution
function main() {
  console.log('Generating GitHub URLs for tool contribution...\n');
  
  // Read template
  const templateContent = readTemplate();
  console.log(`✓ Read template from: ${templatePath}`);
  
  // Detect branch
  const branch = getDefaultBranch();
  console.log(`✓ Detected branch: ${branch}`);
  
  // Detect repo
  const repoInfo = getRepoInfo();
  console.log(`✓ Detected repository: ${repoInfo.owner}/${repoInfo.repo}`);
  
  // Generate URLs
  const urls = generateUrls(templateContent, branch, repoInfo.owner, repoInfo.repo);
  
  console.log('\n' + '='.repeat(80));
  console.log('Generated URLs:');
  console.log('='.repeat(80));
  console.log('\n📝 Add New Tool URL:');
  console.log(urls.addTool);
  console.log('\n✏️  Edit Tool URL Pattern:');
  console.log(urls.editToolPattern);
  console.log('\n' + '='.repeat(80));
  console.log('\n💡 Usage:');
  console.log('  - Copy the "Add New Tool URL" to your README.md and CONTRIBUTING.md');
  console.log('  - Use the "Edit Tool URL Pattern" in your Angular component, replacing {tool_id} with the actual tool ID');
  console.log('\n⚠️  Note: Regenerate these URLs if the default branch or repository changes.');
  console.log('   Run: npm run generate-urls\n');
  
  // Optionally write to a JSON file for reference
  const outputPath = path.join(__dirname, '..', 'github-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(urls, null, 2));
  console.log(`✓ URLs also saved to: ${outputPath}`);
}

main();
