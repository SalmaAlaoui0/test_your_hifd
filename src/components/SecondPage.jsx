import { react } from 'react';
import { GeoCorner } from '../utils/Icons.jsx';
import { MicIcon } from '../utils/Icons.jsx';
import { PlayIcon } from '../utils/Icons.jsx';
import { ActionButton } from '../utils/Button.jsx';
import { HelpCircleIcon } from '../utils/Icons.jsx';
import { EyeIcon } from '../utils/Icons.jsx';
import { useState } from 'react'
import { CounterBtn } from './FirstPage.jsx';
import FeedbackPanel from './FeedbackPanel.jsx';

const StarIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
		<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
	</svg>
)

function MicButton({ isRecording, incrementRetryCounter, stopSpeechRecognition, startSpeechRecognition }) {
	const [hov, setHov] = useState(false)
	return (
		<button
			onClick={() => { incrementRetryCounter(); isRecording ? stopSpeechRecognition() : startSpeechRecognition(); }}
			onMouseEnter={() => setHov(true)}
			onMouseLeave={() => setHov(false)}
			style={{
				width: 100,
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 10,
				background: isRecording
					? 'rgba(155, 35, 53, 0.2)'
					: hov
						? 'rgba(200,150,62,0.12)'
						: 'var(--card-bg)',
				border: `1px solid ${isRecording ? 'rgba(196,56,74,0.6)' : hov ? 'var(--gold)' : 'rgba(180,140,50,0.25)'}`,
				borderRadius: 16,
				cursor: 'pointer',
				color: isRecording ? '#F87171' : hov ? 'var(--gold)' : 'var(--cream-dim)',
				transition: 'all 0.3s ease',
				boxShadow: isRecording
					? '0 0 20px rgba(155,35,53,0.3)'
					: hov
						? '0 0 16px rgba(200,150,62,0.2)'
						: 'none',
				position: 'relative',
				backdropFilter: 'blur(10px)',
				padding: '20px 0',
			}}
		>
			{isRecording && (
				<span style={{
					position: 'absolute',
					inset: -4,
					borderRadius: 20,
					border: '2px solid rgba(196,56,74,0.4)',
					animation: 'pulse-ring 1.5s ease-in-out infinite',
					pointerEvents: 'none',
				}} />
			)}
			<MicIcon active={isRecording} />
			<span style={{
				fontSize: 11,
				fontFamily: 'Noto Naskh Arabic, serif',
				fontWeight: 600,
				textAlign: 'center',
				lineHeight: 1.4,
				letterSpacing: '0.02em',
			}}>
				{isRecording ? 'جارٍ التسجيل' : 'تسجيل صوتي'}
			</span>
		</button>
	)
}


