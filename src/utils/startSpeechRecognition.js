import { cleanArabicText } from "./quranUtils";

// export const startSpeechRecognition = ({
//   setHasRecorded,
//   recognitionRef,
//   setUserTranscript,
//   setIsCorrect,
//   setIsRecording,
//   setFinishRecording,
//   currentAyah,
//   setShowRecordingButton,
// }) => {
//   setHasRecorded(true);

//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;
//   if (!SpeechRecognition) {
//     console.error(
//       "Speech Recognition window API is not supported in this browser.",
//     );
//     alert("معذراً، ميزة التعرف على الصوت غير مدعومة في هذا المتصفح.");
//     return;
//   }

//   const recognition = new SpeechRecognition();
//   recognition.continuous = true;
//   recognition.lang = "ar-SA";
//   recognition.interimResults = false;

//   // on start
//   recognition.onstart = () => {
//     // console.log("Speech Recognition started.");
//     setUserTranscript("");
//     setIsCorrect(null);
//     setIsRecording(true);
//   };

//   // on result
//   recognition.onresult = (event) => {
//   	const transcriptResultIndex = event.resultIndex;
//   	const transcriptResult = event.results[transcriptResultIndex][0].transcript.trim();
//   	setUserTranscript(transcriptResult);

//   	const cleanUserTranscript = cleanArabicText(transcriptResult);
//   	const cleanOriginalTranscript = cleanArabicText(currentAyah.cleanText);

//   	console.log("User Cleaned: ", cleanUserTranscript);
//   	console.log("Original Cleaned: ", cleanOriginalTranscript);
//   	console.log("Original Original🔥: ", currentAyah.text);

//   	const originalWords = cleanOriginalTranscript.split(' ').filter(word => word.trim() !== '');
//   	const userWords = cleanUserTranscript.split(' ').filter(word => word.trim() !== '');
//   	//length check
//   	if (userWords.length === 0 || originalWords.length === 0) {
//   		setIsCorrect(null);
//   		return;
//   	}
//   	// calculate words match count
//   	let correctWordsCount = 0;
//   	userWords.forEach(word => {
//   		if (originalWords.includes(word)) {
//   			correctWordsCount++;
//   		}
//   	});
//   	// calculate match percentage to determine if the user passed or failed
//   	const matchPercentage = (correctWordsCount / originalWords.length) * 100;
//   	// console.log(`Match Percentage: ${matchPercentage.toFixed(2)}%`);
//   	const threshold = originalWords.length <= 30 ? 80 : 70; // 80% for short ayahs, 70% for longer ones
//   	if (matchPercentage >= threshold) {
//   		setIsCorrect(true);
//   		setShowRecordingButton(false),
//   		console.log('You Passed! 🔥');
//   	} else {
//   		setIsCorrect(false);
//   		setShowRecordingButton(false),
//   		console.log('You Failed! 😢');
//   	}
//   };

//   // on error
//   recognition.onerror = (event) => {
//     console.error("recognition Error: ", event.error);
//     setIsRecording(false);
//   };

//   // on end
//   recognition.onend = () => {
//     // console.log("Speech Recognition ended.");
//     setIsRecording(false);
//     setFinishRecording(true);
//   };

//   recognitionRef.current = recognition;
//   recognition.start();
//   // console.log("Speech Recognition window API is supported in this browser.");
// };


export const startSpeechRecognition = ({
  setHasRecorded,
  recognitionRef,
  setUserTranscript,
  setIsCorrect,
  setIsRecording,
  setFinishRecording,
  currentAyah,
  setShowRecordingButton,
}) => {
  setHasRecorded(true);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("Speech Recognition window API is not supported in this browser.");
    alert("معذراً، ميزة التعرف على الصوت غير مدعومة في هذا المتصفح.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "ar-SA";
  recognition.interimResults = false;

  // Track latest full transcript to process at the end
  let accumulatedTranscript = "";

  recognition.onstart = () => {
    setUserTranscript("");
    setIsCorrect(null);
    setIsRecording(true);
    setShowRecordingButton(true); // Ensure button stays visible throughout recording
  };

  recognition.onresult = (event) => {
    let fullResult = "";
    
    // Concatenate all results chunks across long pauses
    for (let i = event.resultIndex; i < event.results.length; i++) {
      fullResult += event.results[i][0].transcript + " ";
    }

    accumulatedTranscript = fullResult.trim();
    setUserTranscript(accumulatedTranscript);

    // Perform live match check without hiding the recording button
    const cleanUserTranscript = cleanArabicText(accumulatedTranscript);
    const cleanOriginalTranscript = cleanArabicText(currentAyah.cleanText);

    const originalWords = cleanOriginalTranscript.split(' ').filter(w => w.trim() !== '');
    const userWords = cleanUserTranscript.split(' ').filter(w => w.trim() !== '');

    if (userWords.length === 0 || originalWords.length === 0) {
      setIsCorrect(null);
      return;
    }

    let correctWordsCount = 0;
    userWords.forEach((word) => {
      if (originalWords.includes(word)) {
        correctWordsCount++;
      }
    });

    const matchPercentage = (correctWordsCount / originalWords.length) * 100;
    const threshold = originalWords.length <= 30 ? 80 : 70;

    if (matchPercentage >= threshold) {
      setIsCorrect(true);
      // Automatically stop recognition if they passed early
      recognition.stop();
    } else {
      setIsCorrect(false);
      // ⚠️ Removed setShowRecordingButton(false) from here so UI doesn't disappear mid-recitation
    }
  };

  recognition.onerror = (event) => {
    console.error("recognition Error: ", event.error);
    setIsRecording(false);
  };

  recognition.onend = () => {
    setIsRecording(false);
    setFinishRecording(true);
    setShowRecordingButton(false); // 🌟 Hide recording controls ONLY when recording actually finishes
  };

  recognitionRef.current = recognition;
  recognition.start();
};