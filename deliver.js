#!/usr/bin/env node
/**
 * Hasweeni Digital — Client Delivery Script
 * Run: node deliver.js
 * Builds a client site, deploys to Netlify, sets up domain if provided.
 */

const readline = require('readline');
const fs       = require('fs');
const fsp      = fs.promises;
const path     = require('path');
const { execSync } = require('child_process');

const REPO = path.join('C:', 'Users', 'momom', 'Hasweeni', 'repo');

// ── Load Netlify token from .env ──────────────────────────────────────────────
function loadToken() {
  const envPath = path.join(REPO, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^NETLIFY_TOKEN\s*=\s*(.+)/);
      if (m) return m[1].trim();
    }
  }
  return '';
}

// ── Prompt helper ─────────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(question, defaultVal) {
  return new Promise(resolve => {
    const prompt = defaultVal ? `${question} [${defaultVal}]: ` : `${question}: `;
    rl.question(prompt, ans => resolve(ans.trim() || defaultVal || ''));
  });
}

// ── Copy directory recursively ────────────────────────────────────────────────
async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  for (const entry of await fsp.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  }
}

// ── Replace {{PLACEHOLDER}} in file content ───────────────────────────────────
function applyVars(content, vars) {
  for (const [k, v] of Object.entries(vars))
    content = content.split(`{{${k}}}`).join(v);
  return content;
}

// ── Remove the demo watermark banner ─────────────────────────────────────────
function stripWatermark(html) {
  return html.replace(/<div[^>]*class="demo-banner"[^>]*>[\s\S]*?<\/div>\s*/g, '');
}

// ── Process all files in a client dir ────────────────────────────────────────
async function processFiles(dir, vars, removeBanner) {
  for (const entry of await fsp.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { await processFiles(p, vars, removeBanner); continue; }
    if (!/\.(html|css|js)$/.test(entry.name)) continue;
    let content = await fsp.readFile(p, 'utf8');
    content = applyVars(content, vars);
    if (removeBanner && entry.name.endsWith('.html')) content = stripWatermark(content);
    await fsp.writeFile(p, content, 'utf8');
  }
}

