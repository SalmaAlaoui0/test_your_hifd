
export const IslamicStar = ({ size = 60, opacity = 0.12 }) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
	{[0, 30, 60, 90, 120, 150].map((deg) => (
		<polygon
		key={deg}
		points="50,8 58,38 90,38 65,57 74,88 50,70 26,88 35,57 10,38 42,38"
		fill="#C8963E"
		transform={`rotate(${deg} 50 50)`}
		/>
	))}
	</svg>
)


export const GeoCorner = ({ flip = false }) => (
  <svg
    width="120" height="120" viewBox="0 0 120 120"
    style={{
      opacity: 0.18,
      transform: flip ? 'scaleX(-1)' : 'none',
    }}
  >
    <path d="M0 0 L60 0 L60 10 L10 10 L10 60 L0 60 Z" fill="#C8963E" />
    <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#C8963E" />
    <circle cx="20" cy="20" r="8" fill="none" stroke="#C8963E" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="4" fill="#C8963E" opacity="0.6" />
    <path d="M16 16 L24 16 L24 24 L16 24 Z" fill="none" stroke="#C8963E" strokeWidth="1" transform="rotate(45 20 20)" />
  </svg>
)


export const BookOpenIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

export const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
)

export const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

