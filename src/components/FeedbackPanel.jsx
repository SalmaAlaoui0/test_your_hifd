import { useState } from 'react'

export default function FeedbackPanel({
    feedback,
    isCorrect,
    setScore,
    score,
    currentQuestionIndex,
    setExamFinished,
    fetchRandomAyah,
    startSpeechRecognition,
    incrementRetryCounter,
    retryCounter,
    questionsCount,
    setShowRecordingButton,
}) {
    const [hovNext, setHovNext] = useState(false)
    const [hovRetry, setHovRetry] = useState(false)

    const Correct = feedback === 'correct'
    const isWrong = feedback === 'wrong'
    const isNoAudio = feedback === 'no-audio'
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
            gap: 12,
            direction: 'rtl',
            width: '100%',
            boxSizing: 'border-box',
            padding: '4px 0',
        }}>
            {Correct && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                }}>
                    <span style={{
                        fontFamily: 'Amiri, serif',
                        fontSize: 20,
                        
                        fontWeight: 700,
                        color: '#34D399',
                    }}>
                        جواب صحيح! أحسنت
                    </span>
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: 'rgba(52,211,153,0.15)',
                        border: '1.5px solid rgba(52,211,153,0.5)',
                        color: '#34D399',
                    }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                </div>
            )}

            {isWrong && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                }}>
                    <span style={{
                        fontFamily: 'Amiri, serif',
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#F87171',
                    }}>
                        جواب خاطئ، حاولي مراجعة الآية
                    </span>
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: 'rgba(248,113,113,0.12)',
                        border: '1.5px solid rgba(248,113,113,0.4)',
                        color: '#F87171',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </span>
                </div>
            )}

            {isNoAudio && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                    <span style={{
                        width: '100%',
                        fontFamily: 'Amiri, serif',
                        fontSize: 18,
                        fontWeight: 600,
                        color: 'var(--cream)',
                        textAlign: 'right',
                        lineHeight: 1.7,
                    }}>
                        لم يتم التقاط أي صوت، حاولي مرة أخرى.
                    </span>

                    <button
                        onClick={() => { startSpeechRecognition(); incrementRetryCounter(); }}
                        onMouseEnter={() => setHovRetry(true)}
                        onMouseLeave={() => setHovRetry(false)}
                        style={{
                            width: '100%',
                            padding: '15px 24px',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 17,
                            fontFamily: 'Noto Naskh Arabic, serif',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            direction: 'rtl',
                            transition: 'all 0.25s ease',
                            background: hovRetry
                                ? 'linear-gradient(135deg, #60A5FA, #3B82F6)'
                                : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                            color: '#fff',
                            boxShadow: hovRetry
                                ? '0 8px 28px rgba(59,130,246,0.45)'
                                : '0 4px 16px rgba(59,130,246,0.25)',
                            transform: hovRetry ? 'translateY(-2px)' : 'translateY(0)',
                        }}
                    >
                        <svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transition: 'transform 0.4s ease', transform: hovRetry ? 'rotate(-180deg)' : 'rotate(0deg)' }}
                        >
                            <polyline points="1 4 1 10 7 10" />
                            <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
                        </svg>
                        <span>إعادة المحاولة</span>
                    </button>
                </div>
            )}
            {retryCounter >= 4 && (
                <button
                    // onClick={onNext}
                    onClick={() => {
                        setShowRecordingButton(true);
                        if (isCorrect) {
                            setScore(score + 1);
                        }
                        if (currentQuestionIndex >= Number(questionsCount)) {
                            setExamFinished(true);
                        } else {
                            fetchRandomAyah();
                        }
                    }}
                    onMouseEnter={() => setHovNext(true)}
                    onMouseLeave={() => setHovNext(false)}
                    style={{
                        width: '100%',
                        padding: '15px 24px',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 17,
                        fontFamily: 'Noto Naskh Arabic, serif',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        direction: 'rtl',
                        transition: 'all 0.25s ease',
                        background: isWrong
                            ? hovNext
                                ? 'linear-gradient(135deg, #F97316, #EA580C)'
                                : 'linear-gradient(135deg, #EA580C, #C2410C)'
                            : hovNext
                                ? 'linear-gradient(135deg, #34D399, #10B981)'
                                : 'linear-gradient(135deg, #10B981, #059669)',
                        color: '#fff',
                        boxShadow: isWrong
                            ? hovNext ? '0 8px 28px rgba(234,88,12,0.45)' : '0 4px 16px rgba(234,88,12,0.25)'
                            : hovNext ? '0 8px 28px rgba(16,185,129,0.45)' : '0 4px 16px rgba(16,185,129,0.25)',
                        transform: hovNext ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                >
                    <span>السؤال التالي</span>
                    <span style={{
                        display: 'flex',
                        transition: 'transform 0.25s ease',
                        transform: hovNext ? 'translateX(-4px)' : 'translateX(0)',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                    </span>
                </button>
            )}
        </div>
    )
}