// https://www.fastify.io/docs/latest/Guides/Serverless/#appjs

import fastify from 'fastify';
import MediaProxy from 'misskey-media-proxy';
import url from 'url';

export function init() {
	const app = fastify();
	app.addHook('onRequest', (request, reply, done) => {
		reply.header('Server', 'Misskey Media Proxy');
		done();
	});
	app.get('/', (req, reply) => {
		reply.header('content-type', 'text/plain; charset=utf-8')
		return reply.send('Hello World!')
	});
	app.register(MediaProxy);
	return app;
}

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
	// called directly i.e. "node app"
	init().listen({ port: 3000 }, (err) => {
		if (err) console.error(err);
		console.log('server listening on 3000');
	});
}
