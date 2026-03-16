#!/usr/bin/env node
/**
 * build-blog.js
 * Reads blog-posts.json and regenerates the update cards section in blog.html.
 *
 * Usage:
 *   node build-blog.js
 *
 * To add a new post: edit blog-posts.json and run this script (or push — CI does it automatically).
 */

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, 'blog-posts.json');
const BLOG_FILE = path.join(__dirname, 'blog.html');
const START_MARKER = '<!-- BLOG_POSTS_START -->';
const END_MARKER = '<!-- BLOG_POSTS_END -->';

function buildCard(post) {
  const tagsHtml = post.tags
    .map(t => `                                <span class="tag${t.class ? ' ' + t.class : ''}">${t.label}</span>`)
    .join('\n');

  const linkHtml = post.link
    ? `\n                                <br><br>\n                                <a href="${post.link.url}" target="_blank" class="btn btn-primary btn-small">${post.link.label}</a>`
    : '';

  return `                        <div class="update-card">
                            <div class="update-header">
                                <span class="update-title">${post.title}</span>
                                <span class="update-date">${post.date}</span>
                            </div>
                            <div class="update-content">
                                ${post.content}${linkHtml}
                            </div>
                            <div class="update-tags">
${tagsHtml}
                            </div>
                        </div>`;
}

function main() {
  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  const html = fs.readFileSync(BLOG_FILE, 'utf8');

  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error('ERROR: Could not find BLOG_POSTS_START / BLOG_POSTS_END markers in blog.html');
    process.exit(1);
  }

  const before = html.slice(0, startIdx + START_MARKER.length);
  const after = html.slice(endIdx);

  const cards = posts.map(buildCard).join('\n\n');
  const newHtml = before + '\n' + cards + '\n                        ' + after;

  fs.writeFileSync(BLOG_FILE, newHtml, 'utf8');
  console.log(`✓ blog.html updated with ${posts.length} posts.`);
}

main();
