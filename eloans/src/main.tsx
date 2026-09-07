import React,{useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Navigate,useLocation,useNavigate,Routes,Route,Link} from 'react-router-dom';
import * as Icons from 'lucide-react';
import {AreaChart,Area,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,BarChart,Bar} from 'recharts';
import './index.css';

import {loans,banks,insurance} from './catalog';
import {products,families} from './catalog';
import {BankLogo} from './BankLogo';
import {ScoreDial,HeroArt,ClipboardArt,BankArt,BotArt} from './DashArt';
import {applyStoredTheme,useTheme,accents} from './theme';
import {AdSlot} from './AdSlot';
import {applyStoredLang,useLang,languages,t,tf,td} from './i18n';
import {usePageMeta,ErrorBoundary} from './meta';
import {infoPages} from './catalog';
import type {Loan,Bank} from './data';
import {InfoPageView,LoansIndex,LoanProduct,BanksPage,ComparePage,InsurancePage,CalculatorPage,
  AboutPage,ServicesPage,ContactPage,ShareMarketPage,GlobalBusinessPage,NotFound as SiteNotFound} from './site';
const offers=[{title:'Pre-approved Personal Loan',amount:'₹5,00,000',rate:'9.25%',tag:'Pre-approved'},{title:'Top-up Loan',amount:'₹2,50,000',rate:'10.10%',tag:'Recommended'},{title:'Balance Transfer',amount:'Save up to ₹45,000',rate:'9.40%',tag:'Limited Time'}];
const payments=[{date:'10 Aug 2026',amount:'₹15,600',loan:'Personal Loan',method:'UPI',status:'Paid'},{date:'10 Jul 2026',amount:'₹15,600',loan:'Personal Loan',method:'Net Banking',status:'Paid'},{date:'10 Jun 2026',amount:'₹15,600',loan:'Personal Loan',method:'UPI',status:'Paid'}];
const menu:[string,string,string][]=[['Home','/','LayoutGrid'],['Loan','/loans','Banknote'],['Banks & Rates','/banks','Landmark'],['Insurance','/insurance','ShieldCheck'],['Calculator','/calculator','Calculator'],['Investments','/share-market','LineChart'],['Cards & Payments','/cards/credit-cards','CreditCard'],['Credit & Tools','/credit/score','Gauge'],['Global Business','/global-business','Globe'],['Resources','/glossary','BookOpen'],['About','/about','Info'],['Services','/services','Sparkles'],['Contact','/contact','Mail']];
/* one nav item can own more than one route */
const alsoActive:Record<string,string[]>={'/banks':['/compare','/rates'],'/share-market':['/investments'],'/cards/credit-cards':['/cards'],'/credit/score':['/credit'],'/glossary':['/resources'],'/global-business':['/global'],'/services':['/support'],'/about':['/about/']};
const notices:[string,string,string,string][]=[['Loan application approved','Your personal loan of ₹8,50,000 has been approved.','2 hours ago','/applications'],['EMI due soon','Your EMI of ₹12,450 is due on 05 May 2025.','1 day ago','/payments'],['Document verification required','Please upload your latest salary slip.','3 days ago','/documents']];
const trust:[string,string,string][]=[['Landmark','50+ Banks & NBFCs','Wide network of trusted partners'],['ShieldCheck','100% Secure','Bank-level data security'],['Zap','Quick Process','Approval in just 24-48 hours'],['Headphones','Dedicated Support',"We're here to help you"]];

function Icon({name,size=19,className}:{name:keyof typeof Icons,size?:number,className?:string}){const C=Icons[name] as React.ComponentType<{size?:number;className?:string}>|undefined;return C?<C size={size} className={className}/>:<Icons.Circle size={size} className={className}/>}

/* old /app/... URLs keep working */
function LegacyRedirect(){const {pathname}=useLocation();return <Navigate to={pathname.replace(/^\/app/,'')||'/'} replace/>}

function App(){return <BrowserRouter><Routes><Route path="/app/*" element={<LegacyRedirect/>}/><Route path="/*" element={<Shell/>}/></Routes></BrowserRouter>}

/* Closes any open popover when you click outside of it or press Escape. */
function useDismiss(close:()=>void){
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};
    const onDown=(e:MouseEvent)=>{const t=e.target;if(!(t instanceof Element)||!t.closest('[data-pop]'))close()};
    document.addEventListener('keydown',onKey);document.addEventListener('mousedown',onDown);
    return ()=>{document.removeEventListener('keydown',onKey);document.removeEventListener('mousedown',onDown)};
  },[close]);
}

/* Expandable sidebar submenus. Keyed by the parent's route so renaming or
   translating a label cannot break them. */
const subMenus:Record<string,[string,string][]>={
  '/banks':[['Compare Loan Rates','/compare'],['Best Interest Rates','/rates/best'],['Bank-wise Offers','/banks'],['Rate Alerts','/rates/alerts'],['Track Interest Rates','/rates/track'],['Lowest Rate Finder','/rates/lowest'],['Pre-approved Offers','/rates/pre-approved']],
  '/insurance':[['Health Insurance','/insurance/health'],['Life Insurance','/insurance/life'],['Vehicle Insurance','/insurance/vehicle'],['Loan Protection','/insurance/loan-protection'],['Travel Insurance','/insurance/travel'],['Buy / Renew Online','/insurance/buy-renew']],
  '/calculator':[['EMI Calculator','/calculator'],['Eligibility Calculator','/eligibility'],['Prepayment Calculator','/calculator'],['SIP Calculator','/calculator'],['All calculators','/calculator']],
  '/share-market':[['Live Market','/investments/live-market'],['Mutual Funds','/investments/mutual-funds'],['Digital Gold','/investments/digital-gold'],['Stocks & Trading','/investments/stocks'],['Fixed Deposits','/investments/fixed-deposits'],['Portfolio Tracker','/investments/portfolio']],
  '/cards/credit-cards':[['Credit Cards','/cards/credit-cards'],['EMI / Shopping Card','/cards/emi-card'],['UPI Payments','/cards/upi'],['Bills & Recharges','/cards/bills']],
  '/credit/score':[['Free Credit Score','/credit-score'],['What a Credit Score Is','/credit/score'],['Detailed Credit Report','/credit/report'],['Credit Improvement Tips','/credit/improve'],['Credit Bureaus','/credit/bureaus']],
  '/global-business':[['Cross-border Payments','/global/cross-border-payments'],['International Business Loans','/global/business-loans'],['Export / Import Finance','/global/trade-finance'],['Forex Services','/global/forex'],['Overseas Education Loan','/global/overseas-education']],
  '/glossary':[['Financial Glossary','/glossary'],['Loan Guides','/resources/loan-guides'],['Investment Guides','/resources/investment-guides'],['Credit Guides','/resources/credit-guides'],['FAQs','/resources/faqs'],['Help Centre','/support']],
  '/about':[['Our Story','/about/story'],['Leadership Team','/about/leadership'],['Our Partners','/about/partners'],['Careers','/about/careers'],['Media & Press','/about/media'],['Investor Relations','/about/investors']],
  '/services':[['Refer & Earn','/support/refer'],['Customer Support','/support'],['Grievance Redressal','/support/grievance'],['Account Management','/support/account'],['Mobile Access','/support/app']],
  '/contact':[['Contact Form','/contact'],['Office Locator','/offices'],['Partner With Us','/contact/partner']],
};

