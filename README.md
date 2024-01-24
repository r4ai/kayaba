# Kayaba (discord bot)

An AI bot for personal discord server.

## Development

### Set secret

```
wrangler secret put DISCORD_TOKEN
wrangler secret put DISCORD_APPLICATION_ID
wrangler secret put DISCORD_GUILD_ID
wrangler secret put DISCORD_PUBLIC_KEY
```

See [Discord official "Hosting on Cloudflare Workers" tutorial](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers) for more details.

### Register commands

```
DISCORD_TOKEN="XXXXXXX" DISCORD_APPLICATION_ID="123456" bun run register
```

### Deploy

```
bun run deploy
```
