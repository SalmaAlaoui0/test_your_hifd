import React from 'react';
import { GeoCorner } from '../utils/Icons.jsx';
import { useState } from 'react';
import { IslamicStar } from '../utils/Icons.jsx';

export default function ResultsPage({
	score,
	total,
	onNewTest,
	onBack,
	current,
} = {}) {
	const pct = total > 0 ? Math.round((score / total) * 100) : 0
	const perfect = pct === 100
	const [hovBtn, setHovBtn] = useState(false)
	const [hovBack, setHovBack] = useState(false)

	const grade =
		pct === 100 ? 'ممتاز' :
			pct >= 80 ? 'جيد جداً' :
				pct >= 60 ? 'جيد' :
					'يحتاج مراجعة'

	// arc for the score ring
	const r = 56
	const circ = 2 * Math.PI * r
	const dash = (pct / 100) * circ

	return (
		<div style={{
			width: '100%',
			maxWidth: 340,
			margin: 'auto',
			padding: '0 5px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 0,
		}}>
			<div
				style={{
					width: '100%',
					background: 'var(--card-bg)',
					border: '1px solid var(--card-border)',
					borderRadius: 24,
					padding: '44px 40px 40px',
					boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,150,62,0.12)',
					backdropFilter: 'blur(12px)',
					position: 'relative',
					overflow: 'hidden',
					textAlign: 'center',
					direction: 'rtl',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				{/* Background star decorations */}
				<div style={{ position: 'absolute', top: 60, right: 80 }}>
					<IslamicStar size={90} opacity={0.07} />
				</div>
				<div style={{ position: 'absolute', bottom: 150, left: 20 }}>
					<IslamicStar size={110} opacity={0.05} />
				</div>
				<div style={{ position: 'absolute', top: '75%', left: 300 }}>
					<IslamicStar size={55} opacity={0.04} />
				</div>

				{/* Corner decorations */}
				<div style={{ position: 'absolute', top: -1, right: -1 }}>
					<GeoCorner />
				</div>
				<div style={{ position: 'absolute', top: -1, left: -1 }}>
					<GeoCorner flip />
				</div>
				<div style={{ position: 'absolute', bottom: -1, right: -1, transform: 'rotate(180deg)' }}>
					<GeoCorner />
				</div>
				<div style={{ position: 'absolute', bottom: -1, left: -1, transform: 'rotate(180deg)' }}>
					<GeoCorner flip />
				</div>

				{/* Gold top line */}
				<div style={{
					position: 'absolute',
					top: 0, left: '12%', right: '12%',
					height: 2,
					background: 'linear-gradient(90deg, transparent, #C8963E, transparent)',
					borderRadius: 1,
				}} />

				{/* Score ring */}
				<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
					<div style={{ position: 'relative', width: 140, height: 140 }}>
						<svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
							{/* Track */}
							<circle
								cx="70" cy="70" r={r}
								fill="none"
								stroke="rgba(180,140,50,0.12)"
								strokeWidth="8"
							/>
							{/* Progress arc */}
							<circle
								cx="70" cy="70" r={r}
								fill="none"
								stroke="url(#goldGrad)"
								strokeWidth="8"
								strokeLinecap="round"
								strokeDasharray={`${dash} ${circ}`}
								style={{ transition: 'stroke-dasharray 1s ease' }}
							/>
							<defs>
								<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#C8963E" />
									<stop offset="100%" stopColor="#E8C87A" />
								</linearGradient>
							</defs>
						</svg>

						{/* Center content */}
						<div style={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<span style={{
								fontFamily: 'Amiri, serif',
								fontSize: 30,
								fontWeight: 700,
								color: 'var(--gold-light)',
								lineHeight: 1,
							}}>
								{pct}%
							</span>
							<span style={{
								fontSize: 11,
								color: 'var(--cream-dim)',
								marginTop: 4,
								fontFamily: 'Noto Naskh Arabic, serif',
							}}>
								النسبة
							</span>
						</div>
					</div>
				</div>

				{/* Message */}
				<div style={{ marginBottom: 6 }}>
					<div style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 10,
						background: perfect
							? 'linear-gradient(135deg, rgba(200,150,62,0.15), rgba(232,200,122,0.08))'
							: 'rgba(200,150,62,0.08)',
						border: `1px solid ${perfect ? 'rgba(200,150,62,0.4)' : 'rgba(180,140,50,0.2)'}`,
						borderRadius: 12,
						padding: '8px 20px',
						marginBottom: 16,
					}}>
						{/* Trophy / star SVG icon */}
						{perfect ? (
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8963E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6" />
								<path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18" />
								<path d="M4 22h16" />
								<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
								<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
								<path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
							</svg>
						) : (
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8963E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
						)}
						<span style={{
							fontFamily: 'Amiri, serif',
							fontSize: 20,
							fontWeight: 700,
							color: 'var(--gold-light)',
						}}>
							{perfect ? 'أحسنت! اختبار مكتمل بنجاح' : 'تم إنهاء الاختبار'}
						</span>
					</div>
				</div>

				{/* Grade badge */}
				<div style={{
					display: 'inline-block',
					fontSize: 15,
					fontWeight: 700,
					fontFamily: 'Noto Naskh Arabic, serif',
					color: perfect ? '#22C55E' : pct >= 60 ? 'var(--gold)' : '#F87171',
					background: perfect ? 'rgba(34,197,94,0.1)' : pct >= 60 ? 'rgba(200,150,62,0.1)' : 'rgba(248,113,113,0.1)',
					border: `1px solid ${perfect ? 'rgba(34,197,94,0.3)' : pct >= 60 ? 'rgba(200,150,62,0.3)' : 'rgba(248,113,113,0.3)'}`,
					borderRadius: 20,
					padding: '4px 16px',
					marginBottom: 20,
				}}>
					{grade}
				</div>

				{/* Score row */}
				<div style={{
					display: 'flex',
					justifyContent: 'center',
					gap: 0,
					marginBottom: 30,
				}}>
					{[
						{ label: 'إجمالي الأسئلة', value: total, color: 'var(--cream)' },
						{ label: 'إجابات صحيحة', value: score, color: '#22C55E' },
						{ label: 'إجابات خاطئة', value: total - score, color: '#F87171' },
					].map(({ label, value, color }, i) => (
						<div
							key={label}
							style={{
								flex: 1,
								padding: '10px 8px',
								borderRight: i < 2 ? '1px solid rgba(180,140,50,0.15)' : 'none',
								textAlign: 'center',
							}}
						>
							<div style={{
								fontFamily: 'Amiri, serif',
								fontSize: 24,
								fontWeight: 600,
								color,
								lineHeight: 1,
								marginBottom: 6,
							}}>
								{value}
							</div>
							<div style={{
								fontSize: 12,
								color: 'var(--cream-dim)',
								fontFamily: 'Noto Naskh Arabic, serif',
								lineHeight: 1.4,
							}}>
								{label}
							</div>
						</div>
					))}
				</div>

				{/* New test button */}
				<button
					onClick={onNewTest}
					onMouseEnter={() => setHovBtn(true)}
					onMouseLeave={() => setHovBtn(false)}
					style={{
						width: '100%',
						padding: '15px 32px',
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
						transition: 'all 0.3s ease',
						background: hovBtn
							? 'linear-gradient(135deg, #E8C87A, #C8963E, #A87020)'
							: 'linear-gradient(135deg, #C8963E, #A87020)',
						color: '#050F09',
						boxShadow: hovBtn
							? '0 8px 32px rgba(200,150,62,0.5), 0 0 0 2px rgba(200,150,62,0.3)'
							: '0 4px 16px rgba(200,150,62,0.25)',
						transform: hovBtn ? 'translateY(-2px)' : 'translateY(0)',
						letterSpacing: '0.03em',
					}}
				>
					<svg
						width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
						strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
						style={{ transition: 'transform 0.4s ease', transform: hovBtn ? 'rotate(180deg)' : 'rotate(0deg)' }}
					>
						<polyline points="23 4 23 10 17 10" />
						<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
					</svg>
					<span>اختبار جديد</span>
				</button>
			</div>
		</div>
	)
}
