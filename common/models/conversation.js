'use strict';

var credentials = require('../../credentials');
var server = require('../../server/server');

var ConversationModulde = require('watson-developer-cloud/conversation/v1');
var conversation = new ConversationModulde(credentials.conversation);

var SpeechToText = require('watson-developer-cloud/speech-to-text/v1');
var speechToText = new SpeechToText(credentials.speechToText);

module.exports = function(Conversation) {
	// TODO User audio input w/ Waton

	// Find the user's interest
	Conversation.interest = function interest (text, next) {
		conversation.message({
			input: { text: text || '' },
			workspace_id: credentials.conversation.workspace
		}, function(err, res) {
			if (err) {
				next(err, null);
				console.error(err);
			} else {
				next(null, res);
				console.log(res);
			}
		});
	};

	// Handle audio upload (speech to text flow)
	Conversation.speechToText = function speechToTextCallback(req, res, id, cb) {
		var storage = server.dataSources.Storage.models.container;

		storage.getContainers(function (err, containers) {
			storage.upload(req, res, { container: id }, function (err, d) {
				cb(err, d);
			});
		});
	};

	Conversation.remoteMethod('speechToText', {
		http: { path: '/:id/speechToText', verb: 'post' },
		accepts: [
			{ arg: 'req', type: 'object', 'http': {source: 'req'} },
			{ arg: 'res', type: 'object', 'http': {source: 'res'} },
			{ arg: 'id', type: 'string' }
		],
		returns: { arg: 'status', type: 'object' }
	});

	Conversation.remoteMethod('interest', {
		accepts: { arg: 'text', type: 'string' },
		returns: { arg: 'conversation', type: 'object' }
	});

};
