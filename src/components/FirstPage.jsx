import { react } from 'react';
import { BookOpenIcon } from '../utils/Icons.jsx';
import { StarIcon } from '../utils/Icons.jsx';
import { PlayIcon } from '../utils/Icons.jsx';
import { useState, useEffect } from 'react'
import { showAlert } from '../utils/alert';


function SelectField({ value, onChange, options, placeholder }) {
	const [focused, setFocused] = useState(false)
	const [isSmallScreen, setIsSmallScreen] = useState(() => {
		if (typeof window === 'undefined') {
			return false;
		}
		return window.innerWidth <= 768;
	});

	useEffect(() => {
		const onResize = () => setIsSmallScreen(window.innerWidth <= 768);
		onResize();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			style={{
				width: '100%',
				padding: '12px 14px 12px 36px',
				background: 'rgba(10, 36, 22, 0.8)',
				border: `1px solid ${focused ? 'var(--gold)' : 'rgba(180,140,50,0.25)'}`,
				borderRadius: 10,
				color: value ? 'var(--cream)' : 'rgba(245,230,200,0.4)',
				fontSize: isSmallScreen ? 12 : 14,
				fontFamily: 'Noto Naskh Arabic, serif',
				cursor: 'pointer',
				transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
				boxShadow: focused ? '0 0 0 3px rgba(200,150,62,0.15)' : 'none',
				direction: 'rtl',
			}}
		>
			<option value="" disabled>{placeholder}</option>
			{options.map((n) => (
				<option key={n} value={n} style={{ background: '#0A1F12' }}>
					الحزب {n}
				</option>
			))}
		</select>
	)
}


export function CounterBtn({ onClick, label }) {
	const [hov, setHov] = useState(false)
	return (
		<button
			onClick={onClick}
			onMouseEnter={() => setHov(true)}
			onMouseLeave={() => setHov(false)}
			style={{
				width: 40,
				height: 40,
				borderRadius: 10,
				border: `1px solid ${hov ? 'var(--gold)' : 'rgba(180,140,50,0.3)'}`,
				background: hov ? 'rgba(200,150,62,0.15)' : 'transparent',
				color: 'var(--gold)',
				fontSize: 22,
				fontWeight: 300,
				cursor: 'pointer',
				transition: 'all 0.2s ease',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				transform: hov ? 'scale(1.1)' : 'scale(1)',
			}}
		>
			{label}
		</button>
	)
}

export default function FirstPage({
	hizbOptions = Array.from({ length: 60 }, (_, i) => i + 1),
	fromHizb,
	setFromHizb,
	toHizb,
	setToHizb,
	count,
	setCount,
	isExamStarted,
	setIsExamStarted,
	fetchRandomAyah
}) {
	const [hovering, setHovering] = useState(false)
	return (
		<div style={{ textAlign: 'center' }}>
			<div style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: 64,
				height: 64,
				borderRadius: '50%',
				background: 'linear-gradient(135deg, rgba(200,150,62,0.25), rgba(200,150,62,0.08))',
				border: '1px solid rgba(200,150,62,0.4)',
				marginBottom: 20,
				color: '#C8963E',
			}}>
				<BookOpenIcon />
			</div>
			<div style={{
				fontSize: 13,
				color: 'var(--gold)',
				letterSpacing: '0.12em',
				marginBottom: 10,
				fontFamily: 'Noto Naskh Arabic, serif',
				opacity: 0.8,
			}}>
				بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
			</div>
			<h1 style={{
				fontFamily: 'Amiri, serif',
				fontSize: 'clamp(22px, 4vw, 28px)',
				fontWeight: 700,
				color: 'var(--cream)',
				margin: 0,
				lineHeight: 1.4,
			}}>
				مراجعة القرآن الكريم
			</h1>

			<div style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 10,
				marginTop: 12,
			}}>
				<div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, rgba(200,150,62,0.5))' }} />
				<span style={{ color: 'var(--gold)', opacity: 0.6, fontSize: 14 }}>
					<StarIcon />
				</span>
				<div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, rgba(200,150,62,0.5))' }} />
			</div>


			<div
				style={{
					display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px', direction: 'rtl'
				}}>
				{[
					{ label: 'من الحزب', value: fromHizb, set: setFromHizb },
					{ label: 'إلى الحزب', value: toHizb, set: setToHizb },
				]
					.map(({ label, value, set }) => (
						<div key={label}>
							<label style={{
								display: 'block',
								fontSize: 13,
								color: 'var(--gold)',
								marginBottom: 8,
								fontWeight: 600,
								letterSpacing: '0.03em',
							}}>
								{label}
							</label>
							<SelectField value={value} onChange={set} options={hizbOptions} placeholder="اختر الحزب" />
						</div>
					))}
			</div>


			<div style={{ marginBottom: 36 }}>
				<label
					style={{
						display: 'block',
						fontSize: 13,
						color: 'var(--gold)',
						marginBottom: 8,
						fontWeight: 600,
						letterSpacing: '0.10m',
						textAlign: 'center',
					}}>
					عدد الأسئلة
				</label>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
					<CounterBtn onClick={() => setCount(Math.max(1, count - 1))} label="−" />
					<div style={{
						fontSize: 28,
						fontWeight: 700,
						color: 'var(--cream)',
						minWidth: 60,
						textAlign: 'center',
						fontFamily: 'Amiri, serif',
					}}>
						{count}
					</div>
					<CounterBtn onClick={() => setCount(Math.min(60, count + 1))} label="+" />
				</div>
			</div>

			<button
				onClick={() => {
					console.log('BISMILLAH\n');
					if (!fromHizb || !toHizb) {
						showAlert("من فضلك اختر الحزب أولاً");
						return;
					}
					if (Number(fromHizb) > Number(toHizb)) {
						showAlert("من فضلك تأكد من أن الحزب 'من' أصغر أو يساوي الحزب 'إلى'");
						return;
					}
					else {
						setIsExamStarted(true);
						fetchRandomAyah();
					}
				}}
				onMouseEnter={() => setHovering(true)}
				onMouseLeave={() => setHovering(false)}
				style={{
					width: '100%',
					padding: '12px 32px',
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
					background: hovering
						? 'linear-gradient(135deg, #E8C87A, #C8963E, #A87020)'
						: 'linear-gradient(135deg, #C8963E, #A87020)',
					color: '#050F09',
					boxShadow: hovering
						? '0 8px 32px rgba(200,150,62,0.5), 0 0 0 2px rgba(200,150,62,0.3)'
						: '0 4px 16px rgba(200,150,62,0.25)',
					transform: hovering ? 'translateY(-2px)' : 'translateY(0)',
					letterSpacing: '0.03em',
					direction: 'rtl',
				}}>
				<span>ابدأ الاختبار</span>
				<span style={{ transform: hovering ? 'translateX(-4px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}>
					<PlayIcon />
				</span>
			</button>
		</div>
	);
}