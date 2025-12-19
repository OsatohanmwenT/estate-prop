#!/usr/bin/env node
/**
 * Dependency audit script
 * - Detects package manager(s) present in the repo (pnpm, npm, yarn classic)
 * - Runs audit and outdated commands
 * - Generates dependency-audit-YYYY-MM-DD.md summary in repo root
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import process from 'node:process';

const repoRoot = resolve(process.cwd());

function detectManagers() {
  const managers = [];
  if (existsSync(resolve(repoRoot, 'pnpm-lock.yaml'))) managers.push('pnpm');
  if (existsSync(resolve(repoRoot, 'package-lock.json'))) managers.push('npm');
  if (existsSync(resolve(repoRoot, 'yarn.lock'))) managers.push('yarn');
  return managers;
}

function run(cmd, args, opts = {}) {
  try {
    const out = execFileSync(cmd, args, {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      ...opts,
    });
    return { ok: true, stdout: out };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function safeJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

function collectFromPnpm() {
  const results = { manager: 'pnpm', audit: null, outdated: null, errors: [] };

  // pnpm audit
  const a = run('pnpm', ['audit', '--json']);
  if (a.ok) {
    results.audit = safeJSON(a.stdout);
  } else {
    results.errors.push(`pnpm audit failed: ${a.error?.message || a.error}`);
  }

  // pnpm outdated
  const o = run('pnpm', ['outdated', '--format', 'json']);
  if (o.ok) {
    results.outdated = safeJSON(o.stdout);
  } else {
    results.errors.push(`pnpm outdated failed: ${o.error?.message || o.error}`);
  }

  return results;
}

function collectFromNpm() {
  const results = { manager: 'npm', audit: null, outdated: null, errors: [] };
  const a = run('npm', ['audit', '--json']);
  if (a.ok) results.audit = safeJSON(a.stdout); else results.errors.push(`npm audit failed: ${a.error?.message || a.error}`);
  const o = run('npm', ['outdated', '--json']);
  if (o.ok) results.outdated = safeJSON(o.stdout); else results.errors.push(`npm outdated failed: ${o.error?.message || o.error}`);
  return results;
}

function collectFromYarn() {
  const results = { manager: 'yarn', audit: null, outdated: null, errors: [] };
  const a = run('yarn', ['audit', '--json']);
  if (a.ok) {
    // yarn outputs NDJSON per line; collect relevant data lines
    const lines = a.stdout.split(/\r?\n/).filter(Boolean).map(safeJSON).filter(Boolean);
    results.audit = lines;
  } else {
    results.errors.push(`yarn audit failed: ${a.error?.message || a.error}`);
  }
  const o = run('yarn', ['outdated', '--json']);
  if (o.ok) {
    const lines = o.stdout.split(/\r?\n/).filter(Boolean).map(safeJSON).filter(Boolean);
    results.outdated = lines;
  } else {
    results.errors.push(`yarn outdated failed: ${o.error?.message || o.error}`);
  }
  return results;
}

function summarizeAuditForPnpm(auditJson) {
  // pnpm uses npm advisories-like output in modern versions via npm audit
  // Try to normalize to a list of findings: {name, version, severity, id, via, fixAvailable, vulnerable_versions}
  const findings = [];
  const totals = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };

  if (!auditJson) return { findings, totals };

  // New npm v8+ format has "vulnerabilities" object and "advisories" removed; but pnpm v8 maps differently.
  if (auditJson.vulnerabilities) {
    for (const [name, v] of Object.entries(auditJson.vulnerabilities)) {
      const sev = v.severity || 'info';
      totals[sev] = (totals[sev] || 0) + v.via?.length || 1;
      findings.push({
        name,
        version: v.version,
        severity: sev,
        id: Array.isArray(v.via) ? v.via.map((x) => (typeof x === 'string' ? x : x.source)).filter(Boolean).join(', ') : (v.via?.source || ''),
        via: v.via,
        fixAvailable: v.fixAvailable,
        vulnerable_versions: v.range,
      });
    }
  } else if (auditJson.advisories) {
    for (const adv of Object.values(auditJson.advisories)) {
      const a = adv;
      totals[a.severity] = (totals[a.severity] || 0) + 1;
      findings.push({
        name: a.module_name,
        version: a.findings?.[0]?.version,
        severity: a.severity,
        id: a.github_advisory_id || a.cves?.[0] || a.id,
        via: a.url,
        fixAvailable: a.patched_versions,
        vulnerable_versions: a.vulnerable_versions,
      });
    }
  }

  return { findings, totals };
}

function summarizeOutdatedForPnpm(outdatedJson) {
  // pnpm outdated --format json returns an array of pkgs with fields current, latest, wanted, isDeprecated, packageType
  const list = Array.isArray(outdatedJson) ? outdatedJson : [];
  const updates = list.map((p) => ({
    name: p.name,
    current: p.current,
    wanted: p.wanted,
    latest: p.latest,
    isDeprecated: !!p.deprecated,
    isMajor: p.latest && p.current && p.latest.split('.')?.[0] !== p.current.split('.')?.[0],
    isMinor: p.latest && p.current && p.latest.split('.')?.[0] === p.current.split('.')?.[0] && p.latest.split('.')?.[1] !== p.current.split('.')?.[1],
    isPatch: p.latest && p.current && p.latest.split('.')?.[0] === p.current.split('.')?.[0] && p.latest.split('.')?.[1] === p.current.split('.')?.[1] && p.latest.split('.')?.[2] !== p.current.split('.')?.[2],
  }));
  return updates;
}

function mdEscape(s) {
  return String(s ?? '').replace(/\|/g, '\\|');
}

function generateMarkdown(collected) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  let md = '';
  md += `# Dependency Audit Report (${dateStr})\n\n`;
  md += `This report was generated by scripts/dependency-audit.mjs. It audits all detected package managers and lists vulnerabilities and available updates.\n\n`;

  for (const c of collected) {
    md += `## Package manager: ${c.manager}\n\n`;

    // Vulnerabilities
    if (c.manager === 'pnpm') {
      const { findings, totals } = summarizeAuditForPnpm(c.audit);
      const totalCount = Object.values(totals).reduce((a, b) => a + (b || 0), 0);
      md += `### Vulnerabilities\n\n`;
      if (!c.audit || totalCount === 0) {
        md += `- No known vulnerabilities reported or audit unavailable.\n\n`;
      } else {
        md += `- Totals: info=${totals.info || 0}, low=${totals.low || 0}, moderate=${totals.moderate || 0}, high=${totals.high || 0}, critical=${totals.critical || 0}.\n\n`;
        md += `| Package | Version | Severity | IDs | Fixed In | Vulnerable Ranges |\n`;
        md += `|---|---|---|---|---|---|\n`;
        for (const f of findings) {
          const fixedIn = typeof f.fixAvailable === 'string' ? f.fixAvailable : (typeof f.fixAvailable === 'object' && f.fixAvailable?.name ? `${f.fixAvailable.name}@${f.fixAvailable.version}` : (f.fixAvailable ? 'Yes' : 'No'));
          md += `| ${mdEscape(f.name)} | ${mdEscape(f.version)} | ${mdEscape(f.severity)} | ${mdEscape(f.id)} | ${mdEscape(fixedIn)} | ${mdEscape(f.vulnerable_versions)} |\n`;
        }
        md += `\n`;
      }

      // Updates
      md += `### Available updates\n\n`;
      if (!c.outdated || (Array.isArray(c.outdated) && c.outdated.length === 0)) {
        md += `- No updates found or command unavailable.\n\n`;
      } else {
        const updates = summarizeOutdatedForPnpm(c.outdated);
        const patch = updates.filter((u) => u.isPatch);
        const minor = updates.filter((u) => u.isMinor);
        const major = updates.filter((u) => u.isMajor);
        const render = (arr, title) => {
          if (arr.length === 0) return `- No ${title.toLowerCase()} updates.\n`;
          let s = `- ${title} updates (${arr.length}):\n\n`;
          s += `| Package | Current | Wanted | Latest | Notes |\n`;
          s += `|---|---|---|---|---|\n`;
          for (const u of arr) {
            const notes = u.isMajor ? 'Potential breaking changes (major). Review CHANGELOG before upgrading.' : (u.isMinor ? 'Minor update' : 'Patch update');
            s += `| ${mdEscape(u.name)} | ${mdEscape(u.current)} | ${mdEscape(u.wanted)} | ${mdEscape(u.latest)} | ${notes} |\n`;
          }
          s += `\n`;
          return s;
        };
        md += render(patch, 'Patch');
        md += render(minor, 'Minor');
        md += render(major, 'Major (batched)');
        if (major.length > 0) {
          md += `- Major updates are batched and should be handled separately due to potential breaking changes.\n\n`;
        }
      }

      if (c.errors?.length) {
        md += `> Errors: ${c.errors.join(' | ')}\n\n`;
      }
    } else if (c.manager === 'npm' || c.manager === 'yarn') {
      md += `- Manager detected but detailed parsing is not yet implemented in this script.\n\n`;
      if (c.errors?.length) md += `> Errors: ${c.errors.join(' | ')}\n\n`;
    }
  }

  md += `---\n\nNext step: We can automatically apply patch and minor updates, run the test suite, and open a PR if everything passes. Reply to confirm whether you'd like me to proceed with applying safe (patch/minor) updates.\n`;

  return { md, dateStr };
}

function main() {
  const managers = detectManagers();
  if (managers.length === 0) {
    console.error('No supported package manager lockfiles found.');
  }

  const collected = [];
  for (const m of managers) {
    if (m === 'pnpm') collected.push(collectFromPnpm());
    else if (m === 'npm') collected.push(collectFromNpm());
    else if (m === 'yarn') collected.push(collectFromYarn());
  }

  const { md, dateStr } = generateMarkdown(collected);
  const outFile = resolve(repoRoot, `dependency-audit-${dateStr}.md`);
  writeFileSync(outFile, md, 'utf8');
  console.log(`Wrote ${outFile}`);
}

main();
