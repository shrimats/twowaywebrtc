
navigator.getWebcam = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

// var peer = new Peer({ key: '7gi7akjj5e7phkt9',
// 						debug: 3,
// 						config: {'iceServers': [
// 						{ url: 'stun:stun.l.google.com:19302' },
// 						{ url: 'stun:stun1.l.google.com:19302' },
// 						{ url: 'turn:numb.viagenie.ca', username:"shrimats@gmail.com", credential:"revathi"}
// 						]}});

var peer = new Peer({　host:'peerjs-server.herokuapp.com', secure:true, port:443, key: 'peerjs', debug: 3})


// On open, set the peer id
peer.on('open', function(){
	$('#my-id').text(peer.id);
});

peer.on('call', function(call) {
	// Answer automatically for demo
	call.answer(window.localStream);
	step3(call);
});

// Click handlers setup
$(function() {
	$('#make-call').click(function() {
		//Initiate a call!
		var call = peer.call($('#callto-id').val(), window.localStream);
		step3(call);
	});
	$('end-call').click(function() {
		window.existingCall.close();
		step2();
	});

	// Retry if getUserMedia fails
	$('#step1-retry').click(function() {
		$('#step1-error').hide();
		step();
	});

	step1();
});

function step1() {
	navigator.getWebcam({audio: true, video: true}, function(stream){
    var microphone = context.createMediaStreamSource(stream);
       var backgroundMusic = context.createMediaElementSource(document.getElementById("back"));
       var analyser = context.createAnalyser();
       var mixedOutput = context.createMediaStreamDestination();
       microphone.connect(analyser);
       analyser.connect(mixedOutput);
       backgroundMusic.connect(mixedOutput);
       requestAnimationFrame(drawAnimation);

       peerConnection.addStream(mixedOutput.stream);
		$('#my-video').prop('src', URL.createObjectURL(stream));

		window.localStream = stream;
		step2();
	}, function(){ $('#step1-error').show(); });
}

function step2() {
	$('#step1', '#step3').hide();
	$('#step2').show();
}

function step3(call) {
	if (window.existingCall) {
		window.existingCall.close();
	}

	call.on('stream', function(stream) {
		$('#their-video').prop('src', URL.createObjectURL(stream));
	});
	$('#step1', '#step2').hide();
	$('#step3').show();
}
