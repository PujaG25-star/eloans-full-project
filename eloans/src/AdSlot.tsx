import {useEffect,useRef,useState} from 'react';
import {t} from './i18n';

/* Google AdSense display unit.
 *
 * Configure via .env (see .env.example):
 *   VITE_ADSENSE_CLIENT=ca-pub-0000000000000000
 *   VITE_ADSENSE_SLOT=0000000000
 *
 * With no client configured the component renders a labelled placeholder
 * instead, so the layout is correct in development and the build never
 * ships a broken <ins> tag. */

const CLIENT=(import.meta.env.VITE_ADSENSE_CLIENT||'').trim();
const SLOT=(import.meta.env.VITE_ADSENSE_SLOT||'').trim();

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

/* Inject the AdSense loader once per page, not once per slot. */
let loaderState:'idle'|'loading'|'ready'='idle';
function loadAdSense(client:string){
  if(loaderState!=='idle') return;
  loaderState='loading';
  const s=document.createElement('script');
  s.async=true;
  s.crossOrigin='anonymous';
  s.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  s.onload=()=>{loaderState='ready'};
  s.onerror=()=>{loaderState='idle'};   // allow a retry on the next mount
  document.head.appendChild(s);
}

export function AdSlot({slot=SLOT,format='auto',minHeight=250,className=''}:{
  slot?:string; format?:string; minHeight?:number; className?:string;
}){
  const ins=useRef<HTMLModElement|null>(null);
  const pushed=useRef(false);           // StrictMode double-invokes effects
  const [failed,setFailed]=useState(false);
  const live=Boolean(CLIENT&&slot);

  useEffect(()=>{
    if(!live||pushed.current) return;
    const el=ins.current;
    if(!el) return;
    // An <ins> that already carries a rendered ad must never be pushed again.
    if(el.getAttribute('data-adsbygoogle-status')) {pushed.current=true; return;}
    loadAdSense(CLIENT);
    try{
      (window.adsbygoogle=window.adsbygoogle||[]).push({});
      pushed.current=true;
    }catch{
      setFailed(true);
    }
  },[live,slot]);

  return <div className={`rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-4 ${className}`}>
    {/* Required by AdSense policy, and it keeps paid placements visually
        distinct from our own rate comparisons. */}
    <div className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted-2)]">
      {t('Advertisement')}
    </div>

    {live&&!failed
      ? <ins
          ref={ins}
          className="adsbygoogle block"
          style={{display:'block',minHeight}}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      : <div
          style={{minHeight}}
          className="grid place-items-center rounded-[10px] border border-dashed border-[var(--border-2)] bg-[var(--card-2)] px-4 text-center">
          <div>
            <div className="text-[12.5px] font-semibold text-[var(--ink-2)]">{t('Ad slot')}</div>
            <div className="mt-1 text-[11px] leading-relaxed text-[var(--muted-2)]">
              {t('Set VITE_ADSENSE_CLIENT and VITE_ADSENSE_SLOT to serve live ads here.')}
            </div>
          </div>
        </div>}
  </div>;
}
