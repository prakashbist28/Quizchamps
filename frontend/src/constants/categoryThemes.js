// Category-to-visual-theme mapping.
// SVG elements use fill/stroke="currentColor" so the parent's text-color
// controls them — category accent in light mode, white in dark mode.

// ── SVG Illustrations ─────────────────────────────────────────────────────────

const CodingIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <path d="M230 30 L155 130 L230 230" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity="0.13"/>
    <path d="M275 30 L350 130 L275 230" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity="0.13"/>
    <path d="M268 20 L212 250" stroke="currentColor" strokeWidth="14" strokeLinecap="round" opacity="0.1"/>
    <rect x="16" y="44"  width="110" height="7" rx="3.5" fill="currentColor" opacity="0.07"/>
    <rect x="16" y="62"  width="75"  height="7" rx="3.5" fill="currentColor" opacity="0.05"/>
    <rect x="32" y="80"  width="90"  height="7" rx="3.5" fill="currentColor" opacity="0.06"/>
    <rect x="32" y="98"  width="55"  height="7" rx="3.5" fill="currentColor" opacity="0.05"/>
    <rect x="16" y="116" width="80"  height="7" rx="3.5" fill="currentColor" opacity="0.06"/>
    <circle cx="28"  cy="200" r="4" fill="currentColor" opacity="0.12"/>
    <circle cx="56"  cy="200" r="4" fill="currentColor" opacity="0.09"/>
    <circle cx="84"  cy="200" r="4" fill="currentColor" opacity="0.07"/>
    <line x1="28" y1="200" x2="84"  y2="200" stroke="currentColor" strokeWidth="1.5" opacity="0.07"/>
    <circle cx="84"  cy="220" r="4" fill="currentColor" opacity="0.09"/>
    <line x1="84" y1="200" x2="84"  y2="220" stroke="currentColor" strokeWidth="1.5" opacity="0.07"/>
    <circle cx="112" cy="220" r="4" fill="currentColor" opacity="0.07"/>
    <line x1="84" y1="220" x2="112" y2="220" stroke="currentColor" strokeWidth="1.5" opacity="0.05"/>
    <rect x="16" y="136" width="11" height="16" rx="1.5" fill="currentColor" opacity="0.18"/>
  </svg>
);

const ScienceIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <circle cx="280" cy="115" r="18" fill="currentColor" opacity="0.2"/>
    <ellipse cx="280" cy="115" rx="88" ry="32" stroke="currentColor" strokeWidth="2.5" opacity="0.18"/>
    <ellipse cx="280" cy="115" rx="88" ry="32" stroke="currentColor" strokeWidth="2.5" opacity="0.14" transform="rotate(60 280 115)"/>
    <ellipse cx="280" cy="115" rx="88" ry="32" stroke="currentColor" strokeWidth="2.5" opacity="0.14" transform="rotate(-60 280 115)"/>
    <circle cx="368" cy="115" r="7" fill="currentColor" opacity="0.28"/>
    <circle cx="236" cy="172" r="6" fill="currentColor" opacity="0.22"/>
    <circle cx="236" cy="58"  r="6" fill="currentColor" opacity="0.22"/>
    <circle cx="55"  cy="185" r="14" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.06" opacity="0.2"/>
    <circle cx="100" cy="165" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.04" opacity="0.16"/>
    <circle cx="40"  cy="220" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.04" opacity="0.14"/>
    <line x1="55" y1="185" x2="100" y2="165" stroke="currentColor" strokeWidth="2" opacity="0.12"/>
    <line x1="55" y1="185" x2="40"  y2="220" stroke="currentColor" strokeWidth="2" opacity="0.12"/>
    {[0,1,2,3].map(r => [0,1,2,3].map(c => (
      <circle key={`${r}-${c}`} cx={20 + c * 28} cy={20 + r * 28} r="2.5" fill="currentColor" opacity="0.07"/>
    )))}
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    {[190, 250, 310].map((x, i) => (
      <g key={i}>
        <rect x={x} y="70" width="28" height="150" fill="currentColor" opacity="0.11"/>
        <rect x={x - 8} y="60"  width="44" height="14" rx="2" fill="currentColor" opacity="0.15"/>
        <rect x={x - 8} y="220" width="44" height="12" rx="2" fill="currentColor" opacity="0.13"/>
        <line x1={x + 9}  y1="70" x2={x + 9}  y2="220" stroke="currentColor" strokeWidth="1.5" opacity="0.06"/>
        <line x1={x + 18} y1="70" x2={x + 18} y2="220" stroke="currentColor" strokeWidth="1.5" opacity="0.06"/>
      </g>
    ))}
    <path d="M190 70 Q265 10 338 70" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.13"/>
    <rect x="150" y="232" width="220" height="8" rx="4" fill="currentColor" opacity="0.1"/>
    <rect x="130" y="240" width="260" height="8" rx="4" fill="currentColor" opacity="0.08"/>
    <rect x="110" y="248" width="300" height="8" rx="4" fill="currentColor" opacity="0.06"/>
    <path d="M55 40 L100 40 L75 90 L100 140 L55 140 L80 90 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.06" opacity="0.14"/>
    <line x1="55" y1="90" x2="100" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.1"/>
    <circle cx="75" cy="110" r="3" fill="currentColor" opacity="0.13"/>
    <circle cx="70" cy="120" r="3" fill="currentColor" opacity="0.1"/>
    <circle cx="80" cy="118" r="2" fill="currentColor" opacity="0.09"/>
  </svg>
);

const GeographyIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <circle cx="280" cy="120" r="105" stroke="currentColor" strokeWidth="2" opacity="0.18"/>
    <ellipse cx="280" cy="70"  rx="72"  ry="20" stroke="currentColor" strokeWidth="1.5" opacity="0.11"/>
    <ellipse cx="280" cy="120" rx="105" ry="30" stroke="currentColor" strokeWidth="1.5" opacity="0.14"/>
    <ellipse cx="280" cy="170" rx="72"  ry="20" stroke="currentColor" strokeWidth="1.5" opacity="0.11"/>
    <path d="M280 15 C230 50 230 190 280 225" stroke="currentColor" strokeWidth="1.5" opacity="0.11"/>
    <path d="M280 15 C330 50 330 190 280 225" stroke="currentColor" strokeWidth="1.5" opacity="0.11"/>
    <line x1="175" y1="120" x2="385" y2="120" stroke="currentColor" strokeWidth="1.5" opacity="0.11"/>
    <g transform="translate(68, 200)">
      <path d="M0 -30 L8 0 L0 30 L-8 0 Z" fill="currentColor" opacity="0.18"/>
      <path d="M-30 0 L0 8 L30 0 L0 -8 Z" fill="currentColor" opacity="0.13"/>
      <circle cx="0" cy="0" r="5" fill="currentColor" opacity="0.22"/>
    </g>
    {[0,1,2].map(r => [0,1,2,3].map(c => (
      <circle key={`${r}-${c}`} cx={20 + c * 32} cy={20 + r * 32} r="2" fill="currentColor" opacity="0.07"/>
    )))}
  </svg>
);

const NatureIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <path d="M0 260 L90 100 L145 155 L210 60 L300 175 L420 80 L420 260 Z" fill="currentColor" opacity="0.09"/>
    <path d="M90 100 L145 155 L210 60 L300 175 L420 80" stroke="currentColor" strokeWidth="2.5" opacity="0.16" fill="none"/>
    <path d="M48 220 L68 180 L88 220 Z" fill="currentColor" opacity="0.13"/>
    <rect x="62" y="220" width="12" height="18" rx="2" fill="currentColor" opacity="0.11"/>
    <path d="M22 225 L38 194 L54 225 Z" fill="currentColor" opacity="0.11"/>
    <rect x="33" y="225" width="10" height="14" rx="2" fill="currentColor" opacity="0.09"/>
    <path d="M340 230 L358 196 L376 230 Z" fill="currentColor" opacity="0.1"/>
    <rect x="352" y="230" width="12" height="16" rx="2" fill="currentColor" opacity="0.08"/>
    <circle cx="350" cy="55" r="30" stroke="currentColor" strokeWidth="2"   fill="currentColor" fillOpacity="0.05" opacity="0.14"/>
    <circle cx="378" cy="45" r="22" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" opacity="0.12"/>
    <circle cx="325" cy="42" r="18" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" opacity="0.1"/>
    <path d="M350 30 Q365 55 345 80" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="none"/>
    <circle cx="140" cy="35" r="2.5" fill="currentColor" opacity="0.22"/>
    <circle cx="175" cy="22" r="2"   fill="currentColor" opacity="0.18"/>
    <circle cx="105" cy="25" r="2"   fill="currentColor" opacity="0.16"/>
    <circle cx="220" cy="30" r="1.5" fill="currentColor" opacity="0.14"/>
  </svg>
);

const SportsIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <path d="M230 25 C195 25 175 55 175 88 C175 128 208 150 218 162 L218 195 L208 195 L208 215 L285 215 L285 195 L275 195 L275 162 C285 150 318 128 318 88 C318 55 298 25 260 25 Z" fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="1.5" opacity="0.18"/>
    <rect x="208" y="215" width="77" height="11" rx="5.5" fill="currentColor" opacity="0.16"/>
    <rect x="196" y="226" width="101" height="8"  rx="4"   fill="currentColor" opacity="0.12"/>
    <path d="M175 65 C138 65 138 130 175 130" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.13"/>
    <path d="M318 65 C355 65 355 130 318 130" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.13"/>
    <path d="M130 35 L133 28 L136 35 L143 35 L137.5 40 L140 47 L133 43 L126 47 L128.5 40 L123 35 Z" fill="currentColor" opacity="0.18"/>
    <path d="M375 55 L377 50 L379 55 L384 55 L380.5 58.5 L382 63 L377 60 L372 63 L373.5 58.5 L370 55 Z" fill="currentColor" opacity="0.15"/>
    <circle cx="90"  cy="70"  r="4" fill="currentColor" opacity="0.18"/>
    <circle cx="395" cy="95"  r="3" fill="currentColor" opacity="0.15"/>
    <line x1="20" y1="110" x2="80"  y2="110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.1"/>
    <line x1="30" y1="125" x2="75"  y2="125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.08"/>
    <line x1="20" y1="140" x2="65"  y2="140" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.07"/>
    <circle cx="55" cy="210" r="42" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.09"/>
    <circle cx="55" cy="210" r="28" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.07"/>
    <circle cx="55" cy="210" r="14" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.04" opacity="0.1"/>
  </svg>
);

const EntertainmentIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <path d="M290 40 L302 90 L350 80 L318 118 L358 148 L302 140 L290 190 L278 140 L222 148 L262 118 L230 80 L278 90 Z" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.5" opacity="0.18"/>
    <rect x="16" y="20" width="175" height="115" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.04" opacity="0.13"/>
    <line x1="74"  y1="20" x2="74"  y2="135" stroke="currentColor" strokeWidth="1.5" opacity="0.08"/>
    <line x1="132" y1="20" x2="132" y2="135" stroke="currentColor" strokeWidth="1.5" opacity="0.08"/>
    <rect x="24"  y="24" width="12" height="10" rx="2" fill="currentColor" opacity="0.16"/>
    <rect x="82"  y="24" width="12" height="10" rx="2" fill="currentColor" opacity="0.13"/>
    <rect x="140" y="24" width="12" height="10" rx="2" fill="currentColor" opacity="0.13"/>
    <rect x="24"  y="121" width="12" height="10" rx="2" fill="currentColor" opacity="0.16"/>
    <rect x="82"  y="121" width="12" height="10" rx="2" fill="currentColor" opacity="0.13"/>
    <rect x="140" y="121" width="12" height="10" rx="2" fill="currentColor" opacity="0.13"/>
    <path d="M65 175 L65 220" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" opacity="0.13"/>
    <ellipse cx="56" cy="222" rx="12" ry="8" fill="currentColor" opacity="0.13"/>
    <path d="M65 175 L100 162 L100 180 L65 193 Z" fill="currentColor" opacity="0.1"/>
    <circle cx="175" cy="200" r="4"   fill="currentColor" opacity="0.18"/>
    <circle cx="155" cy="220" r="2.5" fill="currentColor" opacity="0.14"/>
    <circle cx="195" cy="218" r="3"   fill="currentColor" opacity="0.12"/>
    <circle cx="375" cy="230" r="4"   fill="currentColor" opacity="0.16"/>
    <circle cx="390" cy="210" r="2.5" fill="currentColor" opacity="0.12"/>
  </svg>
);

const BusinessIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <rect x="180" y="195" width="38" height="55"  rx="4" fill="currentColor" opacity="0.12"/>
    <rect x="232" y="155" width="38" height="95"  rx="4" fill="currentColor" opacity="0.15"/>
    <rect x="284" y="105" width="38" height="145" rx="4" fill="currentColor" opacity="0.18"/>
    <rect x="336" y="55"  width="38" height="195" rx="4" fill="currentColor" opacity="0.2"/>
    <line x1="172" y1="250" x2="172" y2="18"  stroke="currentColor" strokeWidth="2" opacity="0.1"/>
    <path d="M162 36 L172 18 L182 36" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1"/>
    <line x1="172" y1="250" x2="400" y2="250" stroke="currentColor" strokeWidth="2" opacity="0.1"/>
    <path d="M200 220 L255 175 L308 125 L360 75" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" opacity="0.15"/>
    <circle cx="75" cy="135" r="66" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.1"/>
    <circle cx="75" cy="135" r="50" stroke="currentColor" strokeWidth="2"   fill="none" opacity="0.08"/>
    <circle cx="75" cy="135" r="34" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" opacity="0.09"/>
    <line x1="75" y1="114" x2="75" y2="156" stroke="currentColor" strokeWidth="3" opacity="0.11"/>
    <path d="M60 122 C60 114 90 114 90 126 C90 138 60 138 60 150 C60 162 90 162 90 154" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.1"/>
    {[60, 105, 155, 205].map(y => (
      <line key={y} x1="172" y1={y} x2="400" y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" opacity="0.05"/>
    ))}
  </svg>
);

const LiteratureIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <path d="M220 40 C196 40 182 58 182 80 C182 104 198 115 216 115 C198 138 180 155 158 166 L178 178 C212 160 242 132 242 80 C242 58 234 40 220 40 Z" fill="currentColor" opacity="0.15"/>
    <path d="M310 40 C286 40 272 58 272 80 C272 104 288 115 306 115 C288 138 270 155 248 166 L268 178 C302 160 332 132 332 80 C332 58 324 40 310 40 Z" fill="currentColor" opacity="0.12"/>
    <path d="M30 195 L30 252 L202 242 L202 186 Z" fill="currentColor" opacity="0.08"/>
    <path d="M202 186 L202 242 L374 252 L374 195 Z" fill="currentColor" opacity="0.06"/>
    <line x1="202" y1="186" x2="202" y2="252" stroke="currentColor" strokeWidth="3" opacity="0.13"/>
    <line x1="50"  y1="210" x2="185" y2="204" stroke="currentColor" strokeWidth="1.5" opacity="0.08"/>
    <line x1="50"  y1="222" x2="185" y2="216" stroke="currentColor" strokeWidth="1.5" opacity="0.07"/>
    <line x1="50"  y1="234" x2="185" y2="228" stroke="currentColor" strokeWidth="1.5" opacity="0.06"/>
    <line x1="218" y1="204" x2="356" y2="210" stroke="currentColor" strokeWidth="1.5" opacity="0.08"/>
    <line x1="218" y1="216" x2="356" y2="222" stroke="currentColor" strokeWidth="1.5" opacity="0.07"/>
    <line x1="218" y1="228" x2="356" y2="234" stroke="currentColor" strokeWidth="1.5" opacity="0.06"/>
    <path d="M380 20 C340 60 330 100 345 160 L350 155 C338 102 348 64 388 26 Z" fill="currentColor" opacity="0.13"/>
    <circle cx="346" cy="162" r="4" fill="currentColor" opacity="0.14"/>
  </svg>
);

const GeneralKnowledgeIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <path d="M245 35 C198 35 166 68 166 108 C166 146 198 170 210 184 L210 206 C210 212 215 217 221 217 L279 217 C285 217 290 212 290 206 L290 184 C302 170 334 146 334 108 C334 68 302 35 255 35 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" opacity="0.18"/>
    <path d="M220 130 Q235 115 250 130 Q265 145 280 130" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.15"/>
    <rect x="215" y="217" width="70" height="9"  rx="4.5" fill="currentColor" opacity="0.16"/>
    <rect x="221" y="228" width="58" height="8"  rx="4"   fill="currentColor" opacity="0.12"/>
    <rect x="228" y="238" width="44" height="7"  rx="3.5" fill="currentColor" opacity="0.09"/>
    <line x1="250" y1="10"  x2="250" y2="-8"  stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.16"/>
    <line x1="305" y1="28"  x2="325" y2="12"  stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.13"/>
    <line x1="346" y1="70"  x2="372" y2="55"  stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.12"/>
    <line x1="195" y1="28"  x2="175" y2="12"  stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.13"/>
    <line x1="154" y1="70"  x2="128" y2="55"  stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.12"/>
    <line x1="355" y1="118" x2="384" y2="112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.1"/>
    <line x1="145" y1="118" x2="116" y2="112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.1"/>
    <path d="M65  55  L68  44  L71  55  L82  55  L73  62  L76  73  L68  67  L60  73  L63  62  L54  55  Z" fill="currentColor" opacity="0.16"/>
    <path d="M385 175 L387 168 L389 175 L396 175 L390 179 L392 186 L387 182 L382 186 L384 179 L378 175 Z" fill="currentColor" opacity="0.13"/>
    <circle cx="42"  cy="160" r="4" fill="currentColor" opacity="0.14"/>
    <circle cx="390" cy="48"  r="3" fill="currentColor" opacity="0.12"/>
  </svg>
);

const OtherIcon = () => (
  <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    {Array.from({ length: 7 }, (_, r) =>
      Array.from({ length: 10 }, (_, c) => (
        <circle key={`${r}-${c}`} cx={20 + c * 40} cy={18 + r * 38} r="3" fill="currentColor" opacity={0.04 + ((r + c) % 3) * 0.025}/>
      ))
    )}
    <rect x="230" y="40" width="120" height="120" rx="12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1"/>
    <rect x="250" y="60" width="80"  height="80"  rx="8"  stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.08"/>
    <line x1="230" y1="40"  x2="350" y2="160" stroke="currentColor" strokeWidth="1.5" opacity="0.07"/>
    <line x1="350" y1="40"  x2="230" y2="160" stroke="currentColor" strokeWidth="1.5" opacity="0.07"/>
    <circle cx="290" cy="100" r="28" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" opacity="0.12"/>
    <circle cx="290" cy="100" r="15" fill="currentColor" opacity="0.08"/>
    <path d="M50 200 L110 120 L170 200 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" opacity="0.1"/>
    <line x1="355" y1="195" x2="395" y2="195" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.12"/>
    <line x1="375" y1="175" x2="375" y2="215" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.12"/>
    <line x1="15"  y1="55"  x2="45"  y2="55"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.1"/>
    <line x1="30"  y1="40"  x2="30"  y2="70"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.1"/>
  </svg>
);

