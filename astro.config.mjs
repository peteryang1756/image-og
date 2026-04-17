// @ts-check

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	adapter: cloudflare(),
	output: 'server',
	vite: {
		plugins: [rawFonts(['.ttf'])],
		assetsInclude: ['**/*.wasm'],
		ssr: {
			external: ['buffer', 'path', 'fs'].map((i) => `node:${i}`),
		},
		assetsExclude: ['**/*.ttf'],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});

function rawFonts(extensions) {
	return {
		name: 'vite-plugin-raw-fonts',
		enforce: 'pre',
		resolveId(id, importer) {
			if (extensions.some((ext) => id.includes(ext))) {
				if (id.startsWith('.')) {
					const resolvedPath = path.resolve(path.dirname(importer), id);
					return resolvedPath;
				}
				return id;
			}
		},
		load(id) {
			if (extensions.some((ext) => id.includes(ext))) {
				const buffer = fs.readFileSync(id);
				return `export default new Uint8Array([${Array.from(buffer).join(',')}]);`;
			}
		},
	};
}
