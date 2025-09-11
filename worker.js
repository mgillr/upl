export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/,'');
    if (path === '' || path === 'ping') return new Response('ok', {status:200});

    if (path.startsWith('u/')) {
      const user = encodeURIComponent(path.split('/')[1] || '');
      const BASE = env.BASE_URL || 'https://mgillr.github.io/upl';
      const params = new URLSearchParams(url.search);
      const target = `${BASE}/index.html?u=${user}${params.toString() ? '&' + params.toString().replace(/^\?/,'') : ''}`;
      return Response.redirect(target, 302);
    }
    return new Response('UPL worker. Use /u/<name>.', {status:200});
  }
}