// ── Theme map ─────────────────────────────────────────────────────────────────
// gradient          — dark mode background
// lightGradient     — light mode background (subtle category tint on white)
// accentBar         — colored left-edge stripe (light mode only)
// illustrationColor — text-{color} class; SVG uses currentColor so this sets
//                     the stroke/fill color. Category accent in light, white in dark.
// cardHover         — hover classes for both modes
// badge             — category pill (light + dark variants combined)

export const CATEGORY_THEMES = {
  'Coding': {
    gradient:               'from-slate-800 via-indigo-900 to-violet-900',
    lightGradient:          'from-white to-violet-50',
    accentBar:              'bg-violet-500',
    illustrationColor:      'text-violet-500',
    darkIllustrationColor:  'dark:text-violet-300',
    cardHover:              'hover:shadow-violet-200 hover:border-violet-300 dark:hover:shadow-violet-400/50 dark:hover:border-violet-400/35',
    badge:                  'bg-violet-100 border border-violet-200 text-violet-700 dark:bg-violet-500/25 dark:border-violet-300/30 dark:text-violet-100',
    Icon: CodingIcon,
  },
  'Science': {
    gradient:               'from-slate-800 via-sky-900 to-cyan-900',
    lightGradient:          'from-white to-sky-50',
    accentBar:              'bg-sky-500',
    illustrationColor:      'text-sky-500',
    darkIllustrationColor:  'dark:text-sky-300',
    cardHover:              'hover:shadow-sky-200 hover:border-sky-300 dark:hover:shadow-sky-400/50 dark:hover:border-sky-400/35',
    badge:                  'bg-sky-100 border border-sky-200 text-sky-700 dark:bg-sky-500/25 dark:border-sky-300/30 dark:text-sky-100',
    Icon: ScienceIcon,
  },
  'History': {
    gradient:               'from-stone-800 via-amber-900 to-yellow-900',
    lightGradient:          'from-white to-amber-50',
    accentBar:              'bg-amber-500',
    illustrationColor:      'text-amber-600',
    darkIllustrationColor:  'dark:text-amber-300',
    cardHover:              'hover:shadow-amber-200 hover:border-amber-300 dark:hover:shadow-amber-400/50 dark:hover:border-amber-400/35',
    badge:                  'bg-amber-100 border border-amber-200 text-amber-700 dark:bg-amber-500/25 dark:border-amber-300/30 dark:text-amber-100',
    Icon: HistoryIcon,
  },
  'Geography': {
    gradient:               'from-slate-800 via-teal-900 to-emerald-900',
    lightGradient:          'from-white to-teal-50',
    accentBar:              'bg-teal-500',
    illustrationColor:      'text-teal-500',
    darkIllustrationColor:  'dark:text-teal-300',
    cardHover:              'hover:shadow-teal-200 hover:border-teal-300 dark:hover:shadow-teal-400/50 dark:hover:border-teal-400/35',
    badge:                  'bg-teal-100 border border-teal-200 text-teal-700 dark:bg-teal-500/25 dark:border-teal-300/30 dark:text-teal-100',
    Icon: GeographyIcon,
  },
  'Nature': {
    gradient:               'from-slate-800 via-green-900 to-emerald-900',
    lightGradient:          'from-white to-green-50',
    accentBar:              'bg-green-500',
    illustrationColor:      'text-green-600',
    darkIllustrationColor:  'dark:text-green-300',
    cardHover:              'hover:shadow-green-200 hover:border-green-300 dark:hover:shadow-green-400/50 dark:hover:border-green-400/35',
    badge:                  'bg-green-100 border border-green-200 text-green-700 dark:bg-green-500/25 dark:border-green-300/30 dark:text-green-100',
    Icon: NatureIcon,
  },
  'Sports': {
    gradient:               'from-slate-800 via-orange-900 to-red-900',
    lightGradient:          'from-white to-orange-50',
    accentBar:              'bg-orange-500',
    illustrationColor:      'text-orange-500',
    darkIllustrationColor:  'dark:text-orange-300',
    cardHover:              'hover:shadow-orange-200 hover:border-orange-300 dark:hover:shadow-orange-400/50 dark:hover:border-orange-400/35',
    badge:                  'bg-orange-100 border border-orange-200 text-orange-700 dark:bg-orange-500/25 dark:border-orange-300/30 dark:text-orange-100',
    Icon: SportsIcon,
  },
  'Entertainment': {
    gradient:               'from-slate-800 via-fuchsia-900 to-purple-900',
    lightGradient:          'from-white to-fuchsia-50',
    accentBar:              'bg-fuchsia-500',
    illustrationColor:      'text-fuchsia-500',
    darkIllustrationColor:  'dark:text-fuchsia-300',
    cardHover:              'hover:shadow-fuchsia-200 hover:border-fuchsia-300 dark:hover:shadow-fuchsia-400/50 dark:hover:border-fuchsia-400/35',
    badge:                  'bg-fuchsia-100 border border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-500/25 dark:border-fuchsia-300/30 dark:text-fuchsia-100',
    Icon: EntertainmentIcon,
  },
  'Business & Finance': {
    gradient:               'from-stone-800 via-yellow-900 to-amber-800',
    lightGradient:          'from-white to-yellow-50',
    accentBar:              'bg-yellow-500',
    illustrationColor:      'text-yellow-600',
    darkIllustrationColor:  'dark:text-yellow-300',
    cardHover:              'hover:shadow-yellow-200 hover:border-yellow-300 dark:hover:shadow-yellow-400/50 dark:hover:border-yellow-400/35',
    badge:                  'bg-yellow-100 border border-yellow-200 text-yellow-700 dark:bg-yellow-500/25 dark:border-yellow-300/30 dark:text-yellow-100',
    Icon: BusinessIcon,
  },
  'Language & Literature': {
    gradient:               'from-slate-800 via-rose-900 to-pink-900',
    lightGradient:          'from-white to-rose-50',
    accentBar:              'bg-rose-500',
    illustrationColor:      'text-rose-500',
    darkIllustrationColor:  'dark:text-rose-300',
    cardHover:              'hover:shadow-rose-200 hover:border-rose-300 dark:hover:shadow-rose-400/50 dark:hover:border-rose-400/35',
    badge:                  'bg-rose-100 border border-rose-200 text-rose-700 dark:bg-rose-500/25 dark:border-rose-300/30 dark:text-rose-100',
    Icon: LiteratureIcon,
  },
  'General Knowledge': {
    gradient:               'from-slate-800 via-indigo-900 to-purple-900',
    lightGradient:          'from-white to-indigo-50',
    accentBar:              'bg-indigo-500',
    illustrationColor:      'text-indigo-500',
    darkIllustrationColor:  'dark:text-indigo-300',
    cardHover:              'hover:shadow-indigo-200 hover:border-indigo-300 dark:hover:shadow-indigo-400/50 dark:hover:border-indigo-400/35',
    badge:                  'bg-indigo-100 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/25 dark:border-indigo-300/30 dark:text-indigo-100',
    Icon: GeneralKnowledgeIcon,
  },
  'Other': {
    gradient:               'from-slate-800 to-zinc-800',
    lightGradient:          'from-white to-slate-50',
    accentBar:              'bg-slate-400',
    illustrationColor:      'text-slate-400',
    darkIllustrationColor:  'dark:text-slate-300',
    cardHover:              'hover:shadow-slate-200 hover:border-slate-300 dark:hover:shadow-slate-400/40 dark:hover:border-slate-400/30',
    badge:                  'bg-slate-100 border border-slate-200 text-slate-600 dark:bg-slate-500/25 dark:border-slate-300/30 dark:text-slate-200',
    Icon: OtherIcon,
  },
};

export const getCategoryTheme = (category) =>
  CATEGORY_THEMES[category] ?? CATEGORY_THEMES['General Knowledge'];
