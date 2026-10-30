# Launch kit

Copy this file into your product's repo and fill it in. Nothing here is posted for you.

**Rules.** The maker posts from their own personal account. No vote requests, no vote swaps, no new accounts. Ask
people to look and comment, never to upvote.

## 1. Pick what to build (ICE)

Read the week's top Product Hunt launches and score ideas 1 to 10 on Impact, Confidence and Ease; ICE is the
average. Keep only ideas that run as one free service with no database and no API keys: the tool computes or
fetches, and the visitor's own AI does any thinking (a "copy for ChatGPT / Claude" link, an MCP server).

| Idea | Seen on PH as | Impact | Confidence | Ease | ICE |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 2. The listing

- **Name**:
- **Tagline** (60 characters at most; say what it does, not how it feels): three options.
  1.
  2.
  3.
- **Description** (260 characters at most):
- **Topics** (three):
- **Links**: the site, the GitHub repo.
- **Thumbnail**: `https://<your domain>/icon-512.png` (240×240 shown).

## 3. Gallery (1270×760, five images)

1. The trick in one picture: the address before and after.
2. A real result page.
3. The fix or the answer the user leaves with.
4. The API, badge or MCP line, for developers.
5. Open source and free: the repo.

Take them from a real run, never a mockup.

## 4. Maker's first comment

> Hi, I'm … I built [name] because …
>
> How it works: …
>
> It is free, has no signup and stores nothing. The code is on GitHub: …
>
> What would make it useful for you?

## 5. Before launch day

- [ ] Deployed on the free plan, custom domain and certificate working, `PUBLIC_URL` set.
- [ ] `bun test` passes; `/robots.txt`, `/sitemap.xml`, `/llms.txt` and the card checked online.
- [ ] Ten real inputs tried by hand; the odd ones fixed.
- [ ] Sitemap submitted to Google Search Console and Bing.
- [ ] Gallery recorded from the live site.
- [ ] The service kept awake (or on a paid plan) for launch day.
- [ ] Launch scheduled for 00:01 Pacific; you are free that day to answer every comment.

## 6. Launch day

- Post the maker comment as soon as it is live.
- Answer every comment within the hour.
- Share it where you already talk to people: your newsletter, your own social accounts. Say what it does and link
  it; do not ask for votes.

## 6b. Forum threads: good and bad examples

Product Hunt moderators reject forum posts that "exist purely to farm engagement", single-line questions, and posts
that mostly promote a product. A rejected post costs you a day. Write the thread so a stranger has something to say.

**Bad (this one was rejected in p/vibecoding):**

> **My AI "fixed" one bug and broke 40 files 😭 What's your worst? (reply with a number or a story)**
>
> 1️⃣ It deleted something I needed 2️⃣ It rewrote way more than I asked 3️⃣ It said "done ✅" and nothing worked
> Just reply with a number. I'll post the tally tomorrow.

Why it fails: a numbered poll with "reply with a number" is engagement farming; there is no story, no context and no
opinion; the tally is a trick to bring people back.

**Bad (too long, reads like a survey):** three questions, a list of what you tried, and a paragraph of setup before
the point. Readers skip it, and nobody knows which question to answer.

**Bad (an ad):** a changelog, install command and feature bullets with no question. Moderators call this "promotional
content", and readers scroll past it.

**Good (short, specific, a story and one question):**

> **I asked an AI for a login page. It rewrote my setup.**
>
> The login page worked. The app didn't start. It took me an evening to find the one file it had renamed.
> What's the smallest request you ever made that turned into the biggest mess?

Why it works: it is your own story; the title says what happened; there is one open question that anyone with an AI
tool can answer with a story, not a method; it names no product and has no link.

**Good (a decision with a trade-off, for your own product forum, p/<product>):**

> **I added a rule to my tool: if anything it generates is edited by hand, it won't start. Dumb or smart?**
>
> After an AI rewrote my setup, I made the tool refuse to start and name the file. Some people say "good", others
> say "let me break my own stuff". Which camp are you, and when would you want to override it?

Why it works: it shares a real design decision, admits doubt, and asks people to pick a side and say why. That is an
opinion, not a bare vote.

**Rules of thumb**

- One story, one question. Under 80 words.
- Use only facts that happened. Never invent counts ("14 files") for effect; a reader who checks will not trust the
  rest.
- Ask for a story or an opinion, never "reply with a number" or "upvote".
- Do not name your product in a topic forum (p/vibecoding, p/general). Answer when someone asks. In your own
  product forum, share a decision, not a feature list.
- Post your own answer as the first comment, answer every reply within the hour, and join a few other threads first.
- Weekday mornings, Pacific.

## 7. Directories to submit to

Submit in the weeks around launch. Each listing is a backlink and a steady trickle of early users.

- [ ] [Product Hunt](https://www.producthunt.com/): schedule the launch for 00:01 Pacific and have the maker comment
  ready, saying why you built it.
- [ ] [Hacker News (Show HN)](https://news.ycombinator.com/showhn.html): post as "Show HN: …" with a plain
  description and a link people can try without signing up. Stay in the thread to answer questions.
- [ ] [BetaList](https://betalist.com/): good for pre-launch and early-stage products collecting their first users.
- [ ] [Indie Hackers](https://www.indiehackers.com/): add the product and share a build or launch story in the
  community.
