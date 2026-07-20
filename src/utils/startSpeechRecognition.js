import { cleanArabicText } from './quranUtils';

export const startSpeechRecognition = ({
	setHasRecorded,
	recognitionRef,
	setUserTranscript,
	setIsCorrect,
	setIsRecording,
	setFinishRecording,
	currentAyah
}) => {
	setHasRecorded(true);

	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!SpeechRecognition) {
		console.error("Speech Recognition window API is not supported in this browser.");
		alert('معذراً، ميزة التعرف على الصوت غير مدعومة في هذا المتصفح.');
		return;
	}

	const recognition = new SpeechRecognition();
	recognition.continuous = true;
	recognition.lang = 'ar-SA';
	recognition.interimResults = false;

	// on start
	recognition.onstart = () => {
		console.log("Speech Recognition started.");
		setUserTranscript("");
		setIsCorrect(null);
		setIsRecording(true);
	};


	// on result
	recognition.onresult = (event) => {
		const transcriptResultIndex = event.resultIndex;
		const transcriptResult = event.results[transcriptResultIndex][0].transcript.trim();
		setUserTranscript(transcriptResult);

		const cleanUserTranscript = cleanArabicText(transcriptResult);
		const cleanOriginalTranscript = cleanArabicText(currentAyah.text);

		console.log("Cleaned User Transcript:", cleanUserTranscript);
		console.log("Cleaned Original Transcript:", cleanOriginalTranscript);

		const originalWords = cleanOriginalTranscript.split(' ').filter(word => word.trim() !== '');
		const userWords = cleanUserTranscript.split(' ').filter(word => word.trim() !== '');
		//length check
		if (userWords.length === 0) {
			setIsCorrect(null);
			return;
		}
		// calculate words match count
		let correctWordsCount = 0;
		userWords.forEach(word => {
			if (originalWords.includes(word)) {
				correctWordsCount++;
			}
		});
		// calculate match percentage to determine if the user passed or failed
		const matchPercentage = (correctWordsCount / originalWords.length) * 100;
		const threshold = originalWords.length <= 30 ? 30 : 60;
		if (matchPercentage >= threshold) {
			setIsCorrect(true);
			console.log('You Passed! 🔥');
		} else {
			setIsCorrect(false);
			console.log('You Failed! 😢');
		}
    };


    // on error
	recognition.onerror = (event) => {
		console.error("recognition Error: ", event.error);
		setIsRecording(false);
	};


    // on end
	recognition.onend = () => {
		console.log("Speech Recognition ended.");
		setIsRecording(false);
		setFinishRecording(true);
	};

	recognitionRef.current = recognition;
	recognition.start();
	console.log("Speech Recognition window API is supported in this browser.");
};