'use strict';

var schemaMatching = global.conf.metadata.schemaMatching;

// class to handle requests
class RequestHandler {

	constructor(solrClient) {
		this.client = solrClient;
		this.queryPipeline = global.conf.solr_client.connection_settings.query_pipeline;
		this.invertSchemaMatching = this.invert(schemaMatching);
		log.trace(this.invertSchemaMatching);
	}

	*getProfiles(freeText,field) {
		var query;
		// check if query param exists
		if (field !== undefined && field.length > 0) {
			// check if field itself exists in schema matching
			// indeed the schema matching of this service is similar (but different structure) to the indexing service. It should be done in a single configuration storage/service with correct parsing for both services.
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
		var results = yield this.client.getAsync(this.queryPipeline,query);
		log.info('Results returned from Solr.');
		log.trace({solrResults:results});
		results = this.cleanseSolrResults(results);
		results = results.map((result) => {
			return this.transform(result);
		});
		log.trace({cleansedResults:results});
		return {peoples:results};
	}

	// basically just filter unused fields
	cleanseSolrResults(solrResults) {
		var results = solrResults.response.docs;
		results = results.map( (result) => {
			delete result._version_;
			return result;
		});
		return results;
	}

	invert(object) {
		var invert = {};
		Object.keys(object).forEach((key) => {
			invert[object[key]] = key;
		});
		return invert;
	}

	transform(solrDoc) {
		var result = {};
		Object.keys(solrDoc).forEach((key) => {
			log.trace({key:key,schemaFiled:this.invertSchemaMatching[key]});
			if (this.invertSchemaMatching[key] !== undefined) {
				result[this.invertSchemaMatching[key]] = solrDoc[key];
			}
			else {
				result[key] = solrDoc[key];
			}
		});
		log.trace({solrDoc:solrDoc,transformed:result});
		return result;
	}

}

module.exports = RequestHandler;