// ── Run a shell command ───────────────────────────────────────────────────────
function run(cmd, opts) {
  return execSync(cmd, { cwd: REPO, encoding: 'utf8', ...opts });
}
function netlify(args, token) {
  return run(`netlify ${args}`, { env: { ...process.env, NETLIFY_AUTH_TOKEN: token } });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + '═'.repeat(52));
  console.log('  Hasweeni Digital — Client Delivery Tool');
  console.log('═'.repeat(52) + '\n');

  const token = loadToken();
  if (!token) {
    console.log('⚠️  No Netlify token found in .env — will push to GitHub Pages only.\n');
  }

  // ── Gather client info ──────────────────────────────────────────────────────
  const niche         = await ask('Niche (hvac / plumbing / electrical)', 'hvac');
  const businessName  = await ask('Business Name (e.g. Paco Heating and Air)');
  const slug          = await ask('URL slug — lowercase, no spaces (e.g. paco-hvac)');
  const city          = await ask('City');
  const state         = await ask('State (2 letters, e.g. TX)');
  const phoneDisplay  = await ask('Phone — display format (e.g. (806) 886-8396)');
  const phoneRaw      = '+1' + phoneDisplay.replace(/\D/g, '');
  const email         = await ask('Contact email (or press Enter to skip)', '');
  const years         = await ask('Years in business', '10');
  const serviceArea   = await ask(`Service area`, `${city} and surrounding areas`);

  const paidInput     = await ask('\nHas this client PAID? (removes watermark) y/n', 'n');
  const paid          = paidInput.toLowerCase() === 'y';

  const domain        = await ask('\nCustom domain? (e.g. pacoheating.com — press Enter to skip)', '');
  let   siteName      = '';
  if (token) {
    siteName = await ask('Netlify site name (e.g. paco-hvac-tx)', slug.replace(/[^a-z0-9]/g, '-'));
  }

  rl.close();

  // ── Paths ──────────────────────────────────────────────────────────────────
  const templateDir = path.join(REPO, `${niche}-template`);
  const clientDir   = path.join(REPO, 'clients', slug);

  if (!fs.existsSync(templateDir)) {
    console.error(`\n❌ Template not found: ${niche}-template`);
    process.exit(1);
  }

  const vars = {
    BUSINESS_NAME:    businessName,
    CITY:             city,
    STATE:            state,
    PHONE_DISPLAY:    phoneDisplay,
    PHONE_RAW:        phoneRaw,
    EMAIL:            email || 'info@' + businessName.toLowerCase().replace(/[^a-z]/g, '') + '.com',
    YEARS:            years,
    SERVICE_AREA_LIST: serviceArea,
    YOUR_NAME:        'Hasweeni Digital',
  };

  // ── Build ──────────────────────────────────────────────────────────────────
  console.log('\n📁  Copying template...');
  if (fs.existsSync(clientDir)) {
    fs.rmSync(clientDir, { recursive: true, force: true });
  }
  await copyDir(templateDir, clientDir);

  console.log('✏️   Filling in client details...');
  await processFiles(clientDir, vars, paid);

  if (paid)  console.log('✅  Watermark removed — client has paid.');
  else       console.log('🔒  Watermark kept — collect payment first.');

  // ── GitHub push ────────────────────────────────────────────────────────────
  console.log('📤  Pushing to GitHub...');
  run(`git add clients/${slug}/`);
  try {
    run(`git commit -m "Client: ${businessName}, ${city} ${state}"`);
    run('git push');
    console.log('✅  GitHub push done.');
  } catch (e) {
    console.log('⚠️   Git push failed — check manually.');
  }

  let liveUrl = `https://momowm.github.io/Hasweeni/clients/${slug}/`;

  // ── Netlify deploy ─────────────────────────────────────────────────────────
  if (token && siteName) {
    console.log(`\n🌐  Creating Netlify site "${siteName}"...`);
    let siteId = '';
    try {
      const out = netlify(`sites:create --name ${siteName}`, token);
      const m = out.match(/Project ID:\s*([a-f0-9-]{36})/);
      if (m) siteId = m[1];
      console.log('✅  Site created.');
    } catch (e) {
      // Site name might be taken — try with suffix
      const alt = siteName + '-hd';
      console.log(`⚠️   Name taken, trying "${alt}"...`);
      try {
        const out2 = netlify(`sites:create --name ${alt}`, token);
        const m2 = out2.match(/Project ID:\s*([a-f0-9-]{36})/);
        if (m2) { siteId = m2[1]; siteName = alt; }
      } catch (e2) {
        console.log('⚠️   Could not create Netlify site. Falling back to GitHub Pages.');
      }
    }

    if (siteId) {
      console.log('🚀  Deploying files...');
      try {
        netlify(`deploy --dir "${clientDir}" --site ${siteId} --prod`, token);
        liveUrl = `https://${siteName}.netlify.app`;
        console.log('✅  Deployed to Netlify.');

        // ── Custom domain ────────────────────────────────────────────────────
        if (domain) {
          console.log(`🔗  Adding custom domain ${domain}...`);
          try {
            netlify(`domains:add ${domain} --site ${siteId}`, token);

            // Write CNAME hint file into client folder
            await fsp.writeFile(path.join(clientDir, 'CNAME_INFO.txt'),
              `Custom domain: ${domain}\nNetlify site: ${siteName}.netlify.app\n`
            );
            liveUrl = `https://${domain}`;
            console.log(`✅  Domain ${domain} added to Netlify.`);
          } catch (e) {
            console.log(`⚠️   Domain add failed — do it manually in app.netlify.com.`);
          }
        }
      } catch (e) {
        console.log('⚠️   Netlify deploy failed. Site is on GitHub Pages.');
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(52));
  console.log('  ✅  DELIVERY COMPLETE');
  console.log('═'.repeat(52));
  console.log(`\n  Business : ${businessName}`);
  console.log(`  City     : ${city}, ${state}`);
  console.log(`  Phone    : ${phoneDisplay}`);
  console.log(`  Status   : ${paid ? 'PAID — watermark removed' : 'DEMO — awaiting payment'}`);
  console.log(`  Live URL : ${liveUrl}\n`);

  if (domain && liveUrl.includes(domain)) {
    console.log('─'.repeat(52));
    console.log(`  📋  DNS SETTINGS — add these in Namecheap for ${domain}`);
    console.log('─'.repeat(52));
    console.log(`  Type: CNAME | Host: www | Value: ${siteName}.netlify.app`);
    console.log(`  Type: A     | Host: @   | Value: 75.2.60.5`);
    console.log(`\n  ⏱  DNS goes live in 1–24 hours after you add these.\n`);
  }

  console.log('─'.repeat(52));
  console.log('  📱  Message to send the client:\n');
  console.log(`  "Hey! Your website is live 🎉`);
  console.log(`  Here's your link: ${liveUrl}`);
  console.log(`  Put it in your Facebook bio and share it with customers!"`);
  console.log('\n' + '═'.repeat(52) + '\n');
}

main().catch(err => { console.error(err); process.exit(1); });
