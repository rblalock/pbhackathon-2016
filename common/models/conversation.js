'use strict';

var fs = require('fs');
var credentials = require('../../credentials');
var server = require('../../server/server');

var ConversationModule = require('watson-developer-cloud/conversation/v1');
var SpeechToTextModule = require('watson-developer-cloud/speech-to-text/v1');
var TextToSpeechModule = require('watson-developer-cloud/text-to-speech/v1');

var conversation = new ConversationModule(credentials.conversation);
var speechToText = new SpeechToTextModule(credentials.speechToText);
var textToSpeech = new TextToSpeechModule(credentials.textToSpeech);

module.exports = function(Conversation) {

	// Find the user's interest
	Conversation.interest = function interest (text, next) {
		conversation.message({
			input: { text: text || '' },
			workspace_id: credentials.conversation.workspace
		}, function(err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	};

	// Handle audio upload (speech to text flow)
	Conversation.speechToText = function speechToTextCallback(req, res, id, next) {
		var storage = server.dataSources.Storage.models.container;

		// Handle upload the audio first
		storage.getContainers(function (err, containers) {
			storage.upload(req, res, { container: id }, function (err, d) {
				// Now convert to text
				var params = {
					// hardcoded for now since we aren't saving a hash of this file
					audio: fs.createReadStream(__dirname + '/../../uploads/speechToText/audio.wav'),
					content_type: 'audio/wav; rate=44100'
				};

				speechToText.recognize(params, function(e, text) {
					next(e, text);
				});
			});
		});
	};

	// Handle watson's text to speech
	Conversation.textToSpeech = function textToSpeechCallback (text, next) {
		textToSpeech.synthesize({
			text: text,
			accept: 'audio/wav',
			voice: 'en-US_LisaVoice'
		}, next);
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

	Conversation.remoteMethod('textToSpeech', {
		accepts: [
			{ arg: 'text', type: 'string' }
		],
		returns: { arg: 'results', type: 'object' }
	});

	Conversation.remoteMethod('interest', {
		accepts: { arg: 'text', type: 'string' },
		returns: { arg: 'conversation', type: 'object' }
	});

};
