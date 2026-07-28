import { useState, useRef } from 'react'
import { startSpeechRecognition } from './utils/startSpeechRecognition';
import {fetchRandomAyah } from './utils/fetchRandomAyah';
import FirstPage from './components/FirstPage';
import SecondPage from './components/SecondPage';
import { IslamicStar } from './utils/Icons.jsx';
import { GeoCorner } from './utils/Icons.jsx';
import './App.css'

function App() {
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
	const [option, setOption] = useState('');
	const [showRecordingButton, setShowRecordingButton] = useState(true);

	// the question count and result states
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [ExamFinished, setExamFinished] = useState(false);

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
			currentAyah,
			setShowRecordingButton,
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
			setCurrentQuestionIndex,
			currentQuestionIndex,
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
		<div
			className="geo-pattern fade-in"
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '24px',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Background stars */}
			<div style={{ position: 'absolute', top: 40, right: 60 }}>
				<IslamicStar size={80} opacity={0.08} />
			</div>
			<div style={{ position: 'absolute', bottom: 60, left: 40 }}>
				<IslamicStar size={100} opacity={0.06} />
			</div>
			<div style={{ position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)' }}>
				<IslamicStar size={50} opacity={0.05} />
			</div>

			<div style={{
						width: '100%',
						maxWidth: 520,
						background: 'var(--card-bg)',
						border: '1px solid var(--card-border)',
						borderRadius: 20,
						padding: '48px 40px',
						boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,150,62,0.15)',
						position: 'relative',
						alignSelf: 'center',
						margin: '0 auto',
						backdropFilter: 'blur(12px)',
					}}>

				<div style={{ position: 'absolute', top: -1, right: -1 }}>
					<GeoCorner />
				</div>
				<div style={{ position: 'absolute', top: -1, left: -1 }}>
					<GeoCorner flip />
				</div>

				{/* Gold top line */}
				<div style={{
					position: 'absolute',
					top: 0, left: '15%', right: '15%',
					height: 2,
					background: 'linear-gradient(90deg, transparent, #C8963E, transparent)',
					borderRadius: 1,
				}} />
				<div>
				{ !isExamStarted? (
					<FirstPage
						fromHizb={fromHizb}
						setFromHizb={setFromHizb}
						toHizb={toHizb}
						setToHizb={setToHizb}
						count={questionsCount}
						setCount={setQuestionsCount}
						isExamStarted={isExamStarted}
						setIsExamStarted={setIsExamStarted}
						fetchRandomAyah={handleFetchRandomAyah}
					/>
				)
				: ExamFinished ? (
					<div style={{ textAlign: 'center', padding: '40px', direction: 'rtl' }}>
					<h2 style={{ fontSize: '28px', color: '#10b981', marginBottom: '15px' }}>
						🎉 ألمعيّ! تم إنهاء الاختبار بنجاح
					</h2>
					<p style={{ fontSize: '20px', marginBottom: '20px' }}>
						نتيجتك هي: <strong style={{ color: '#3b82f6' }}>{score}</strong> من <strong style={{ color: '#3b82f6' }}>{questionsCount}</strong>
					</p>

					{/* نسبة النجاح المئوية */}
					<p style={{ fontSize: '18px', color: '#a1a1aa', marginBottom: '30px' }}>
						النسبة المئوية: {((score / Number(questionsCount)) * 100).toFixed(0)}%
					</p>

					<button 
						onClick={() => {
							setExamFinished(false);
							setIsExamStarted(false);
							setCurrentQuestionIndex(0);
							setScore(0);
						}}
						style={{ padding: '12px 30px', fontSize: '18px', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#6b21a8', color: '#fff', border: 'none' }}
					>
						اختبار جديد 🔄
					</button>
				</div>
				)
				:
				(
					<SecondPage
						currentAyah={currentAyah}
						Loding={Loding}
						option={option}
						setOption={setOption}
						isRecording={isRecording}
						incrementRetryCounter={incrementRetryCounter}
						startSpeechRecognition={handleStartSpeechRecognition}
						stopSpeechRecognition={stopSpeechRecognition}
						isCorrect={isCorrect}
						setIsCorrect={setIsCorrect}
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
						score={score}
						setScore={setScore}
						currentQuestionIndex={currentQuestionIndex}
						setCurrentQuestionIndex={setCurrentQuestionIndex}
						questionsCount={questionsCount}
						setExamFinished={setExamFinished}
						showRecordingButton={showRecordingButton}
						setShowRecordingButton={setShowRecordingButton}
					/>
				)}
			</div>
		</div>
	</div>
	)
}

export default App
