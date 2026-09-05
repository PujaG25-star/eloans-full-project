import React from 'react';
import {t} from './i18n';
import {useLocation} from 'react-router-dom';
import {infoPages} from './catalog';

/* ------------------------------------------------------------------
   Page metadata + a crash guard.
   Neither changes how anything looks; the boundary only ever renders
   when a page would otherwise have shown a blank screen.
------------------------------------------------------------------ */

const SITE='eLoans';
/* longest matching prefix wins, so /loans/personal inherits the loans entry */
const meta:[string,string,string][]=[
  ['/loans','Loan Products — every loan type explained','Personal, business, property, vehicle, home, gold, securities and education loans — what each one is, who it suits, eligibility, documents, fees and repayment.'],
  ['/banks','Partner Banks & Lenders','Browse the RBI-registered banks and NBFCs we work with, their starting rates, processing fees and approval speed.'],
  ['/compare','Compare Loan Rates Side by Side','Sort every partner lender by interest rate, processing fee or customer rating to find the cheapest total cost, not just the lowest headline rate.'],
  ['/insurance','Insurance — life, health, term and more','Compare cover from partner insurers. Premiums are priced separately from your loan, never bundled in.'],
  ['/calculator','Financial Calculators — EMI, eligibility, SIP, FD','Eighteen calculators covering loan EMI, eligibility, prepayment, SIP, NPS, fixed deposit and GST, with full amortisation schedules.'],
  ['/share-market','Share Market — broking, mutual funds and LAS','Demat and trading accounts, direct mutual funds, IPO access and loans against securities through SEBI-registered partners.'],
  ['/global-business','Global Business — NRI loans and trade finance','NRI home loans, trade finance, export credit and cross-border payments across more than forty markets.'],
  ['/about','About eLoans','An independent loan marketplace. We are paid by lenders only after disbursal, so we have no reason to steer you toward a worse rate.'],
  ['/services','Our Services','Loan advisory, rate negotiation, balance transfer, insurance, credit health and business finance.'],
  ['/contact','Contact a Loan Advisor','Tell us what you are financing and an advisor will come back within one working day with the lenders worth your time.'],
  ['/apply','Apply for a Loan','A secure, guided application. One submission, matched against every partner lender whose policy fits your profile.'],
  ['/eligibility','Check Your Loan Eligibility','A soft check that estimates how much you could borrow. No impact on your credit score.'],
  ['/applications','My Applications','Track the status of every application, from submission through to disbursal.'],
  ['/my-loans','My Loans','Your active loans, outstanding balances and repayment progress in one place.'],
  ['/payments','EMI Payments','Upcoming instalments, payment history and downloadable receipts.'],
  ['/credit-score','Credit Score','Track your score, see what is helping and hurting it, and how lenders read your profile.'],
  ['/documents','Documents','Upload and manage the KYC and income documents your lender needs.'],
  ['/offers','Offers','Pre-approved offers and limited-time rates matched to your profile.'],
  ['/support','Support','Reach our team by phone, email or ticket, and track anything already open.'],
  ['/glossary','Glossary of Lending Terms','Plain-English definitions of FOIR, LTV, EBLR, foreclosure, moratorium and every other term that appears on a sanction letter.'],
  ['/offices','Our Offices','Where to find us across Bengaluru, Mumbai, Delhi NCR and Hyderabad.'],
  ['/profile','Profile & Security','Manage your personal information, password, two-factor authentication and login activity.'],
];

const setTag=(name:string,content:string)=>{
  let el=document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if(!el){el=document.createElement('meta');el.name=name;document.head.appendChild(el)}
  el.content=content;
};

export function usePageMeta(){
  const {pathname}=useLocation();
  React.useEffect(()=>{
    /* an authored content page describes itself */
    const info=infoPages.find(p=>'/'+p.id===pathname);
    const hit=info?[pathname,info.title,info.sub] as [string,string,string]
      :meta.filter(([p])=>pathname===p||pathname.startsWith(p+'/'))
           .sort((a,b)=>b[0].length-a[0].length)[0];
    const title=hit?`${hit[1]} | ${SITE}`:`${SITE} — Smart Loans Made Simple`;
    const desc=hit?hit[2]:'Compare loan offers from 50+ banks and NBFCs in one place. One application, no impact on your credit score, and a rate you would not get walking into a branch.';
    document.title=title;
    setTag('description',desc);
  },[pathname]);
}

/* A thrown render error would otherwise leave a blank page with nothing to
   click. This keeps the shell intact and offers a way out. */
type BState={error:Error|null};
export class ErrorBoundary extends React.Component<{children:React.ReactNode;onReset?:()=>void},BState>{
  state:BState={error:null};
  static getDerivedStateFromError(error:Error){return {error}}
  componentDidCatch(error:Error,info:React.ErrorInfo){
    console.error('Page failed to render:',error,info.componentStack);
  }
  componentDidUpdate(prev:{children:React.ReactNode}){
    /* navigating away from a broken page should clear the error */
    if(this.state.error&&prev.children!==this.props.children)this.setState({error:null});
  }
  render(){
    if(!this.state.error) return this.props.children;
    return <div className="mx-auto max-w-[560px] px-5 py-20 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--warn-soft)] text-[var(--warn)]">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
        </svg>
      </div>
      <h1 className="mt-5 text-[24px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('This page ran into a problem')}</h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--muted)]">
        {t('Nothing you entered was sent anywhere. Reload the page, or head back and try again.')}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button onClick={()=>window.location.reload()}
          className="rounded-[10px] bg-[var(--accent)] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[var(--accent-hover)]">{t('Reload the page')}</button>
        <button onClick={()=>{this.setState({error:null});window.location.href='/'}}
          className="rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-[14px] font-semibold text-[var(--ink)] transition hover:border-[var(--accent)]">{t('Back to home')}</button>
      </div>
    </div>;
  }
}
