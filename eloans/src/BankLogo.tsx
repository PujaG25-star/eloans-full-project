/* Partner-bank logos.

   Files live in src/assets/banks/<bank id>.<ext> and are picked up by the glob
   below, so adding a bank is: drop the image in, add the row in data.ts. The
   supplied artwork is wide, full-colour banner lockups rather than square
   marks, so the default box is a landscape strip with object-contain — that
   keeps each logo whole instead of cropping or squashing it.

   Any bank without an image falls back to an original geometric monogram. */

const files=import.meta.glob('./assets/banks/*.{png,jpg,jpeg,svg,webp}',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const logos:Record<string,string>=Object.fromEntries(
  Object.entries(files).map(([path,url])=>[path.split('/').pop()!.replace(/\.[^.]+$/,''),url])
);

type Glyph='blocks'|'ring'|'arc'|'chevron'|'diamond'|'mono';
type Brand={bg:string;fg:string;accent:string;glyph:Glyph};

const brands:Record<string,Brand>={
  hdfc :{bg:'#004C8F',fg:'#ffffff',accent:'#ED232A',glyph:'blocks'},
  sbi  :{bg:'#22409A',fg:'#ffffff',accent:'#8FC7F3',glyph:'ring'},
  icici:{bg:'#AE275F',fg:'#ffffff',accent:'#F58220',glyph:'arc'},
  axis :{bg:'#97144D',fg:'#ffffff',accent:'#E5B45C',glyph:'chevron'},
  kotak:{bg:'#003874',fg:'#ffffff',accent:'#ED1C24',glyph:'diamond'},
};
const fallback:Brand={bg:'#0f2f6e',fg:'#ffffff',accent:'#5ea2ff',glyph:'mono'};

function Mark({b,initials}:{b:Brand;initials:string}){
  switch(b.glyph){
    case 'blocks': return <>
      <rect x="9" y="9" width="10" height="10" rx="1.5" fill={b.fg}/>
      <rect x="21" y="9" width="10" height="10" rx="1.5" fill={b.accent}/>
      <rect x="9" y="21" width="22" height="10" rx="1.5" fill={b.fg} opacity=".85"/>
    </>;
    case 'ring': return <>
      <circle cx="20" cy="20" r="11" fill="none" stroke={b.fg} strokeWidth="4"/>
      <rect x="17" y="26" width="6" height="9" fill={b.bg}/>
      <rect x="18.5" y="9" width="3" height="9" rx="1.5" fill={b.accent}/>
    </>;
    case 'arc': return <>
      <path d="M10 30a14 14 0 0 1 20-14" fill="none" stroke={b.fg} strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="29" cy="28" r="4.5" fill={b.accent}/>
    </>;
    case 'chevron': return <>
      <path d="M11 25l9-10 9 10" fill="none" stroke={b.fg} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 31l6-6 6 6" fill="none" stroke={b.accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </>;
    case 'diamond': return <>
      <path d="M20 8l12 12-12 12z" fill={b.accent}/>
      <path d="M20 8L8 20l12 12z" fill={b.fg}/>
    </>;
    default: return <text x="20" y="25" textAnchor="middle" fill={b.fg} fontSize="12" fontWeight="900" fontFamily="Inter,system-ui,sans-serif">{initials.slice(0,4)}</text>;
  }
}

export function BankLogo({id,name='',initials='',w=112,h=40,radius=8,className=''}:{id:string;name?:string;initials?:string;w?:number;h?:number;radius?:number;className?:string}){
  const src=logos[id];
  /* Rendered bare, at its own aspect ratio — no frame, border or backdrop.
     Height is fixed so a row of logos lines up; width follows the artwork and
     is only capped, so nothing is cropped, padded or letterboxed. */
  if(src) return <img src={src} alt={`${name||id} logo`} loading="lazy"
    className={`block shrink-0 object-contain object-left ${className}`}
    style={{height:h,width:'auto',maxWidth:w}}/>;

  const b=brands[id]??fallback;
  const side=Math.min(w,h);
  return <span className={`inline-grid shrink-0 place-items-center overflow-hidden ${className}`}
    style={{width:w,height:h,borderRadius:radius,background:b.bg,boxShadow:'inset 0 0 0 1px rgba(255,255,255,.12)'}}>
    <svg viewBox="0 0 40 40" width={side} height={side} role="img" aria-label={`${name||id} logo`}>
      <Mark b={b} initials={initials}/>
    </svg>
  </span>;
}
