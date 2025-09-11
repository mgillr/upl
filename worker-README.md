# UPL Cloudflare Worker

This is a Cloudflare Worker script that creates shortlinks for UPL profiles.

## Deployment Instructions

1. Sign up for a [Cloudflare Workers](https://workers.cloudflare.com/) account (free tier is sufficient)

2. Install Wrangler CLI (if you haven't already):
   ```
   npm install -g wrangler
   ```

3. Authenticate with Cloudflare:
   ```
   wrangler login
   ```

4. Create a new Worker project:
   ```
   mkdir upl-worker
   cd upl-worker
   wrangler init
   ```

5. Replace the generated Worker code with the contents of `worker.js`

6. Create a `wrangler.toml` file with the following content:
   ```toml
   name = "upl-shortlink"
   main = "src/index.js"
   compatibility_date = "2023-09-11"

   [vars]
   BASE_URL = "https://mgillr.github.io/upl"
   ```

7. Deploy the Worker:
   ```
   wrangler deploy
   ```

## Usage

Once deployed, you can use the Worker to create shortlinks to UPL profiles:

- `https://<your-worker-subdomain>.workers.dev/u/demo` will redirect to `https://mgillr.github.io/upl/index.html?u=demo`
- You can also pass additional parameters: `https://<your-worker-subdomain>.workers.dev/u/demo?amount=10&currency=USD`

## Custom Domain (Optional)

To use a custom domain with your Worker:

1. Add a custom domain in the Cloudflare Workers dashboard
2. Configure DNS settings to point to your Worker
3. Update the BASE_URL in your wrangler.toml if needed