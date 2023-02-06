// https://www.fastify.io/docs/latest/Guides/Serverless/#appjs

import fastify from 'fastify';
import MediaProxy from 'misskey-media-proxy';
import url from "url";

export function init() {
	const app = fastify();
	app.register(MediaProxy);
}

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
	// called directly i.e. "node app"
	init().listen({ port: 3000 }, (err) => {
		if (err) console.error(err);
		console.log('server listening on 3000');
	});
}
