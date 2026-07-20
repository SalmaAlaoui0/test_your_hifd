import { react } from 'react';

export default function FirstPage({
	hizbOptions = Array.from({length: 60}, (_, i) => i + 1),
	fromHizb,
	setFromHizb,
	toHizb,
	setToHizb,
	questionsCount,
	setQuestionsCount,
	isExamStarted,
	setIsExamStarted,
	fetchRandomAyah
}) {
	return (
	<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
		<h2>مرحباً بكِ في تطبيق مراجعة القرآن</h2>
		<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row-reverse', gap: '170px', marginTop: '15px' }}>
			<div style= {{ }}>
			<h5 style={{marginBottom: '10px', textAlign: 'right'}}>: من</h5>
			<select value={fromHizb} onChange={(e) => setFromHizb(e.target.value)} style={{ width: '150px', height: '33px', textAlign: 'center', borderRadius: '7px', border: '2px solid #ccc', backgroundColor: '#374151', fontSize: '17px', color: '#fff' }}>
				<option value="">اختر الحزب</option>
				{hizbOptions.map((hizb) => (
				<option key={hizb} value={hizb}>الحزب {hizb}</option>
				))}
			</select>
			</div>
			<div>
			<h5 style={{marginBottom: '10px', textAlign: 'right'}}>: إلى</h5>
			<select value={toHizb} onChange={(e) => setToHizb(e.target.value)} style={{ width: '150px', height: '33px', textAlign: 'center', borderRadius: '7px', border: '2px solid #ccc', backgroundColor: '#374151', fontSize: '17px', color: '#fff' }}>
				<option value="">اختر الحزب</option>
				{hizbOptions.map((hizb) => (
				<option key={hizb} value={hizb}>الحزب {hizb}</option>
				))}
			</select>
			</div>
		</div>
		<div style={{ marginTop: '80px' }}>
			<h5>: عدد الأسئلة</h5>
			<input type="number" min="1" max="100" style={{ width: '150px', height: '33px', textAlign: 'center', borderRadius: '7px', border: '2px solid #ccc', backgroundColor: '#374151', fontSize: '18px', color: '#fff' }} />
		</div>
		<button 
			style={{ margin: '0 auto', borderRadius: '7px', border: '2px solid #ccc', marginTop: '160px', height: '50px', width: '160px', textAlign: 'center', fontSize: '20px' }}
			onClick={() => {
			if (fromHizb && toHizb) {
				setIsExamStarted(true);
				fetchRandomAyah();
				console.log(`بدأ الاختبار من حزب ${fromHizb} إلى حزب ${toHizb}`);
			}
			else {
				alert("من فضلك اختر الحزب أولاً");
			}
			}}
		>
			🔥 ابدأ الإختبار
		</button>
	</div>
    );
}