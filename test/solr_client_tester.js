'use strict';
var fs = require('fs');

class SolrClientTester {

	*getAsync(queryPiplineName,query) {
		log.info('SolrClientTester: getAsync!');
		var solrReply = fs.readFileSync('test/solr_reply_example.json').toString();
		var jsonSolrReply = JSON.parse(solrReply);
		log.trace(jsonSolrReply);
		return jsonSolrReply;
	}

}
module.exports = SolrClientTester;
