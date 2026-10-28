// The 13-second "how it works" clip on the home page and in the README. Replace the scenes in frame() with your
// tool's own; keep the four-scene shape: the address, the result, the detail, the API. It is, drawn frame by frame as SVG (no screen recording, so it is sharp, small and the same on every run). Run it after changing a scene:
//   bun run video
// Writes src/video.generated.ts (MP4 and a poster, served at /demo.mp4 and /demo.jpg) and docs/demo.gif.
// Needs ffmpeg on the PATH.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { check } from "../src/contrast";
import { SITE } from "../src/site";

const W = 960;
const H = 540;
const FPS = 25;
const here = new URL("..", import.meta.url).pathname;

const C = {
	bg: "#fbfaf7",
	fg: "#1d1c1a",
	muted: "#6b6862",
	line: "#e6e2da",
	card: "#ffffff",
	pass: "#1f7a4d",
	fail: "#b3261e",
	accent: "#2d4cc8",
};
const SANS = "Helvetica, Arial, sans-serif";
const MONO = "Menlo, monospace";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
/** 0 → 1 between `from` and `to` seconds, eased. */
const ease = (t: number, from: number, to: number) => {
	const x = clamp((t - from) / (to - from));
	return x * x * (3 - 2 * x);
};
const esc = (s: string) =>
	s.replace(
		/[&<>]/g,
		(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string,
	);

function caption(text: string, opacity: number) {
	return `<g opacity="${opacity}"><rect x="0" y="${H - 64}" width="${W}" height="64" fill="${C.fg}"/><text x="${W / 2}" y="${H - 24}" text-anchor="middle" font-family="${SANS}" font-size="26" font-weight="700" fill="${C.bg}">${esc(text)}</text></g>`;
}

function addressBar(prefix: string, rest: string, cursor: boolean) {
	return `<rect x="80" y="70" width="800" height="64" rx="32" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
<circle cx="120" cy="102" r="9" fill="none" stroke="${C.muted}" stroke-width="3"/><line x1="126" y1="108" x2="133" y2="115" stroke="${C.muted}" stroke-width="3"/>
<text x="150" y="113" font-family="${MONO}" font-size="30"><tspan fill="${C.accent}" font-weight="700">${esc(prefix)}</tspan><tspan fill="${C.fg}">${esc(rest)}</tspan>${cursor ? `<tspan fill="${C.accent}">|</tspan>` : ""}</text>`;
}

const HOST = new URL(SITE.url).host;
const FG = "767676";
const BG = "ffffff";
const RESULT = check(FG, BG) as NonNullable<ReturnType<typeof check>>;
const DURATION = 13;

function frame(t: number): string {
	const parts: string[] = [`<rect width="${W}" height="${H}" fill="${C.bg}"/>`];
	if (t < 3.4) {
		// 1. Two colors typed after the address.
		const path = `/${FG}/${BG}`;
		const typed = Math.floor(clamp((t - 0.6) / 1.4) * path.length);
		parts.push(
			addressBar(`${HOST}`, path.slice(0, typed), Math.floor(t * 2) % 2 === 0),
		);
		parts.push(
			`<g opacity="${ease(t, 2.2, 2.8)}"><circle cx="400" cy="290" r="40" fill="#${FG}"/><circle cx="560" cy="290" r="40" fill="#${BG}" stroke="${C.line}" stroke-width="2"/><text x="480" y="300" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="800" fill="${C.muted}">on</text></g>`,
		);
		parts.push(caption("Put two colors in the address", ease(t, 0.1, 0.5)));
	} else if (t < 6.6) {
		// 2. The ratio, and the colors side by side.
		const s = t - 3.4;
		const shown = (RESULT.ratio * ease(s, 0.1, 1.2)).toFixed(2);
		parts.push(
			`<text x="80" y="190" font-family="${SANS}" font-size="96" font-weight="800" fill="${C.fg}">${shown}:1</text>`,
		);
		parts.push(
			`<g opacity="${ease(s, 0.8, 1.3)}"><rect x="80" y="240" width="800" height="150" rx="16" fill="#${BG}" stroke="${C.line}" stroke-width="2"/><text x="110" y="305" font-family="${SANS}" font-size="34" font-weight="700" fill="#${FG}">Large text, 24px bold</text><text x="110" y="350" font-family="${SANS}" font-size="22" fill="#${FG}">Body text at 16px, the size most paragraphs use.</text></g>`,
		);
		parts.push(caption("The WCAG contrast ratio, at once", 1));
	} else if (t < 10) {
		// 3. Each level, pass or fail, and the nearest color that passes.
		const s = t - 6.6;
		RESULT.levels.forEach((l, i) => {
			const o = ease(s, 0.1 + i * 0.3, 0.4 + i * 0.3);
			const y = 70 + i * 54 + (1 - o) * 10;
			parts.push(
				`<g opacity="${o}"><rect x="80" y="${y}" width="800" height="44" rx="10" fill="${C.card}" stroke="${C.line}" stroke-width="2"/><text x="104" y="${y + 29}" font-family="${SANS}" font-size="21" fill="${C.fg}">${esc(l.label)} (${l.min}:1)</text><text x="856" y="${y + 29}" text-anchor="end" font-family="${SANS}" font-size="21" font-weight="700" fill="${l.pass ? C.pass : C.fail}">${l.pass ? "Pass" : "Fail"}</text></g>`,
			);
		});
		parts.push(
			caption("AA and AAA verdicts, and the nearest color that passes", 1),
		);
	} else {
		// 4. The same result for code and AI assistants.
		const s = t - 10;
		const lines = [
			`curl ${HOST}/api/contrast?fg=${FG}&bg=${BG}`,
			`![contrast](${HOST}/badge/${FG}/${BG}.svg)`,
			`claude mcp add --transport http contrast ${HOST}/mcp`,
		];
		lines.forEach((l, i) => {
			parts.push(
				`<g opacity="${ease(s, 0.1 + i * 0.35, 0.4 + i * 0.35)}"><rect x="80" y="${110 + i * 90}" width="800" height="64" rx="12" fill="${C.fg}"/><text x="104" y="${150 + i * 90}" font-family="${MONO}" font-size="19" fill="${C.bg}">${esc(l)}</text></g>`,
			);
		});
		parts.push(caption("A JSON API, a badge and an MCP server. No keys.", 1));
	}
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("\n")}</svg>`;
}

const render = (svg: string) =>
	new Resvg(svg, {
		font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
	})
		.render()
		.asPng();

if (import.meta.main) {
	const work = mkdtempSync(join(tmpdir(), "video-"));
	try {
		const frames = Math.round(DURATION * FPS);
		for (let i = 0; i < frames; i++)
			writeFileSync(
				join(work, `f${String(i).padStart(4, "0")}.png`),
				render(frame(i / FPS)),
			);
		const run = (args: string[]) => {
			const r = Bun.spawnSync(["ffmpeg", "-loglevel", "error", "-y", ...args]);
			if (r.exitCode !== 0) throw new Error(r.stderr.toString());
		};
		const input = ["-framerate", String(FPS), "-i", join(work, "f%04d.png")];
		const mp4 = join(work, "demo.mp4");
		run([
			...input,
			"-c:v",
			"libx264",
			"-pix_fmt",
			"yuv420p",
			"-crf",
			"28",
			"-preset",
			"slow",
			"-movflags",
			"+faststart",
			"-an",
			mp4,
		]);
		const poster = join(work, "demo.jpg");
		run([
			"-i",
			join(work, `f${String(Math.round(8.6 * FPS)).padStart(4, "0")}.png`),
			"-q:v",
			"4",
			poster,
		]);
		run([
			...input,
			"-vf",
			"fps=12,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=48[p];[b][p]paletteuse=dither=none",
			join(here, "../../../docs/demo.gif"),
		]);
		const b64 = (f: string) => readFileSync(f).toString("base64");
		writeFileSync(
			join(here, "src", "video.generated.ts"),
			`// Written by \`bun run video\` (scripts/video.ts). Do not edit.\nexport const VIDEO = {\n\t"demo.mp4": { type: "video/mp4", base64: "${b64(mp4)}" },\n\t"demo.jpg": { type: "image/jpeg", base64: "${b64(poster)}" },\n};\n`,
		);
		console.log(
			`Wrote src/video.generated.ts (${Math.round(readFileSync(mp4).length / 1024)} KB video) and docs/demo.gif`,
		);
	} finally {
		rmSync(work, { recursive: true, force: true });
	}
}
