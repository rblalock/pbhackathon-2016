var Watson = {
	watsonInterval: null,

	getRandomInt: function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	recordAudio: function recordAudio () {
		Fr.voice.record(false);
	},

	speechToText: function (text, callback) {
		$.ajax({
			url: '/api/conversation/textToSpeech',
			type: 'POST',
			data: {
				text: text
			},
			success: function(data) {
				var aud = new Audio("data:audio/wav;base64," + data.results.$data);
				callback(aud);
			}
		});
	},

	watsonShow: function watsonShow() {
		$("#watson").delay(50).fadeIn().animate({
			bottom: 10
		}, 200, function() {
			$(this).effect("bounce", { times: 4 }, 400);
		});
	},

	watsonConnect: function watsonConnect() {
		$("#watson .prompt").fadeOut(200);
		$("#watson .speech").fadeIn(300);
	},

	watsonLoading: function watsonLoading() {
		Watson.watsonInterval = setInterval(Watson.watsonLoadingAnim, 1000);
	},

	watsonLoadingAnim: function watsonLoadingAnim() {
		$("#watson .wave").fadeTo(500, 0.5).fadeTo(500, 1);
	},

	watsonLoadingEnd: function watsonLoadingEnd() {
		window.clearInterval(Watson.watsonInterval);
		$("#watson .wave").fadeTo(500, 1);
	},

	watsonSpeak: function watsonSpeak() {
		Watson.watsonInterval = setInterval(Watson.watsonSpeakAnim, 75);
	},

	watsonSpeakAnim: function watsonSpeakAnim() {
		$("#watson .wave .l").animate({
			height: Watson.getRandomInt(10, 30)
		}, 75);

		$("#watson .wave .r").animate({
			height: Watson.getRandomInt(10, 30)
		}, 75);
	},

	watsonSpeakEnd: function watsonSpeakEnd() {
		window.clearInterval(Watson.watsonInterval);

		$("#watson .wave .l").animate({
			height: 10
		}, 75);

		$("#watson .wave .r").animate({
			height: 10
		}, 75);
	},

	watsonListen: function watsonListen() {
		Watson.watsonInterval = setInterval(function() {
			Watson.watsonListenAnim();
		}, 800);
	},

	watsonListenAnim: function watsonListenAnim() {
		$("#watson .wave .l").animate({
			top: 10
		}, 200, function() {
			$("#watson .wave .l").animate({
				top: -10
			}, 400, function() {
				$("#watson .wave .l").animate({
					top: 0
				}, 200);
			});
		});

		$("#watson .wave .r").animate({
			top: -10
		}, 200, function() {
			$("#watson .wave .r").animate({
				top: 10
			}, 400, function() {
				$("#watson .wave .r").animate({
					top: 0
				}, 200);
			});
		});
	},

	watsonListenEnd: function watsonListenEnd() {
		window.clearInterval(Watson.watsonInterval);

		$("#watson .wave .l").animate({
			top: 0
		}, 200);

		$("#watson .wave .r").animate({
			top: 0
		}, 200);
	},

	watsonHide: function watsonHide() {
		$("#watson").animate({
			bottom: -100
		}, 200, function() {
			$(this).hide();

			$("#watson .prompt").show();
			$("#watson .speech").hide();
		});
	}
};

// watsonShow();

// $("#watson").click(function() {
// 	if (isRecording) {
// 		isRecording = false;
// 		Fr.voice.export(function(blob) {
// 			var data = new FormData();
// 			data.append('file', blob, 'audio.wav');
//
// 			$.ajax({
// 				url: '/api/conversation/speechToText/speechToText',
// 				type: 'POST',
// 				data: data,
// 				contentType: false,
// 				processData: false,
// 				success: function(data) {
// 					watsonListenEnd();
// 					// TODO on success pass them to the next step
// 					console.log(arguments);
// 				}
// 			});
// 		}, 'blob');
// 		Fr.voice.stop();
// 	} else {
// 		isRecording = true;
// 		watsonConnect();
// 		watsonLoading();
// 		watsonLoadingEnd();
//
// 		setTimeout(function() {
// 			watsonListen();
// 			recordAudio();
// 		}, 250);
// 	}
// });


// $("#watson").click(function() {
// 	watsonConnect();
// 	watsonLoading();
//
// 	// On audio prompt retrieval, play audio
// 	setTimeout(function() {
// 		watsonLoadingEnd();
// 		watsonSpeak();
//
// 		// After speaking, start listening
// 		setTimeout(function() {
// 			watsonSpeakEnd();
// 			watsonListen();
//
// 			// After listening to response, hide Watson user interface
// 			setTimeout(function() {
// watsonListenEnd();
// watsonHide();
// 			}, 4000);
// 		}, 4000);
// 	}, 4000);
// });
