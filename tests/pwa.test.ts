import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
test('Manifest, ikony i zasoby działają w katalogu głównym i pod /przybornik/', () => {
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));
  const html = readFileSync('index.html', 'utf8');
  const resources = Array.from(html.matchAll(/(?:href|src)="([^"]+)"/g), match => match[1]);
  for (const path of ['/', '/przybornik/']) {
    const app = new URL(path, 'https://example.test');
    const manifestUrl = new URL('manifest.webmanifest', app);
    assert.equal(new URL(manifest.scope, manifestUrl).href, app.href);
    assert.equal(new URL(manifest.start_url, manifestUrl).href, app.href);
    for (const resource of resources) {
      assert.match(resource, /^\.\//);
      assert.ok(new URL(resource, app).pathname.startsWith(path));
    }
  }
  for (const icon of manifest.icons) assert.ok(existsSync('public/' + icon.src));
  assert.ok(manifest.icons.some((icon: {purpose: string}) => icon.purpose === 'maskable'));
});
test('Workflow publikuje automatycznie z main i pozwala na ręczne wdrożenie',()=>{const y=readFileSync('.github/workflows/deploy.yml','utf8');assert.match(y,/workflow_dispatch:/);assert.match(y,/^  push:\s*\n\s+branches:\s*\[main\]/m);assert.match(y,/actions\/deploy-pages@v4/);});
test('Hasła nie są zapisywane w pamięci',()=>{const app=readFileSync('src/main.ts','utf8');const code=app.slice(app.indexOf('function passwordTool()'),app.indexOf('const popular:'));assert.doesNotMatch(code,/localStorage|save\(|console\.|fetch\(/);});
