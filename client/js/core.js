$(function() {
	var watsonInterval, isRecording;

	watsonShow();

	$("#watson").click(function() {
		if (isRecording) {
			isRecording = false;
			Fr.voice.export(function(blob) {
				var data = new FormData();
				data.append('file', blob, 'audio.wav');

				$.ajax({
					url: '/api/conversation/speechToText/speechToText',
					type: 'POST',
					data: data,
					contentType: false,
					processData: false,
					success: function(data) {
						watsonListenEnd();
						console.log(arguments);
					}
				});
			}, 'blob');
			Fr.voice.stop();
		} else {
			isRecording = true;
			watsonConnect();
			watsonLoading();
			watsonLoadingEnd();

			setTimeout(function() {
				watsonListen();
				recordAudio();
			}, 250);
		}
	});

	// Random integer generator
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function recordAudio () {
		Fr.voice.record(false);
	}

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

	function watsonShow() {
		$("#watson").delay(50).fadeIn().animate({
			bottom: 10
		}, 200, function() {
			$(this).effect("bounce", { times: 4 }, 400);
		});
	}

	function watsonConnect() {
		$("#watson .prompt").fadeOut(200);
		$("#watson .speech").fadeIn(300);
	}

	function watsonLoading() {
		watsonInterval = setInterval(watsonLoadingAnim, 1000);
	}

	function watsonLoadingAnim() {
		$("#watson .wave").fadeTo(500, 0.5).fadeTo(500, 1);
	}

	function watsonLoadingEnd() {
		window.clearInterval(watsonInterval);
		$("#watson .wave").fadeTo(500, 1);
	}

	function watsonSpeak() {
		watsonInterval = setInterval(watsonSpeakAnim, 75);
	}

	function watsonSpeakAnim() {
		$("#watson .wave .l").animate({
			height: getRandomInt(10, 30)
		}, 75);

		$("#watson .wave .r").animate({
			height: getRandomInt(10, 30)
		}, 75);
	}

	function watsonSpeakEnd() {
		window.clearInterval(watsonInterval);

		$("#watson .wave .l").animate({
			height: 10
		}, 75);

		$("#watson .wave .r").animate({
			height: 10
		}, 75);
	}

	function watsonListen() {
		watsonInterval = setInterval(function() {
			watsonListenAnim();
		}, 800);
	}

	function watsonListenAnim() {
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
	}

	function watsonListenEnd() {
		window.clearInterval(watsonInterval);

		$("#watson .wave .l").animate({
			top: 0
		}, 200);

		$("#watson .wave .r").animate({
			top: 0
		}, 200);
	}

	function watsonHide() {
		$("#watson").animate({
			bottom: -100
		}, 200, function() {
			$(this).hide();

			$("#watson .prompt").show();
			$("#watson .speech").hide();
		});
	}

});
