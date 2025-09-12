export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/,'');
    
    // Health check
    if (path === '' || path === 'ping') {
      return new Response('ok', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Handle shortlinks
    if (path.startsWith('u/')) {
      try {
        const user = encodeURIComponent(path.split('/')[1] || '');
        if (!user) {
          return new Response('Missing username in path. Use /u/username', {
            status: 400,
            headers: {
              'Content-Type': 'text/plain',
              'Cache-Control': 'no-store'
            }
          });
        }
        
        const BASE = env.BASE_URL || 'https://mgillr.github.io/upl';
        const params = new URLSearchParams(url.search);
        const target = `${BASE}/index.html?u=${user}${params.toString() ? '&' + params.toString().replace(/^\?/,'') : ''}`;
        
        // Set cache for 1 hour (3600 seconds)
        return new Response(null, {
          status: 302,
          headers: {
            'Location': target,
            'Cache-Control': 'public, max-age=3600',
            'X-UPL-User': user
          }
        });
      } catch (error) {
        return new Response(`Error processing request: ${error.message}`, {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store'
          }
        });
      }
    }
    
    // Default response for other paths
    return new Response('Universal Pay Link shortener. Use /u/username to access a profile.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store'
      }
    });
  }
}