# Get it in front of people who ask an AI

People now ask Claude, ChatGPT or Cursor for a tool instead of searching for one. A directory listing puts yours where they ask. This is what we learned listing [Citable](https://github.com/flisk-sh/citable) and [README Score](https://github.com/flisk-sh/readme-score), so you can skip the trial and error. Nothing here is posted for you.

## Which listing does what

| You have | List it as | Where |
| --- | --- | --- |
| A remote MCP server (this template's `/mcp`) | A **connector** | Claude directory (remote servers only), the [official MCP Registry](https://registry.modelcontextprotocol.io), Glama, Smithery, mcp.so |
| Skills plus a server reference | A **plugin bundle** | Claude directory, Cursor ([cursor.directory](https://cursor.directory/plugins/new) and cursor.com/marketplace/publish: forms, no pull requests), [docker/claude-plugins](https://github.com/docker/claude-plugins) (a pull request) |
| A check that fits in CI | A **GitHub Action** | GitHub Marketplace |
| A tool worth a line in a list | A **pull request** | Awesome lists: read each one's rules first, say it is yours, expect to skip many |

**Do both the connector and the plugin.** The Claude directory says so itself: the connector gets its own listing and dashboard, the plugin teaches Claude when and how to use it, and the two can be paired. A local stdio server (like `flisk mcp`) cannot be a connector; it can only travel inside a plugin, and then it runs in Claude Code and Cowork, not on claude.ai.

## 1. Name it in the words people type

Nobody types "README Checker". They type "improve my README". Name the listing for the job, and put those phrases in the description, the keywords and the skill's trigger list.

| We called it | We renamed it | People type |
| --- | --- | --- |
| README Checker | Improve My README | improve / fix / review my README, README score |
| AI Search Checker | Get My Site Found by AI | AI SEO, SEO for ChatGPT, show up in ChatGPT |

The **slug and plugin name are permanent** (kebab-case, they appear in install commands and URLs). The display name, description and keywords are not: set `displayName` in `plugin.json`, and edit the connector listing in the developer portal (an edit to a live listing goes to review and the old one stays live until then). So choose the slug carefully and the display name freely.

## 2. The connector (remote MCP server)

Already in this template: `/mcp`, Streamable HTTP, no key. Before you submit:

- Every tool has `annotations`: `title` (the directory shows it, and suggests it when missing), `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`. Keep tools read-only if you can.
- Tool descriptions only say what the tool does. No instructions to the model, no hidden text.
- Authentication **None** is fine for a free public tool; the form detects it.
- You need public **documentation**, **support** and **privacy policy** URLs. An `/about` page that says what is stored (nothing) works; a repo README for docs and the issues page for support work too.
- Three example prompts, a one-line prerequisite ("nothing, no account, no key") and "read only".
- Keep the server from being abused: per-client limits and a request-size cap (`src/guard.ts` has the counters; a Cloudflare Worker with no storage can count per IP in the Cache API).
- Serve a real **icon** at fixed addresses: `/favicon.ico`, `/icon.svg`, `/apple-touch-icon.png`, `/icon-512.png`. Set the custom icon URL in the listing too. The public detail page can show a grey placeholder for a while after publishing.
- The form asks you to confirm you tested every tool. Do that in Claude (Settings, Connectors) or with MCP Inspector before you tick it.
- Review took us hours, not weeks, but the page says "up to weeks".

## 3. The plugin

Put it in its own folder, for example `plugins/<slug>/`, and give the form that **plugin path**:

```
plugins/<slug>/
  .claude-plugin/plugin.json   name, displayName, version, description, keywords,
                               icon, documentationUrl, supportUrl, privacyPolicyUrl
  .claude-plugin/icon.png      square, 512 to 2048 px, under 2 MB (not SVG)
  .mcp.json                    { "mcpServers": { "<slug>": { "type": "http", "url": "https://…/mcp" } } }
  skills/<skill>/SKILL.md      what to do, in order, and when to ask first
```

- Run `claude plugin validate plugins/<slug>`. The listing keys (`icon`, `documentationUrl`, …) show as warnings on older Claude Code; that is expected.
- **No `.DS_Store`** or other system files anywhere in the repo. It is a blocking error. `git rm --cached` them.
- Set a `version`.
- A **remote** server in `.mcp.json` avoids almost every hold. For a **local** server the directory only reads commands it knows: `docker`, `node`, `python`, `java`, or a plain shell script named as `${CLAUDE_PLUGIN_ROOT}/<path>` (no `sh -c`, no `npx`). Anything else, such as a bare `flisk`, is held for a person to read. That is allowed, just slower.
- No top-level `bin/` folder if you want Cowork: plugins with one cannot be installed there. Use `scripts/`.
- The skill should say what happens, ask before anything public or irreversible, and list the phrases that should trigger it.

## 4. Order that works

1. Deploy the server and check it with a real call, the icons, the limits.
2. Submit the **connector** (developer portal: Submit new, MCP connector).
3. Submit the **plugin** (Plugin bundle, repo plus plugin path). Answer the data questions truthfully: personal data, who receives data, retention, under 18.
4. **After the connector is approved**, open the plugin, Content tab, "Link existing listing", and enter the connector's slug. Before approval the form answers "No published directory listing matches".
5. Add the **push webhook** the portal offers (payload URL, `application/json`, the secret it shows once, push events only). New commits then reach the directory in minutes instead of every 6 hours. Treat the secret like a password: copy it straight into GitHub, never into a chat or a file.
6. You tick the compliance boxes and press Submit. Those are your statements to the directory.

## 5. GitHub Actions Marketplace

Worth it only if the tool fits in CI (checking a URL or a README on every pull request). This template has no action; Citable and README Score do (`action.yml`). From GitHub's rules, and not yet done for those two:

- `action.yml` at the repository root, one action per repository, a **unique name**, a description, and `branding` with an `icon` and a `color`.
- A public repository with a README that shows the `uses:` line and the inputs.
- Publish through a **release**: on the new release, tick "Publish this Action to the GitHub Marketplace", accept the Developer Agreement, pick a category. Tag with semver and move a `v1` tag so users can pin to it.
- Pin third-party actions in your own workflows by commit.

## 6. Pitfalls we hit

- **Actions billing.** When recent payments fail, jobs never start (they fail in seconds with a billing message). Fix billing; do not read it as a test failure.
- **Merge queues and required reviews.** A repository with a merge queue needs `gh pr merge` without a strategy flag, and may need two approvals; the author cannot approve their own pull request.
- **The spell check** flags a truncated word inside a regex (a word stem followed by `\w*`). Spell the whole words out.
- **Formatters.** Run the repo's own linter with `--write` before you push; one long line fails CI.
- **A custom domain on a Worker creates a DNS record.** Deploy it on purpose.
- **Put each service in its own repository**, with its own tests and deploy, not inside someone else's service.
- **Copied code drifts.** If you copy a planner or checker into a second service, its bugs come along. Share one source or fix both.

## Before you submit

- [ ] Names, descriptions and skill triggers use the words people type.
- [ ] Every MCP tool has `annotations.title` and `readOnlyHint`.
- [ ] `/about` (or a README section) states what is stored; docs, support and privacy URLs work.
- [ ] Icons answer at the four addresses; a 512 px PNG is in the plugin.
- [ ] `claude plugin validate` passes; no `.DS_Store`; a `version` is set.
- [ ] The server has per-client limits and a size cap, and you called each tool for real.
- [ ] Connector submitted, plugin submitted, plugin linked after approval, webhook added.