export default function SecondPage({
	currentAyah,
	Loding,
	isRecording,
	setIsRecording,
	incrementRetryCounter,
	startSpeechRecognition,
	stopSpeechRecognition,
	isCorrect,
	setIsCorrect,
	hasRecorded,
	showAnswerBox,
	setShowAnswerBox,
	tafsirBox,
	setTafsirBox,
	fetchTafsir,
	isExamStarted,
	setIsExamStarted,
	fetchRandomAyah,
	loadingTafsir,
	userTranscript,
	tafsirText,
	retryCounter,
	score,
	setScore,
	currentQuestionIndex,
	setCurrentQuestionIndex,
	questionsCount,
	setExamFinished,
	showRecordingButton,
	setShowRecordingButton
}) {
	const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | 'no-audio'
	const shouldRevealFullAyahInCard = !isRecording && userTranscript !== "" && isCorrect !== null;
	const ayahPreviewText = currentAyah
		? shouldRevealFullAyahInCard
			? currentAyah.text
			: `${currentAyah.text.split(' ').slice(0, 4).join(' ')} ...`
		: "";
	return (
		<div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '20px' }}>
			<div style={{ display: 'grid', direction: 'rtl', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 16, alignItems: 'stretch' }}>
				<div
					style={{
						background: 'var(--card-bg)',
						border: shouldRevealFullAyahInCard
							? isCorrect
								? '1px solid rgba(52,211,153,0.45)'
								: '1px solid rgba(248,113,113,0.45)'
							: '1px solid var(--card-border)',
						borderRadius: 16,
						padding: '28px 32px',
						boxShadow: shouldRevealFullAyahInCard
							? isCorrect
								? '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.16) inset'
								: '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(248,113,113,0.14) inset'
							: '0 16px 48px rgba(0,0,0,0.4)',
						position: 'relative',
						backdropFilter: 'blur(10px)',
						transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
					}}
				>
					<div style={{ position: 'absolute', top: -1, right: -1 }}>
						<GeoCorner />
					</div>
					{Loding ? (
						<p style={{ marginLeft: '180px' }}>جاري جلب الآية...</p>
					) : currentAyah ? (
						<>
							<div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,150,62,0.5), transparent)' }} />
							<div style={{
								fontSize: 13,
								color: 'var(--gold)',
								marginBottom: 12,
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								direction: 'rtl',
							}}>
								<span style={{ color: 'var(--gold)', opacity: 0.7 }}><StarIcon /></span>
								<span style={{ fontWeight: 600 }}>{currentAyah.surahName}</span>
								<span style={{ color: 'var(--cream-dim)' }}>—</span>
								<span style={{ color: 'var(--cream-dim)' }}>آية {currentAyah.numberInSurah}</span>
							</div>
							<p style={{
								fontFamily: 'Amiri, serif',
								fontSize: 'clamp(18px, 2.8vw, 24px)',
								lineHeight: 2,
								color: 'var(--cream)',
								opacity: shouldRevealFullAyahInCard ? 0.62 : 1,
								margin: 0,
								direction: 'rtl',
								textAlign: 'right',
								transition: 'all 0.4s ease',
								marginLeft: '180px'
								// filter: showAnswer ? 'none' : 'blur(0)',
							}}>
								"{ayahPreviewText}"
							</p>
						</>
					) : (
						<p style={{ marginLeft: '180px' }}>اضغط على لا أعلم لتوليد آية</p>
					)}
				</div>

				{showRecordingButton && (
					<MicButton
						isRecording={isRecording}
						incrementRetryCounter={incrementRetryCounter}
						stopSpeechRecognition={stopSpeechRecognition}
						startSpeechRecognition={startSpeechRecognition}
					/>
				)}
			</div>

			{/* 4. الأزرار الأربعة للتفاعل */}
			{!isRecording && isCorrect === null && !hasRecorded && !showAnswerBox && !tafsirBox && (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
					<ActionButton
						label="مساعدة"
						icon={<HelpCircleIcon />}
						hoverColor="#60A5FA"
						hoverBg="rgba(29, 78, 122, 0.2)"
						borderColor="rgba(29,78,122,0.4)"
						activeBorderColor="#2B6CB0"
						onClick={() => {
							setShowRecordingButton(false);
							fetchTafsir();
						}}
					/>
					<ActionButton
						label="إظهار الجواب"
						icon={<EyeIcon />}
						hoverColor="#22C55E"
						hoverBg="rgba(26, 92, 58, 0.2)"
						borderColor="rgba(26,92,58,0.4)"
						activeBorderColor="#22834F"
						onClick={() => {
							setShowRecordingButton(false);
							setShowAnswerBox(true);
						}}
					/>
				</div>
			)}

			{!isRecording && tafsirBox && currentAyah && (
				<div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>

					{/* صندوق التفسير */}
					<div
						className="fade-in"
						style={{
							background: 'rgba(18, 52, 82, 0.5)',
							border: '1px solid rgba(43,108,176,0.4)',
							borderRadius: 12,
							padding: '16px 24px',
							fontFamily: 'Amiri, serif',
							lineHeight: 1.8,
							textAlign: 'center',
							direction: 'rtl',
						}}>
						<p style={{ color: '#fff', fontSize: '14px' }}>
							التلميح : تفسير الآية (الميسر)
							{/* تفسير الآية (الميسر): */}
						</p>

						{loadingTafsir ? (
							<p style={{ color: '#a1a1aa' }}>جاري تحميل التفسير...</p>
						) : (
							<p
								style={{
									color: 'rgba(147, 210, 255, 0.9)',
									fontSize: 17,
								}}>
								{tafsirText}
							</p>
						)}
					</div>
					{/* زر الرجوع للواجهة السابقة لمواصلة التسميع */}
					<div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
						<button
							onClick={() => { setShowRecordingButton(true); setTafsirBox(false); }}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 8,
								height: '40px',
								padding: '0 22px',
								borderRadius: '14px',
								fontSize: '15px',
								fontWeight: 700,
								cursor: 'pointer',
								background: 'linear-gradient(135deg, rgba(75,85,99,0.95), rgba(55,65,81,0.95))',
								color: '#fff',
								border: '1px solid rgba(255,255,255,0.08)',
								boxShadow: '0 8px 22px rgba(0,0,0,0.25)',
								transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
							}}
						>
							رجوع
							<span style={{ display: 'inline-flex', opacity: 0.85 }}>
								<PlayIcon />
							</span>
						</button>
					</div>
				</div>
			)}

			{/* shows the correct answer */}
			{!isRecording && showAnswerBox && currentAyah && (
				<div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
					{/* صندوق يعرض الجواب الكامل للآية */}
					<div
						className="fade-in"
						style={{
							// background: '#1e293b',
							background: 'var(--card-bg)',
							border: '1px solid #10b981',
							borderRadius: 12,
							padding: '16px 24px',
							fontFamily: 'Amiri, serif',
							lineHeight: 1.8,
							textAlign: 'center',
						}}>
						<p style={{ color: '#10b981', fontSize: '14px', marginBottom: '15px' }}>: الجواب الكامل للآية</p>
						<p style={{ color: '#fff', fontSize: '18px', direction: 'rtl', lineHeight: '1.6' }}>
							" {currentAyah.text} "
						</p>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							gap: '20px',
							marginTop: '30px'
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row-reverse',
								justifyContent: 'center',
								height: '40px',
								alignItems: 'center',
								gap: '50px',
							}}
						>
							<button
								onClick={() => {
									setShowRecordingButton(true);
									setScore(score + 1);
									// console.log('score is: ', score);
									if (currentQuestionIndex >= Number(questionsCount)) {
										setExamFinished(true);
									} else {
										fetchRandomAyah();
									}
								}}
								style={{
									fontSize: '20px',
									color: '#fff',
									background: 'var(--card-bg)',
									border: '1px solid #10b981',
									borderRadius: 12,
									padding: '16px 24px',
									fontFamily: 'Amiri, serif',
								}}
							>
								صح
							</button>
							<button
								onClick={() => {
									setShowRecordingButton(true);
									if (currentQuestionIndex >= Number(questionsCount)) {
										setExamFinished(true);
									} else {
										fetchRandomAyah();
									}
								}}
								style={{
									fontSize: '20px',
									color: '#fff',
									background: 'var(--card-bg)',
									border: '1px solid #ef4444',
									borderRadius: 12,
									padding: '16px 24px',
									fontFamily: 'Amiri, serif',
								}}
							>
								خطأ
							</button>
						</div>
					</div>
				</div>
			)}

			{!isRecording && (
				<div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					{/* 1. حالة: لم يسجل شيئاً (الضغط على الإيقاف دون التحدث) */}
					
					{userTranscript === "" && isCorrect === null && hasRecorded && !showAnswerBox && (
						// no-audio
						<FeedbackPanel
							feedback={'no-audio'}
							isCorrect={isCorrect}
							setScore={setScore}
							score={score}
							currentQuestionIndex={currentQuestionIndex}
							setExamFinished={setExamFinished}
							fetchRandomAyah={fetchRandomAyah}
							startSpeechRecognition={startSpeechRecognition}
							incrementRetryCounter={incrementRetryCounter}
							retryCounter={retryCounter}
							questionsCount={questionsCount}
							setShowRecordingButton={setShowRecordingButton}
						/>
					)}

					{/* 2. حالة: جواب صحيح */}
					{userTranscript !== "" && isCorrect === true && (
						// console.log('Correct answer detected!'), // Debugging log
						<FeedbackPanel 
							feedback={'correct'}
							isCorrect={isCorrect}
							setScore={setScore}
							score={score}
							currentQuestionIndex={currentQuestionIndex}
							setExamFinished={setExamFinished}
							fetchRandomAyah={fetchRandomAyah}
							startSpeechRecognition={startSpeechRecognition}
							incrementRetryCounter={incrementRetryCounter}
							retryCounter={4}
							questionsCount={questionsCount}
							setShowRecordingButton={setShowRecordingButton}
						/>
					)}

					{/* 3. حالة: جواب خاطئ */}
					{userTranscript !== "" && isCorrect === false && (
						// console.log('isCorrect is false, feedback is: ', feedback),
						<FeedbackPanel
							feedback={'wrong'}
							isCorrect={isCorrect}
							setScore={setScore}
							score={score}
							currentQuestionIndex={currentQuestionIndex}
							setExamFinished={setExamFinished}
							fetchRandomAyah={fetchRandomAyah}
							startSpeechRecognition={startSpeechRecognition}
							incrementRetryCounter={incrementRetryCounter}
							retryCounter={4}
							questionsCount={questionsCount}
							setShowRecordingButton={setShowRecordingButton}
						/>
					)}
				</div>
			)}
		</div>
	)
}