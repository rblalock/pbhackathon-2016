'use strict';

var server = require('../../server/server');

module.exports = function(Survey) {
	Survey.saveSurveyResults = function saveSurveyResults (surveyObject, next) {
		// Get tone of user text
		var ConversationModel = server.models.conversation;
		ConversationModel.toneCheck(surveyObject.text, function (e, d) {
			// Save the result
			Survey.create({
				text: surveyObject.text,
				exhibit: surveyObject.exhibit,
				tone: d.document_tone.tone_categories
			}, next);
		});
	};

	Survey.remoteMethod('saveSurveyResults', {
		accepts: { arg: 'survey', type: 'object' },
		returns: { arg: 'results', type: 'object' }
	});
};
