# UPL Telegram Bot Worker

This is a Cloudflare Worker script that creates a Telegram bot for generating UPL payment links.

## Deployment Instructions

1. Create a Telegram Bot:
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Use the `/newbot` command and follow the instructions
   - Save the API token you receive (it looks like `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)

2. Deploy the Worker to Cloudflare:
   - Sign up for a [Cloudflare Workers](https://workers.cloudflare.com/) account (free tier is sufficient)
   - Install Wrangler CLI: `npm install -g wrangler`
   - Authenticate with Cloudflare: `wrangler login`
   - Create a new Worker project:
     ```
     mkdir upl-telegram-bot
     cd upl-telegram-bot
     wrangler init
     ```
   - Replace the generated Worker code with the contents of `telegram-worker.js`

3. Create a `wrangler.toml` file with the following content:
   ```toml
   name = "upl-telegram-bot"
   main = "src/index.js"
   compatibility_date = "2023-09-11"

   [vars]
   BASE_URL = "https://mgillr.github.io/upl"
   BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"
   ```

4. Deploy the Worker:
   ```
   wrangler deploy
   ```

5. Set up the Webhook:
   - After deployment, you'll get a URL like `https://upl-telegram-bot.your-username.workers.dev`
   - Set the webhook by visiting:
     ```
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://upl-telegram-bot.your-username.workers.dev/tg
     ```
   - You should see a response like `{"ok":true,"result":true,"description":"Webhook was set"}`

## Bot Commands

Once set up, your bot will respond to the following commands:

1. `/link <username>` - Generates a link to a user's payment page
   - Example: `/link demo`
   - Response: `https://mgillr.github.io/upl/index.html?u=demo`

2. `/pay <username> <amount> [note]` - Generates a payment link with amount and optional note
   - Example: `/pay demo 50 Coffee`
   - Response: `https://mgillr.github.io/upl/index.html?u=demo&amount=50&note=Coffee`

## Security Considerations

- The BOT_TOKEN should be kept secret. Never commit it to version control.
- Use Cloudflare's environment variables or secrets to store the token securely.
- For production use, consider adding authentication to verify that requests are coming from Telegram.

## Customization

- Update the BASE_URL in your wrangler.toml to point to your own UPL instance
- Add more commands or features as needed