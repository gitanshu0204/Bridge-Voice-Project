function Logo({ size = 40 }) {
  return (
    <svg width={size * 3} height={size} viewBox="0 0 120 40" role="img">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#9333ea'}}/>
          <stop offset="100%" style={{stopColor:'#3b82f6'}}/>
        </linearGradient>
      </defs>

      {/* Left land */}
      <rect x="0" y="22" width="12" height="4" rx="2" fill="url(#g1)"/>

      {/* Right land */}
      <rect x="68" y="22" width="12" height="4" rx="2" fill="url(#g1)"/>

      {/* Sound wave bars forming bridge */}
      <rect x="13" y="19" width="4" height="7" rx="1.5" fill="#9333ea"/>
      <rect x="19" y="16" width="4" height="10" rx="1.5" fill="#9333ea"/>
      <rect x="25" y="12" width="4" height="14" rx="1.5" fill="#8b2fe8"/>
      <rect x="31" y="9" width="4" height="17" rx="1.5" fill="#7c3aed"/>
      <rect x="37" y="7" width="4" height="19" rx="1.5" fill="url(#g1)"/>
      <rect x="43" y="7" width="4" height="19" rx="1.5" fill="url(#g1)"/>
      <rect x="49" y="9" width="4" height="17" rx="1.5" fill="#3b82f6"/>
      <rect x="55" y="12" width="4" height="14" rx="1.5" fill="#3b82f6"/>
      <rect x="61" y="16" width="4" height="10" rx="1.5" fill="#3b82f6"/>
      <rect x="67" y="19" width="4" height="7" rx="1.5" fill="#3b82f6"/>
    </svg>
  )
}

export default Logo