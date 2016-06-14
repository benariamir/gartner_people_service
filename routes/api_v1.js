'use strict';

var router = require('koa-router')({ prefix: '/api_v1' });

module.exports = function routes(requestHandler) {

	router.get('/profile/',function*() {
		log.trace('query',this.query);
		if (this.query.q === undefined) {
			throw new Error('Missing Query Parameter q=');
		}
		var results = yield requestHandler.getProfiles(this.query.q,this.query.field);
		this.body = results;
		this.status = 200;
	});

	return router.routes();

};
