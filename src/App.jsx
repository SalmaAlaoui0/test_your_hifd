import { useState, useRef } from 'react'
import { startSpeechRecognition } from './utils/startSpeechRecognition';
import { fetchRandomAyah } from './utils/fetchRandomAyah';
import FirstPage from './components/FirstPage';
import SecondPage from './components/SecondPage';
import ResultPage from './components/ResultPage';
import { IslamicStar } from './utils/Icons.jsx';
import { GeoCorner } from './utils/Icons.jsx';
import { ExitButton } from './utils/Button.jsx';
import { XIcon } from './utils/Icons.jsx';
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
		// console.log('increment retry function called');
	};


	const fetchTafsir = async () => {
		if (!currentAyah) return;

		setLoadingTafsir(true);
		setTafsirBox(true);
		try {
			const response = await fetch(`https://api.quran-tafseer.com/tafseer/1/${currentAyah.surahNumber}/${currentAyah.numberInSurah}/`)
			const data = await response.json();
			setTafsirText(data.text);
		} catch (error) {
			console.error('Error fetching tafsir:', error);
		}
		setLoadingTafsir(false);
	};

	const resetExamState = () => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
		}
		setCurrentQuestionIndex(0);
		setScore(0);
		setExamFinished(false);
		setIsExamStarted(false);
		setShowAnswerBox(false);
		setTafsirBox(false);
		setLoadingTafsir(false);
		setTafsirText('');
		setShowRecordingButton(true);
		setCurrentAyah(null);
		setUserTranscript('');
		setIsCorrect(null);
		setIsRecording(false);
		setHasRecorded(false);
		setFinishRecording(false);
		setRetryCounter(0);
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
			{isExamStarted && !ExamFinished && (
				<div style={{
					position: 'absolute',
					top: 0, left: 0, right: 0,
					height: 3,
					direction: 'rtl',
					background: 'rgba(200,150,62,0.15)',
				}}>
					<div style={{
						width: `${(currentQuestionIndex * 100) / (questionsCount)}%`,
						height: '100%',
						background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
						borderRadius: '0 2px 2px 0',
						transition: 'width 0.5s ease',
					}} />
				</div>
			)}

			{isExamStarted && !ExamFinished && (
				<div
					style={{
						position: 'absolute',
						top: 10,
						left: 16,
						right: 16,
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						zIndex: 20,
						pointerEvents: 'none',
					}}>
					<p style={{
						position: 'absolute',
						left: '50%',
						transform: 'translateX(-50%)',
						color: 'var(--cream)',
						padding: '5px 10px',
						borderRadius: '5px',
						margin: 0,
					}}>
						{currentQuestionIndex}/{questionsCount}
					</p>
					<div style={{ pointerEvents: 'auto' }}>
						<ExitButton
							label="مغادرة الاختبار"
							icon={<XIcon />}
							hoverColor="#F87171"
							hoverBg="rgba(155, 35, 53, 0.12)"
							borderColor="rgba(120,20,30,0.4)"
							activeBorderColor="#9B2335"
							onClick={resetExamState}
						/>
					</div>
				</div>
			)}

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


			{/* Gold top line */}

			<div
				style={{
					...(!isExamStarted
						? {
							display: 'flex',
							alignItems: 'center',
							width: '100%',
							maxWidth: 450,
						}
						: {}
					),
				}}
			>
				{!isExamStarted ? (
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
						<div style={{
							position: 'absolute',
							top: 0, left: '15%', right: '15%',
							height: 2,
							background: 'linear-gradient(90deg, transparent, #C8963E, transparent)',
							borderRadius: 1,
						}} />
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
					</div>
				)
					: ExamFinished ? (
						<ResultPage
							score={score}
							total={questionsCount}
							onNewTest={resetExamState}
							onBack={resetExamState}
							current={currentQuestionIndex}
						/>
					)
						:
						(
							<SecondPage
								currentAyah={currentAyah}
								Loding={Loding}
								isRecording={isRecording}
								setIsRecording={setIsRecording}
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
	)
}

export default App
