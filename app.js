'use strict';

require('./config/conf');
global.conf = require('./config/appsettings');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var co = require('co');
var apiV1Routes = require('./routes/api_v1');
var handleErrors = require('./lib/handle_errors');
var solr = require('solr-client');
var Bluebird = require('bluebird');

class App {
	constructor(requestHandler) {
		this.requestHandler = requestHandler;
	}

	*run() {
		this.app = koa();
		this.app.use(bodyParser());
		this.app.use(handleErrors);
		this.app.use(apiV1Routes(this.requestHandler));

		log.info('Listening to port 3000');
		this.app.listen(3000);
	}

}


co(function*() {


	var solrConnectionSettings = global.conf.solr_client.connection_settings;
	var solrClient = solr.createClient(solrConnectionSettings);
	solrClient = Bluebird.promisifyAll(solrClient);
	var app = new App();

	yield app.run();
}).catch(function(err) {
	log.error(err);
	process.abort();
});
