import { react } from 'react';

export default function SecondPage({
    currentAyah,
	Loding,
	isRecording,
	incrementRetryCounter,
	startSpeechRecognition,
	stopSpeechRecognition,
	isCorrect,
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
	retryCounter
}) {
    return (
	<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
		<div style={{ display: 'flex', flexDirection: 'row', gap: '30px', marginBottom: '120px' }}>
			<div style={{border: '2px solid #ccc', borderRadius: '7px', padding: '15px', width: '300px', textAlign: 'center'}}>
				{Loding ? (
					<p>جاري جلب الآية...</p>
				): currentAyah ? (
					<>
					<span>
						{currentAyah.surahName} - آية {currentAyah.numberInSurah}
					</span>
					<p style={{fontSize: '20px', direction: 'rtl'}}>
						"{currentAyah.text.split(' ').slice(0, 4).join(' ')} ..."
					</p>
					</>
				) : (
					<p>اضغط على لا أعلم لتوليد آية</p>
				)}
			</div>

			{/* 3. زر بالتسجيل */}
			<div 
			onClick={() => {incrementRetryCounter(); isRecording ? stopSpeechRecognition() : startSpeechRecognition();}}
			style={{ 
				padding: '15px 25px',
				borderRadius: '20px',
				border: '1px solid #4b5563',
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '10px',
				
				backgroundColor: isRecording ? '#ef4444' : '#374151', 
				color: '#ffffff',
				transition: 'all 0.3s ease'
			}}
			>
			{/* white dot */}
			<span style={{ 
				display: 'inline-block', 
				width: '10px', 
				height: '10px', 
				borderRadius: '50%', 
				backgroundColor: 'white',
				opacity: isRecording ? 1 : 0.5
			}}></span>

			{/* 4. تغيير النص ديناميكياً بناءً على الحالة */}
			<span style={{ fontWeight: 'bold', fontSize: '14px' }}>
				{isRecording ? "إيقاف التسجيل ورؤية النتيجة" : "ابدأ التسجيل الصوتي"}
			</span>
			</div>
		</div>

		{/* 4. الأزرار الأربعة للتفاعل */}
		{!isRecording && isCorrect === null && !hasRecorded && !showAnswerBox && !tafsirBox && (
		<div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
			<button
			style={{height: '36px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}
			onClick = {() => {
				setShowAnswerBox(true);
			}}
			>
			<span>لا أعلم</span>
			<span>🔄</span>
			</button>
			
			<button
			style={{height: '36px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}
			onClick={fetchTafsir}
			>
			<span>مساعدة</span>
			<span>❓</span>
			</button>

			<button style={{height: '36px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}>
			<span>إظهار الجواب </span>
			<span>✅</span>
			</button>

			<button
			style={{height: '36px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}
			onClick={() => {
				setIsExamStarted(false);
				}}
			>
			<span>Exit </span>
			<span>❌</span>
			</button>
		</div>
		)}

		{!isRecording && tafsirBox && currentAyah && (
		<div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
			
			{/* صندوق التفسير */}
			<div style={{ 
				backgroundColor: '#1e293b', 
				border: '1px solid #3b82f6', 
				padding: '20px', 
				borderRadius: '12px', 
				marginBottom: '15px' 
			}}>
				<p style={{ color: '#3b82f6', fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>
					تفسير الآية (الميسر):
				</p>
				
				{loadingTafsir ? (
					<p style={{ color: '#a1a1aa' }}>جاري تحميل التفسير...</p>
				) : (
					<p style={{ fontSize: '16px', direction: 'rtl', lineHeight: '1.6', color: '#e2e8f0' }}>
					{tafsirText}
					</p>
				)}
			</div>
			{/* زر الرجوع للواجهة السابقة لمواصلة التسميع */}
			<button 
			onClick={() => setTafsirBox(false)} // إغلاق صندوق التفسير وإعادة الأزرار الثلاثة
			style={{ 
				height: '36px', 
				borderRadius: '7px', 
				fontSize: '16px', 
				cursor: 'pointer', 
				padding: '0 20px', 
				backgroundColor: '#4b5563', 
				color: '#fff', 
				border: 'none' 
			}}
			>
			⬅️ رجوع
			</button>
		</div>
		)}

		{/* shows the correct answer */}
		{!isRecording && showAnswerBox && currentAyah && (
		<div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
			{/* صندوق يعرض الجواب الكامل للآية */}
			<div style={{ 
				backgroundColor: '#1e293b', 
				border: '1px solid #10b981', 
				padding: '20px', 
				borderRadius: '12px', 
				marginBottom: '15px' 
			}}>
				<p style={{ color: '#10b981', fontSize: '14px', marginBottom: '8px' }}>الجواب الكامل للآية:</p>
				<p style={{ fontSize: '18px', direction: 'rtl', lineHeight: '1.6' }}>
					" {currentAyah.text} "
				</p>
			</div>
			{/* زر الانتقال للسؤال التالي */}
			<button 
			onClick={fetchRandomAyah} 
			style={{ 
				height: '40px', 
				borderRadius: '7px', 
				fontSize: '16px', 
				cursor: 'pointer', 
				padding: '0 20px', 
				backgroundColor: '#10b981', 
				color: '#fff', 
				border: 'none', 
				fontWeight: 'bold' 
			}}
			>
			السؤال التالي ➡️
			</button>
		</div>
		)}

		{!isRecording && (
		<div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
			{/* 1. حالة: لم يسجل شيئاً (الضغط على الإيقاف دون التحدث) */}
			{userTranscript === "" && isCorrect === null && hasRecorded && !showAnswerBox && (
			<div>
				<p style={{ color: '#a1a1aa', marginBottom: '10px' }}>.لم يتم التقاط أي صوت، حاولي مرة أخرى</p>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '17px', alignItems: 'center' }}>
				<button 
					onClick={() => {startSpeechRecognition(); incrementRetryCounter();}} // تشغيل التسجيل مجدداً فوراً وزيادة العداد
					style={{ height: '40px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer', padding: '0 15px', backgroundColor: '#3b82f6', color: '#fff', border: 'none' }}
				>
					🔄 إعادة المحاولة
				</button>
				{retryCounter >= 4 && (
					<button
					onClick={fetchRandomAyah}
					style={{ height: '40px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer', padding: '0 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold' }}
					> 
					السؤال التالي ➡️
					</button>
				)}
			</div>
		</div>
		)}

		{/* 2. حالة: جواب صحيح */}
		{userTranscript !== "" && isCorrect === true && (
		<div>
			<p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
			✅ جواب صحيح! أحسنتِ
			</p>
			<button 
			onClick={fetchRandomAyah} // جلب آية عشوائية جديدة
			style={{ height: '40px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer', padding: '0 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold' }}
			>
			السؤال التالي ➡️
			</button>
		</div>
		)}

		{/* 3. حالة: جواب خاطئ */}
		{userTranscript !== "" && isCorrect === false && (
		<div>
			<p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
			❌ جواب خاطئ، حاولي مراجعة الآية
			</p>
			<button 
			onClick={fetchRandomAyah} // جلب آية عشوائية جديدة للمحاولة في سؤال آخر
			style={{ height: '40px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer', padding: '0 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', fontWeight: 'bold' }}
			>
			السؤال التالي ➡️
			</button>
		</div>
		)}

	</div>
	)}
</div>
)}