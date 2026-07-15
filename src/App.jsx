import { useState } from 'react'
import './App.css'

function App() {
  
  const hizbOptions = Array.from({length: 60}, (_, i) => i + 1);
  
  // const [count, setCount] = useState(0)
  const [fromHizb, setFromHizb] = useState('');
  const [toHizb, setToHizb] = useState('');
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [questionsCount, setQuestionsCount] = useState(1);

  // start the process of rendomizing the questions/Ayaht
  const [currentAyah, setCurrentAyah] = useState(null);
  const [Loding, setLoding] = useState(false);

  // user voice recording state
  const [userTranscript, setUserTranscript] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const fetchRandomAyah = async () => {
    setLoding(true);
    try {
      const minHizb = parseInt(fromHizb);
      const maxHizb = parseInt(toHizb);
      const randomHizb = Math.floor(Math.random() * (maxHizb - minHizb + 1)) + minHizb;

      console.log('Random Hizb:', randomHizb);
      const juzNumber = Math.ceil(randomHizb / 2);
      
      const response = await fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/ar.warsh`);
      const data = await response.json();
      // console.log('Fetched data:', data);

      const allAyahs = data.data.ayahs;

      const hizbAyahs = allAyahs.filter(ayah => ayah.hizbQuarter >= (randomHizb - 1) * 4 + 1 && ayah.hizbQuarter <= randomHizb * 4);
      // console.log('Fetched Ayahs for Hizb:', hizbAyahs);

      const randomIndex = Math.floor(Math.random() * hizbAyahs.length);
      const selected = hizbAyahs[randomIndex];

      setCurrentAyah({
        text: selected.text,
        numberInSurah: selected.numberInSurah,
        surahName: selected.surah.name,
      });
      // console.log('selected Ayah text is: ', selected.text);
      // console.log('selected Ayah number is: ', selected.numberInSurah);
      // console.log('selected Surah Name is: ', selected.surah.name);

    } catch (error) {
      console.error('error fetching the random Ayah: ', error)
    }
    setLoding(false);
  };

  return (
    <div>
    { !isExamStarted? (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>مرحباً بكِ في تطبيق مراجعة القرآن</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row-reverse', gap: '170px', marginTop: '15px' }}>
        <div style= {{ }}>
          <h5 style={{marginBottom: '10px', textAlign: 'right'}}>: من</h5>
          <select value={fromHizb} onChange={(e) => setFromHizb(e.target.value)} style={{ width: '150px', height: '33px', textAlign: 'center', borderRadius: '7px', border: '2px solid #ccc', backgroundColor: '#866084', fontSize: '16px', color: '#333' }}>
            <option value="">اختر الحزب</option>
            {hizbOptions.map((hizb) => (
              <option key={hizb} value={hizb}>الحزب {hizb}</option>
            ))}
          </select>
        </div>
        <div>
          <h5 style={{marginBottom: '10px', textAlign: 'right'}}>: إلى</h5>
          <select value={toHizb} onChange={(e) => setToHizb(e.target.value)} style={{ width: '150px', height: '33px', textAlign: 'center', borderRadius: '7px', border: '2px solid #ccc', backgroundColor: '#866084', fontSize: '16px', color: '#333' }}>
            <option value="">اختر الحزب</option>
            {hizbOptions.map((hizb) => (
              <option key={hizb} value={hizb}>الحزب {hizb}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginTop: '80px' }}>
        <h5>: عدد الأسئلة</h5>
        <input type="number" min="1" max="100" style={{ width: '150px', height: '33px', textAlign: 'center', borderRadius: '7px', border: '2px solid #ccc', backgroundColor: '#866084', fontSize: '16px', color: '#333' }} />
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

    </div>)
    
    :
    
    (
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
                "{currentAyah.text.split(' ').slice(0, 5).join(' ')} ..."
              </p>
            </>
          ) : (
            <p>اضغط على لا أعلم لتوليد آية</p>
          )}
        </div>

      {/* 3. زر البدء بالتسجيل */}
        <div style={{border: '2px solid #ccc', borderRadius: '17px', padding: '5px', fontSize: '10px', height: '40px', marginTop: '16px', width: '60px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#866084', color: '#fff'}}>
          <span>
            <span></span>
            <span></span>
          </span>
          <span>ابدأ التسجيل الصوتي</span>
        </div>
      </div>

    {/* 4. الأزرار الأربعة للتفاعل */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <button style={{height: '30px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}
      onClick={() => {
        setIsExamStarted(false);
      }}>
          <span>لا أعلم</span>
          <span>🔄</span>
        </button>
        
        <button style={{height: '30px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}>
          <span>مساعدة</span>
          <span>❓</span>
        </button>

        <button style={{height: '30px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}>
          <span>كشف آية واحدة</span>
          <span>👁️</span>
        </button>

        <button style={{height: '30px', borderRadius: '7px', fontSize: '16px', cursor: 'pointer'}}>
          <span>إظهار الجواب</span>
          <span>✅</span>
        </button>
      </div>
    </div>)}
  </div>
  )
}

export default App
