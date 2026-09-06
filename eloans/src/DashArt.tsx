import {t} from './i18n';
/* Illustrations and gauges for the dashboard, drawn inline so they scale
   cleanly at any breakpoint and inherit the theme without extra requests. */

/* ---------- gauges ---------- */

/* Small credit-score dial used inside the stat row. */
export function ScoreDial({value,min=300,max=900,size=44}:{value:number;min?:number;max?:number;size?:number}){
  const pct=Math.min(Math.max((value-min)/(max-min),0),1);
  const r=16, cx=20, cy=20;
  const len=Math.PI*r;                       // half-circumference
  const arc=(from:number,to:number,color:string)=>(
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
      strokeDasharray={`${len*(to-from)} ${len*4}`} strokeDashoffset={-len*from}
      transform={`rotate(180 ${cx} ${cy})`}/>
  );
  const angle=180*pct;
  return <svg viewBox="0 0 40 26" width={size} height={size*26/40} aria-label={`Score ${value}`} role="img">
    {arc(0,.34,'var(--danger)')}{arc(.35,.67,'var(--warn-bright)')}{arc(.68,1,'var(--ok-bright)')}
    <g transform={`rotate(${angle-90} ${cx} ${cy})`}>
      <line x1={cx} y1={cy} x2={cx} y2={cy-12} stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"/>
    </g>
    <circle cx={cx} cy={cy} r="2.6" fill="var(--ink)"/>
  </svg>;
}

