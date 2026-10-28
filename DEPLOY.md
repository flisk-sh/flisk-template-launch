# Deploy at template.flisk.si (free)

One Render web service on the free plan, from [`render.yaml`](render.yaml) and the root [`Dockerfile`](Dockerfile).
Nothing to sign up for besides Render: no database, no keys.

## 1. Create the service

1. https://dashboard.render.com → **New → Blueprint** → `flisk-sh/flisk-template-launch`, branch `main`.
2. Render lists one service, `flisk-template-launch`, on the **Free** plan, with the domain `template.flisk.si`.
   Apply.

The free plan sleeps after 15 minutes without traffic and takes about a minute to wake. On launch day, upgrade to
Starter for the day, or keep it awake.

## 2. Point the domain at it

1. Render → the service → **Settings → Custom Domains** shows the CNAME target.
2. Your DNS (Cloudflare: **DNS → Add record**): `CNAME`, name `template`, that target, proxy **DNS only**.
3. Wait for Render to issue the certificate.

If you put Cloudflare's proxy in front instead, set `TRUST_PROXY=cloudflare` and accept traffic from Cloudflare only.

## 3. Check it

```bash
curl -s https://template.flisk.si/ready
curl -s https://template.flisk.si/robots.txt
curl -s 'https://template.flisk.si/api/contrast?fg=767676&bg=ffffff'
curl -s -X POST https://template.flisk.si/mcp -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## 4. Tell search engines

- Google Search Console and Bing Webmaster Tools: add the domain, submit `/sitemap.xml`.
- Paste a result address into https://www.opengraph.xyz and the Rich Results Test to see the card and the JSON-LD.
