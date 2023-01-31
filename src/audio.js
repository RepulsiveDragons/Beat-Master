
const NUM_SAMPLES = 128;
let audioElement, sourceNode, analyserNode, gainNode, data, audioCtx;

function setupWebaudio(filePath){
	// 1 - get reference to <audio> element on page
	audioElement = new Audio();

	loadSoundFile(filePath);
			
	// 2 - create a new `AudioContext` object
	// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
	audioCtx = new (window.AudioContext || window.webkitAudioContext); // to support Safari and mobile
	
	// 3 - create a node that points at the <audio> element
	// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource
	sourceNode = audioCtx.createMediaElementSource(audioElement); 
	
	// 4 - create a *analyser node*
	// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
	// this gets us real-time frequency and time-domain (i.e. waveform) information
	analyserNode = audioCtx.createAnalyser();
	
	// 5 - How many samples do we want? fft stands for Fast Fourier Transform
	analyserNode.fftSize = NUM_SAMPLES;
	gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;

	// 6 - hook up the <audio> element to the analyserNode
	sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
	
	// 8 - create a new array of 8-bit integers (0-255)
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
	data = new Uint8Array(analyserNode.frequencyBinCount); // OR analyserNode.fftSize/2

	//analyserNode.getByteFrequencyData(data);
}

	function loadSoundFile(filePath){
		audioElement.src = filePath;
	}
	
	function playCurrentSound(){
		audioElement.play();
	}
	
	function pauseCurrentSound(){
		audioElement.pause();
	}
	
	function setVolume(value){
		value = Number(value);
		gainNode.gain.value = value;
	}

export {data, analyserNode, audioCtx,loadSoundFile,playCurrentSound,pauseCurrentSound,setVolume,setupWebaudio};