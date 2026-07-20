import { useState, useRef } from 'react'
import { startSpeechRecognition } from './utils/startSpeechRecognition';
import {fetchRandomAyah } from './utils/fetchRandomAyah';
import FirstPage from './components/FirstPage';
import SecondPage from './components/SecondPage';
import './App.css'

function App() {
  
  // const hizbOptions = Array.from({length: 60}, (_, i) => i + 1);
  const recognitionRef = useRef(null);

  // const [count, setCount] = useState(0)
  const [fromHizb, setFromHizb] = useState('');
  const [toHizb, setToHizb] = useState('');
  const [questionsCount, setQuestionsCount] = useState(1);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [finishRecording, setFinishRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [tafsirBox, setTafsirBox] = useState(false);
  const [tafsirText, setTafsirText] = useState("");

  // To rendomize the questions/Ayaht
  const [currentAyah, setCurrentAyah] = useState(null);
  const [Loding, setLoding] = useState(false);

  // user voice recording state
  const [userTranscript, setUserTranscript] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isRecording, setIsRecording] = useState(false);


	const handleStartSpeechRecognition = () => {
		startSpeechRecognition({
			setHasRecorded,
			recognitionRef,
			setUserTranscript,
			setIsCorrect,
			setIsRecording,
			setFinishRecording,
			currentAyah
		});
	};

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };


	const handleFetchRandomAyah = async () => {
		fetchRandomAyah({
			setRetryCounter,
			setUserTranscript,
			setIsCorrect,
			setLoding,
			setHasRecorded,
			setShowAnswerBox,
			fromHizb,
			toHizb,
			setCurrentAyah
		});
	};


  const incrementRetryCounter = () => {
    setRetryCounter(retryCounter + 1);
    console.log('increment retry function called');
  };


  const fetchTafsir = async () => {
    if (!currentAyah) return;
	
    setLoadingTafsir(true);
    setTafsirBox(true);
    try{
      const response = await fetch(`http://api.quran-tafseer.com/tafseer/1/${currentAyah.surahNumber}/${currentAyah.numberInSurah}/`)
      const data = await response.json();
      setTafsirText(data.text);
    } catch (error) {
      console.error('Error fetching tafsir:', error);
    }
    setLoadingTafsir(false);
  };


  return (
    <div>
    { !isExamStarted? (
      <FirstPage
        fromHizb={fromHizb}
        setFromHizb={setFromHizb}
        toHizb={toHizb}
        setToHizb={setToHizb}
        questionsCount={questionsCount}
        setQuestionsCount={setQuestionsCount}
        isExamStarted={isExamStarted}
        setIsExamStarted={setIsExamStarted}
        fetchRandomAyah={handleFetchRandomAyah}
      />
    )
    :
    (
      <SecondPage
				currentAyah={currentAyah}
				Loding={Loding}
				isRecording={isRecording}
				incrementRetryCounter={incrementRetryCounter}
				startSpeechRecognition={handleStartSpeechRecognition}
				stopSpeechRecognition={stopSpeechRecognition}
				isCorrect={isCorrect}
				hasRecorded={hasRecorded} 
				showAnswerBox={showAnswerBox}
				setShowAnswerBox={setShowAnswerBox}
				tafsirBox={tafsirBox}
				setTafsirBox={setTafsirBox}
				fetchTafsir={fetchTafsir}
				isExamStarted={isExamStarted}
				setIsExamStarted={setIsExamStarted}
				fetchRandomAyah={handleFetchRandomAyah}
				loadingTafsir={loadingTafsir}
				userTranscript={userTranscript}
				tafsirText={tafsirText}
				retryCounter={retryCounter}
      />
    )}
  </div>
  )
}

export default App
