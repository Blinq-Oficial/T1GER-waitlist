// Match the existing site's aggregate Vercel metrics; never send query strings or lesson inputs.
if (location.hostname === 't1ger.app') {
  window.va = window.va || function (...args) { (window.vaq = window.vaq || []).push(args); };
  window.va('beforeSend', event => {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    if (!canonical || !canonical.startsWith('https://t1ger.app/guides')) return null;
    return { ...event, url: canonical };
  });
  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  document.head.appendChild(script);
}
