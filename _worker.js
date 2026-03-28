export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Check if the request is for a static asset
    const staticAssets = [
      '/static/',
      '/manifest.json',
      '/robots.txt',
      '/favicon.svg',
      '/og-image.svg',
      '/twitter-image.svg',
      '/favicon.png',
      '/sitemap.xml',
      '/asset-manifest.json'
    ];

    const isStaticAsset = staticAssets.some(asset => url.pathname.startsWith(asset)) ||
                         url.pathname.endsWith('.ico') ||
                         url.pathname.endsWith('.png');

    // If it's a static asset, let it be served normally
    if (isStaticAsset) {
      return env.ASSETS.fetch(request);
    }

    // For all other routes (including /cities/*), serve index.html
    const indexRequest = new Request(`${url.origin}/index.html`, request);
    return env.ASSETS.fetch(indexRequest);
  }
};