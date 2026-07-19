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
  const [finishRecording, setFinishRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [tafsirBox, setTafsirBox] = useState(false);
  const [tafsirText, setTafsirText] = useState("");

  // start the process of rendomizing the questions/Ayaht
  const [currentAyah, setCurrentAyah] = useState(null);
  const [Loding, setLoding] = useState(false);

  // user voice recording state
  const [userTranscript, setUserTranscript] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const cleanArabicText = (text) => {
    if (!text) return "";
    return text
      .replace(/[\u064B-\u065F]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ۖ /g, "")
      .replace(/ۙ /g, "")
      .replace(/ٰ/g, "")
      .replace(/ۗ /g, "")
      .replace(/ۚ /g, "")
      .trim();
  };

  const startSpeechRecognition = () => {
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
    }
    // on result
    recognition.onresult = (event) => {
      const transcriptResultIndex = event.resultIndex;
      const transcriptResult = event.results[transcriptResultIndex][0].transcript.trim();

      setUserTranscript(transcriptResult);
      
      const cleanUserTranscript = cleanArabicText(transcriptResult);
      const cleanOriginalTranscript = cleanArabicText(currentAyah.text);

      console.log("Cleaned User Transcript:", cleanUserTranscript);
      console.log("Cleaned Original Transcript:", cleanOriginalTranscript);

      // const oText = cleanOriginalTranscript.replace(/\s+/g, '');
      // const uText = cleanUserTranscript.replace(/\s+/g, '');
      // if (oText.includes(uText) || uText.includes(oText)) {
      //   setIsCorrect(true);
      // } else {
      //   setIsCorrect(false);
      // }

      const originalWords = cleanOriginalTranscript.split(' ').filter(word => word.trim() !== '');
      const userWords = cleanUserTranscript.split(' ').filter(word => word.trim() !== '');

      // إذا لم ينطق المستخدم أي شيء بعد، نعتبر الإجابة لم تبدأ
      if (userWords.length === 0) {
        setIsCorrect(null);
        return;
      }

      // 2. حساب عدد الكلمات الصحيحة التي نطقها المستخدم وموجودة في الآية الأصلية
      let correctWordsCount = 0;
      userWords.forEach(word => {
        if (originalWords.includes(word)) {
          correctWordsCount++;
        }
      });

      // 3. حساب النسبة المئوية للمطابقة بناءً على عدد كلمات الآية الأصلية
      // (أو بناءً على كلمات المستخدم، ولكن الأفضل مقارنتها بالآية الأصلية لمعرفة كم استظهر منها)
      const matchPercentage = (correctWordsCount / originalWords.length) * 100;

      console.log(`نسبة التطابق الحالية: ${matchPercentage.toFixed(2)}%`);

      // 4. اتخاذ القرار بناءً على شرط الـ 80%
      if (matchPercentage >= 60) {
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
      setFinishRecording(true);
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
    setRetryCounter(0);
    setUserTranscript("");
    setIsCorrect(null);
    setLoding(true);
    setHasRecorded(false);
    setShowAnswerBox(false);
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
        surahNumber: selected.surah.number,
      });
      console.log('selected surah number is: ', selected.surah.number);
      console.log('selected surah name is: ', selected.surah.name);
      // console.log('selected Ayah number is: ', selected.numberInSurah);
      // console.log('selected Surah Name is: ', selected.surah.name);

    } catch (error) {
      console.error('error fetching the random Ayah: ', error)
    }
    setLoding(false);
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
    { !isExamStarted? (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
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
    </div>)}
  </div>
  )
}

export default App
