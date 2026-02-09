const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const toolsDir = path.join(__dirname, '..', 'data', 'tools');
const GITHUB_API_BASE = 'https://api.github.com';
const RATE_LIMIT_DELAY = 1000; // 1 second between requests to respect rate limits

// Cache for API responses to avoid duplicate requests
const apiCache = new Map();

async function fetchWithCache(url, cacheKey) {
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Pentest-Tools-Catalogue-Updater'
    };
    
    // Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    apiCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateToolFromGitHub(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const tool = yaml.load(fileContents);
    
    if (!tool.github_repo) {
      console.log(`⏭️  Skipping ${tool.name} - no GitHub repo`);
      return false;
    }
    
    console.log(`\n📦 Updating ${tool.name} (${tool.github_repo})...`);
    
    const [owner, repo] = tool.github_repo.split('/');
    if (!owner || !repo) {
      console.log(`⚠️  Invalid GitHub repo format: ${tool.github_repo}`);
      return false;
    }
    
    // Fetch repository info
    const repoUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    const repoData = await fetchWithCache(repoUrl, `repo:${tool.github_repo}`);
    
    if (!repoData) {
      console.log(`⚠️  Could not fetch data for ${tool.github_repo}`);
      return false;
    }
    
    let updated = false;
    const updates = [];
    
    // Update stars
    if (repoData.stargazers_count !== undefined) {
      const newStars = repoData.stargazers_count;
      if (tool.stars !== newStars) {
        tool.stars = newStars;
        updates.push(`⭐ Stars: ${tool.stars || 'N/A'} → ${newStars}`);
        updated = true;
      }
    }
    
    // Update description if missing or very short
    if (!tool.description && repoData.description) {
      tool.description = repoData.description;
      updates.push(`📝 Added description from GitHub`);
      updated = true;
    }
    
    // Update website if missing
    if (!tool.website && repoData.homepage) {
      tool.website = repoData.homepage;
      updates.push(`🌐 Added website: ${repoData.homepage}`);
      updated = true;
    }
    
    // Update maintainers/authors from GitHub
    if (!tool.maintainers || tool.maintainers.length === 0) {
      // Try to get owner as maintainer
      if (repoData.owner && repoData.owner.login) {
        tool.maintainers = [repoData.owner.login];
        updates.push(`👤 Added maintainer: ${repoData.owner.login}`);
        updated = true;
      }
    }
    
    // Fetch contributors (top contributors)
    const contributorsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=5`;
    const contributorsData = await fetchWithCache(contributorsUrl, `contributors:${tool.github_repo}`);
    
    if (contributorsData && Array.isArray(contributorsData) && contributorsData.length > 0) {
      const topContributors = contributorsData.slice(0, 3).map(c => c.login);
      if (!tool.authors || tool.authors.length === 0) {
        tool.authors = topContributors;
        updates.push(`✍️  Added authors: ${topContributors.join(', ')}`);
        updated = true;
      } else {
        // Merge with existing authors
        const existing = new Set(tool.authors);
        const newAuthors = topContributors.filter(c => !existing.has(c));
        if (newAuthors.length > 0) {
          tool.authors = [...tool.authors, ...newAuthors];
          updates.push(`✍️  Added authors: ${newAuthors.join(', ')}`);
          updated = true;
        }
      }
    }
    
    // Update license if missing
    if (!tool.license && repoData.license && repoData.license.spdx_id) {
      tool.license = repoData.license.spdx_id;
      updates.push(`📄 Updated license: ${repoData.license.spdx_id}`);
      updated = true;
    }
    
    if (updated) {
      // Write updated YAML back to file
      const updatedYaml = yaml.dump(tool, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      });
      fs.writeFileSync(filePath, updatedYaml, 'utf8');
      console.log(`✅ Updated ${tool.name}:`);
      updates.forEach(update => console.log(`   ${update}`));
      return true;
    } else {
      console.log(`✓ No updates needed for ${tool.name}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

async function updateAllTools() {
  const files = fs.readdirSync(toolsDir).filter(file => 
    file.endsWith('.yml') || file.endsWith('.yaml')
  );
  
  console.log(`\n🚀 Starting update for ${files.length} tools...\n`);
  console.log(`⏳ Rate limiting: ${RATE_LIMIT_DELAY}ms between requests\n`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(toolsDir, file);
    
    try {
      const result = await updateToolFromGitHub(filePath);
      if (result === true) {
        updatedCount++;
      } else if (result === false) {
        skippedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
    
    // Rate limiting - wait between requests (except for the last one)
    if (i < files.length - 1) {
      await delay(RATE_LIMIT_DELAY);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated: ${updatedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`\n✨ Done!\n`);
}

// Run the updater
updateAllTools().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
