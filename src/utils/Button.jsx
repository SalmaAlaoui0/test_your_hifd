import { useState } from 'react'

export function ActionButton({
  label, icon, hoverColor, hoverBg, borderColor, activeBorderColor, onClick,
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '14px 20px',
        borderRadius: 12,
        border: `1px solid ${hov ? activeBorderColor : borderColor}`,
        background: hov ? hoverBg : 'var(--card-bg)',
        color: hov ? hoverColor : 'var(--cream-dim)',
        fontSize: 16,
        fontFamily: 'Noto Naskh Arabic, serif',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        direction: 'rtl',
        transition: 'all 0.25s ease',
        backdropFilter: 'blur(8px)',
        boxShadow: hov ? `0 4px 20px ${hoverColor}25` : 'none',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>{label}</span>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
        transition: 'transform 0.25s ease',
        transform: hov ? 'scale(1.2)' : 'scale(1)',
      }}>
        <span style={{ display: 'block' }}>{icon}</span>
      </span>
    </button>
  )
}


export function ExitButton({
  label, icon, hoverColor, hoverBg, borderColor, activeBorderColor, onClick,
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={label || 'خروج'}
      style={{
        padding: hov ? '8px 20px' : '8px 14px',
        borderRadius: 12,
        border: `1px solid ${hov ? activeBorderColor : borderColor}`,
        // background: hov ? hoverBg : 'var(--card-bg)',
        background: hov ? hoverBg : 'rgba(0,0,0,0.1)',
        color: hov ? hoverColor : 'var(--cream-dim)',
        fontSize: 16,
        fontFamily: 'Noto Naskh Arabic, serif',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        direction: 'rtl',
        transition: 'all 0.25s ease',
        backdropFilter: 'blur(8px)',
        boxShadow: hov ? `0 4px 20px ${hoverColor}25` : 'none',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1, maxWidth: hov ? 140 : 0, opacity: hov ? 1 : 0, overflow: 'hidden', whiteSpace: 'nowrap', transition: 'all 0.25s ease' }}>{label}</span>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
        transition: 'transform 0.25s ease',
        transform: hov ? 'scale(1.2)' : 'scale(1)',
      }}>
        <span style={{ display: 'block' }}>{icon}</span>
      </span>
    </button>
  )
}