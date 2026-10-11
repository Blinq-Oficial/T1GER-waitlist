import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guides } from '../content/guides.mjs';
import { renderArticle, renderHub, guidePath } from '../scripts/build-guides.mjs';
import { readFileSync } from 'node:fs';

test('Each educational guide has translated, reciprocal canonicals and readable HTML', () => {
  for (const guide of guides) for (const language of ['en', 'es']) {
    const html = renderArticle(guide, language);
    assert.ok(html.includes(`<html lang="${language}">`));
    assert.ok(html.includes(`rel="canonical" href="https://t1ger.app${guidePath(guide, language)}"`));
    for (const alternate of ['en', 'es']) assert.ok(html.includes(`hreflang="${alternate}" href="https://t1ger.app${guidePath(guide, alternate)}"`));
    assert.ok(html.includes('<article '));
    assert.ok(html.includes('<details>'));
    for (const source of guide.sources) assert.ok(html.includes(source.url));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema.inLanguage, language);
    assert.equal(schema['@type'], 'Article');
    assert.equal(schema.author.name, 'T1GER');
    assert.equal(schema.mainEntityOfPage, 'https://t1ger.app' + guidePath(guide, language));
  }
  assert.ok(renderHub('es').includes('La interfaz de la app está actualmente en inglés'));
});

test('Authenticated and legal screens cannot enter the public learning search index', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)));
  for (const route of ['/app', '/app/:path*', '/privacy', '/terms']) {
    assert.ok(config.headers.find(rule => rule.source === route)?.headers.some(header => header.key === 'X-Robots-Tag' && header.value.includes('noindex')));
  }
  const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  assert.ok(!sitemap.includes('/app/'));
  assert.ok(!sitemap.includes('/privacy'));
  for (const guide of guides) for (const language of ['en', 'es']) assert.ok(sitemap.includes(guidePath(guide, language)));
});
