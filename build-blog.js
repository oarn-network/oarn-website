#!/usr/bin/env node
/**
 * build-blog.js
 * Reads blog-posts.json and regenerates:
 *   1. The update cards section in blog.html
 *   2. rss.xml — for Combot and RSS readers
 *
 * Usage:
 *   node build-blog.js
 *
 * To add a new post: edit blog-posts.json and push — CI runs this automatically.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://oarn-network.github.io/oarn-website';
const RSS_FILE = path.join(__dirname, 'rss.xml');

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

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '');
}

function toRfc822(dateStr) {
  return new Date(dateStr).toUTCString();
}

function buildRss(posts) {
  const items = posts.map(post => {
    const plainContent = stripHtml(post.content);
    const link = post.link ? post.link.url : `${SITE_URL}/blog.html`;
    return `    <item>
      <title>${post.title}</title>
      <link>${link}</link>
      <description>${plainContent}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <guid>${link}#${encodeURIComponent(post.title)}</guid>
    </item>`;
  }).join('\n');

  const lastBuild = toRfc822(posts[0].date);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>OARN Network — Updates</title>
    <link>${SITE_URL}/blog.html</link>
    <description>Latest updates from OARN Network — decentralized AI compute on Arbitrum.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

function main() {
  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));

  // 1. Regenerate blog.html
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

  // 2. Regenerate rss.xml
  fs.writeFileSync(RSS_FILE, buildRss(posts), 'utf8');
  console.log(`✓ rss.xml generated with ${posts.length} items.`);
}

main();
