#!/usr/bin/env node
/**
 * generate-blog-index.js
 *
 * Scans the blogs/ directory for .md files and generates blogs/index.json.
 * Blog filenames are expected to follow the pattern: YYYY_MM_DD-title.md
 *
 * Usage:
 *   node generate-blog-index.js
 */

const fs = require('fs');
const path = require('path');

const BLOGS_DIR = path.join(__dirname, 'blogs');
const OUTPUT = path.join(BLOGS_DIR, 'index.json');

const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8');

  // Extract date from filename: YYYY_MM_DD-title.md
  const dateMatch = file.match(/^(\d{4})_(\d{2})_(\d{2})-(.+)\.md$/);
  const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '';
  const fileTitle = dateMatch ? dateMatch[4] : file.replace('.md', '');

  // Extract title from first # heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : fileTitle;

  // Extract subtitle from first ## heading
  const subtitleMatch = content.match(/^##\s+(.+)$/m);
  const subtitle = subtitleMatch ? subtitleMatch[1] : '';

  return { file, title, subtitle, date };
});

// Sort by date descending
posts.sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2) + '\n', 'utf-8');
console.log(`✅ Generated ${OUTPUT} with ${posts.length} post(s).`);
