'use strict';

var schemaMatching = global.conf.metadata.schemaMatching;

// class to handle requests
class RequestHandler {

	constructor(solrClient) {
		this.client = solrClient;
	}

	*getProfiles(freeText,field) {
		var query;
		if (field !== undefined && field.length > 0) {
			if (!schemaMatching[field]) {
				throw new Error(`Field ${field} does not exist.`);
			}
			var matchedField = schemaMatching[field];
			query = `q=${matchedField}:*${freeText}*`;
		}
		else {
			var query = `q=${freeText}`;
		}
		log.info('Performing query to Solr.');
		var results = yield this.client.getAsync('query',query);
		log.info('Results returned from Solr.');
		log.trace({solrResults:results});
		results = this.cleanseSolrResults(results);
		log.trace({cleansedResults:results});
		return {peoples:results};
	}

	cleanseSolrResults(solrResults) {
		var results = solrResults.response.docs;
		results = results.map( (result) => {
			delete result._version_;
			return result;
		});
		return results;
	}

}

module.exports = RequestHandler;
