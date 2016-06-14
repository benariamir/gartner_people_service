'use strict';

var router = require('koa-router')({ prefix: '/api_v1' });

module.exports = function routes(requestHandler) {

	router.get('/profile/',function*() {
		
	});

	return router.routes();

};