/* Large half-ring. Currently unused — kept for reuse. */
export function SemiGauge({value,label,size=150}:{value:number;label:string;size?:number}){
  const r=52, cx=60, cy=60, len=Math.PI*r;
  const pct=Math.min(Math.max(value/100,0),1);
  return <div className="relative" style={{width:size,height:size*0.64}}>
    <svg viewBox="0 0 120 68" width={size} height={size*0.64} role="img" aria-label={`${t(label)} ${value}%`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="11" strokeLinecap="round"
        strokeDasharray={`${len} ${len*3}`} transform={`rotate(180 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ok-bright)" strokeWidth="11" strokeLinecap="round"
        strokeDasharray={`${len*pct} ${len*3}`} transform={`rotate(180 ${cx} ${cy})`}/>
    </svg>
    <div className="absolute inset-x-0 bottom-0 text-center">
      <div className="text-[26px] font-black leading-none tracking-[-.02em] text-[var(--ink-strong)]">{value}%</div>
      <div className="mt-1 text-[11px] text-[var(--muted-2)]">{t(label)}</div>
    </div>
  </div>;
}

/* ---------- illustrations ---------- */

/* Approved-loan phone beside a classical bank facade and rupee coins. */
export function HeroArt({className=''}:{className?:string}){
  return <svg viewBox="0 0 360 300" className={className} role="img" aria-label={t('Loan approved on a phone beside a bank')}>
    <defs>
      <linearGradient id="ha-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--accent-soft)"/><stop offset="1" stopColor="var(--art-2)"/>
      </linearGradient>
      <linearGradient id="ha-c" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--accent)"/><stop offset="1" stopColor="var(--hero-2)"/>
      </linearGradient>
    </defs>

    {/* bank facade */}
    <g transform="translate(214 96)">
      <rect x="4" y="34" width="118" height="76" rx="3" fill="url(#ha-b)"/>
      <path d="M63 0l70 34H-7z" fill="var(--art-1)"/>
      <rect x="-10" y="30" width="146" height="8" rx="3" fill="var(--art-2)"/>
      {[10,34,58,82,106].map(x=><rect key={x} x={x} y="44" width="11" height="56" rx="4" fill="var(--card)"/>)}
      <rect x="-12" y="104" width="150" height="11" rx="4" fill="var(--art-3)"/>
    </g>

    {/* rupee cubes */}
    <g>
      <rect x="150" y="196" width="52" height="52" rx="10" fill="url(#ha-c)"/>
      <text x="176" y="230" textAnchor="middle" fill="var(--accent-soft)" fontSize="26" fontWeight="800" fontFamily="Inter,system-ui,sans-serif">₹</text>
      <rect x="300" y="212" width="40" height="40" rx="9" fill="url(#ha-c)" opacity=".9"/>
      <text x="320" y="239" textAnchor="middle" fill="var(--accent-soft)" fontSize="20" fontWeight="800" fontFamily="Inter,system-ui,sans-serif">₹</text>
    </g>
    {/* coin stack */}
    <g fill="var(--art-3)">
      {[0,1,2,3].map(i=><ellipse key={i} cx="126" cy={244-i*11} rx="26" ry="8"/>)}
    </g>

    {/* phone */}
    <g transform="translate(60 26)">
      <rect x="0" y="0" width="150" height="248" rx="22" fill="var(--hero-1)" opacity=".55"/>
      <rect x="5" y="5" width="140" height="238" rx="18" fill="var(--card)"/>
      <rect x="58" y="13" width="34" height="5" rx="2.5" fill="var(--border)"/>
      <circle cx="75" cy="70" r="21" fill="var(--ok-soft)"/>
      <path d="M66 70l6.5 7L85 63" fill="none" stroke="var(--ok-bright)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="75" y="112" textAnchor="middle" fill="var(--ink-strong)" fontSize="13" fontWeight="800" fontFamily="Inter,system-ui,sans-serif">{t('Loan Approved')}</text>
      <text x="75" y="129" textAnchor="middle" fill="var(--muted-2)" fontSize="9.5" fontFamily="Inter,system-ui,sans-serif">{t('Congratulations!')}</text>
      <text x="75" y="163" textAnchor="middle" fill="var(--ink-strong)" fontSize="21" fontWeight="900" fontFamily="Inter,system-ui,sans-serif">₹8,50,000</text>
      <text x="75" y="178" textAnchor="middle" fill="var(--muted-2)" fontSize="9" fontFamily="Inter,system-ui,sans-serif">{t('Loan Amount')}</text>
      <rect x="26" y="196" width="98" height="26" rx="8" fill="var(--accent)"/>
      <text x="75" y="213" textAnchor="middle" fill="var(--card)" fontSize="10" fontWeight="700" fontFamily="Inter,system-ui,sans-serif">{t('View Details')}</text>
    </g>
  </svg>;
}

/* Clipboard with ticks, for the eligibility prompt. */
export function ClipboardArt({className=''}:{className?:string}){
  return <svg viewBox="0 0 120 120" className={className} role="img" aria-label={t('Eligibility checklist')}>
    <ellipse cx="60" cy="106" rx="40" ry="9" fill="var(--art-2)"/>
    <rect x="26" y="14" width="68" height="86" rx="9" fill="var(--card)" stroke="var(--art-3)" strokeWidth="2.5"/>
    <rect x="46" y="6" width="28" height="16" rx="5" fill="var(--accent)"/>
    {[38,56,74].map((y,i)=><g key={y}>
      <circle cx="42" cy={y} r="7" fill={i<2?'var(--ok-soft)':'var(--accent-soft)'}/>
      <path d={`M38.6 ${y}l2.6 2.8 4.6-5.2`} fill="none" stroke={i<2?'var(--ok-bright)':'var(--art-3)'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="55" y={y-4} width={i===2?22:30} height="7" rx="3.5" fill="var(--border)"/>
    </g>)}
    <rect x="34" y="88" width="30" height="7" rx="3.5" fill="var(--art-2)"/>
  </svg>;
}

/* Small bank facade used as a decorative anchor in the status card. */
export function BankArt({className=''}:{className?:string}){
  return <svg viewBox="0 0 110 90" className={className} role="img" aria-label={t('Bank')}>
    <ellipse cx="55" cy="82" rx="36" ry="7" fill="var(--art-1)"/>
    <path d="M55 8l44 22H11z" fill="var(--art-1)"/>
    <rect x="8" y="28" width="94" height="7" rx="3" fill="var(--art-2)"/>
    {[18,38,58,78].map(x=><rect key={x} x={x} y="38" width="12" height="34" rx="5" fill="var(--card)" stroke="var(--art-2)" strokeWidth="1.5"/>)}
    <rect x="6" y="72" width="98" height="9" rx="4" fill="var(--art-3)"/>
  </svg>;
}

/* Friendly bot for the sidebar assistant card. */
export function BotArt({className=''}:{className?:string}){
  return <svg viewBox="0 0 90 90" className={className} role="img" aria-label={t('AI assistant')}>
    <rect x="26" y="30" width="42" height="34" rx="11" fill="var(--accent-soft)"/>
    <circle cx="38" cy="45" r="4.6" fill="var(--accent)"/>
    <circle cx="56" cy="45" r="4.6" fill="var(--accent)"/>
    <rect x="40" y="54" width="14" height="3.6" rx="1.8" fill="var(--art-3)"/>
    <rect x="42" y="20" width="10" height="10" rx="5" fill="var(--on-hero-dim)"/>
    <rect x="45.6" y="12" width="2.8" height="9" rx="1.4" fill="var(--on-hero-dim)"/>
    <rect x="16" y="38" width="8" height="18" rx="4" fill="var(--art-2)"/>
    <rect x="70" y="38" width="8" height="18" rx="4" fill="var(--art-2)"/>
    <rect x="32" y="66" width="30" height="9" rx="4.5" fill="var(--art-2)"/>
  </svg>;
}
