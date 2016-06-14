'use strict';

var RequestHandler = require('../lib/request_handler');

var SolrClientTester = require('./solr_client_tester');
describe('End to end test',function() {

	it ('End to end test',function*() {
		var solrClientTester = new SolrClientTester();
		var requestHandler = new RequestHandler(solrClientTester);
		var result = yield requestHandler.getProfiles('nada','profileId');
		log.trace(result);
		expect(result).to.be.not.null;
		expect(result.peoples.length).to.be.eq(1);
		expect(result.peoples[0].profileId).to.be.eq('yuvalkaufman');
		expect(result.peoples[0].summary.length).to.be.eq(258);
		expect(result.peoples[0].skills.length).to.be.eq(16);
		expect(result.peoples[0].experience.length).to.be.eq(3);
		expect(result.peoples[0].education.length).to.be.eq(2);
	});

});