function SideLink({label,path,ic,active,badge,onNav}:{label:string;path:string;ic:string;active:boolean;badge?:string;onNav:()=>void}){
  const {t}=useLang();
  return <Link to={path} onClick={onNav} className={`flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-semibold ${active?'bg-[var(--accent)] text-white shadow-[0_7px_17px_rgba(18,99,233,.22)]':'text-[var(--ink-2)] transition-colors duration-100 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]'}`}>
    <Icon name={ic as keyof typeof Icons} size={18}/><span className="flex-1">{t(label)}</span>
    {badge&&<span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active?'bg-[var(--card)]/20 text-white':'bg-[var(--accent-soft)] text-[var(--accent-ink)]'}`}>{t(badge)}</span>}
  </Link>;
}

const footerCols:[string,[string,string][]][]=[
  ['Loans',[['Personal Loan','/loans/personal'],['Business Loan','/loans/business'],['Home Loan','/loans/home'],['Vehicle Loan','/loans/vehicle'],['Gold Loan','/loans/gold'],['Loan Against Property','/loans/mortgage'],['Loan Against Securities','/loans/las']]],
  ['Insurance',[['Health Insurance','/insurance/health'],['Life Insurance','/insurance/life'],['Vehicle Insurance','/insurance/vehicle'],['Travel Insurance','/insurance/travel'],['All insurance','/insurance']]],
  ['Investments',[['Mutual Funds','/investments/mutual-funds'],['Digital Gold','/investments/digital-gold'],['Stocks','/investments/stocks'],['Fixed Deposits','/investments/fixed-deposits'],['Live Market','/investments/live-market']]],
  ['Tools',[['EMI Calculator','/calculator'],['Eligibility Calculator','/eligibility'],['Prepayment Calculator','/calculator'],['SIP Calculator','/calculator'],['Credit Score','/credit-score']]],
  ['Resources',[['Loan Guides','/resources/loan-guides'],['Investment Guides','/resources/investment-guides'],['Credit Guides','/resources/credit-guides'],['Financial Glossary','/glossary'],['Help Centre','/support']]],
  ['Company',[['About Us','/about'],['Careers','/about/careers'],['Media','/about/media'],['Partners','/about/partners'],['Contact','/contact']]],
  ['Support',[['Customer Support','/support'],['Grievance Redressal','/support/grievance'],['Account Management','/support/account'],['Refer a Friend','/support/refer'],['Mobile Access','/support/app']]],
];

function DashFooter(){
  const {lang,setLang,t}=useLang();
  return <footer className="mt-5 overflow-hidden rounded-[14px] bg-[var(--footer-bg)] text-[var(--footer-ink)]">
    <div className="grid gap-8 px-6 py-9 sm:px-8 lg:grid-cols-3 xl:grid-cols-[1.4fr_repeat(4,1fr)]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent)] text-[17px] font-black text-white">e</span>
          <span className="flex flex-col leading-none">
            <span className="text-[18px] font-extrabold tracking-[-.01em] text-white">{t('ELOANSS')}</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[.18em] text-[var(--footer-ink)]">{t('Finance smarter')}</span>
          </span>
        </div>
        <p className="mt-4 max-w-[290px] text-[13px] leading-relaxed">
          {t("India's loan marketplace. Compare offers from 50+ banks and NBFCs, apply once, and track everything in one place.")}
        </p>
        <div className="mt-5 space-y-2 text-[12.5px]">
          <div className="flex items-center gap-2.5"><Icons.Phone size={14} className="shrink-0 text-[var(--on-hero-dim)]"/>{t('1800 200 4747 (toll free)')}</div>
          <div className="flex items-center gap-2.5"><Icons.Mail size={14} className="shrink-0 text-[var(--on-hero-dim)]"/>{t('hello@eloans.in')}</div>
          <div className="flex items-start gap-2.5"><Icons.MapPin size={14} className="mt-0.5 shrink-0 text-[var(--on-hero-dim)]"/>{t('Prestige Tech Park, Outer Ring Road, Bengaluru 560103')}</div>
        </div>
      </div>
      {footerCols.map(([title,links])=>(
        <div key={title}>
          <div className="mb-3.5 text-[11.5px] font-bold uppercase tracking-[.14em] text-white">{t(title)}</div>
          <div className="space-y-2">
            {links.map(([label,to])=><Link key={label} to={to} className="block text-[13px] transition hover:text-white">{t(label)}</Link>)}
          </div>
        </div>
      ))}
    </div>
    <div className="border-t border-white/10 px-6 py-4 sm:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-2.5 border-b border-white/10 pb-4">
        <Icons.Languages size={16} className="shrink-0 opacity-80"/>
        <label htmlFor="site-language" className="text-[12.5px] font-semibold">{t('Language')}</label>
        <select id="site-language" value={lang} onChange={e=>setLang(e.target.value as typeof lang)}
          className="rounded-[9px] border border-white/20 bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-white outline-none focus:border-white/50">
          {languages.map(([code,native,english])=>(
            <option key={code} value={code} style={{color:'var(--ink)',background:'var(--card)'}}>{t(native)}{native!==english?` · ${english}`:''}</option>
          ))}
        </select>
        <span className="text-[11.5px] opacity-70">{t('Interface language. Page content stays in English for now.')}</span>
      </div>
      <div className="flex flex-col gap-3 text-[12px] sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} {t('eLoans Financial Services Pvt Ltd.')} {t('All rights reserved.')}</div>
        <div className="flex flex-wrap gap-5">
          <Link to="/support" className="hover:text-white">{t('Privacy policy')}</Link>
          <Link to="/support" className="hover:text-white">{t('Terms of use')}</Link>
          <Link to="/support" className="hover:text-white">{t('Grievance redressal')}</Link>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 bg-[var(--footer-deep)] px-6 pt-4 pb-[calc(1rem+var(--assistant-space,0px))] text-[11px] leading-relaxed text-[var(--footer-ink)] sm:px-8">
      {t('eLoans is a loan aggregator and does not lend on its own account. All loans are sanctioned and disbursed by our RBI-registered partner banks and NBFCs, at their sole discretion and subject to their credit policy. Interest rates shown are indicative starting rates and vary by applicant profile, tenure and lender. Please read all offer documents carefully before borrowing.')}
    </div>
  </footer>;
}

/* Floating assistant prompt, pinned to the lower-right corner.
   Dismissing it is remembered per browser, so it does not nag on every visit;
   a small robot bubble stays behind as the way back in. */
const PROMO_KEY='eloans.assistantPromo.dismissed';
const readDismissed=()=>{try{return localStorage.getItem(PROMO_KEY)==='1'}catch{return false}};
const writeDismissed=(v:boolean)=>{try{v?localStorage.setItem(PROMO_KEY,'1'):localStorage.removeItem(PROMO_KEY)}catch{/* private mode */}};

function AssistantPromo({onStart}:{onStart:()=>void}){
  const [dismissed,setDismissed]=useState(readDismissed);
  const box=useRef<HTMLElement|null>(null);
  const close=()=>{setDismissed(true);writeDismissed(true)};

  /* Publish the room this widget takes in the bottom-right corner so the footer
     can pad itself clear of it; at full scroll it otherwise covers the copyright
     and disclaimer lines. The value is left in place on unmount so opening the
     full assistant does not shift the page. */
  useEffect(()=>{
    const el=box.current;
    if(!el) return;
    const publish=()=>document.documentElement.style.setProperty('--assistant-space',`${Math.ceil(el.getBoundingClientRect().height)+20}px`);
    publish();
    const ro=new ResizeObserver(publish);
    ro.observe(el);
    return()=>ro.disconnect();
  },[dismissed]);

  if(dismissed) return <button ref={el=>{box.current=el}} onClick={()=>{setDismissed(false);writeDismissed(false)}}
    aria-label={t('Show AI Loan Assistant')}
    className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-[var(--panel-navy)] shadow-[0_14px_34px_rgba(4,16,42,.34)] transition hover:bg-[var(--panel-navy)]">
    <BotArt className="w-9"/>
  </button>;

  return <div ref={el=>{box.current=el}} role="complementary" aria-label={t('AI Loan Assistant')}
    className="promo-in fixed bottom-5 right-5 z-[60] w-[280px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[14px] bg-[var(--panel-navy)] p-5 text-white shadow-[0_18px_44px_rgba(4,16,42,.38)]">
    <button onClick={close} aria-label={t('Dismiss AI Loan Assistant')}
      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-[var(--on-hero-soft)] transition hover:bg-[var(--card)]/10 hover:text-white">
      <Icons.X size={15}/>
    </button>
    <BotArt className="pointer-events-none absolute -bottom-2 -right-3 w-[92px] opacity-95"/>
    <div className="relative max-w-[170px]">
      <div className="text-[16px] font-bold leading-tight">{t('AI Loan Assistant')}</div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--on-hero-soft)]">{t('Get personalized loan recommendations in seconds.')}</p>
      <button onClick={onStart} className="mt-4 rounded-[9px] bg-[var(--accent)] px-4 py-2.5 text-[13px] font-bold transition hover:bg-[var(--accent-hover)]">{t('Get Started')}</button>
    </div>
  </div>;
}

const swatch:Record<string,string>={blue:'#1263e9',green:'#0a8f4d',purple:'#7c3aed'};

function ThemePicker(){
  const {mode,accent,setAccent,toggleMode}=useTheme();
  const [open,setOpen]=useState(false);
  return <div className="relative" data-pop>
    <button onClick={()=>setOpen(v=>!v)} aria-label={t('Theme settings')} aria-expanded={open}
      className="grid h-10 w-10 place-items-center rounded-lg text-[var(--ink)] hover:bg-[var(--card-2)]">
      {mode==='dark'?<Icons.Moon size={18}/>:<Icons.Sun size={18}/>}
    </button>
    {open&&<div className="absolute right-0 top-[52px] z-50 w-[228px] rounded-[12px] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-pop)]">
      <div className="px-1 pb-2 text-[11px] font-bold uppercase tracking-[.14em] text-[var(--muted-2)]">{t('Appearance')}</div>
      <div className="grid grid-cols-2 gap-1.5">
        {([['light','Light','Sun'],['dark','Dark','Moon']] as [string,string,string][]).map(([m,label,ic])=>(
          <button key={m} onClick={()=>{if(m!==mode)toggleMode();setOpen(false)}}
            className={`flex items-center justify-center gap-2 rounded-[9px] px-2 py-2 text-[13px] font-semibold transition ${mode===m?'bg-[var(--accent)] text-white':'bg-[var(--card-2)] text-[var(--ink-2)] hover:bg-[var(--surface-3)]'}`}>
            <Icon name={ic as keyof typeof Icons} size={15}/>{t(label)}
          </button>
        ))}
      </div>
      <div className="mt-3 px-1 pb-2 text-[11px] font-bold uppercase tracking-[.14em] text-[var(--muted-2)]">{t('Accent')}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {accents.map(([a,label])=>(
          <button key={a} onClick={()=>{setAccent(a);setOpen(false)}} aria-label={tf('{label} theme',{label})} aria-pressed={accent===a}
            className={`flex flex-col items-center gap-1.5 rounded-[9px] px-1 py-2 transition ${accent===a?'bg-[var(--card-2)] ring-2 ring-[var(--accent-ring)]':'hover:bg-[var(--card-2)]'}`}>
            <span className="h-5 w-5 rounded-full" style={{background:swatch[a]}}/>
            <span className="text-[11px] font-semibold text-[var(--ink-2)]">{t(label)}</span>
          </button>
        ))}
      </div>
    </div>}
  </div>;
}

/* an authored insurance guide wins over the product detail page */
function InsuranceRoute(){const {pathname}=useLocation();
  return infoPages.some(p=>'/'+p.id===pathname)?<InfoPageView/>:<InsuranceDetails/>}

function Shell(){
  const loc=useLocation();
  const {t}=useLang();
  usePageMeta();
  const [mobile,setMobile]=useState(false);
  const [search,setSearch]=useState('');
  const [notify,setNotify]=useState(false);
  const [assistant,setAssistant]=useState(false);
  const [openMenu,setOpenMenu]=useState<string|null>(loc.pathname.startsWith('/loans')?'/loans':null);
  const [seen,setSeen]=useState(false);
  const closeAll=useCallback(()=>{setNotify(false);setSearch('')},[]);
  useDismiss(closeAll);
  useEffect(()=>{setMobile(false);closeAll()},[loc.pathname,closeAll]);
  // Land at the top of every new page. Without this you keep the previous
  // page's scroll offset and arrive mid-content, which reads as a dead click.
  // The browser's own scrollRestoration re-applies the old offset after we
  // reset it, so it has to be turned off for this to hold.
  useEffect(()=>{
    if('scrollRestoration' in history) history.scrollRestoration='manual';
  },[]);
  useLayoutEffect(()=>{
    if(loc.hash) return;
    window.scrollTo(0,0);
  },[loc.pathname,loc.hash]);

  const results=useMemo(()=>{
    const q=search.trim().toLowerCase();
    if(!q) return [];
    const pool:[string,string,string][]=[
      ...loans.map(l=>[l.name,'Loan product',`/app/loans/${l.id}`] as [string,string,string]),
      ...banks.map(b=>[b.name,'Partner bank',`/app/banks/${b.id}`] as [string,string,string]),
      ...insurance.map(x=>[x[1],'Insurance',`/app/insurance/${x[0]}`] as [string,string,string]),
      ['EMI Calculator','Tool','/calculator'],['Eligibility Check','Tool','/eligibility'],
      ['Compare Loans','Tool','/compare'],['My Applications','Account','/applications'],
      ['Credit Score','Account','/credit-score'],['Documents','Account','/documents'],['Offers','Account','/offers'],
    ];
    return pool.filter(x=>x[0].toLowerCase().includes(q)).slice(0,7);
  },[search]);

  const isActive=(p:string)=>p==='/'?loc.pathname==='/':loc.pathname.startsWith(p)||(alsoActive[p]||[]).some(x=>loc.pathname.startsWith(x));

  return <div className="dash min-h-screen bg-[var(--bg)] text-[var(--ink)]">
    {mobile&&<div onClick={()=>setMobile(false)} className="fixed inset-0 z-40 bg-[var(--footer-deep)]/45 lg:hidden"/>}

    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--border)] bg-[var(--card)] transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none lg:translate-x-0 ${mobile?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex h-[72px] shrink-0 items-center gap-3 px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--accent)] text-[18px] font-black text-white">e</span>
          <span className="flex flex-col leading-none">
            <span className="text-[19px] font-extrabold tracking-[-.01em] text-[var(--ink-strong)]">{t('ELOANSS')}</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[.18em] text-[var(--muted-2)]">{t('Finance smarter')}</span>
          </span>
        </Link>
        <button onClick={()=>setMobile(false)} aria-label={t('Close menu')} className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-[var(--ink-2)] lg:hidden"><Icons.X size={18}/></button>
      </div>

      <nav className="scrollbar flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        {menu.map(([label,path,ic])=>{
          const items=path==='/loans'?loans.slice(0,8).map(l=>[l.name,`/loans/${l.id}`] as [string,string]).concat([['View all loan products','/loans']]):subMenus[path];
          if(!items) return <SideLink key={path} label={label} path={path} ic={ic} active={isActive(path)} onNav={()=>setMobile(false)}/>;
          const open=openMenu===path;
          return <div key={path}>
            <div className={`flex items-center gap-3 rounded-[10px] pr-2 ${isActive(path)?'bg-[var(--accent)] text-white shadow-[0_7px_17px_rgba(18,99,233,.22)]':'text-[var(--ink-2)] transition-colors duration-100 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]'}`}>
              <Link to={path} onClick={()=>setMobile(false)} className="flex flex-1 items-center gap-3 py-2.5 pl-3.5 text-[14px] font-semibold"><Icon name={ic as keyof typeof Icons} size={18}/>{t(label)}</Link>
              <button onClick={()=>setOpenMenu(open?null:path)} aria-label={tf('Toggle {label}',{label})} aria-expanded={open} className="grid h-7 w-7 place-items-center rounded-md">
                <Icons.ChevronRight size={16} className={`transition-transform ${open?'rotate-90':''}`}/>
              </button>
            </div>
            {open&&<div className="ml-5 mt-1 space-y-0.5 border-l border-[var(--border)] pl-3">
              {items.map(([lb,href])=>(
                <Link key={lb+href} to={href} onClick={()=>setMobile(false)}
                  className={`block rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold ${loc.pathname===href?'bg-[var(--accent-soft)] text-[var(--accent-ink)]':'text-[var(--muted)] transition-colors duration-100 hover:bg-[var(--card-2)] hover:text-[var(--ink-2)]'}`}>{t(lb)}</Link>
              ))}
            </div>}
          </div>;
        })}
      </nav>

      <div className="shrink-0 px-4 pb-4">
        <div className="flex items-center gap-2.5 border-t border-[var(--border-2)] pt-4">
          <Icons.ShieldCheck size={18} className="text-[var(--accent-ink)]"/>
          <div><div className="text-[12.5px] font-bold text-[var(--ink)]">{t('100% Secure')}</div><div className="text-[11px] text-[var(--muted-2)]">{t('Your data is safe with us')}</div></div>
        </div>
      </div>
    </aside>

    <div className="lg:pl-[260px]">
      <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_95%,transparent)] px-4 backdrop-blur-xl sm:gap-4 sm:px-6">
        <button onClick={()=>setMobile(true)} aria-label={t('Open menu')} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[var(--ink)] hover:bg-[var(--card-2)] lg:hidden"><Icons.Menu size={20}/></button>

        <div className="relative min-w-0 flex-1 sm:max-w-[420px]" data-pop>
          <Icons.Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-2)]"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('Search for loans, banks, offers, calculators...')}
            className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-3 text-[13.5px] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent)]"/>
          {search.trim()&&<div className="absolute left-0 right-0 top-[52px] z-50 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_50px_rgba(17,42,84,.14)]">
            {results.length===0
              ? <div className="px-4 py-5 text-[13px] text-[var(--muted-2)]">{t('No matches for "')}{t(search)}".</div>
              : results.map(([label,kind,to])=>(
                  <Link key={to} to={to} onClick={()=>setSearch('')} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[var(--card-2)]">
                    <span className="truncate text-[13.5px] font-semibold text-[var(--ink)]">{t(label)}</span>
                    <span className="shrink-0 text-[11px] text-[var(--muted-2)]">{t(kind)}</span>
                  </Link>
                ))}
          </div>}
        </div>

        <Link to="/support" className="ml-auto hidden items-center gap-2 text-[13.5px] font-semibold text-[var(--ink-2)] hover:text-[var(--accent-ink)] md:flex">
          <Icons.Headphones size={18}/>{t('Need Help?')}
        </Link>

        <div className="ml-auto md:ml-0"><ThemePicker/></div>

        <div className="relative" data-pop>
          <button onClick={()=>{setNotify(v=>!v);setSeen(true)}} aria-label={t('Notifications')} className="relative grid h-10 w-10 place-items-center rounded-lg text-[var(--ink)] hover:bg-[var(--card-2)]">
            <Icons.Bell size={19}/>
            {!seen&&<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger)] ring-2 ring-white"/>}
          </button>
          {notify&&<div className="absolute right-0 top-[52px] z-50 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_50px_rgba(17,42,84,.14)]">
            <div className="border-b border-[var(--border-2)] px-4 py-3 text-[14px] font-bold">{t('Notifications')}</div>
            {notices.map(([ttl,b,when,to])=>(
              <Link key={ttl} to={to} onClick={()=>setNotify(false)} className="block border-b border-[var(--border-2)] px-4 py-3 last:border-0 hover:bg-[var(--card-2)]">
                <div className="text-[13.5px] font-bold text-[var(--ink)]">{t(ttl)}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted)]">{t(b)}</div>
                <div className="mt-1.5 text-[11px] text-[var(--muted-2)]">{t(when)}</div>
              </Link>
            ))}
          </div>}
        </div>

        <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-[10px] bg-[var(--accent)] px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-[var(--accent-hover)]">
          <Icons.Mail size={16}/><span className="hidden sm:inline">{t('Contact Us')}</span>
        </Link>
      </header>

      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-[9px] focus:bg-[var(--accent)] focus:px-4 focus:py-2.5 focus:text-[14px] focus:font-semibold focus:text-white">{t('Skip to main content')}</a>
      <main id="main" className="mx-auto max-w-[1560px] px-4 py-5 sm:px-6">
        <ErrorBoundary>
        <Routes><Route path="/" element={<Dashboard/>}/><Route path="/loans" element={<LoansIndex/>}/><Route path="/loans/:id" element={<LoanProduct/>}/><Route path="/banks" element={<BanksPage/>}/><Route path="/banks/:id" element={<BankDetails/>}/><Route path="/compare" element={<ComparePage/>}/><Route path="/insurance" element={<InsurancePage/>}/><Route path="/insurance/:id" element={<InsuranceRoute/>}/><Route path="/calculator" element={<CalculatorPage/>}/><Route path="/calculators" element={<Navigate to="/calculator" replace/>}/><Route path="/calculators/emi" element={<Navigate to="/calculator" replace/>}/><Route path="/share-market" element={<ShareMarketPage/>}/><Route path="/global-business" element={<GlobalBusinessPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/services" element={<ServicesPage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/apply" element={<Apply/>}/><Route path="/eligibility" element={<Eligibility/>}/><Route path="/applications" element={<Applications/>}/><Route path="/applications/:id" element={<ApplicationDetails/>}/><Route path="/my-loans" element={<MyLoans/>}/><Route path="/payments" element={<Payments/>}/><Route path="/credit-score" element={<CreditScore/>}/><Route path="/documents" element={<Documents/>}/><Route path="/offers" element={<Offers/>}/><Route path="/support" element={<Support/>}/><Route path="/glossary" element={<GlossaryPage/>}/><Route path="/rates/*" element={<InfoPageView/>}/><Route path="/credit/*" element={<InfoPageView/>}/><Route path="/cards/*" element={<InfoPageView/>}/><Route path="/investments/*" element={<InfoPageView/>}/><Route path="/global/*" element={<InfoPageView/>}/><Route path="/resources/*" element={<InfoPageView/>}/><Route path="/support/*" element={<InfoPageView/>}/><Route path="/about/*" element={<InfoPageView/>}/><Route path="/contact/*" element={<InfoPageView/>}/><Route path="/offices" element={<Offices/>}/><Route path="/profile" element={<Profile/>}/><Route path="*" element={<SiteNotFound/>}/></Routes>
        </ErrorBoundary>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 rounded-[14px] bg-gradient-to-r from-[var(--accent)] to-[var(--hero-3)] px-6 py-6 text-white sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(([ic,ttl,s])=>(
            <div key={ttl} className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[11px] bg-[var(--card)]/15"><Icon name={ic as keyof typeof Icons} size={20}/></span>
              <span><span className="block text-[14.5px] font-bold">{t(ttl)}</span><span className="block text-[12.5px] text-[var(--on-hero-soft)]">{t(s)}</span></span>
            </div>
          ))}
        </div>

        <DashFooter/>
      </main>
    </div>
    {assistant
      ? <Assistant onClose={()=>setAssistant(false)}/>
      : <AssistantPromo onStart={()=>setAssistant(true)}/>}
  </div>;
}
function PageHeader({title,subtitle,action}:{title:string;subtitle?:string;action?:React.ReactNode}){return <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7"><div><div className="text-sm text-[var(--accent-ink)] font-semibold mb-2">{t('eLoans /')} {t(title)}</div><h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t(title)}</h1>{subtitle&&<p className="text-[var(--muted)] mt-2 max-w-2xl">{t(subtitle)}</p>}</div>{action}</div>}
function Button({children,to,onClick,secondary=false}:{children:React.ReactNode;to?:string;onClick?:()=>void;secondary?:boolean}){const cls=`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${secondary?'bg-[var(--card)] border border-[var(--border)] text-[var(--ink-2)] hover:bg-[var(--card-2)]':'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm'}`;return to?<Link className={cls} to={to}>{children}</Link>:<button onClick={onClick} className={cls}>{children}</button>}
function Card({children,className='',id}:{children:React.ReactNode;className?:string;id?:string}){return <div id={id} className={`bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-soft ${className}`}>{children}</div>}
/* "₹25,00,000" -> "Up to ₹25 Lakhs" so the cards read like the marketing copy
   while still deriving from the product data. */
function upTo(max:string){
  const n=Number(max.replace(/[^0-9]/g,''));
  if(!n) return max;
  if(n>=10000000){const c=n/10000000;return tf(c>1?'Up to ₹{n} Crores':'Up to ₹{n} Crore',{n:c%1?c.toFixed(1):c})}
  const l=n/100000;return tf(l>1?'Up to ₹{n} Lakhs':'Up to ₹{n} Lakh',{n:l%1?l.toFixed(1):l});
}

const quickActions:[string,string,string,string][]=[
  ['EMI Calculator','Calculate your estimated monthly repayment.','Calculator','/calculator'],
  ['Eligibility Check','Estimate potential loan eligibility.','UserRoundCheck','/eligibility'],
  ['Interest Rates','Explore and compare available rates.','Percent','/compare'],
  ['Compare Loans','Compare loan options on important terms.','GitCompare','/compare'],
  ['Credit Score','Understand your current credit profile.','Gauge','/credit-score'],
  ['Loan Status','Track your application progress.','ClipboardList','/applications'],
];
const offerTags=['Instant Approval','Minimal Documents','Quick Disbursal','Flexible Tenure','Low Processing Fee'];
const journey:[string,string,'done'|'current'|'pending'][]=[
  ['Application Submitted','02 May 2025','done'],
  ['Documents Verified','03 May 2025','done'],
  ['Bank Review','In Progress','current'],
  ['Loan Approved','Pending','pending'],
  ['Amount Disbursed','Pending','pending'],
];

/* Scroll-snap carousel: the dots track real scroll position, so it stays
   correct at every breakpoint without hard-coding a page size. */
function BankOffers(){
  const ref=useRef<HTMLDivElement>(null);
  const [page,setPage]=useState(0);
  const [pages,setPages]=useState(1);
  const measure=useCallback(()=>{
    const el=ref.current;if(!el)return;
    setPages(Math.max(1,Math.ceil(el.scrollWidth/el.clientWidth)));
    setPage(Math.round(el.scrollLeft/el.clientWidth));
  },[]);
  useEffect(()=>{measure();const el=ref.current;if(!el)return;
    window.addEventListener('resize',measure);
    return ()=>window.removeEventListener('resize',measure);
  },[measure]);
  const go=(i:number)=>{const el=ref.current;if(el)el.scrollTo({left:i*el.clientWidth,behavior:'smooth'})};
  return <>
    <div ref={ref} onScroll={measure} className="scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1">
      {banks.map((b,i)=>(
        <div key={b.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] 2xl:w-[calc(20%-0.8rem)]">
          <div className={`flex h-full flex-col rounded-[12px] border p-4 transition hover:shadow-[0_14px_34px_rgba(17,42,84,.09)] ${i===0?'border-[var(--accent-border)] bg-[var(--card-2)]':'border-[var(--border)] bg-[var(--card)]'}`}>
            <BankLogo id={b.id} name={b.name} initials={b.initials} w={120} h={36}/>
            <div className="mt-2.5 min-h-[34px] text-[14.5px] font-bold leading-tight text-[var(--ink-strong)]">{t(b.name)}</div>
            <div className="mt-3 text-[12.5px] text-[var(--muted)]">{t('Personal Loan')}</div>
            <div className="mt-0.5 text-[26px] font-extrabold leading-none tracking-[-.02em] text-[var(--ink-strong)]">{t(b.rate)}</div>
            <div className="mt-1 text-[12px] text-[var(--muted-2)]">{t('p.a. onwards')}</div>
            <div className="mt-3 mb-4"><span className="inline-block rounded-[6px] bg-[var(--accent-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--accent-ink)]">{t(offerTags[i%offerTags.length])}</span></div>
            <Link to={`/banks/${b.id}`} className="mt-auto block rounded-[9px] bg-[var(--accent)] pt-2.5 pb-2.5 text-center text-[13px] font-bold text-white transition hover:bg-[var(--accent-hover)]">{t('Apply Now')}</Link>
          </div>
        </div>
      ))}
    </div>
    {pages>1&&<div className="mt-4 flex justify-center gap-2">
      {Array.from({length:pages}).map((_,i)=>(
        <button key={i} onClick={()=>go(i)} aria-label={tf('Go to slide {n}',{n:i+1})}
          className={`h-2 rounded-full transition-all ${i===page?'w-5 bg-[var(--accent)]':'w-2 bg-[var(--border)] hover:bg-[var(--muted-2)]'}`}/>
      ))}
    </div>}
  </>;
}

function Panel({title,action,children,className=''}:{title:string;action?:React.ReactNode;children:React.ReactNode;className?:string}){
  const {t}=useLang();
  return <div className={`rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-5 ${className}`}>
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[17px] font-extrabold tracking-[-.01em] text-[var(--ink-strong)]">{t(title)}</h2>
      {action}
    </div>
    {children}
  </div>;
}
const seeAll=(to:string,label:string)=><Link to={to} className="flex shrink-0 items-center gap-1 text-[12.5px] font-bold text-[var(--accent-ink)] hover:underline">{t(label)} <Icons.ArrowRight size={14}/></Link>;

/* Homepage content sections. Built from the same Panel / Card / Tile
   primitives the rest of the dashboard uses, so they read as part of the
   existing page rather than an addition to it. */

const purposes:[string,string,string,string][]=[
  ['Emergency expenses','Unplanned costs that will not wait.','Zap','/loans/personal'],
  ['Medical expenses','Treatment costs beyond what insurance covers.','HeartPulse','/loans/medical-emergency'],
  ['Education','Tuition and living costs, in India or abroad.','GraduationCap','/loans/education'],
  ['Wedding','Venue, jewellery and the rest of it.','HeartHandshake','/loans/wedding'],
  ['Travel','Spread a trip over fixed instalments.','Plane','/loans/travel'],
  ['Home renovation','Repairs, extensions and improvements.','House','/loans/home-topup'],
  ['Debt consolidation','Replace several costly debts with one.','ArrowDownUp','/loans/debt-consolidation'],
  ['Business expansion','Working capital, stock and equipment.','BriefcaseBusiness','/loans/business'],
  ['Vehicle purchase','A car, bike or commercial vehicle.','CarFront','/loans/vehicle'],
  ['Home purchase','Buying, building or transferring a home.','Landmark','/loans/home'],
];

const whyUs:[string,string,string][]=[
  ['GitCompare','Compare multiple options','See lenders side by side on rate, fee, tenure and total cost — not just the headline number.'],
  ['BookOpen','Simple explanations','Every product page sets out what it is, who it suits and what to weigh up, in plain English.'],
  ['BadgeCheck','Easy eligibility checks','A soft check that indicates what you may qualify for, with no effect on your credit score.'],
  ['Calculator','Helpful calculators','Eighteen calculators covering EMI, eligibility, prepayment, investments and more.'],
  ['FileText','Transparent information','Fees, prepayment terms and the things that can go wrong are stated, not buried.'],
  ['LockKeyhole','Careful with your information','Documents are shared only with lenders you choose to apply to.'],
];

const howItWorks:[string,string][]=[
  ['Explore','Browse loan and financial products, and read what each one actually involves.'],
  ['Compare','Compare available options on rate, fees, tenure and total cost.'],
  ['Check eligibility','Share a few basic details to understand what you may qualify for.'],
  ['Review','Read the terms, fees, repayment schedule and conditions carefully.'],
  ['Apply','Continue with the lender whose offer suits you best.'],
  ['Manage','Track your application and repayment information in one place.'],
];

const borrowingTips:string[]=[
  'Borrow only what you can comfortably repay, not the maximum you are offered.',
  'Compare the total cost of borrowing, not the monthly instalment alone.',
  'Check processing fees and anything else deducted at disbursal.',
  'Understand the repayment schedule before you commit to it.',
  'Review prepayment and foreclosure terms in case your circumstances change.',
  'Check your credit profile before applying, using a soft check.',
  'Avoid making several applications in a short period.',
  'Read the sanction letter in full — it, not the conversation, is what binds you.',
  'Never share your OTP, UPI PIN, card CVV or passwords with anyone.',
];

const education:[string,string,string][]=[
  ['Percent','How interest is calculated','Interest accrues on the outstanding balance. Early instalments are mostly interest, which is why prepaying early saves the most.'],
  ['CalendarClock','How an EMI is built','Each instalment covers the interest due first; whatever remains reduces the principal. The repayment schedule shows the split year by year.'],
  ['Gauge','How credit scores work','A summary of how you have handled borrowing. Repayment history matters most, followed by how much of your available credit you use.'],
  ['GitCompare','How to compare loans','Hold the amount and tenure constant, work out the total repayable, then add the fees. Compare that single number.'],
  ['ShieldCheck','How to avoid excessive debt','Keep total EMIs within a share of income you could still service if something went wrong. Lenders cap around half; prudence often sits lower.'],
  ['LayoutGrid','How to plan repayment','Align due dates with your salary cycle, automate payments, and keep a buffer for a month when things are tight.'],
];

const sampleTestimonials:[string,string,string][]=[
  ['Comparing six lenders took minutes, and the fee breakdown showed the cheapest headline rate was not the cheapest loan.','Salaried professional, Bengaluru','Personal loan enquiry'],
  ['The repayment schedule made it obvious how much a shorter tenure would save. I changed my mind about the term before applying.','Self-employed, Pune','Home loan enquiry'],
  ['The eligibility check gave me a realistic figure before I applied anywhere, so I was not left with a rejection on my record.','First-time borrower, Bhubaneswar','Eligibility check'],
];

/* Served from public/. WebP first (~128KB vs ~1.5MB for the same PNG); a
   dropped-in .png still works as a fallback, and if neither exists the hero
   falls back to the live-text panel rather than a broken image. */
const heroBannerSources=['/hero-banner.webp','/hero-banner.png'];
const HERO_ASPECT='1999 / 786';

/* The banner's own headline, buttons and feature labels are baked in, so the
   two calls to action are re-created as transparent links sitting exactly on
   top of them. Percentages are of the artwork's own box. */
const heroHotspots:{to:string;label:string;left:string;top:string;width:string;height:string}[]=[
  {to:'/loans',                 label:'Explore Loans', left:'4.6%',  top:'65.6%', width:'14.8%', height:'9.6%'},
  {to:'/resources/loan-guides', label:'How It Works',  left:'20.1%', top:'65.6%', width:'13.6%', height:'9.6%'},
];

function Dashboard(){
  const {t:tr,lang}=useLang();
  const [bannerIdx,setBannerIdx]=useState(0);
  /* Measure the hero itself rather than the viewport: the 360px right rail
     and 260px sidebar mean hero width is not a simple function of window
     width. Below this the artwork's baked-in copy is unreadable and its
     painted buttons are too small to tap. */
  const heroRef=useRef<HTMLDivElement|null>(null);
  const [heroWide,setHeroWide]=useState(false);
  useEffect(()=>{
    const el=heroRef.current;
    if(!el||typeof ResizeObserver==='undefined') return;
    const ro=new ResizeObserver(([e])=>setHeroWide(e.contentRect.width>=600));
    ro.observe(el);
    return ()=>ro.disconnect();
  },[]);
  /* The artwork has English copy baked in, so only use it for English.
     Every other language keeps the live, translated hero. */
  const bannerLoadable=bannerIdx<heroBannerSources.length;
  const useBanner=lang==='en'&&heroWide&&bannerLoadable;
  /* Where the banner cannot be used as-is - narrow screens, or a language it
     was not drawn in - it still appears as a background behind the live copy
     rather than being dropped entirely. */
  const useBannerBg=!useBanner&&bannerLoadable;
  const bannerOk=false;
  return <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
    <div ref={heroRef} className="min-w-0 space-y-5">

      {/* hero — banner artwork, edge to edge */}
      {useBanner
        ? <div className="relative overflow-hidden rounded-[16px] bg-[var(--hero-tint)]">
            <img
              src={heroBannerSources[bannerIdx]}
              alt={tr('Smart Loans. Simple Decisions.')}
              decoding="async"
              onError={()=>setBannerIdx(i=>i+1)}
              className="block w-full select-none"
              style={{aspectRatio:HERO_ASPECT,objectFit:'cover'}}
            />
            {/* Transparent links over the artwork's painted buttons. */}
            {heroHotspots.map(h=>(
              <Link key={h.to} to={h.to} aria-label={tr(h.label)}
                className="absolute rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                style={{left:h.left,top:h.top,width:h.width,height:h.height}}/>
            ))}
          </div>
        : <div className={`@container relative overflow-hidden rounded-[16px] px-6 py-8 sm:px-9 sm:py-10 ${useBannerBg?'':'bg-[var(--hero-tint)]'}`}>
        {useBannerBg&&<>
          {/* Blurred: the artwork carries its own headline, EMI figures and
              book spines, which would otherwise read as competing text behind
              the live copy. Scaled up slightly so the blur has no soft edge. */}
          <img src={heroBannerSources[bannerIdx]} alt="" aria-hidden="true" decoding="async"
            onError={()=>setBannerIdx(i=>i+1)}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-[88%_center]"
            style={{filter:'blur(3px)',transform:'scale(1.06)'}}/>
          {/* This hero keeps dark copy on a light panel, so the scrim is the
              hero tint rather than a dark wash - a dark one would make the
              existing text unreadable. */}
          <div className="pointer-events-none absolute inset-0" style={{background:'linear-gradient(to bottom,color-mix(in srgb,var(--hero-tint) 90%,transparent),color-mix(in srgb,var(--hero-tint) 80%,transparent))'}}/>
        </>}
        <div className="pointer-events-none absolute -right-24 -top-28 h-[320px] w-[320px] rounded-full bg-[var(--accent)]/10 blur-3xl"/>
        <div className={`relative max-w-[760px] ${bannerOk?'@min-[640px]:max-w-[54%]':''}`}>
          <div>
            <h1 className="text-[30px] font-black leading-[1.1] tracking-[-.03em] text-[var(--ink-strong)] sm:text-[38px]">{tr('Smart Loans. Simple Decisions.')}</h1>
            <p className="mt-4 max-w-[460px] text-[14.5px] leading-relaxed text-[var(--muted)]">
              {tr('Compare loan options, understand your eligibility, calculate your EMI, and make informed borrowing decisions from one convenient platform.')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/loans" className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--accent)] px-5 py-3 text-[14.5px] font-bold text-white transition hover:bg-[var(--accent-hover)]">
                <Icons.Rocket size={17}/> {tr('Explore Loans')}
              </Link>
              <Link to="/resources/loan-guides" className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-[14.5px] font-bold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">
                <Icons.FileText size={17}/> {tr('How It Works')}
              </Link>
            </div>
            {/* Four across only when the banner is not narrowing this column;
                otherwise the labels truncate. */}
            <div className={`mt-7 grid grid-cols-2 gap-x-4 gap-y-3 ${bannerOk?'':'lg:grid-cols-4'}`}>
              {([['Percent','Compare Loan Costs'],['UserRoundCheck','Simple Application Journey'],['FileCheck2','Clear Documentation'],['LockKeyhole','Secure Experience']] as [string,string][]).map(([ic,label])=>(
                <span key={label} className="flex items-center gap-2.5 text-[12.5px] font-medium text-[var(--ink-2)]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={ic as keyof typeof Icons} size={14}/></span>{tr(label)}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>}

      {/* quick actions */}
      <Panel title="Quick Actions" className="mt-5 @container">
        <div className="grid gap-3 @min-[520px]:grid-cols-2 @min-[1070px]:grid-cols-4">
          {([
            ['Apply for a Loan','Start a guided application.','FilePlus2','/apply'],
            ['Check Eligibility','See what you may qualify for.','UserRoundCheck','/eligibility'],
            ['Loan Calculator','Plan your EMI and tenure.','Calculator','/calculator'],
            ['Track Application','Check the status of your applications.','Clock','/applications'],
          ] as [string,string,string,string][]).map(([ttl,s,ic,to])=>(
            <Link key={ttl} to={to} className="group flex items-center gap-3.5 rounded-[11px] border border-[var(--border)] p-4 transition hover:border-[var(--accent-border)] hover:bg-[var(--card-2)]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={ic as keyof typeof Icons} size={20}/></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold leading-tight text-[var(--ink-strong)]">{tr(ttl)}</span>
                <span className="mt-0.5 block text-[12px] leading-tight text-[var(--muted-2)]">{tr(s)}</span>
              </span>
              <Icons.ChevronRight size={16} className="shrink-0 text-[var(--muted-2)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent-ink)]"/>
            </Link>
          ))}
        </div>
      </Panel>

      {/* discover loan options */}
      <Panel title="Discover Loan Options" className="mt-5" action={seeAll('/loans','View All Offers')}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([
            ['personal','For your everyday needs',['Quick Disbursal','Flexible Tenure']],
            ['home','For your dream home',['Long Tenure','Secured']],
            ['education','For your future goals',['Moratorium','Tax Benefit']],
            ['business','For growing your business',['Working Capital','Flexible Use']],
            ['gold','Against your gold assets',['Fast Disbursal','Minimal Documents']],
            ['vehicle','For your next vehicle',['Secured','Fixed EMI']],
          ] as [string,string,string[]][]).map(([id,tagline,tags])=>{
            const l=loans.find(x=>x.id===id)!;
            return <Link key={id} to={`/loans/${id}`} className="group rounded-[11px] border border-[var(--border)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent-border)] hover:shadow-[0_14px_34px_rgba(17,42,84,.09)]">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={l.icon} size={20}/></span>
                <span>
                  <span className="block text-[14.5px] font-bold text-[var(--ink-strong)]">{tr(l.name)}</span>
                  <span className="block text-[12px] text-[var(--muted-2)]">{t(tagline)}</span>
                </span>
              </div>
              <div className="mt-3 text-[13px] font-semibold text-[var(--ink-2)]">{l.max==='On request'?tf('Tenure {tenure}',{tenure:l.tenure}):t(l.max)}</div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {tags.map(x=><span key={x} className="rounded-[6px] bg-[var(--card-2)] px-2 py-1 text-[10.5px] font-semibold text-[var(--muted)]">{t(x)}</span>)}
              </div>
              <div className="mt-3 border-t border-[var(--border-2)] pt-3 text-[12.5px] font-bold text-[var(--accent-ink)]">
                {l.rate==='On request'?t('Rate on request'):tf('From {rate} p.a.',{rate:l.rate})}
              </div>
            </Link>;
          })}
        </div>
      </Panel>

      {/* bank offers */}
      <Panel title="Top Bank Offers for You" action={seeAll('/banks','View All Offers')}>
        <BankOffers/>
      </Panel>


      {/* ---- conversion blocks ---- */}
      <div className="grid gap-5 lg:grid-cols-3">
        {([
          ['BadgeCheck','Find Out What You May Qualify For','Answer a few basic questions to understand which loan options may be suitable for your profile.','Check Eligibility','/eligibility'],
          ['GitCompare','Compare Loans Before You Apply','See interest rates, EMI, tenure, processing fees and total repayment side by side before you commit.','Compare Loans','/compare'],
          ['Calculator','Know Your EMI Before You Borrow','Estimate your monthly repayment and understand the total cost of your loan before making a decision.','Calculate EMI','/calculator'],
        ] as [string,string,string,string,string][]).map(([ic,h,body,cta,to])=>(
          <div key={h} className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-6">
            <span className="grid h-11 w-11 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={ic as keyof typeof Icons} size={20}/></span>
            <h3 className="mt-4 text-[17px] font-extrabold leading-snug tracking-[-.01em] text-[var(--ink-strong)]">{t(h)}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(body)}</p>
            <Link to={to} className="mt-4 inline-flex items-center gap-2 rounded-[9px] bg-[var(--accent)] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[var(--accent-hover)]">{t(cta)} <Icons.ArrowRight size={15}/></Link>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-[var(--muted-2)]">{t('Eligibility results are indicative and do not guarantee loan approval. Your lender decides the final outcome.')}</p>

      {/* ---- borrow by purpose ---- */}
      <Panel title="What do you need the money for?" className="mt-5" action={seeAll('/loans','All loan products')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {purposes.map(([ttl,d,ic,to])=>(
            <Link key={ttl} to={to} className="group rounded-[11px] border border-[var(--border)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent-border)] hover:shadow-[0_14px_34px_rgba(17,42,84,.09)]">
              <span className="grid h-10 w-10 place-items-center rounded-[9px] bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={ic as keyof typeof Icons} size={18}/></span>
              <span className="mt-3 block text-[13.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</span>
              <span className="mt-1 block text-[11.5px] leading-relaxed text-[var(--muted-2)]">{t(d)}</span>
            </Link>
          ))}
        </div>
      </Panel>

      {/* ---- how it works ---- */}
      <Panel title="How it works" className="mt-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {howItWorks.map(([ttl,d],i)=>(
            <div key={ttl} className="rounded-[11px] border border-[var(--border)] p-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent)] text-[12px] font-bold text-white">{i+1}</span>
                <span className="text-[14px] font-bold text-[var(--ink-strong)]">{t(ttl)}</span>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--muted)]">{t(d)}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- why this platform ---- */}
      <Panel title="Why use this platform" className="mt-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map(([ic,ttl,d])=>(
            <div key={ttl} className="rounded-[11px] border border-[var(--border)] p-4">
              <span className="grid h-10 w-10 place-items-center rounded-[9px] bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={ic as keyof typeof Icons} size={18}/></span>
              <div className="mt-3 text-[14.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--muted)]">{t(d)}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- financial education ---- */}
      <Panel title="Understanding how it all works" className="mt-5" action={seeAll('/resources/loan-guides','Read the guides')}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {education.map(([ic,ttl,d])=>(
            <div key={ttl} className="rounded-[11px] border border-[var(--border)] p-4">
              <span className="grid h-10 w-10 place-items-center rounded-[9px] bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={ic as keyof typeof Icons} size={18}/></span>
              <div className="mt-3 text-[14.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--muted)]">{t(d)}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- borrowing tips ---- */}
      <Panel title="Smart borrowing" className="mt-5">
        <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
          {borrowingTips.map(x=>(
            <div key={x} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[var(--ink-2)]">
              <Icons.Check size={16} className="mt-0.5 shrink-0 text-[var(--ok-bright)]" strokeWidth={2.6}/>{t(x)}
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- trust & security ---- */}
      <Panel title="Trust and security" className="mt-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([
            ['LockKeyhole','Careful data handling','Information you provide is used to match you with lenders and is shared only with those you choose to apply to.'],
            ['ShieldCheck','Secure communication','Data is transmitted over encrypted connections. [Add verified security certifications before claiming any.]'],
            ['FileText','Your consent','You decide which lenders receive your details. Nothing is submitted on your behalf without you choosing to proceed.'],
            ['Info','Transparent terms','Fees, prepayment conditions and the risks of each product are stated on the product page.'],
            ['BadgeCheck','Responsible lending','We show what a loan costs in total and what happens if you cannot repay, not only what you could borrow.'],
            ['Bell','Fraud awareness','No genuine lender or platform will ask for your OTP, UPI PIN, CVV or passwords. Treat any such request as fraud.'],
          ] as [string,string,string][]).map(([ic,ttl,d])=>(
            <div key={ttl} className="rounded-[11px] border border-[var(--border)] p-4">
              <span className="grid h-10 w-10 place-items-center rounded-[9px] bg-[var(--accent-soft)] text-[var(--accent-ink)]"><Icon name={ic as keyof typeof Icons} size={18}/></span>
              <div className="mt-3 text-[14.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--muted)]">{t(d)}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- sample testimonials, clearly labelled ---- */}
      <Panel title="What people use it for" className="mt-5"
        action={<span className="shrink-0 rounded-full bg-[var(--warn-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--warn)]">{t('Sample content')}</span>}>
        <p className="-mt-3 mb-4 text-[12.5px] text-[var(--muted-2)]">{t('Illustrative examples showing how the tools are used. These are not real customer reviews and are not attributed to real people.')}</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {sampleTestimonials.map(([quote,who,what])=>(
            <div key={quote} className="flex h-full flex-col rounded-[11px] border border-[var(--border)] p-5">
              <p className="flex-1 text-[13.5px] leading-relaxed text-[var(--ink-2)]">“{t(quote)}”</p>
              <div className="mt-4 border-t border-[var(--border-2)] pt-3">
                <div className="text-[13px] font-bold text-[var(--ink-strong)]">{t(who)}</div>
                <div className="text-[11.5px] text-[var(--muted-2)]">{t(what)}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ---- final CTA ---- */}
      <div className="mt-5 overflow-hidden rounded-[14px] px-6 py-10 text-center sm:px-10" style={{background:'linear-gradient(112deg,var(--hero-1) 0%,var(--hero-2) 57%,var(--hero-3) 100%)'}}>
        <h2 className="mx-auto max-w-[620px] text-[26px] font-extrabold leading-[1.15] tracking-[-.02em] text-white sm:text-[32px]">{t('Make better financial decisions with confidence')}</h2>
        <p className="mx-auto mt-3 max-w-[560px] text-[14.5px] leading-relaxed text-[var(--on-hero-soft)]">{t('Explore loan options, compare costs, calculate your EMI, and understand your choices before you apply.')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/eligibility" className="rounded-[10px] bg-white px-6 py-3 text-[14.5px] font-bold text-[var(--accent-ink)] transition hover:opacity-90">{t('Get started')}</Link>
          <Link to="/loans" className="rounded-[10px] border border-white/25 bg-white/10 px-6 py-3 text-[14.5px] font-bold text-white transition hover:bg-white/20">{t('Explore loans')}</Link>
        </div>
      </div>
    </div>

    {/* ---------- right rail ---------- */}
    <aside className="space-y-4 xl:sticky xl:top-[88px]">
      <div className="relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-5">
        {/* The banner artwork this came from carries its own copy and button,
            which would render ~6px tall in this 360px rail. Only its
            illustration is used, so the text below stays live and translated. */}
        {/* Sits fully inside the card so nothing is clipped, and multiplies so
            its near-white backdrop (rgb 251,253,255) dissolves into the white
            card instead of showing as a pasted rectangle. */}
        <img src="/eligibility-art.webp" alt="" aria-hidden="true" decoding="async"
          className="art-light-only pointer-events-none absolute bottom-0 right-0 w-[112px] select-none mix-blend-multiply"/>
        <ClipboardArt className="art-dark-only pointer-events-none absolute -bottom-2 right-1 w-[104px]"/>
        <div className="relative max-w-[190px]">
          <h3 className="text-[16px] font-extrabold leading-snug tracking-[-.01em] text-[var(--ink-strong)]">{t('Check your eligibility in 2 minutes')}</h3>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--muted)]">{t('Get loan options that may be suitable for your profile.')}</p>
          <Link to="/eligibility" className="mt-4 inline-flex items-center gap-2 rounded-[9px] bg-[var(--accent)] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[var(--accent-hover)]">{t('Check Now')} <Icons.ArrowRight size={15}/></Link>
        </div>
        {/* Kept clear of the corner artwork, which is opaque unlike the vector
            it replaced. */}
        <p className="relative mt-4 max-w-[196px] text-[11px] leading-relaxed text-[var(--muted-2)]">{t('Eligibility results are indicative and do not guarantee loan approval.')}</p>
      </div>

      <AdSlot/>
    </aside>
  </div>;
}
function SectionTitle({title,subtitle,action}:{title:string;subtitle?:string;action?:React.ReactNode}){return <div className="flex justify-between items-end gap-4 mb-4"><div><h2 className="text-xl font-extrabold">{t(title)}</h2>{subtitle&&<p className="text-sm text-[var(--muted)] mt-1">{t(subtitle)}</p>}</div>{action}</div>}
function BankDetails(){const id=location.pathname.split('/').pop()||'hdfc';const b=banks.find(x=>x.id===id)||banks[0];return <><PageHeader title={b.name} subtitle={t('Explore rates, products and application options.')} action={<Button to="/apply">{t('Apply Now')}</Button>}/><div className="grid lg:grid-cols-3 gap-6"><Card className="p-6 lg:col-span-2"><div className="flex items-center gap-4"><BankLogo id={b.id} name={b.name} initials={b.initials} w={172} h={52}/><div><h2 className="text-2xl font-black">{t(b.name)}</h2><div className="flex items-center gap-1 text-sm text-[var(--warn-bright)] mt-1"><Icons.Star fill="currentColor" size={15}/>{tf('{score} rating',{score:b.rating})}</div></div></div><div className="grid md:grid-cols-4 gap-4 mt-8">{[['Starting rate',b.rate],['Max amount',b.amount],['Tenure',b.tenure],['Processing fee',b.fee]].map(x=><div className="p-4 rounded-xl bg-[var(--card-2)]" key={x[0]}><div className="text-xs text-[var(--muted)]">{t(x[0])}</div><b className="block mt-1">{t(x[1])}</b></div>)}</div><h3 className="font-bold mt-8">{t('Available loan products')}</h3><div className="grid md:grid-cols-2 gap-3 mt-3">{loans.slice(0,6).map(l=><Link to={`/loans/${l.id}`} className="p-4 rounded-xl border border-[var(--border-2)] hover:border-[var(--accent-border)]" key={l.id}><div className="font-semibold">{t(l.name)}</div><div className="text-xs text-[var(--muted)] mt-1">{t('Rates from')} {t(l.rate)}</div></Link>)}</div></Card><Card className="p-6 h-fit"><h3 className="font-bold">{t('Why applicants choose')} {t(b.name)}</h3><div className="space-y-3 mt-4">{['Competitive rates','Digital application journey','Multiple repayment options','Dedicated support'].map(x=><div key={x} className="flex gap-2 text-sm"><Icons.CheckCircle2 size={17} className="text-[var(--ok-bright)]"/>{t(x)}</div>)}</div><Button to="/apply">{t('Start application')}</Button></Card></div></>}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="mt-7"><label className="text-sm font-semibold">{t(label)}</label>{children}</div>};function Metric({label,value}:{label:string;value:string}){return <div><div className="text-xs text-[var(--muted)]">{t(label)}</div><div className="font-bold mt-1">{t(value)}</div></div>}
const num=(v:string)=>Number(String(v).replace(/[^0-9.]/g,''))||0;
const rupees=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');

const eligSteps:[string,[string,string][]][]=[
  ['Tell us about yourself',[['fullName','Full name'],['age','Age'],['employment','Employment type'],['city','City']]],
  ['Your financial profile',[['income','Monthly income'],['existingEmi','Existing EMI'],['expenses','Monthly expenses'],['creditScore','Credit score']]],
  ['What do you need?',[['loanType','Loan type'],['amount','Required amount'],['tenure','Preferred tenure (months)'],['purpose','Purpose']]],
];

function Eligibility(){
  const [step,setStep]=useState(1);
  const [submitted,setSubmitted]=useState(false);
  const [form,setForm]=useState({fullName:'Puja Gouda',age:'29',employment:'Salaried',city:'Bhubaneswar',
    income:'75000',existingEmi:'8500',expenses:'25000',creditScore:'780',
    loanType:'Personal Loan',amount:'1500000',tenure:'60',purpose:'Home renovation'});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));

  /* Everything below is derived from what was typed — FOIR of 50%, an EMI at
     the best partner rate, and a score weighted on credit history and how much
     of the affordable EMI the request actually consumes. */
  const result=useMemo(()=>{
    const income=num(form.income), existing=num(form.existingEmi);
    const want=num(form.amount), months=num(form.tenure)||60;
    const cs=Math.min(Math.max(num(form.creditScore),300),900);
    const best=[...banks].sort((a,b)=>parseFloat(a.rate)-parseFloat(b.rate))[0];
    const rate=parseFloat(best.rate)||8.5, r=rate/1200;
    const affordable=Math.max(income*0.5-existing,0);
    const maxLoan=r===0?affordable*months:affordable*(1-Math.pow(1+r,-months))/r;
    const emi=want>0?(r===0?want/months:(want*r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1)):0;
    const creditPts=((cs-300)/600)*60;                       // 0-60 on credit score
    const loadPts=affordable<=0?0:Math.max(0,1-Math.min(emi/affordable,1))*40; // 0-40 on headroom
    const score=Math.round(Math.min(creditPts+loadPts,99));
    const matches=banks.filter(b=>num(b.amount)*100000>=want).length;
    return {score,maxLoan,emi,affordable,matches,rate,lender:best.name,
      verdict:score>=75?'Good chance of approval':score>=55?'Approval likely with a co-applicant':'Approval unlikely at this amount'};
  },[form]);

  return <><PageHeader title="Eligibility Check" subtitle="Get a personalized estimate in a few minutes. No hard credit inquiry in this demo."/>
    <Card className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        {['Personal','Financial','Loan need','Result'].map((x,i)=>(
          <div className="flex items-center gap-2" key={x}>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold ${(submitted?4:step)>=i+1?'bg-[var(--accent)] text-white':'bg-[var(--surface-3)] text-[var(--muted-2)]'}`}>{i+1}</div>
            <span className="hidden sm:block text-xs font-semibold">{t(x)}</span>
            {i<3&&<div className="w-10 md:w-20 h-px bg-[var(--border)]"/>}
          </div>
        ))}
      </div>
      {submitted
        ? <div className="text-center py-10">
            <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${result.score>=55?'bg-[var(--ok-soft)] text-[var(--ok)]':'bg-[var(--warn-soft)] text-[var(--warn)]'}`}>
              {result.score>=55?<Icons.Check size={32}/>:<Icons.TriangleAlert size={30}/>}
            </div>
            <h2 className="text-2xl font-black mt-5">{t(result.score)}{t('% Eligibility Score')}</h2>
            <p className="text-[var(--muted)] mt-2">{t(result.verdict)}</p>
            <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
              <Metric label="Maximum you could borrow" value={rupees(result.maxLoan)}/>
              <Metric label={tf('EMI on {amount}',{amount:rupees(num(form.amount))})} value={rupees(result.emi)}/>
              <Metric label="Lenders matching your amount" value={tf('{n} matches',{n:result.matches})}/>
            </div>
            <p className="mt-6 text-xs text-[var(--muted-2)] max-w-lg mx-auto leading-relaxed">
              {t('Based on a FOIR of 50% (')}{rupees(result.affordable)} {t('affordable EMI) at')} {result.rate.toFixed(2)}{t('% p.a., our best partner rate from')} {t(result.lender)}{t('. Your sanctioned offer is set by the lender.')}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button to="/banks">{t('View Best Offers')}</Button>
              <Button secondary onClick={()=>{setSubmitted(false);setStep(1)}}>{t('Edit details')}</Button>
            </div>
          </div>
        : <div>
            <h2 className="text-xl font-bold">{t(eligSteps[step-1][0])}</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {eligSteps[step-1][1].map(([key,label])=>(
                <label key={key} className="text-sm font-semibold">{t(label)}
                  <input value={(form as Record<string,string>)[key]} onChange={e=>set(key,e.target.value)}
                    inputMode={['income','existingEmi','expenses','creditScore','amount','tenure','age'].includes(key)?'numeric':undefined}
                    className="w-full mt-2 border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-8">
              {step>1&&<Button secondary onClick={()=>setStep(step-1)}>{t('Back')}</Button>}
              {step<3
                ? <Button onClick={()=>setStep(step+1)}>{t('Continue')} <Icons.ArrowRight size={15}/></Button>
                : <Button onClick={()=>setSubmitted(true)}>{t('Check Eligibility')}</Button>}
            </div>
          </div>}
    </Card></>;
}
const applyFields:Record<number,[string,string,string][]>={
  2:[['fullName','Full name','text'],['email','Email','email'],['phone','Phone','tel'],['city','City','text']],
  3:[['employer','Employer','text'],['designation','Designation','text'],['employment','Employment type','text'],['experience','Years in current job','text']],
  4:[['income','Monthly income (₹)','numeric'],['existingEmi','Existing EMI (₹)','numeric'],['amount','Loan amount required (₹)','numeric'],['tenure','Preferred tenure (months)','numeric']],
};
const applyDocs=['PAN','Aadhaar','Salary Slip','Bank Statement','Address Proof','Income Tax Return'];

function Apply(){
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [loanId,setLoanId]=useState('');
  const [files,setFiles]=useState<Record<string,string>>({});
  const [form,setForm]=useState<Record<string,string>>({fullName:'',email:'',phone:'',city:'',
    employer:'',designation:'',employment:'Salaried',experience:'',income:'',existingEmi:'',amount:'',tenure:'60',notes:''});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  const labels=['Loan Type','Personal','Employment','Financial','Documents','Review'];
  const chosen=loans.find(l=>l.id===loanId);
  /* stable per submission, not regenerated on every render */
  const appId=useMemo(()=>'EL-'+new Date().getFullYear()+'-'+Math.floor(10000+Math.random()*89999),[done]);

  const review:[string,string][]=[
    ['Loan type',chosen?.name||'—'],['Amount',form.amount?'₹'+Number(form.amount).toLocaleString('en-IN'):'—'],
    ['Tenure',form.tenure?form.tenure+' months':'—'],['Full name',form.fullName||'—'],
    ['Email',form.email||'—'],['Phone',form.phone||'—'],['City',form.city||'—'],
    ['Employer',form.employer||'—'],['Employment',form.employment||'—'],
    ['Monthly income',form.income?'₹'+Number(form.income).toLocaleString('en-IN'):'—'],
    ['Existing EMI',form.existingEmi?'₹'+Number(form.existingEmi).toLocaleString('en-IN'):'—'],
    ['Documents',tf('{done} of {total} uploaded',{done:Object.keys(files).length,total:applyDocs.length})],
  ];

  return <><PageHeader title="Apply for a Loan" subtitle="A secure, guided application designed to keep your information organized."/>
    <Card className="max-w-5xl mx-auto p-6 md:p-8">
      {done
        ? <div className="text-center py-12">
            <div className="h-16 w-16 mx-auto rounded-full bg-[var(--ok-soft)] text-[var(--ok)] flex items-center justify-center"><Icons.Check size={32}/></div>
            <h2 className="text-2xl font-black mt-5">{t('Application Submitted Successfully')}</h2>
            <p className="text-[var(--muted)] mt-2">{t('Your application ID is')} <b>{t(appId)}</b>.</p>
            {chosen&&<p className="text-[var(--muted)] mt-1 text-sm">{t(chosen.name)}{form.amount&&` · ₹${Number(form.amount).toLocaleString('en-IN')}`}</p>}
            <div className="mt-7 flex justify-center gap-3">
              <Button to="/applications">{t('Track Application')}</Button>
              <Button to="/" secondary>{t('Back to dashboard')}</Button>
            </div>
          </div>
        : <>
          <div className="overflow-x-auto pb-3">
            <div className="flex min-w-[650px]">
              {labels.map((x,i)=>(
                <div className="flex-1 flex items-center" key={x}>
                  <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${i<step?'bg-[var(--accent)] text-white':'bg-[var(--surface-3)] text-[var(--muted-2)]'}`}>{i+1}</div>
                  <span className="ml-2 text-xs font-semibold">{t(x)}</span>
                  {i<labels.length-1&&<div className="flex-1 h-px bg-[var(--border)] mx-3"/>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[var(--card-2)] p-6">
            <h2 className="text-xl font-bold">{t(['Select a loan type','Personal details','Employment details','Financial details','Upload documents','Review your application'][step-1])}</h2>

            {step===1&&<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
              {loans.slice(0,9).map(l=>(
                <button key={l.id} onClick={()=>{setLoanId(l.id);setStep(2)}}
                  className={`text-left p-4 rounded-xl border transition ${loanId===l.id?'border-blue-500 bg-[var(--accent-soft)] ring-2 ring-[var(--accent-ring)]':'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-border)]'}`}>
                  <Icon name={l.icon} className="text-[var(--accent-ink)]"/>
                  <div className="font-semibold text-sm mt-3">{t(l.name)}</div>
                  <div className="text-xs text-[var(--muted)] mt-1">{t('From')} {t(l.rate)}</div>
                </button>
              ))}
            </div>}

            {(step===2||step===3||step===4)&&<div className="grid md:grid-cols-2 gap-4 mt-5">
              {applyFields[step].map(([k,label,type])=>(
                <label key={k} className="text-sm font-semibold text-[var(--ink-2)]">{t(label)}
                  <input value={form[k]} onChange={e=>set(k,e.target.value)}
                    type={type==='numeric'?'text':type} inputMode={type==='numeric'?'numeric':undefined}
                    className="w-full mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
                </label>
              ))}
              {step===4&&<label className="md:col-span-2 text-sm font-semibold text-[var(--ink-2)]">{t('Additional details')}
                <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder={t('Anything the lender should know')}
                  className="w-full mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 min-h-28 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
              </label>}
            </div>}

            {step===5&&<>
              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                {applyDocs.map(x=>(
                  <label key={x} className={`border-2 border-dashed rounded-xl p-5 flex items-center gap-3 cursor-pointer transition ${files[x]?'border-green-300 bg-[var(--ok-soft)]':'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-border)]'}`}>
                    {files[x]?<Icons.CircleCheckBig className="text-[var(--ok)] shrink-0"/>:<Icons.UploadCloud className="text-[var(--accent-ink)] shrink-0"/>}
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{files[x]?t(x):tf('Upload {name}',{name:t(x)})}</span>
                      {files[x]&&<span className="block text-xs text-[var(--muted)] truncate">{t(files[x])}</span>}
                    </span>
                    <input type="file" className="hidden"
                      onChange={e=>{const f=e.target.files?.[0];if(f)setFiles(p=>({...p,[x]:f.name}))}}/>
                  </label>
                ))}
              </div>
              <div className="mt-4 text-xs text-[var(--muted)]">{tf('{done} of {total} uploaded. Files stay in your browser in this demo.',{done:Object.keys(files).length,total:applyDocs.length})}</div>
            </>}

            {step===6&&<div className="mt-5 divide-y divide-[var(--border)] rounded-xl bg-[var(--card)]">
              {review.map(([k,v])=>(
                <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-[var(--muted)]">{t(k)}</span>
                  <span className="font-semibold text-right">{t(v)}</span>
                </div>
              ))}
            </div>}

            <div className="flex justify-end gap-3 mt-7">
              {step>1&&<Button secondary onClick={()=>setStep(step-1)}>{t('Back')}</Button>}
              {step<6
                ? <Button onClick={()=>setStep(step+1)}>{t('Continue')} <Icons.ArrowRight size={15}/></Button>
                : <Button onClick={()=>setDone(true)}>{t('Submit Application')} <Icons.Check size={15}/></Button>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-5"><Icons.LockKeyhole size={14}/> {t('Demo flow: sensitive information is not transmitted anywhere.')}</div>
        </>}
    </Card></>;
}
function Timeline({compact=false}:{compact?:boolean}){const rows=[['Application Submitted','20 May 2024, 10:30 AM','done'],['Under Review','21 May 2024, 02:15 PM','done'],['Document Verification','22 May 2024, 11:20 AM','current'],['Loan Approved','Pending','pending'],['Disbursed','Pending','pending']];return <div className="space-y-0">{rows.map((r,i)=><div className="flex gap-4" key={r[0]}><div className="flex flex-col items-center"><div className={`h-8 w-8 rounded-full flex items-center justify-center ${r[2]==='done'?'bg-[var(--ok-soft)] text-[var(--ok)]':r[2]==='current'?'bg-[var(--accent-soft)] text-[var(--accent-ink)]':'bg-[var(--surface-3)] text-[var(--muted-2)]'}`}>{r[2]==='done'?<Icons.Check size={16}/>:r[2]==='current'?<div className="h-2.5 w-2.5 bg-[var(--accent)] rounded-full"/>:<Icons.Circle size={15}/>}</div>{i<rows.length-1&&<div className="w-px bg-[var(--border)] flex-1 min-h-8"/>}</div><div className={`${compact?'pb-4':'pb-6'} pt-1`}><div className="font-semibold text-sm">{t(r[0])}</div><div className="text-xs text-[var(--muted-2)] mt-1">{t(r[1])}</div></div></div>)}</div>}
function Applications(){const apps=[['EL-2026-48291','Personal Loan','₹8,50,000','HDFC Bank','28 Aug 2026','Document Verification'],['EL-2026-31724','Home Loan','₹42,00,000','SBI Bank','14 Jul 2026','Approved'],['EL-2026-21809','Car Loan','₹9,80,000','ICICI Bank','05 Jun 2026','Disbursed']];return <><PageHeader title="My Applications" subtitle="Track every application from submission to disbursement." action={<Button to="/apply">{t('New application')}</Button>}/><Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[var(--card-2)] text-xs text-[var(--muted)]"><tr>{['Application ID','Loan Type','Amount','Bank','Date','Status','Action'].map(x=><th className="px-5 py-4 font-semibold" key={x}>{t(x)}</th>)}</tr></thead><tbody>{apps.map(a=><tr className="border-t border-[var(--border-2)]" key={a[0]}>{a.slice(0,6).map((x,i)=><td className="px-5 py-4 whitespace-nowrap" key={i}>{i===5?<Status text={x}/>:<span className={i===0?'font-semibold text-[var(--accent-ink)]':''}>{t(x)}</span>}</td>)}<td className="px-5 py-4"><Link to={`/applications/${a[0]}`} className="text-[var(--accent-ink)] font-semibold">{t('View')}</Link></td></tr>)}</tbody></table></div></Card></>}
function Status({text}:{text:string}){const c=text==='Approved'||text==='Disbursed'?'bg-[var(--ok-soft)] text-[var(--ok)]':text==='Rejected'?'bg-[var(--warn-soft)] text-[var(--danger)]':text==='Document Verification'?'bg-[var(--warn-soft)] text-[var(--warn)]':'bg-[var(--accent-soft)] text-[var(--accent-ink)]';return <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${c}`}>{t(text)}</span>}
function ApplicationDetails(){return <><PageHeader title="Application EL-2026-48291" subtitle="Personal Loan • ₹8,50,000 • HDFC Bank" action={<Button to="/support" secondary>{t('Need help?')}</Button>}/><div className="grid lg:grid-cols-[1.1fr_.7fr] gap-6"><Card className="p-7"><SectionTitle title="Application timeline"/><Timeline/></Card><Card className="p-7 h-fit"><h3 className="font-bold">{t('Application summary')}</h3><div className="space-y-4 mt-5">{[['Loan amount','₹8,50,000'],['Tenure','60 months'],['Interest rate','8.50%'],['Application date','28 Aug 2026'],['Current status','Document Verification']].map(x=><div className="flex justify-between text-sm" key={x[0]}><span className="text-[var(--muted)]">{t(x[0])}</span><b>{t(x[1])}</b></div>)}</div><div className="mt-6 p-4 rounded-xl bg-[var(--warn-soft)] text-[var(--warn)] text-sm"><b>{t('Action required:')}</b> {t('Please upload your latest salary slip to continue verification.')}</div><Button to="/documents">{t('Upload document')}</Button></Card></div></>}
function MyLoans(){return <><PageHeader title="My Loans" subtitle="A clear view of your active borrowing and repayment progress."/><div className="grid md:grid-cols-4 gap-4 mb-6">{[['Active Loans','2'],['Total Outstanding','₹12,40,000'],['Next EMI','₹15,600'],['Total Interest','₹2,14,800']].map(x=><Card className="p-5" key={x[0]}><div className="text-xs text-[var(--muted)]">{t(x[0])}</div><div className="text-2xl font-black mt-2">{t(x[1])}</div></Card>)}</div><div className="grid lg:grid-cols-2 gap-6"><LoanPortfolio title="Personal Loan" amount="₹8,50,000" outstanding="₹6,20,000" emi="₹15,600" progress={45}/><LoanPortfolio title="Home Loan" amount="₹42,00,000" outstanding="₹38,20,000" emi="₹36,800" progress={18}/></div></>}
function LoanPortfolio({title,amount,outstanding,emi,progress}:{title:string;amount:string;outstanding:string;emi:string;progress:number}){return <Card className="p-6"><div className="flex justify-between"><div><h3 className="text-xl font-bold">{t(title)}</h3><div className="text-sm text-[var(--muted)] mt-1">{t('Original amount')} {t(amount)}</div></div><Status text="Active"/></div><div className="grid grid-cols-3 gap-4 mt-7"><Metric label="Outstanding" value={outstanding}/><Metric label="Monthly EMI" value={emi}/><Metric label="Next EMI" value="10 Sep 2026"/></div><div className="mt-7"><div className="flex justify-between text-xs"><span className="text-[var(--muted)]">{t('Loan progress')}</span><b>{t(progress)} {t('/ 60 EMIs paid')}</b></div><div className="h-2 bg-[var(--surface-3)] rounded-full mt-2"><div className="h-full bg-[var(--accent)] rounded-full" style={{width:`${progress/60*100}%`}}/></div></div><div className="flex gap-2 mt-6"><Button to="/payments">{t('Pay EMI')}</Button><Button secondary to="/applications/EL-2026-48291">{t('View Details')}</Button></div></Card>}
function Payments(){const [note,setNote]=useState('');return <><PageHeader title="EMI Payments" subtitle="Pay upcoming EMIs and keep your repayment history organized."/>{note&&<div className="mb-5 flex items-center gap-2 rounded-xl bg-[var(--surface-3)] px-4 py-3 text-sm"><Icons.Info size={16} className="text-[var(--accent-ink)] shrink-0"/>{t(note)}<button onClick={()=>setNote('')} className="ml-auto text-[var(--muted-2)] hover:text-[var(--ink-2)]" aria-label={t('Dismiss')}><Icons.X size={15}/></button></div>}<Card className="p-7 bg-[var(--panel-navy)] text-white"><div className="flex flex-col md:flex-row md:items-center justify-between gap-6"><div><div className="text-sm text-[var(--on-hero-soft)]">{t('Upcoming EMI • Personal Loan')}</div><div className="text-4xl font-black mt-2">₹15,600</div><div className="text-sm text-[var(--on-hero-soft)] mt-1">{t('Due 10 Sep 2026')}</div></div><Button onClick={()=>setNote('Payment flow opened — no real payment is processed in this demo.')}>{t('Pay EMI Now')} <Icons.ArrowRight size={16}/></Button></div></Card><Card className="mt-6 overflow-hidden"><div className="p-6"><SectionTitle title="Payment history"/></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-[var(--card-2)] text-xs text-[var(--muted)]"><tr>{['Date','Amount','Loan','Method','Status','Receipt'].map(x=><th className="px-5 py-4 text-left" key={x}>{t(x)}</th>)}</tr></thead><tbody>{payments.map(p=><tr className="border-t border-[var(--border-2)]" key={p.date}><td className="px-5 py-4">{t(p.date)}</td><td className="px-5 py-4 font-semibold">{t(p.amount)}</td><td className="px-5 py-4">{t(p.loan)}</td><td className="px-5 py-4">{t(p.method)}</td><td className="px-5 py-4"><Status text={p.status}/></td><td className="px-5 py-4"><button onClick={()=>setNote('Receipt generated for this instalment.')} className="text-[var(--accent-ink)] font-semibold">{t('Download')}</button></td></tr>)}</tbody></table></div></Card></>}
function CreditScore(){return <><PageHeader title="Credit Score" subtitle="Understand your credit health and the factors that influence it."/><div className="grid lg:grid-cols-[.8fr_1.2fr] gap-6"><Card className="p-8 text-center"><div className="text-sm text-[var(--muted)]">{t('Your credit score')}</div><div className="mx-auto mt-5 h-52 w-52 rounded-full border-[18px] border-green-100 border-t-green-500 border-r-green-500 flex items-center justify-center"><div><div className="text-5xl font-black">780</div><div className="text-[var(--ok)] font-bold mt-1">{t('Excellent')}</div></div></div><p className="text-sm text-[var(--muted)] mt-6">{t('Updated 01 Sep 2026')}</p></Card><Card className="p-7"><SectionTitle title="Score factors" subtitle="What is helping your credit profile."/><div className="space-y-5">{[['Payment History',92,'Excellent'],['Credit Utilization',78,'Good'],['Credit Age',84,'Excellent'],['Credit Mix',70,'Good'],['Recent Enquiries',88,'Excellent']].map(x=><div key={x[0]}><div className="flex justify-between text-sm"><b>{t(x[0])}</b><span className="text-[var(--muted)]">{t(x[2])}</span></div><div className="h-2 bg-[var(--surface-3)] rounded-full mt-2"><div className="h-full bg-[var(--ok-bright)] rounded-full" style={{width:`${x[1]}%`}}/></div></div>)}</div><div className="mt-7 rounded-2xl bg-[var(--accent-soft)] p-5"><h3 className="font-bold">{t('Improve your score')}</h3><div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">{['Pay EMIs on time','Maintain low credit utilization','Avoid unnecessary applications'].map(x=><div key={x} className="bg-[var(--card)] rounded-xl p-3 flex gap-2"><Icons.CheckCircle2 size={16} className="text-[var(--ok-bright)] shrink-0"/>{t(x)}</div>)}</div></div></Card></div></>}
type Doc={id:string;name:string;kind:string;date:string;status:string;file?:File};
const today=()=>new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const profileFields:[string,string][]=[['fullName','Full name'],['email','Email'],['phone','Phone'],['dob','Date of Birth'],['pan','PAN'],['address','Address'],['employment','Employment']];
function Documents(){
  const [docs,setDocs]=useState<Doc[]>([
    {id:'d1',name:'PAN Card',kind:'Identity',date:'28 Aug 2026',status:'Verified'},
    {id:'d2',name:'Aadhaar Card',kind:'Identity',date:'28 Aug 2026',status:'Verified'},
    {id:'d3',name:'Salary Slip — Aug 2026',kind:'Income',date:'01 Sep 2026',status:'Pending'},
    {id:'d4',name:'Bank Statement',kind:'Income',date:'28 Aug 2026',status:'Verified'},
    {id:'d5',name:'Address Proof',kind:'Address',date:'28 Aug 2026',status:'Verified'},
  ]);
  const [note,setNote]=useState('');

  const add=(f:File)=>{
    setDocs(d=>[{id:'u'+Date.now(),name:f.name,kind:'Uploaded',date:today(),status:'Pending',file:f},...d]);
    setNote(tf('{name} added.',{name:f.name}));
  };
  const remove=(id:string,name:string)=>{setDocs(d=>d.filter(x=>x.id!==id));setNote(tf('{name} deleted.',{name}))};
  /* Uploaded files live in the browser, so View/Download work on them for real. */
  const open=(d:Doc)=>{
    if(!d.file){setNote(tf('{name} is a sample record — no file attached.',{name:d.name}));return}
    const url=URL.createObjectURL(d.file);window.open(url,'_blank','noopener');
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  };
  const download=(d:Doc)=>{
    if(!d.file){setNote(tf('{name} is a sample record — nothing to download.',{name:d.name}));return}
    const url=URL.createObjectURL(d.file);const a=document.createElement('a');
    a.href=url;a.download=d.file.name;a.click();URL.revokeObjectURL(url);
  };

  return <><PageHeader title="Documents" subtitle="Manage your loan documents in one organized workspace."
    action={<label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold cursor-pointer hover:bg-[var(--accent-hover)]">
      <Icons.Upload size={16}/> {t('Upload document')}
      <input type="file" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)add(f);e.target.value=''}}/>
    </label>}/>
    <Card className="p-5 mb-6 flex items-center gap-4 bg-[var(--accent-soft)] border-[var(--accent-border)]">
      <div className="h-11 w-11 rounded-xl bg-[var(--card)] text-[var(--accent-ink)] flex items-center justify-center"><Icons.LockKeyhole/></div>
      <div><div className="font-bold">{t('Your documents are protected')}</div>
        <div className="text-sm text-[var(--muted)]">{t('Demo environment: uploaded files stay in your browser and are not sent anywhere.')}</div></div>
    </Card>
    {note&&<div className="mb-5 flex items-center gap-2 rounded-xl bg-[var(--surface-3)] px-4 py-3 text-sm">
      <Icons.Info size={16} className="text-[var(--accent-ink)] shrink-0"/>{t(note)}
      <button onClick={()=>setNote('')} className="ml-auto text-[var(--muted-2)] hover:text-[var(--ink-2)]" aria-label={t('Dismiss')}><Icons.X size={15}/></button>
    </div>}
    {docs.length===0
      ? <Card className="p-14 text-center text-[var(--muted)]">{t('No documents yet. Use “Upload document” to add one.')}</Card>
      : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {docs.map(d=>(
            <Card className="p-5" key={d.id}>
              <div className="flex justify-between">
                <div className="h-10 w-10 bg-[var(--surface-3)] rounded-xl flex items-center justify-center"><Icons.FileText size={18}/></div>
                <Status text={d.status}/>
              </div>
              <h3 className="font-bold mt-4 break-words">{t(d.name)}</h3>
              <div className="text-xs text-[var(--muted)] mt-1">{t(d.kind)} {t('• Uploaded')} {t(d.date)}</div>
              <div className="flex gap-4 mt-5 text-xs font-semibold">
                <button onClick={()=>open(d)} className="text-[var(--accent-ink)] hover:underline">{t('View')}</button>
                <button onClick={()=>download(d)} className="text-[var(--accent-ink)] hover:underline">{t('Download')}</button>
                <button onClick={()=>remove(d.id,d.name)} className="text-[var(--danger)] hover:underline">{t('Delete')}</button>
              </div>
            </Card>
          ))}
        </div>}
  </>;
}
function Offers(){return <><PageHeader title="Offers" subtitle="Personalized opportunities based on your profile and existing relationships."/><div className="grid lg:grid-cols-3 gap-5">{offers.map((o,i)=><Card className={`p-6 ${i===0?'ring-2 ring-[var(--accent-ring)]':''}`} key={o.title}><div className="flex justify-between"><span className="bg-[var(--accent-soft)] text-[var(--accent-ink)] rounded-full px-2.5 py-1 text-[10px] font-bold">{t(o.tag)}</span><Icons.MoreHorizontal size={18} className="text-[var(--muted-2)]"/></div><h3 className="text-xl font-bold mt-7">{t(o.title)}</h3><div className="text-3xl font-black mt-3">{t(o.amount)}</div><div className="text-sm text-[var(--muted)] mt-1">{t('Rate from')} {t(o.rate)}</div><div className="mt-7 p-4 bg-[var(--card-2)] rounded-xl text-sm">{t('Fast digital application with flexible repayment options.')}</div><Button to="/apply">{t('View offer')} <Icons.ArrowRight size={15}/></Button></Card>)}</div></>}
function InsuranceDetails(){const [quote,setQuote]=useState({name:'',phone:''});const [quoted,setQuoted]=useState(false);const id=location.pathname.split('/').pop()||'life';const x=insurance.find(a=>a[0]===id)||insurance[0];return <><PageHeader title={x[1]} subtitle={x[2]} action={<Button onClick={()=>document.getElementById('quote-form')?.scrollIntoView({behavior:'smooth',block:'center'})}>{t('Get a Quote')}</Button>}/><div className="grid lg:grid-cols-3 gap-6"><Card className="p-7 lg:col-span-2"><div className="grid md:grid-cols-3 gap-4">{[['Coverage',x[3]],['Premium estimate',x[4]],['Plans available','12+']].map(a=><div className="bg-[var(--card-2)] rounded-xl p-4" key={a[0]}><div className="text-xs text-[var(--muted)]">{t(a[0])}</div><b className="block mt-1">{t(a[1])}</b></div>)}</div><h3 className="font-bold mt-8">{t('Benefits')}</h3><div className="grid md:grid-cols-2 gap-3 mt-4">{['Flexible coverage options','Transparent policy terms','Digital claims support','Multiple plan choices','Family protection options','Easy renewal'].map(a=><div key={a} className="flex gap-2 p-3 border border-[var(--border-2)] rounded-xl text-sm"><Icons.CheckCircle2 size={17} className="text-[var(--ok-bright)]"/>{t(a)}</div>)}</div></Card><Card id="quote-form" className="p-7 h-fit"><h3 className="font-bold">{t('Get your personalized quote')}</h3>{quoted?<div className="mt-5 rounded-xl bg-[var(--ok-soft)] p-4 text-sm"><div className="flex items-center gap-2 font-semibold text-[var(--ok)]"><Icons.Check size={16}/>{t('Quote request received')}</div><p className="mt-1.5 text-[var(--ink-2)]">{t('Thanks')} {quote.name.split(" ")[0]||"there"} {t('— an advisor will call')} {quote.phone||"you"} {t('within one working day.')}</p><button onClick={()=>{setQuoted(false);setQuote({name:"",phone:""})}} className="mt-3 text-[var(--accent-ink)] font-semibold">{t('Request another')}</button></div>:<form onSubmit={e=>{e.preventDefault();setQuoted(true)}}><input required value={quote.name} onChange={e=>setQuote(q=>({...q,name:e.target.value}))} placeholder={t('Full name')} className="mt-5 w-full border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/><input required value={quote.phone} onChange={e=>setQuote(q=>({...q,phone:e.target.value}))} placeholder={t('Phone number')} className="mt-3 w-full border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/><button type="submit" className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">{t('Get Quote')}</button></form>}<div className="text-xs text-[var(--muted-2)] mt-4">{t('Prototype only. No real insurance policy is issued.')}</div></Card></div></>}
/* Plain-English definitions of the terms that appear on sanction letters and
   offer documents. Searchable, because the point is to look one up quickly. */
const glossary:[string,string][]=[
  ['Amortisation','The schedule that splits each EMI into interest and principal. Early instalments are mostly interest; later ones are mostly principal.'],
  ['Balance transfer','Moving an existing loan to another lender at a lower rate. Worth it only if the interest saved exceeds the processing and foreclosure costs of switching.'],
  ['CIBIL score','A credit score from 300 to 900 issued by TransUnion CIBIL. Most lenders want 700+ for unsecured lending, and price their best rates for 750+.'],
  ['Collateral','An asset pledged against a loan — property, gold or securities. Secured loans carry lower rates because the lender can recover the asset on default.'],
  ['Disbursal','The moment the sanctioned money actually reaches your account. Fees are often deducted here, so you receive slightly less than the sanctioned amount.'],
  ['EMI','Equated Monthly Instalment — the fixed amount you repay each month, covering both interest and principal.'],
  ['EMI in arrears / in advance','Arrears means the first EMI falls due a month after disbursal, which is standard. In advance means one instalment is collected upfront.'],
  ['External benchmark (EBLR)','Since 2019 most floating retail loans are priced off an external benchmark, usually the RBI repo rate, plus a fixed spread. Your rate moves when the benchmark does.'],
  ['Fixed vs floating rate','A fixed rate stays put for the agreed period; a floating rate moves with the benchmark. Floating loans to individuals carry no foreclosure charge by RBI rule.'],
  ['FOIR','Fixed Obligation to Income Ratio — the share of your net monthly income already committed to EMIs. Lenders typically cap total EMIs at 50–55% of income.'],
  ['Foreclosure','Repaying the entire outstanding balance before the tenure ends, closing the loan early.'],
  ['Guarantor','Someone who agrees to repay your loan if you cannot. A guarantor is liable for the debt; a co-applicant additionally shares ownership of the asset.'],
  ['Hard vs soft enquiry','A soft enquiry (an eligibility check) is invisible to other lenders and does not affect your score. A hard enquiry, made when you formally apply, is recorded and can dent it slightly.'],
  ['LTV — Loan to Value','The share of an asset’s value a lender will finance. Typically up to 90% for home loans, 75% for gold and 50–60% for loan against property.'],
  ['Moratorium','An agreed pause before repayment begins — common on education loans, covering the course period plus six to twelve months.'],
  ['NBFC','Non-Banking Financial Company. RBI-registered lenders that are not banks; often faster and more flexible on eligibility, usually at a slightly higher rate.'],
  ['Part-payment','Paying a lump sum toward the principal without closing the loan. It either shortens the tenure or reduces the EMI — shortening the tenure saves more interest.'],
  ['Prepayment penalty','A charge for repaying early. Prohibited on floating-rate loans to individuals; fixed-rate products may charge 2–4% of the outstanding amount.'],
  ['Processing fee','A one-off charge for underwriting the loan, typically 0.25% to 3% of the sanctioned amount, usually deducted at disbursal.'],
  ['Sanction letter','The lender’s formal offer — amount, rate, tenure, fees and conditions. Read it line by line before signing; the rate on it overrides anything quoted earlier.'],
  ['Tenure','How long you take to repay. A longer tenure lowers the EMI but raises total interest, often substantially.'],
  ['Top-up loan','Additional borrowing on an existing loan, usually at a rate close to the original and without fresh collateral.'],
];

function GlossaryPage(){
  const [q,setQ]=useState('');
  const list=useMemo(()=>{
    const s=q.trim().toLowerCase();
    return s?glossary.filter(([term,d])=>(term+d).toLowerCase().includes(s)):glossary;
  },[q]);
  return <><PageHeader title="Glossary" subtitle="Every term that turns up on a sanction letter or offer document, in plain English."/>
    <Card className="p-7">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold">{t('Lending terms A–Z')}</h2>
        <p className="text-sm text-[var(--muted)] mt-1">{t('Search for the word you are stuck on.')}</p>
      </div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('Search terms…')} aria-label={t('Search glossary')}
        className="w-full sm:w-[260px] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
    </div>
    {list.length===0
      ? <div className="py-10 text-center text-sm text-[var(--muted)]">{t('No term matches “')}{t(q)}”.</div>
      : <dl className="mt-5 grid gap-3 md:grid-cols-2">
          {list.map(([term,def])=>(
            <div key={term} className="rounded-xl border border-[var(--border)] p-4">
              <dt className="text-sm font-bold text-[var(--ink-strong)]">{t(term)}</dt>
              <dd className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)]">{t(def)}</dd>
            </div>
          ))}
        </dl>}
    <div className="mt-4 text-xs text-[var(--muted-2)]">{tf('{shown} of {total} terms',{shown:list.length,total:glossary.length})}</div>
  </Card>
  <Card className="p-6 mt-6 flex flex-wrap items-center justify-between gap-4">
    <div>
      <div className="font-bold">{t('Still not clear?')}</div>
      <div className="text-sm text-[var(--muted)] mt-1">{t('Ask an advisor — we will explain it against your own offer.')}</div>
    </div>
    <Button to="/support">{t('Contact support')} <Icons.ArrowRight size={15}/></Button>
  </Card></>;
}

function Support(){
  const [reqForm,setReqForm]=useState({type:'Application Support',appId:'',detail:''});
  const [ticket,setTicket]=useState('');
  const submit=(e:React.FormEvent)=>{
    e.preventDefault();
    setTicket('TKT-'+Math.floor(1000+Math.random()*8999));
  };
  return <><PageHeader title="Support Center" subtitle="Find answers or connect with our support team."/>
    <div className="grid md:grid-cols-3 gap-5">
      {([['Call','Speak to a support specialist','Phone','1800-000-LOAN'],['Email','Get help by email','Mail','support@eloans.demo'],['Live Chat','Chat with our team','MessageCircle','Available 9 AM – 6 PM']] as [string,string,string,string][]).map(x=>(
        <Card className="p-6" key={x[0]}>
          <Icon name={x[2] as keyof typeof Icons} className="text-[var(--accent-ink)]"/>
          <h3 className="font-bold mt-4">{t(x[0])}</h3>
          <p className="text-sm text-[var(--muted)] mt-1">{t(x[1])}</p>
          <div className="font-semibold mt-4">{t(x[3])}</div>
        </Card>
      ))}
    </div>
    <Card className="p-7 mt-6 max-w-4xl">
      {ticket
        ? <div className="text-center py-8">
            <div className="mx-auto h-14 w-14 rounded-full bg-[var(--ok-soft)] text-[var(--ok)] flex items-center justify-center"><Icons.Check size={28}/></div>
            <h2 className="text-xl font-bold mt-4">{tf('Ticket {id} created',{id:ticket})}</h2>
            <p className="text-[var(--muted)] mt-2 text-sm">{t('Our team replies within one working day. We’ll email updates to your registered address.')}</p>
            <Button secondary onClick={()=>{setTicket('');setReqForm({type:'Application Support',appId:'',detail:''})}}>{t('Raise another ticket')}</Button>
          </div>
        : <form onSubmit={submit}>
            <h2 className="text-xl font-bold">{t('Create a support ticket')}</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <select value={reqForm.type} onChange={e=>setReqForm(v=>({...v,type:e.target.value}))} className="border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]">
                {['Application Support','Payment Support','Document Support','Something else'].map(o=><option key={o}>{t(o)}</option>)}
              </select>
              <input value={reqForm.appId} onChange={e=>setReqForm(v=>({...v,appId:e.target.value}))} placeholder={t('Application ID (optional)')}
                className="border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
              <textarea required value={reqForm.detail} onChange={e=>setReqForm(v=>({...v,detail:e.target.value}))} placeholder={t('Describe your issue')}
                className="md:col-span-2 border border-[var(--border)] rounded-xl px-4 py-3 min-h-32 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
            </div>
            <button type="submit" className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">{t('Submit Ticket')}</button>
          </form>}
    </Card>
    <Card className="p-6 mt-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="font-bold">{t('Unsure what a term means?')}</div>
        <div className="text-sm text-[var(--muted)] mt-1">{t('Our glossary explains every word that appears on a sanction letter.')}</div>
      </div>
      <Button to="/glossary" secondary>{t('Open the glossary')} <Icons.ArrowRight size={15}/></Button>
    </Card></>;
}
function Offices(){return <><PageHeader title="Office Locations" subtitle="Connect with eLoans support and partner service teams."/><div className="grid lg:grid-cols-2 gap-6"><Card className="p-7"><div className="rounded-2xl bg-[var(--surface-3)] h-72 flex items-center justify-center text-[var(--muted-2)]"><div className="text-center"><Icons.MapPinned size={40} className="mx-auto"/><div className="font-semibold mt-3">{t('Map placeholder')}</div><div className="text-xs mt-1">{t('Connect a maps provider for production.')}</div></div></div></Card><Card className="p-7"><h2 className="text-2xl font-black">{t('eLoans.com')}</h2><div className="mt-6 space-y-5 text-sm"><div className="flex gap-3"><Icons.MapPin className="text-[var(--accent-ink)]"/>{t('Bhubaneswar, Odisha, India')}</div><div className="flex gap-3"><Icons.Phone className="text-[var(--accent-ink)]"/>{t('1800-000-LOAN')}</div><div className="flex gap-3"><Icons.Mail className="text-[var(--accent-ink)]"/>{t('support@eloans.demo')}</div><div className="flex gap-3"><Icons.Clock className="text-[var(--accent-ink)]"/>{t('Mon–Sat, 9:00 AM – 6:00 PM')}</div></div></Card></div></>}
function Profile(){
  const [p,setP]=useState<Record<string,string>>({fullName:'Puja Gouda',email:'puja@example.demo',phone:'',dob:'',pan:'',address:'',employment:''});
  const [saved,setSaved]=useState(false);
  const [panel,setPanel]=useState('');
  const [twoFa,setTwoFa]=useState(false);
  const [pw,setPw]=useState({cur:'',next:'',confirm:''});
  const [pwMsg,setPwMsg]=useState('');
  const set=(k:string,v:string)=>{setP(f=>({...f,[k]:v}));setSaved(false)};
  const completion=Math.round(profileFields.filter(([k])=>p[k].trim()).length/profileFields.length*100);

  const changePw=(e:React.FormEvent)=>{
    e.preventDefault();
    if(pw.next.length<8) return setPwMsg('New password must be at least 8 characters.');
    if(pw.next!==pw.confirm) return setPwMsg('The two new passwords do not match.');
    setPwMsg('Password updated.');setPw({cur:'',next:'',confirm:''});
  };
  const sessions=[['Chrome on Windows','Bhubaneswar, IN','Active now'],['Safari on iPhone','Bhubaneswar, IN','2 days ago'],['Edge on Windows','Cuttack, IN','12 days ago']];
  const security:[string,string,string][]=[['Two-factor Authentication','Add another layer of security','ShieldCheck'],['Notification Preferences','Choose how we contact you','Bell']];

  return <><PageHeader title="Profile & Security" subtitle="Manage your personal information and account preferences."/>
    <div className="grid lg:grid-cols-[.7fr_1.3fr] gap-6">
      <Card className="p-7">
        <div className="h-20 w-20 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-ink)] flex items-center justify-center text-2xl font-black">
          {(p.fullName.trim()||'P G').split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase()}
        </div>
        <h2 className="text-xl font-bold mt-4">{p.fullName||'Your name'}</h2>
        <div className="text-sm text-[var(--muted)]">{p.email||'Add an email'}</div>
        <div className="mt-6 h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent)] rounded-full transition-all" style={{width:`${completion}%`}}/>
        </div>
        <div className="text-xs text-[var(--muted)] mt-2">{t('Profile completion')} {t(completion)}%</div>
      </Card>
      <Card className="p-7">
        <h2 className="font-bold text-lg">{t('Personal information')}</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          {profileFields.map(([k,label])=>(
            <label className="text-sm font-semibold" key={k}>{t(label)}
              <input value={p[k]} onChange={e=>set(k,e.target.value)} placeholder={label}
                className="w-full mt-2 border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-5">
          <Button onClick={()=>setSaved(true)}>{t('Save changes')}</Button>
          {saved&&<span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--ok)]"><Icons.Check size={16}/>{t('Saved')}</span>}
        </div>
      </Card>
    </div>
    <Card className="p-7 mt-6">
      <h2 className="font-bold text-lg">{t('Security')}</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-5">
        {security.map(([title,desc,ic])=>(
          <button key={title} onClick={()=>{setPanel(panel===title?'':title);setPwMsg('')}}
            className={`text-left p-4 rounded-xl transition ${panel===title?'bg-[var(--accent-soft)] ring-2 ring-[var(--accent-ring)]':'bg-[var(--card-2)] hover:bg-[var(--surface-3)]'}`}>
            <Icon name={ic as keyof typeof Icons}/>
            <div className="font-semibold mt-3 text-sm flex items-center gap-2">{t(title)}
              {title.startsWith('Two')&&<span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${twoFa?'bg-[var(--ok-soft)] text-[var(--ok)]':'bg-[var(--border)] text-[var(--ink-2)]'}`}>{t(twoFa?'On':'Off')}</span>}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1">{t(desc)}</div>
          </button>
        ))}
      </div>

      {panel==='Change Password'&&<form onSubmit={changePw} className="mt-5 border-t border-[var(--border-2)] pt-5 max-w-lg">
        <div className="grid gap-3">
          {([['cur','Current password'],['next','New password'],['confirm','Confirm new password']] as [string,string][]).map(([k,label])=>(
            <label key={k} className="text-sm font-semibold">{t(label)}
              <input type="password" value={(pw as Record<string,string>)[k]} onChange={e=>{setPw(v=>({...v,[k]:e.target.value}));setPwMsg('')}} required
                className="w-full mt-1.5 border border-[var(--border)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)]">{t('Update password')}</button>
          {pwMsg&&<span className={`text-sm font-semibold ${pwMsg==='Password updated.'?'text-[var(--ok)]':'text-[var(--danger)]'}`}>{t(pwMsg)}</span>}
        </div>
      </form>}

      {panel==='Two-factor Authentication'&&<div className="mt-5 border-t border-[var(--border-2)] pt-5 max-w-lg">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-[var(--card-2)] p-4">
          <div><div className="font-semibold text-sm">{t('Authenticator app')}</div>
            <div className="text-xs text-[var(--muted)] mt-1">{t('Require a 6-digit code at sign-in.')}</div></div>
          <button onClick={()=>setTwoFa(v=>!v)} role="switch" aria-checked={twoFa} aria-label={t('Toggle two-factor authentication')}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${twoFa?'bg-[var(--ok-bright)]':'bg-slate-300'}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-[var(--card)] transition-all ${twoFa?'left-6':'left-1'}`}/>
          </button>
        </div>
        <p className="text-xs text-[var(--muted)] mt-3">{t(twoFa?'Two-factor authentication is on.':'Two-factor authentication is off.')}</p>
      </div>}

      {panel==='Login Activity'&&<div className="mt-5 border-t border-[var(--border-2)] pt-5">
        <div className="divide-y divide-[var(--border-2)]">
          {sessions.map(([device,place,when])=>(
            <div key={device} className="flex flex-wrap justify-between gap-2 py-3">
              <div><div className="font-semibold text-sm">{t(device)}</div><div className="text-xs text-[var(--muted)] mt-0.5">{t(place)}</div></div>
              <div className={`text-xs font-semibold ${when==='Active now'?'text-[var(--ok)]':'text-[var(--muted-2)]'}`}>{t(when)}</div>
            </div>
          ))}
        </div>
      </div>}
    </Card></>;
}
type Msg={from:'bot'|'you';text:string};

/* Keyword-matched replies drawn from the real product data, so the demo
   assistant answers with figures that match the rest of the app. */
function reply(q:string):string{
  const t=q.toLowerCase();
  const cheapest=[...banks].sort((a,b)=>parseFloat(a.rate)-parseFloat(b.rate))[0];
  const named=loans.find(l=>t.includes(l.name.toLowerCase().replace(' loan','')));
  if(/rate|interest|cheap|lowest/.test(t))
    return tf('The lowest personal loan rate right now is {rate} p.a. from {bank}, with a {fee} processing fee. Open Compare to see all {n} lenders side by side.',{rate:cheapest.rate,bank:cheapest.name,fee:cheapest.fee,n:banks.length});
  if(/emi|instal|month/.test(t))
    return 'Use the EMI calculator to see the monthly instalment for any amount, rate and tenure. As a guide, ₹10,00,000 at 8.50% over 5 years works out to about ₹20,517 a month.';
  if(/eligib|qualif|approv/.test(t))
    return 'Eligibility is a soft check, so it will not affect your credit score. Most lenders allow total EMIs up to 50% of net monthly income. Open Eligibility Check and I will match you against every partner.';
  if(/document|paper|kyc/.test(t))
    return 'For most unsecured loans you need PAN, Aadhaar, three months of bank statements, and salary slips or two years of ITR if self-employed. You upload once and we reuse it across lenders.';
  if(/insur/.test(t))
    return tf('We broker {n} categories of cover — life, health, term, travel, property and vehicle. Insurance is always priced separately from your loan, never bundled in.',{n:insurance.length});
  if(/gold/.test(t))
    return 'Gold loans settle fastest of anything we broker — no income proof or credit score needed, loan-to-value up to 75% of assessed value, and disbursal usually the same day.';
  if(named)
    return tf('{bank}: rates from {rate} p.a., up to {max}, over {tenure}. Want the eligibility criteria or the document list?',{bank:named.name,rate:named.rate,max:named.max,tenure:named.tenure});
  if(/apply|start|loan/.test(t))
    return 'I can start an application for you. Pick a product from Loan Categories, or tell me the amount and purpose and I will point you at the right lenders.';
  return 'I can help with interest rates, EMI estimates, eligibility, documents or insurance. Which of those would you like?';
}

function Assistant({onClose}:{onClose:()=>void}){
  const [messages,setMessages]=useState<Msg[]>([{from:'bot',text:'Hi! I’m your eLoans assistant. What type of loan are you looking for?'}]);
  const [draft,setDraft]=useState('');
  const feed=useRef<HTMLDivElement>(null);
  const options=['Personal Loan','Home Loan','Compare rates','Check eligibility'];

  const send=(text:string)=>{
    const q=text.trim();
    if(!q) return;
    setMessages(m=>[...m,{from:'you',text:q},{from:'bot',text:reply(q)}]);
    setDraft('');
  };
  /* keep the newest message in view */
  useEffect(()=>{const el=feed.current;if(el)el.scrollTop=el.scrollHeight},[messages]);

  return <div className="fixed bottom-5 right-5 z-[70] w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
    <div className="flex justify-between bg-[var(--panel-navy)] p-5 text-white">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500"><Icons.Sparkles size={18}/></div>
        <div><b>{t('AI Loan Assistant')}</b><div className="mt-1 text-xs text-[var(--on-hero-soft)]">{t('Demo assistant')}</div></div>
      </div>
      <button onClick={onClose} aria-label={t('Close assistant')}><Icons.X size={18}/></button>
    </div>
    <div ref={feed} className="scrollbar max-h-80 space-y-3 overflow-y-auto p-4">
      {messages.map((m,i)=>(
        <div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${m.from==='bot'?'bg-[var(--surface-3)]':'ml-auto bg-[var(--accent)] text-white'}`}>{t(m.text)}</div>
      ))}
      {messages.length===1&&<div className="flex flex-wrap gap-2">
        {options.map(x=><button key={x} onClick={()=>send(x)} className="rounded-full border border-[var(--border)] px-3 py-2 text-xs hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)]">{t(x)}</button>)}
      </div>}
    </div>
    <form onSubmit={e=>{e.preventDefault();send(draft)}} className="flex gap-2 border-t p-3">
      <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t('Ask about loans...')} aria-label={t('Message')}
        className="flex-1 rounded-xl bg-[var(--card-2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"/>
      <button type="submit" disabled={!draft.trim()} aria-label={t('Send message')}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-40">
        <Icons.Send size={16}/>
      </button>
    </form>
  </div>;
}

applyStoredTheme();
applyStoredLang();
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
