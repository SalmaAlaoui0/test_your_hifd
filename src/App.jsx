import { useState, useRef } from 'react'
import './App.css'

function App() {
  
  const hizbOptions = Array.from({length: 60}, (_, i) => i + 1);
  const recognitionRef = useRef(null);

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
  const [isRecording, setIsRecording] = useState(false);


  // let recognition = null;

  // if (SpeechRecognition) {
  //   recognition = new SpeechRecognition();
  //   recognition.continuous = true;
  //   recognition.lang = 'ar-SA';
  //   recognition.interimResults = false;
  // }

  const cleanArabicText = (text) => {
    if (!text) return "";
    return text
      .replace(/[\u064B-\u065F]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ۖ /g, "")
      .replace(/ۗ /g, "")
      .replace(/ۚ /g, "")
      .trim();
  };

  const startSpeechRecognition = () => {

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
    }
    // on result
    recognition.onresult = (event) => {
      const transcriptResultIndex = event.resultIndex;
      const transcriptResult = event.results[transcriptResultIndex][0].transcript.trim();
      
      const cleanUserTranscript = cleanArabicText(transcriptResult);
      const cleanOriginalTranscript = cleanArabicText(currentAyah.text);

      console.log("Cleaned User Transcript:", cleanUserTranscript);
      console.log("Cleaned Original Transcript:", cleanOriginalTranscript);

      const oText = cleanOriginalTranscript.replace(/\s+/g, '');
      const uText = cleanUserTranscript.replace(/\s+/g, '');
      if (oText.includes(uText) || uText.includes(oText)) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    };
    // on error
    recognition.onerror = (event) => {
      console.error("recognition Error: ", event.error);
      setIsRecording(false);
    }
    // on end
    recognition.onend = () => {
      console.log("Speech Recognition ended.");
      setIsRecording(false);
    }

    recognitionRef.current = recognition;
    recognition.start();
    
    console.log("Speech Recognition window API is supported in this browser.");
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

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
      console.log('selected Ayah text is: ', selected.text);
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

      {/* 3. زر بالتسجيل */}
        <div 
          onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
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
      {userTranscript && (
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#a1a1aa' }}>ما نطقتِه:</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f3f4f6' }}>"{userTranscript}"</p>
          
          {/* إظهار النتيجة للمستخدم بصرياً */}
          {isCorrect === true && (
            <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '10px' }}>
              ✅ أحسنتِ! قراءتكِ صحيحة ومطابقة.
            </p>
          )}
          {isCorrect === false && (
            <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '10px' }}>
              ❌ هناك اختلاف، حاولي المقارنة مع الآية الأصلية.
            </p>
          )}
        </div>
      )}
    </div>)}
  </div>
  )
}

export default App
