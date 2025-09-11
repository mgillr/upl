export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/ping') return new Response('ok');

    if (url.pathname === '/tg' && request.method === 'POST') {
      const update = await request.json().catch(()=> ({}));
      const msg = update.message || update.edited_message;
      if (!msg || !msg.text) return new Response('ok');

      const text = msg.text.trim();
      const chatId = msg.chat.id;
      const BASE = env.BASE_URL || 'https://mgillr.github.io/upl';

      // /pay <user> <amount> [note...]
      // /link <user>
      let reply = "Usage:\n/pay <user> <amount> [note]\n/link <user>";
      const parts = text.split(/\s+/);

      if (parts[0] === '/link' && parts[1]) {
        const user = encodeURIComponent(parts[1]);
        reply = `${BASE}/index.html?u=${user}`;
      }
      if (parts[0] === '/pay' && parts[1] && parts[2]) {
        const user = encodeURIComponent(parts[1]);
        const amount = encodeURIComponent(parts[2]);
        const note = encodeURIComponent(parts.slice(3).join(' '));
        reply = `${BASE}/index.html?u=${user}&amount=${amount}${note ? '&note='+note : ''}`;
      }

      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply, disable_web_page_preview: true })
      });

      return new Response('ok');
    }
    return new Response('UPL tg worker', {status:200});
  }
}