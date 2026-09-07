import {useEffect,useMemo,useState} from 'react';
import {Routes,Route,Link,NavLink,useParams,useLocation} from 'react-router-dom';
import {ArrowRight,ArrowUpRight,Menu,X,Check,ChevronDown,Star,Phone,Mail,MapPin,ShieldCheck,Zap,FileCheck2,Users,Clock,Percent,Landmark,Calculator,BadgeCheck,TrendingUp,Headphones,Lock,Building2,Sparkles,Send,Plus,Minus,ArrowDownUp,Bike,Car,CarFront,Gem,GraduationCap,House,MapPinned,Truck,WalletCards,BriefcaseBusiness,LayoutGrid,Banknote,LineChart,Globe,Info,HeartPulse,HeartHandshake,Shield,Plane,PiggyBank,Wallet,Ship,Coins,CandlestickChart,Briefcase} from 'lucide-react';
import {RATES_AS_OF} from './data';
import {loans,banks,insurance} from './catalog';
import {products,families} from './catalog';
import {infoPages} from './catalog';
import {useLang,t,tf,td} from './i18n';
import type {Block} from './pages';
import {BankLogo} from './BankLogo';
import type {Loan} from './data';

/* ---------- tokens ---------- */
const NAVY='linear-gradient(112deg,var(--hero-1) 0%,var(--hero-2) 57%,var(--hero-3) 100%)';
const DOTS='radial-gradient(circle at 1px 1px,var(--hero-dots) 1px,transparent 0)';
/* Sampled from the hero artwork's own left edge (#011850 top, #010e39 bottom),
   so the panel behind and the fade over it are the same blue as the image and
   no seam is visible where they meet. */
const ART_BASE='linear-gradient(180deg,#011850 0%,#010e39 100%)';
const ART_SCRIM='linear-gradient(to right,#01174b 0%,rgba(1,21,73,.97) 30%,rgba(1,20,70,.72) 46%,rgba(1,20,70,.22) 60%,transparent 72%)';
/* Sits over a banner used as a background. Dark enough for white copy to pass
   contrast over any part of the artwork, light enough that the image reads. */
const HERO_IMG_SCRIM='linear-gradient(to bottom,rgba(11,6,38,.86) 0%,rgba(11,6,38,.72) 55%,rgba(11,6,38,.86) 100%)';

const nav:[string,string,string][]=[
  ['Home','/','LayoutGrid'],
  ['Loan','/loans','Banknote'],
  ['Banks & Rates','/banks','Landmark'],
  ['Insurances','/insurance','ShieldCheck'],
  ['Calculator','/calculator','Calculator'],
  ['Share Market','/share-market','LineChart'],
  ['Global Business','/global-business','Globe'],
  ['About','/about','Info'],
  ['Services','/services','Sparkles'],
  ['Contact','/contact','Mail'],
];
/* "Banks & Rates" covers both the lender directory and the comparison table,
   so the nav item stays highlighted across the pair. */
const alsoActive:Record<string,string[]>={'/banks':['/compare']};

const stats=[['₹2,400 Cr','Loans disbursed'],['50+','Bank & NBFC partners'],['4.8/5','Average customer rating'],['24–48 hrs','Typical approval time']];

const steps=[
  ['Tell us what you need','Pick a loan type and share a few basic details. No paperwork to start.','FileCheck2'],
  ['Compare live offers','See real rates from 50+ lenders, ranked by what you actually qualify for.','Percent'],
  ['Upload documents once','Submit KYC and income proof a single time. We share it securely with your chosen lender.','ShieldCheck'],
  ['Get disbursed','Track approval in real time and receive funds directly in your bank account.','Zap'],
] as const;

const testimonials=[
  ['Rohit Sharma','Product Manager, Bengaluru','Got a personal loan at 8.6% when my own bank quoted 11.4%. The comparison took about four minutes and the money landed in two days.','Personal Loan · ₹12,00,000'],
  ['Ananya Iyer','Doctor, Chennai','I was dreading the home loan paperwork. My advisor handled the follow-ups with the bank and I only had to upload documents once.','Home Loan · ₹68,00,000'],
  ['Vikram Desai','Founder, Pune','Compared six lenders for working capital and picked the one with the lowest processing fee. The fee breakdown alone saved me ₹40,000.','Business Loan · ₹35,00,000'],
];

const faqs:[string,string][]=[
  ['Does checking my eligibility affect my credit score?','No. Eligibility checks on eLoans are soft enquiries, which are invisible to other lenders and have no effect on your score. A hard enquiry happens only when you formally accept an offer and the lender begins underwriting.'],
  ['What does eLoans charge me?','Nothing. We are paid a commission by the lender once a loan is disbursed. The rate you are shown is the rate you get — we do not mark it up, and there is no fee for comparing or applying.'],
  ['How fast can I actually get the money?','Personal and pre-approved loans are typically disbursed in 24–48 hours after document verification. Secured products such as home and mortgage loans take 7–21 days because they require legal and technical property checks.'],
  ['Which documents do I need?','For most unsecured loans: PAN, Aadhaar, three months of bank statements, and either salary slips or two years of ITR if you are self-employed. Secured loans additionally need property documents. You upload once and we reuse it across lenders.'],
  ['Can I apply with a low or no credit score?','Yes. Several of our NBFC partners underwrite on banking behaviour and income stability rather than score alone. Your offers will show which lenders are open to thin-file applicants.'],
  ['Can I prepay or foreclose my loan early?','Most of our partners allow prepayment. Floating-rate loans to individuals carry no foreclosure charge by RBI rule; fixed-rate products may charge 2–4%. The exact terms appear on every offer before you accept.'],
];

const services=[
  ['Loan advisory','A dedicated advisor reads your profile, flags what will and will not get approved, and shapes the application before it goes out.','Users'],
  ['Rate negotiation','We take your best competing offer back to the other lenders. On larger tickets this routinely moves the rate by 30–70 basis points.','Percent'],
  ['Balance transfer','Move an expensive existing loan to a cheaper lender. We calculate whether the switch actually pays for itself after fees.','TrendingUp'],
  ['Insurance & protection','Term, health and property cover priced separately from your loan, so you are never bundled into something you did not choose.','ShieldCheck'],
  ['Credit health','Free monthly score tracking with a plain-English report on what is helping and what is hurting your profile.','BadgeCheck'],
  ['Business finance','Working capital, machinery and commercial vehicle finance, including OD and invoice-backed lines.','Building2'],
];

const offices=[
  ['Bengaluru','HQ','Prestige Tech Park, Kadubeesanahalli, Outer Ring Road, Bengaluru 560103','+91 80 4718 2200'],
  ['Mumbai','West','One International Center, Tower 3, Senapati Bapat Marg, Mumbai 400013','+91 22 6821 4400'],
  ['Delhi NCR','North','DLF Cyber City, Building 8, Tower C, Sector 24, Gurugram 122002','+91 124 471 9900'],
  ['Hyderabad','South','Salarpuria Sattva Knowledge City, Raidurg, Hyderabad 500081','+91 40 6752 3100'],
];

/* per-product editorial content, keyed by loan id */
const iconMap={FileCheck2,Percent,ShieldCheck,Zap,TrendingUp,Users,BadgeCheck,Lock,Headphones,Building2,Landmark,Calculator,
  ArrowDownUp,Bike,Car,CarFront,Gem,GraduationCap,House,MapPinned,Truck,WalletCards,BriefcaseBusiness,
  LayoutGrid,Banknote,LineChart,Globe,Info,HeartPulse,HeartHandshake,Shield,Plane,PiggyBank,Wallet,Ship,Coins,CandlestickChart,Briefcase,Clock};
type IconName=keyof typeof iconMap;
function Ico({name,size=20,className=''}:{name:IconName|string;size?:number;className?:string}){
  const C=iconMap[name as IconName]??Sparkles;
  return <C size={size} className={className}/>;
}

/* ---------- primitives ---------- */
function Btn({to,href,children,variant='primary',size='md',className=''}:{to?:string;href?:string;children:React.ReactNode;variant?:'primary'|'ghost'|'light'|'outline';size?:'md'|'lg';className?:string}){
  const base='inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition whitespace-nowrap';
  const sizes={md:'px-5 py-2.5 text-sm',lg:'px-6 py-3.5 text-[15px]'}[size];
  const variants={
    primary:'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[0_8px_20px_rgba(18,99,233,.24)]',
    ghost:'text-[var(--ink)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]',
    light:'bg-[var(--card)] text-[var(--accent-ink)] hover:bg-[var(--accent-soft)] shadow-[0_8px_20px_rgba(3,20,60,.18)]',
    outline:'border border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]',
  }[variant];
  const cls=`${base} ${sizes} ${variants} ${className}`;
  if(href) return <a href={href} className={cls}>{children}</a>;
  return <Link to={to??'/'} className={cls}>{children}</Link>;
}

function Pill({children,tone='blue'}:{children:React.ReactNode;tone?:'blue'|'green'|'amber'|'slate'}){
  const tones={blue:'bg-[var(--accent-soft)] text-[var(--accent-ink)]',green:'bg-[var(--ok-soft)] text-[var(--ok)]',amber:'bg-[var(--warn-soft)] text-[var(--warn)]',slate:'bg-[var(--border-2)] text-[var(--ink-2)]'}[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones}`}>{children}</span>;
}

function Section({children,className='',tight=false}:{children:React.ReactNode;className?:string;tight?:boolean}){
  return <section className={`px-5 sm:px-8 ${tight?'py-12':'py-16 sm:py-20'} ${className}`}><div className="mx-auto w-full max-w-[1200px]">{children}</div></section>;
}

function Head({eyebrow,title,sub,center=true,light=false}:{eyebrow?:string;title:string;sub?:string;center?:boolean;light?:boolean}){
  return <div className={`${center?'text-center mx-auto max-w-[680px]':'max-w-[680px]'} mb-10`}>
    {eyebrow&&<div className={`text-[12px] font-bold uppercase tracking-[.14em] mb-3 ${light?'text-[var(--on-hero-dim)]':'text-[var(--accent-ink)]'}`}>{t(eyebrow)}</div>}
    <h2 className={`text-[28px] sm:text-[34px] font-extrabold leading-[1.15] tracking-[-.02em] ${light?'text-white':'text-[var(--ink-strong)]'}`}>{t(title)}</h2>
    {sub&&<p className={`mt-3 text-[15px] leading-relaxed ${light?'text-[var(--on-hero-soft)]':'text-[var(--muted)]'}`}>{t(sub)}</p>}
  </div>;
}

function Card({children,className='',hover=false}:{children:React.ReactNode;className?:string;hover?:boolean}){
  return <div className={`rounded-[14px] border border-[var(--border)] bg-[var(--card)] ${hover?'transition hover:-translate-y-1 hover:border-[var(--accent-border)] hover:shadow-[0_18px_40px_rgba(17,42,84,.10)]':''} ${className}`}>{children}</div>;
}

function Tile({name,tone='blue'}:{name:string;tone?:'blue'|'navy'}){
  return <div className={`grid h-11 w-11 place-items-center rounded-[10px] ${tone==='navy'?'bg-[var(--panel-navy)] text-[var(--on-hero-dim)]':'bg-[var(--accent-soft)] text-[var(--accent-ink)]'}`}><Ico name={name} size={20}/></div>;
}

/* ---------- chrome ---------- */
const SIDEBAR='lg:pl-[264px]';

/* ---------- shared blocks ---------- */
function LoanTile({l}:{l:Loan}){
  const {t}=useLang();
  return <Link to={`/loans/${l.id}`} className="group block">
    <Card hover className="h-full p-5">
      <div className="flex items-start justify-between">
        <Tile name={String(l.icon)}/>
        {l.tag&&<Pill tone="amber">{t(l.tag)}</Pill>}
      </div>
      <div className="mt-4 text-[15.5px] font-bold text-[var(--ink-strong)]">{t(l.name)}</div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)]">{t(l.description)}</p>
      <div className="mt-4 flex items-end justify-between border-t border-[var(--border-2)] pt-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--muted-2)]">{t(l.rate==='On request'?'Interest rate':'Starting at')}</div>
          <div className="text-[17px] font-extrabold text-[var(--accent-ink)]">{t(l.rate)}{l.rate!=='On request'&&<span className="text-[11px] font-semibold text-[var(--muted-2)]"> p.a.</span>}</div>
        </div>
        <span className="flex items-center gap-1 text-[12.5px] font-semibold text-[var(--ink-2)] transition group-hover:text-[var(--accent-ink)]">{t('Details')} <ArrowUpRight size={14}/></span>
      </div>
    </Card>
  </Link>;
}

function CtaBand(){
  return <div className="px-5 py-16 sm:px-8 sm:py-20">
    <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[18px] p-10 text-center sm:p-14" style={{background:NAVY}}>
      <div className="mx-auto max-w-[620px]">
        <h2 className="text-[28px] font-extrabold leading-[1.15] tracking-[-.02em] text-white sm:text-[34px]">{t('Find out what you qualify for in two minutes')}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--on-hero-soft)]">{t('A soft check, no impact on your credit score, and no obligation to accept anything you are shown.')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Btn to="/eligibility" variant="light" size="lg">{t('Check my eligibility')} <ArrowRight size={17}/></Btn>
          <Btn to="/compare" size="lg" className="border border-white/25 bg-[var(--card)]/10 text-white shadow-none hover:bg-[var(--card)]/20">{t('Compare all rates')}</Btn>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12.5px] text-[var(--on-hero-soft)]">
          {['No credit score impact','No documents to start','Free, always'].map(ttl=><span key={ttl} className="flex items-center gap-1.5"><Check size={14} className="text-[var(--ok-bright)]"/>{t(ttl)}</span>)}
        </div>
      </div>
    </div>
  </div>;
}

/* ---------- EMI calculator ---------- */
const inr=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');

function EMI({compact=false,defaultAmount=1000000,defaultRate=8.5}:{compact?:boolean;defaultAmount?:number;defaultRate?:number}){
  const [amount,setAmount]=useState(defaultAmount);
  const [rate,setRate]=useState(defaultRate);
  const [months,setMonths]=useState(60);
  const {emi,total,interest}=useMemo(()=>{
    const r=rate/1200;
    const e=r===0?amount/months:(amount*r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1);
    return {emi:e,total:e*months,interest:e*months-amount};
  },[amount,rate,months]);
  const pct=Math.round((interest/(interest+amount))*100);

  const Slider=({label,value,display,min,max,step,onChange}:{label:string;value:number;display:string;min:number;max:number;step:number;onChange:(n:number)=>void})=>(
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] font-semibold text-[var(--ink-2)]">{t(label)}</label>
        <span className="text-[15px] font-extrabold text-[var(--ink-strong)]">{t(display)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}
        className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--border)] accent-[var(--accent)]"
        style={{background:`linear-gradient(90deg,var(--accent) ${((value-min)/(max-min))*100}%,var(--border) ${((value-min)/(max-min))*100}%)`}}/>
    </div>
  );

  return <Card className={compact?'p-6':'p-6 sm:p-8'}>
    <div className={`grid gap-8 ${compact?'':'lg:grid-cols-[1.15fr_1fr]'}`}>
      <div className="space-y-6">
        <Slider label="Loan amount" value={amount} display={inr(amount)} min={50000} max={20000000} step={50000} onChange={setAmount}/>
        <Slider label="Interest rate" value={rate} display={`${rate.toFixed(2)}% p.a.`} min={6} max={24} step={0.05} onChange={setRate}/>
        <Slider label="Tenure" value={months} display={months>=12?tf('{n} years',{n:(months/12).toFixed(months%12?1:0)}):tf('{n} months',{n:months})} min={6} max={360} step={6} onChange={setMonths}/>
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--card-2)] p-6">
        <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-[var(--muted-2)]">{t('Monthly EMI')}</div>
        <div className="mt-1 text-[34px] font-extrabold leading-none tracking-[-.02em] text-[var(--ink-strong)]">{inr(emi)}</div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--border)]">
          <div className="h-full bg-[var(--accent)]" style={{width:`${100-pct}%`}}/>
        </div>
        <div className="mt-2.5 flex justify-between text-[11.5px] text-[var(--muted)]">
          <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"/>{t('Principal')} {100-pct}%</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-[var(--border)]"/>{t('Interest')} {t(pct)}%</span>
        </div>
        <dl className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4 text-[13.5px]">
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Principal')}</dt><dd className="font-semibold text-[var(--ink)]">{inr(amount)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Total interest')}</dt><dd className="font-semibold text-[var(--ink)]">{inr(interest)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Total payable')}</dt><dd className="font-extrabold text-[var(--ink-strong)]">{inr(total)}</dd></div>
        </dl>
        <Btn to="/apply" className="mt-5 w-full">{t('Apply at this rate')} <ArrowRight size={16}/></Btn>
      </div>
    </div>
  </Card>;
}

/* ---------- FAQ ---------- */
function Faq({items}:{items:[string,string][]}){
  const [open,setOpen]=useState<number|null>(0);
  return <div className="mx-auto max-w-[820px] space-y-3">
    {items.map(([q,a],i)=>(
      <Card key={q} className="overflow-hidden">
        <button onClick={()=>setOpen(open===i?null:i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
          <span className="text-[15px] font-bold text-[var(--ink-strong)]">{t(q)}</span>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-ink)]">{open===i?<Minus size={15}/>:<Plus size={15}/>}</span>
        </button>
        {open===i&&<div className="border-t border-[var(--border-2)] px-5 py-4 text-[14px] leading-relaxed text-[var(--ink-2)]">{t(a)}</div>}
      </Card>
    ))}
  </div>;
}

/* ---------- pages ---------- */
/* A hero can be replaced wholesale by artwork that already carries the same
   copy. The image is English-only and its text is unreadable when small, so
   it is used only for English and only above a usable width; otherwise the
   live, translated hero renders as normal. */
type CrumbBox={left:string;top:string;width:string;height:string};
const DEFAULT_CRUMB:CrumbBox={left:'3.1%',top:'20%',width:'3.6%',height:'6%'};

/* Every info page is rendered by one component, so a page that has its own
   banner artwork is looked up by id here rather than wired at a call site. */
type HeroBanner={image:string;imageAspect:string;mobileImage:string;mobileAspect:string;crumbBox?:CrumbBox};
const infoPageBanners:Record<string,HeroBanner>={
  'credit/score':{
    image:'/credit-score-hero.webp',imageAspect:'1600 / 533',
    mobileImage:'/credit-score-hero-m.webp',mobileAspect:'730 / 533',
    crumbBox:{left:'3.2%',top:'20.5%',width:'3.2%',height:'5.5%'},
  },
  'cards/credit-cards':{
    image:'/cards-hero.webp',imageAspect:'2170 / 725',
    mobileImage:'/cards-hero-m.webp',mobileAspect:'940 / 725',
    crumbBox:{left:'3.3%',top:'24.5%',width:'3.2%',height:'5%'},
  },
  'rates/best':{
    image:'/rates-best-hero.webp',imageAspect:'2170 / 725',
    mobileImage:'/rates-best-hero-m.webp',mobileAspect:'860 / 725',
    crumbBox:{left:'2.6%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'rates/alerts':{
    image:'/rates-alerts-hero.webp',imageAspect:'2163 / 727',
    mobileImage:'/rates-alerts-hero-m.webp',mobileAspect:'1103 / 727',
    crumbBox:{left:'3.1%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'rates/track':{
    image:'/rates-track-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/rates-track-hero-m.webp',mobileAspect:'1122 / 724',
    crumbBox:{left:'3.1%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'rates/lowest':{
    image:'/rates-lowest-hero.webp',imageAspect:'2164 / 727',
    mobileImage:'/rates-lowest-hero-m.webp',mobileAspect:'1014 / 727',
    crumbBox:{left:'3.0%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'rates/pre-approved':{
    image:'/rates-pre-approved-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/rates-pre-approved-hero-m.webp',mobileAspect:'972 / 724',
    crumbBox:{left:'3.0%',top:'23%',width:'3.0%',height:'5%'},
  },
  'insurance/health':{
    image:'/ins-health-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/ins-health-hero-m.webp',mobileAspect:'962 / 724',
    crumbBox:{left:'3.1%',top:'24%',width:'3.0%',height:'5%'},
  },
  'insurance/life':{
    image:'/ins-life-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/ins-life-hero-m.webp',mobileAspect:'997 / 724',
    crumbBox:{left:'3.2%',top:'23%',width:'3.0%',height:'5%'},
  },
  'insurance/vehicle':{
    image:'/ins-vehicle-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/ins-vehicle-hero-m.webp',mobileAspect:'1152 / 724',
    crumbBox:{left:'3.1%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'insurance/loan-protection':{
    image:'/ins-loan-protection-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/ins-loan-protection-hero-m.webp',mobileAspect:'1082 / 724',
    crumbBox:{left:'3.1%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'insurance/travel':{
    image:'/ins-travel-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/ins-travel-hero-m.webp',mobileAspect:'1212 / 724',
    crumbBox:{left:'3.2%',top:'23.5%',width:'2.9%',height:'5%'},
  },
  'insurance/buy-renew':{
    image:'/ins-buy-renew-hero.webp',imageAspect:'1884 / 835',
    mobileImage:'/ins-buy-renew-hero-m.webp',mobileAspect:'669 / 620',
    crumbBox:{left:'3.9%',top:'25%',width:'3.5%',height:'5%'},
  },
  'investments/live-market':{
    image:'/inv-live-market-hero.webp',imageAspect:'1884 / 835',
    mobileImage:'/inv-live-market-hero-m.webp',mobileAspect:'934 / 660',
    crumbBox:{left:'3.9%',top:'22.5%',width:'3.9%',height:'5%'},
  },
  'investments/mutual-funds':{
    image:'/inv-mutual-funds-hero.webp',imageAspect:'1884 / 835',
    mobileImage:'/inv-mutual-funds-hero-m.webp',mobileAspect:'1004 / 680',
    crumbBox:{left:'3.7%',top:'24%',width:'3.8%',height:'5%'},
  },
  'investments/digital-gold':{
    image:'/inv-digital-gold-hero.webp',imageAspect:'1884 / 835',
    mobileImage:'/inv-digital-gold-hero-m.webp',mobileAspect:'1004 / 700',
    crumbBox:{left:'3.9%',top:'23.6%',width:'3.7%',height:'5%'},
  },
  'investments/stocks':{
    image:'/inv-stocks-hero.webp',imageAspect:'1884 / 835',
    mobileImage:'/inv-stocks-hero-m.webp',mobileAspect:'1024 / 710',
    crumbBox:{left:'3.8%',top:'23.6%',width:'3.6%',height:'5%'},
  },
  'investments/fixed-deposits':{
    image:'/inv-fixed-deposits-hero.webp',imageAspect:'1884 / 835',
    mobileImage:'/inv-fixed-deposits-hero-m.webp',mobileAspect:'1074 / 670',
    crumbBox:{left:'3.9%',top:'23.6%',width:'3.5%',height:'5%'},
  },
  'investments/portfolio':{
    image:'/inv-portfolio-hero.webp',imageAspect:'1884 / 835',
    mobileImage:'/inv-portfolio-hero-m.webp',mobileAspect:'869 / 710',
    crumbBox:{left:'3.7%',top:'23%',width:'3.8%',height:'5%'},
  },
};

/* Loan product pages are also rendered by one component, so their artwork is
   looked up by product id the same way. A product with no entry keeps the
   plain gradient hero. */
const loanBanners:Record<string,HeroBanner>={
  'personal':{
    image:'/loan-personal-hero.webp',imageAspect:'2167 / 725',
    mobileImage:'/loan-personal-hero-m.webp',mobileAspect:'987 / 725',
    crumbBox:{left:'3.3%',top:'27%',width:'3.0%',height:'5%'},
  },
  'instant-personal':{
    image:'/loan-instant-personal-hero.webp',imageAspect:'2167 / 726',
    mobileImage:'/loan-instant-personal-hero-m.webp',mobileAspect:'967 / 726',
    crumbBox:{left:'3.5%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'salary-advance':{
    image:'/loan-salary-advance-hero.webp',imageAspect:'2164 / 727',
    mobileImage:'/loan-salary-advance-hero-m.webp',mobileAspect:'1124 / 727',
    crumbBox:{left:'3.4%',top:'23.5%',width:'3.0%',height:'5%'},
  },
  'debt-consolidation':{
    image:'/loan-debt-consolidation-hero.webp',imageAspect:'2170 / 725',
    mobileImage:'/loan-debt-consolidation-hero-m.webp',mobileAspect:'1080 / 725',
    crumbBox:{left:'2.6%',top:'24%',width:'3.0%',height:'5%'},
  },
  'medical-emergency':{
    image:'/loan-medical-emergency-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/loan-medical-emergency-hero-m.webp',mobileAspect:'1022 / 724',
    crumbBox:{left:'3.3%',top:'26.5%',width:'2.9%',height:'5%'},
  },
  'travel':{
    image:'/loan-travel-hero.webp',imageAspect:'2172 / 724',
    mobileImage:'/loan-travel-hero-m.webp',mobileAspect:'1042 / 724',
    crumbBox:{left:'3.3%',top:'26%',width:'2.9%',height:'5%'},
  },
  'wedding':{
    image:'/loan-wedding-hero.webp',imageAspect:'2155 / 730',
    mobileImage:'/loan-wedding-hero-m.webp',mobileAspect:'975 / 730',
    crumbBox:{left:'3.3%',top:'24%',width:'3.0%',height:'5%'},
  },
  'business':{
    image:'/loan-business-hero.webp',imageAspect:'2164 / 727',
    mobileImage:'/loan-business-hero-m.webp',mobileAspect:'1154 / 727',
    crumbBox:{left:'3.4%',top:'24%',width:'3.1%',height:'5%'},
  },
};

function PageHeroImage({src,aspect,alt,crumbBox=DEFAULT_CRUMB}:{src:string;aspect:string;alt:string;crumbBox?:CrumbBox}){
  const {t}=useLang();
  const [ok,setOk]=useState(true);
  if(!ok) return null;
  return <div className="relative">
    <img src={src} alt={t(alt)} decoding="async" onError={()=>setOk(false)}
      className="block w-full select-none" style={{aspectRatio:aspect,objectFit:'cover'}}/>
    {/* The breadcrumb is painted into the artwork; keep "Home" clickable. */}
    <Link to="/" aria-label={t('Home')}
      className="absolute rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={crumbBox}/>
  </div>;
}

function PageHero({eyebrow,title,sub,crumb,image,imageAspect,mobileImage,mobileAspect,crumbBox,art}:{eyebrow?:string;title:string;sub?:string;crumb?:string;image?:string;imageAspect?:string;mobileImage?:string;mobileAspect?:string;crumbBox?:CrumbBox;art?:string}){
  const {lang}=useLang();
  const [wide,setWide]=useState(typeof window!=='undefined'&&window.innerWidth>=900);
  const [artOk,setArtOk]=useState(true);
  useEffect(()=>{
    const on=()=>setWide(window.innerWidth>=900);
    on(); window.addEventListener('resize',on);
    return ()=>window.removeEventListener('resize',on);
  },[]);
  if(image&&imageAspect&&lang==='en'&&wide) return <PageHeroImage src={image} aspect={imageAspect} alt={title} crumbBox={crumbBox}/>;
  /* Two fallbacks for when the full banner cannot be used.
     Narrow screens get the artwork as its own clear band above the copy -
     cropped to the illustration so it reads properly at phone size.
     Wide screens in a language the banner was not drawn in keep it as a
     blurred backdrop, where there is room for copy over the top of it. */
  const showImageBand=Boolean(mobileImage)&&artOk&&!wide;
  const showImageBg=Boolean(image)&&artOk&&wide;
  /* `art` is decorative artwork with no baked-in copy, so unlike `image` it
     sits behind the live text: every language and every width keeps working. */
  const showArt=Boolean(art)&&artOk&&wide;
  /* The artwork is deep blue and the default hero is purple, so anchoring it
     to one side reads as two glued-together halves. Instead it fills the whole
     hero and is scrimmed with its own left-edge blue, which blends invisibly
     and leaves a single continuous panel. */
  return <div className="relative overflow-hidden" style={{background:showArt?ART_BASE:NAVY}}>
    {showArt&&<>
      <img src={art} alt="" aria-hidden="true" decoding="async" onError={()=>setArtOk(false)}
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[64%] select-none object-cover object-[72%_center]"/>
      <div className="pointer-events-none absolute inset-0" style={{background:ART_SCRIM}}/>
    </>}
    {showImageBg&&<>
      {/* Blurred: these banners carry their own headline and labels, which
          would otherwise read as competing text behind the live copy. Scaled
          up slightly so the blur leaves no soft edge. */}
      <img src={image} alt="" aria-hidden="true" decoding="async" onError={()=>setArtOk(false)}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-[88%_center]"
        style={{filter:'blur(3px)',transform:'scale(1.06)'}}/>
      <div className="pointer-events-none absolute inset-0" style={{background:HERO_IMG_SCRIM}}/>
    </>}
    {!showArt&&!showImageBg&&<div className="pointer-events-none absolute inset-0" style={{backgroundImage:DOTS,backgroundSize:'22px 22px',maskImage:'linear-gradient(to right,transparent 45%,#000 100%)'}}/>}
    {/* Phone: a pre-cropped mobile asset - the illustration only, with the
        baked-in headline already cut away - shown whole and unblurred above
        the copy, so nothing of it is clipped at phone width. */}
    {showImageBand&&<img src={mobileImage} alt="" aria-hidden="true" decoding="async" onError={()=>setArtOk(false)}
      className="relative block w-full select-none"
      style={{aspectRatio:mobileAspect,objectFit:'cover'}}/>}
    <div className={`relative mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${showArt?'py-10 sm:py-12':'py-14 sm:py-20'}`}>
      {crumb&&<div className="mb-4 flex items-center gap-2 text-[12.5px] text-[var(--on-hero-soft)]"><Link to="/" className="hover:text-white">{t('Home')}</Link><span>/</span><span className="text-white">{t(crumb)}</span></div>}
      {eyebrow&&<div className="mb-3 text-[12px] font-bold uppercase tracking-[.14em] text-[var(--on-hero-dim)]">{t(eyebrow)}</div>}
      {/* Slightly tighter type while art shows: the copy column is only half
          width, and long languages (Tamil, Telugu) otherwise wrap to five
          lines and stretch the banner out of proportion. */}
      <h1 className={`font-black leading-[1.08] tracking-[-.025em] text-white ${showArt?'max-w-[50%] text-[28px] sm:text-[36px]':'max-w-[760px] text-[34px] sm:text-[44px]'}`}>{t(title)}</h1>
      {sub&&<p className={`mt-4 text-[15.5px] leading-relaxed text-[var(--on-hero-soft)] ${showArt?'max-w-[46%]':'max-w-[620px]'}`}>{t(sub)}</p>}
    </div>
  </div>;
}

export function LoansIndex(){
  const {t}=useLang();
  const [q,setQ]=useState('');
  const list=useMemo(()=>loans.filter(l=>(l.name+l.description).toLowerCase().includes(q.toLowerCase())),[q]);
  return <>
    <PageHero eyebrow="Loan products" crumb="Loans" title="Every loan we broker, with real starting rates"
      sub={tf('{n} products across eight families of secured and unsecured lending. Each page sets out who it suits, what you need, what it costs and what to weigh up.',{n:products.length})}
      image="/loans-hero.webp" imageAspect="1600 / 533"
      mobileImage="/loans-hero-m.webp" mobileAspect="750 / 533"/>
    <Section>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="text-[14px] text-[var(--muted)]">{tf('{shown} of {total} products',{shown:list.length,total:loans.length})}</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('Search loan products…')}
          className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[14px] outline-none placeholder:text-[var(--muted-2)] focus:border-[var(--accent)] sm:w-[300px]"/>
      </div>
      {list.length===0
        ? <Card className="p-14 text-center text-[14px] text-[var(--muted)]">{t('No products match "')}{t(q)}".</Card>
        : <div className="space-y-10">
            {families.map(fam=>{
              const inFam=list.filter(l=>products.find(x=>x.id===l.id)?.family===fam.id);
              if(!inFam.length) return null;
              return <div key={fam.id}>
                <div className="mb-4 flex items-start gap-3">
                  <Tile name={String(fam.icon)}/>
                  <div>
                    <h2 className="text-[19px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(fam.name)}</h2>
                    <p className="mt-0.5 text-[13.5px] text-[var(--muted)]">{t(fam.blurb)}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {inFam.map(l=><LoanTile key={l.id} l={l}/>)}
                </div>
              </div>;
            })}
          </div>}
    </Section>
    <CtaBand/>
  </>;
}

/* Income-tax deductions that apply to a few loan types. Shown only where they
   are real — most borrowing carries none, and implying otherwise would be
   worse than saying nothing. */
const taxBenefits:Record<string,{section:string;cap:string;what:string}[]>={
  home:[
    {section:'Section 24(b)',cap:'Up to ₹2,00,000 a year',what:'Interest paid on a home loan for a self-occupied property. There is no upper limit if the property is let out.'},
    {section:'Section 80C',cap:'Up to ₹1,50,000 a year',what:'Principal repaid, plus stamp duty and registration charges in the year of purchase. Shares the same ₹1.5 lakh ceiling as your other 80C investments.'},
    {section:'Section 80EE / 80EEA',cap:'₹50,000 / ₹1,50,000',what:'Extra interest deduction for first-time buyers, but only on loans sanctioned inside the original windows. 80EEA closed to new sanctions on 31 March 2022.'},
  ],
  education:[
    {section:'Section 80E',cap:'No upper limit',what:'The full interest paid on an education loan for yourself, your spouse or your children, claimable for up to 8 years from the year repayment starts. Principal is not deductible.'},
  ],
};

function TaxPanel({loanId}:{loanId:string}){
  const {t}=useLang();
  const rows=taxBenefits[loanId];
  if(!rows) return null;
  return <Card className="p-6 sm:p-8">
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] bg-[var(--ok-soft)] text-[var(--ok)]"><Percent size={18}/></span>
      <div>
        <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Tax benefits')}</h2>
        <p className="mt-1 text-[13.5px] text-[var(--muted)]">{t('Deductions you can claim against this loan.')}</p>
      </div>
    </div>
    <div className="mt-5 space-y-3">
      {rows.map(r=>(
        <div key={r.section} className="rounded-[11px] border border-[var(--border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[14.5px] font-bold text-[var(--ink-strong)]">{t(r.section)}</span>
            <Pill tone="green">{t(r.cap)}</Pill>
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(r.what)}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--muted-2)]">
      {t('These deductions are available under the')} <b className="font-semibold text-[var(--ink-2)]">{t('old tax regime')}</b> {t('only — the new regime does not allow them for a self-occupied property. Limits are those in force for FY 2025–26 and change with the Finance Act. Confirm your position with a tax adviser before relying on it.')}
    </p>
  </Card>;
}

export function LoanProduct(){
  const {id=''}=useParams();
  const {t}=useLang();
  const p=products.find(x=>x.id===id);
  const loan=loans.find(l=>l.id===id);
  if(!p||!loan) return <NotFound/>;
  const fam=families.find(f=>f.id===p.family);
  const rateNum=parseFloat(p.rate||'')||9;
  const productFaqs=p.faqs;
  return <>
    <PageHero eyebrow={fam?.name??'Loan product'} crumb={t(loan.name)} title={t(loan.name)} sub={p.what.split('. ')[0]+'.'} {...loanBanners[p.id]}/>
    <div className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
        {([['Starting rate',p.rate?`${p.rate} p.a.`:t('On request')],['Loan amount',p.max],['Tenure',p.tenure],['Category',fam?.name??'Loan']] as [string,string][]).map(([k,v])=>(
          <div key={k} className="py-7">
            <div className="text-[12px] uppercase tracking-wide text-[var(--muted-2)]">{t(k)}</div>
            <div className="mt-1 text-[20px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(v)}</div>
          </div>
        ))}
      </div>
    </div>

    <Section>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <Card className="p-6 sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('About this loan')}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-2)]">{t(p.what)}</p>
            <h3 className="mt-6 text-[15px] font-bold text-[var(--ink-strong)]">{t('Who it suits')}</h3>
            <ul className="mt-3 space-y-2.5">
              {p.suitedTo.map(x=>(
                <li key={x} className="flex gap-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[var(--ok-bright)]" strokeWidth={2.6}/>{t(x)}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-[15px] font-bold text-[var(--ink-strong)]">{t('Common uses')}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.uses.map(u=><Pill key={u} tone="slate">{t(u)}</Pill>)}
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Who qualifies')}</h2>
            <ul className="mt-4 space-y-3">
              {p.eligibility.map(g=>(
                <li key={g} className="flex gap-3 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
                  <Check size={17} className="mt-0.5 shrink-0 text-[var(--ok-bright)]" strokeWidth={2.6}/>{t(g)}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Documents you will need')}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {p.docs.map(doc=>(
                <div key={doc} className="flex items-start gap-3 rounded-[10px] border border-[var(--border-2)] px-4 py-3">
                  <FileCheck2 size={17} className="mt-0.5 shrink-0 text-[var(--accent-ink)]"/>
                  <span className="text-[13.5px] leading-relaxed text-[var(--ink-2)]">{t(doc)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-[var(--border-2)] px-6 py-5 sm:px-8">
              <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Fees and charges')}</h2>
            </div>
            <div className="divide-y divide-[var(--border-2)]">
              {p.fees.map(([k,v])=>(
                <div key={k} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <span className="text-[14px] font-semibold text-[var(--ink)]">{t(k)}</span>
                  <span className="text-[13.5px] text-[var(--muted)]">{t(v)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Repayment')}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-2)]">{t(p.repayment)}</p>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-[18px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Advantages')}</h2>
              <ul className="mt-4 space-y-3">
                {p.advantages.map(x=>(
                  <li key={x} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[var(--ink-2)]">
                    <Check size={16} className="mt-0.5 shrink-0 text-[var(--ok-bright)]" strokeWidth={2.6}/>{t(x)}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <h2 className="text-[18px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Things to consider')}</h2>
              <ul className="mt-4 space-y-3">
                {p.considerations.map(x=>(
                  <li key={x} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[var(--ink-2)]">
                    <Info size={16} className="mt-0.5 shrink-0 text-[var(--warn)]"/>{t(x)}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <TaxPanel loanId={loan.id}/>

          <div>
            <h2 className="mb-5 text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Common questions')}</h2>
            <div className="[&>div]:max-w-none"><Faq items={productFaqs}/></div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-[92px] lg:self-start">
          <div className="rounded-[14px] p-6 text-white" style={{background:NAVY}}>
            <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-[var(--on-hero-dim)]">{t('Ready to apply?')}</div>
            <div className="mt-2 text-[20px] font-extrabold leading-snug">{t('Get matched with lenders for your')} {loan.name.toLowerCase()}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--on-hero-soft)]">{t('Soft check only. Nothing here touches your credit score.')}</p>
            <Btn to="/apply" variant="light" className="mt-5 w-full">{t('Apply now')} <ArrowRight size={16}/></Btn>
            <Btn to="/eligibility" className="mt-2 w-full border border-white/25 bg-[var(--card)]/10 text-white shadow-none hover:bg-[var(--card)]/20">{t('Check eligibility')}</Btn>
          </div>
          <Card className="p-5">
            <div className="text-[14px] font-bold text-[var(--ink-strong)]">{t('Estimate your EMI')}</div>
            <p className="mt-1 text-[12.5px] text-[var(--muted)]">{t("Pre-filled at this product's starting rate.")}</p>
          </Card>
          <EMI compact defaultRate={rateNum} defaultAmount={1000000}/>
        </aside>
      </div>
    </Section>

    <div className="bg-[var(--card)]">
      <Section tight>
        <Head eyebrow="Related" title="Other products people compare this with" center={false}/>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loans.filter(l=>l.id!==loan.id&&products.find(x=>x.id===l.id)?.family===p.family).concat(loans.filter(l=>l.id!==loan.id)).slice(0,4).map(l=><LoanTile key={l.id} l={l}/>)}
        </div>
      </Section>
    </div>
    <CtaBand/>
  </>;
}

export function BanksPage(){
  return <>
    <PageHero eyebrow="Partner lenders" crumb="Banks" title="The banks and NBFCs behind your offer"
      sub="Every partner is RBI-registered. We route your application to the ones whose credit policy actually fits your profile."
      image="/banks-hero.webp" imageAspect="2172 / 724"
      mobileImage="/banks-hero-m.webp" mobileAspect="1022 / 724"
      crumbBox={{left:'2.7%',top:'20.5%',width:'3.2%',height:'5.5%'}}/>
    <div className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-3.5 text-[12.5px] text-[var(--muted)] sm:px-8">
        {t('Personal loan starting rates as published by each lender,')} {t(RATES_AS_OF)}{t('. Advertised minimums for the strongest profiles — your offer may differ.')}
      </div>
    </div>
    <Section>
      <div className="grid gap-5 lg:grid-cols-2">
        {banks.map(b=>(
          <Card key={b.id} hover className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <BankLogo id={b.id} name={b.name} initials={b.initials} w={124} h={38}/>
                <div>
                  <div className="text-[17px] font-extrabold text-[var(--ink-strong)]">{t(b.name)}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[12.5px] font-semibold text-[var(--ink)]"><Star size={13} className="fill-[var(--warn-bright)] text-[var(--warn-bright)]"/>{t(b.rating)}</span>
                    <Pill tone="green">{tf('{speed} approval',{speed:t(b.approval)})}</Pill>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wide text-[var(--muted-2)]">{t('From')}</div>
                <div className="text-[26px] font-extrabold tracking-[-.02em] text-[var(--accent-ink)]">{t(b.rate)}</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] bg-[var(--border-2)]">
              {([['Max amount',b.amount],['Max tenure',b.tenure],['Processing fee',b.fee]] as [string,string][]).map(([k,v])=>(
                <div key={k} className="bg-[var(--card-2)] px-3 py-3 text-center">
                  <div className="text-[10.5px] uppercase tracking-wide text-[var(--muted-2)]">{t(k)}</div>
                  <div className="mt-0.5 text-[14px] font-bold text-[var(--ink)]">{t(v)}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Btn to="/apply" className="flex-1">{t('Apply now')}</Btn>
              <Btn to="/compare" variant="outline" className="flex-1">{t('Compare')}</Btn>
            </div>
          </Card>
        ))}
      </div>
    </Section>
    <CtaBand/>
  </>;
}

export function ComparePage(){
  const {t}=useLang();
  const [sort,setSort]=useState<'rate'|'fee'|'rating'>('rate');
  const rows=useMemo(()=>[...banks].sort((a,b)=>{
    if(sort==='rating') return b.rating-a.rating;
    return parseFloat(a[sort==='rate'?'rate':'fee'])-parseFloat(b[sort==='rate'?'rate':'fee']);
  }),[sort]);
  const best=rows[0];
  return <>
    <PageHero eyebrow="Compare" crumb="Compare" title="Put every lender side by side"
      sub="Sort by what matters to you. The cheapest headline rate is not always the cheapest loan once fees are counted."
      image="/rates-compare-hero.webp" imageAspect="2164 / 727"
      mobileImage="/rates-compare-hero-m.webp" mobileAspect="979 / 727"
      crumbBox={{left:'3.0%',top:'23.5%',width:'3.0%',height:'5%'}}/>
    <Section>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-semibold text-[var(--muted)]">{t('Sort by')}</span>
        {([['rate','Interest rate'],['fee','Processing fee'],['rating','Customer rating']] as [typeof sort,string][]).map(([k,label])=>(
          <button key={k} onClick={()=>setSort(k)}
            className={`rounded-[9px] px-3.5 py-2 text-[13px] font-semibold transition ${sort===k?'bg-[var(--accent)] text-white':'border border-[var(--border)] bg-[var(--card)] text-[var(--ink-2)] hover:border-[var(--accent)]'}`}>{t(label)}</button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="bg-[var(--card-2)] text-[11.5px] uppercase tracking-wide text-[var(--muted-2)]">
                {['Lender','Interest rate','Max amount','Max tenure','Processing fee','Approval','Rating',''].map(h=>(
                  <th key={h} className="px-5 py-3.5 font-bold">{h?t(h):''}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-2)]">
              {rows.map(b=>(
                <tr key={b.id} className="transition hover:bg-[var(--card-2)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <BankLogo id={b.id} name={b.name} initials={b.initials} w={112} h={34}/>
                      <div>
                        <div className="whitespace-nowrap text-[14px] font-bold text-[var(--ink-strong)]">{t(b.name)}</div>
                        {b.id===best.id&&<Pill tone="green">{tf('Best on {metric}',{metric:t(sort==='rate'?'rate':sort==='fee'?'fees':'rating')})}</Pill>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[16px] font-extrabold text-[var(--accent-ink)]">{t(b.rate)}</td>
                  <td className="px-5 py-4 text-[13.5px] text-[var(--ink-2)]">{t(b.amount)}</td>
                  <td className="px-5 py-4 text-[13.5px] text-[var(--ink-2)]">{t(b.tenure)}</td>
                  <td className="px-5 py-4 text-[13.5px] text-[var(--ink-2)]">{t(b.fee)}</td>
                  <td className="px-5 py-4"><Pill tone={b.approval==='Fast'?'green':'amber'}>{t(b.approval)}</Pill></td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-[13.5px] font-semibold text-[var(--ink)]"><Star size={13} className="fill-[var(--warn-bright)] text-[var(--warn-bright)]"/>{t(b.rating)}</span>
                  </td>
                  <td className="px-5 py-4"><Btn to="/apply">{t('Apply')}</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--muted-2)]">
        {t('Published starting rates as of')} {t(RATES_AS_OF)}{t(', for salaried applicants with a credit score above 750. These are the lenders’ advertised minimums — most applicants are priced higher, and your sanctioned rate is set by the lender against your own profile. Verify with the lender before you commit.')}
      </p>
    </Section>
    <div className="bg-[var(--card)]">
      <Section tight>
        <Head eyebrow="Try it yourself" title="What would the EMI look like?" sub="Set the amount and tenure, then move the rate between the best and worst offer above to see the real cost of a rate difference."/>
        <EMI defaultRate={parseFloat(best.rate)||8.5}/>
      </Section>
    </div>
    <CtaBand/>
  </>;
}

export function ServicesPage(){
  return <>
    <PageHero eyebrow="Services" crumb="Services" title="More than a rate comparison"
      sub="Comparison gets you a shortlist. These are the services that get the loan actually sanctioned, at a price worth signing for."
      image="/services-hero.webp" imageAspect="1600 / 533"
      mobileImage="/services-hero-m.webp" mobileAspect="740 / 533"
      crumbBox={{left:'3.8%',top:'22%',width:'3.0%',height:'5%'}}/>
    <Section>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(([ttl,b,ic])=>(
          <Card key={ttl} hover className="p-6">
            <Tile name={ic}/>
            <div className="mt-4 text-[16px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
          </Card>
        ))}
      </div>
    </Section>
    <div className="bg-[var(--card)]">
      <Section>
        <Head eyebrow="Process" title="What working with an advisor looks like"/>
        <div className="mx-auto max-w-[820px]">
          {[
            ['Day 0 · Profile review','You share income, obligations and what you are trying to finance. Your advisor tells you plainly which lenders will say yes and which will not.'],
            ['Day 1 · Shortlist and rate pull','We pull live offers from every partner whose policy fits, then take the strongest one back to the others to negotiate.'],
            ['Day 2–3 · Documentation','One upload, shared securely with your chosen lender. We chase the follow-up queries so you do not have to.'],
            ['Day 3–7 · Sanction and disbursal','Sanction letter reviewed line by line before you sign. Funds land in your account, and your loan appears in your eLoans dashboard.'],
          ].map(([ttl,b],i,arr)=>(
            <div key={ttl} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[13px] font-bold text-white">{i+1}</div>
                {i<arr.length-1&&<div className="w-px flex-1 bg-[var(--border)]"/>}
              </div>
              <div className="pb-8">
                <div className="text-[15.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
    <CtaBand/>
  </>;
}

export function AboutPage(){
  return <>
    <PageHero eyebrow="About us" crumb="About" title="We built eLoans because borrowing in India is needlessly opaque"
      sub="Two of our founders spent a decade inside bank credit teams. They watched good borrowers accept bad rates simply because nobody showed them the alternative."
      image="/about-hero.webp" imageAspect="1600 / 533"
      mobileImage="/about-hero-m.webp" mobileAspect="680 / 533"/>
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 text-[15px] leading-relaxed text-[var(--ink-2)]">
          <p>{t('eLoans started in 2019 with a single product — personal loan comparison — and five lending partners. The premise was simple: a borrower should be able to see every offer they qualify for before committing to one, and should not have to submit the same documents five times to find out.')}</p>
          <p>{t('Today we work with more than fifty banks and NBFCs across fifteen loan products, from ₹50,000 gold loans to ₹5 crore home finance. We have facilitated over ₹2,400 crore in disbursals, and the average customer on our platform closes at a rate 84 basis points below the first offer they were quoted directly.')}</p>
          <p>{t('We are an aggregator, not a lender. We do not hold your loan, we do not set your rate, and we are paid a commission by the lender only after your loan is disbursed. That structure matters: it means we have no incentive to steer you toward a more expensive product, because our fee does not rise with your interest rate.')}</p>
          <p>{t('Your data stays yours. We do not sell contact information to third parties, and documents you upload are shared only with the lenders you explicitly choose to apply to.')}</p>
        </div>
        <div className="space-y-4">
          {([['2019','Founded in Bengaluru'],['₹2,400 Cr','Disbursed to date'],['50+','Lending partners'],['1.8 lakh','Loans facilitated'],['84 bps','Average rate saved'],['4.8/5','Customer rating']] as [string,string][]).map(([v,l])=>(
            <Card key={l} className="flex items-center justify-between px-5 py-4">
              <span className="text-[13.5px] text-[var(--muted)]">{t(l)}</span>
              <span className="text-[19px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(v)}</span>
            </Card>
          ))}
        </div>
      </div>
    </Section>
    <div className="bg-[var(--card)]">
      <Section>
        <Head eyebrow="What we stand by" title="Four commitments we will not trade away"/>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {([
            ['Transparent pricing','Every fee, penalty and add-on is shown before you accept, in writing.','Percent'],
            ['No data selling','Your information goes to the lenders you choose. Nowhere else, ever.','Lock'],
            ['Independent advice','Our commission does not vary with your rate, so we have nothing to gain from a worse one.','BadgeCheck'],
            ['Human support','Advisors on call 9am–9pm, seven days, reachable without a ticket queue.','Headphones'],
          ] as [string,string,string][]).map(([ttl,b,ic])=>(
            <Card key={ttl} className="p-6">
              <Tile name={ic}/>
              <div className="mt-4 text-[15.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
    <Section>
      <Head eyebrow="Offices" title="Where you can find us"/>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {offices.map(([city,region,addr,phone])=>(
          <Card key={city} className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-bold text-[var(--ink-strong)]">{t(city)}</div>
              <Pill tone="slate">{t(region)}</Pill>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted)]">{t(addr)}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-[var(--border-2)] pt-3 text-[13px] font-semibold text-[var(--accent-ink)]"><Phone size={14}/>{t(phone)}</div>
          </Card>
        ))}
      </div>
    </Section>
    <CtaBand/>
  </>;
}

export function ContactPage(){
  const [sent,setSent]=useState(false);
  const [form,setForm]=useState({name:'',email:'',phone:'',product:loans[0].name,message:''});
  const set=(k:keyof typeof form)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setForm(f=>({...f,[k]:e.target.value}));
  const field='w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[14px] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent)]';
  return <>
    <PageHero eyebrow="Contact" crumb="Contact" title="Talk to a loan advisor"
      sub="Tell us what you are trying to finance. An advisor will come back within one working day with the lenders worth your time."
      image="/contact-hero.webp" imageAspect="1600 / 533"
      mobileImage="/contact-hero-m.webp" mobileAspect="750 / 533"
      crumbBox={{left:'3.0%',top:'23%',width:'3.0%',height:'5%'}}/>
    <Section>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6 sm:p-8">
          {sent
            ? <div className="py-14 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--ok-soft)]"><Check size={26} className="text-[var(--ok-bright)]" strokeWidth={3}/></div>
                <div className="mt-5 text-[20px] font-extrabold text-[var(--ink-strong)]">{t('Thanks,')} {form.name.split(' ')[0]||'there'}</div>
                <p className="mx-auto mt-2 max-w-[380px] text-[14px] leading-relaxed text-[var(--muted)]">{t('Your enquiry about a')} {form.product.toLowerCase()} {t('is with our advisory team. Expect a call on')} {form.phone||'your number'} {t('within one working day.')}</p>
                <Btn to="/loans" variant="outline" className="mt-6">{t('Browse loan products')}</Btn>
              </div>
            : <form onSubmit={e=>{e.preventDefault();setSent(true);}} className="space-y-5">
                <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('Send us an enquiry')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[var(--ink-2)]">{t('Full name')}</label>
                    <input required value={form.name} onChange={set('name')} placeholder={t('Your name')} className={field}/>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[var(--ink-2)]">{t('Phone')}</label>
                    <input required value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className={field}/>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[var(--ink-2)]">{t('Email')}</label>
                  <input required type="email" value={form.email} onChange={set('email')} placeholder={t('you@example.com')} className={field}/>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[var(--ink-2)]">{t('What are you financing?')}</label>
                  <select value={form.product} onChange={set('product')} className={field}>
                    {loans.map(l=><option key={l.id}>{t(l.name)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[var(--ink-2)]">{t('Anything else we should know?')}</label>
                  <textarea rows={4} value={form.message} onChange={set('message')} placeholder={t('Amount, timeline, existing loans…')} className={`${field} resize-none`}/>
                </div>
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--accent)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(18,99,233,.24)] transition hover:bg-[var(--accent-hover)]">{t('Send enquiry')} <Send size={16}/></button>
                <p className="text-center text-[12px] text-[var(--muted-2)]">{t('Submitting does not create a loan application and has no effect on your credit score.')}</p>
              </form>}
        </Card>
        <div className="space-y-4">
          {([
            ['Call us','1800 200 4747 · toll free, 9am–9pm all week','Phone'],
            ['Email','hello@eloans.in · replies within one working day','Mail'],
            ['Visit','Prestige Tech Park, Outer Ring Road, Bengaluru 560103','MapPin'],
          ] as [string,string,string][]).map(([ttl,b,ic])=>(
            <Card key={ttl} className="flex items-start gap-4 p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent-ink)]">
                {ic==='Phone'?<Phone size={18}/>:ic==='Mail'?<Mail size={18}/>:<MapPin size={18}/>}
              </div>
              <div>
                <div className="text-[14.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  </>;
}

/* Renders any authored content page using the existing primitives only —
   PageHero, Section, Card, Tile, Pill, Faq, CtaBand. No new styling, so
   every content page inherits the site's design automatically. */
function BlockView({b}:{b:Block}){
  switch(b.t){
    case 'intro':
      return <Card className="p-6 sm:p-8">
        <p className="text-[15.5px] leading-relaxed text-[var(--ink-2)]">{t(b.text)}</p>
      </Card>;

    case 'cards':
      return <div>
        {b.title&&<h2 className="mb-1 text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(b.title)}</h2>}
        {b.sub&&<p className="mb-4 text-[14px] text-[var(--muted)]">{t(b.sub)}</p>}
        <div className={`grid gap-4 md:grid-cols-2 ${b.items.length>4?'lg:grid-cols-3':''} ${b.title?'mt-4':''}`}>
          {b.items.map(([ic,h,body])=>(
            <Card key={h} className="p-6">
              <Tile name={ic}/>
              <div className="mt-4 text-[15.5px] font-bold text-[var(--ink-strong)]">{t(h)}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(body)}</p>
            </Card>
          ))}
        </div>
      </div>;

    case 'list':
      return <Card className="p-6 sm:p-8">
        <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(b.title)}</h2>
        {b.sub&&<p className="mt-1 text-[14px] text-[var(--muted)]">{t(b.sub)}</p>}
        <ul className="mt-4 space-y-3">
          {b.items.map(x=>(
            <li key={x} className="flex gap-3 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
              <Check size={17} className="mt-0.5 shrink-0 text-[var(--ok-bright)]" strokeWidth={2.6}/>{t(x)}
            </li>
          ))}
        </ul>
      </Card>;

    case 'steps':
      return <Card className="p-6 sm:p-8">
        <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(b.title)}</h2>
        {b.sub&&<p className="mt-1 text-[14px] text-[var(--muted)]">{t(b.sub)}</p>}
        <div className="mt-5">
          {b.items.map(([ttl,d],i,arr)=>(
            <div key={ttl} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[13px] font-bold text-white">{i+1}</div>
                {i<arr.length-1&&<div className="w-px flex-1 bg-[var(--border)]"/>}
              </div>
              <div className="pb-7">
                <div className="text-[15.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted)]">{t(d)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>;

    case 'table':
      return <Card className="overflow-hidden">
        <div className="border-b border-[var(--border-2)] px-6 py-5 sm:px-8">
          <h2 className="text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(b.title)}</h2>
          {b.sub&&<p className="mt-1 text-[14px] text-[var(--muted)]">{t(b.sub)}</p>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="bg-[var(--card-2)] text-[11.5px] uppercase tracking-wide text-[var(--muted-2)]">
                {b.head.map(h=><th key={h} className="px-6 py-3.5 font-bold">{t(h)}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-2)]">
              {b.rows.map(r=>(
                <tr key={r[0]}>
                  {r.map((c,i)=>(
                    <td key={i} className={`px-6 py-4 text-[13.5px] ${i===0?'font-bold text-[var(--ink-strong)]':'text-[var(--muted)]'}`}>{t(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {b.note&&<div className="border-t border-[var(--border-2)] px-6 py-3.5 text-[12.5px] leading-relaxed text-[var(--muted-2)] sm:px-8">{t(b.note)}</div>}
      </Card>;

    case 'faq':
      return <div>
        <h2 className="mb-5 text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(b.title)}</h2>
        <div className="[&>div]:max-w-none"><Faq items={b.items}/></div>
      </div>;

    case 'links':
      return <div>
        <h2 className="mb-1 text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(b.title)}</h2>
        {b.sub&&<p className="mb-4 text-[14px] text-[var(--muted)]">{t(b.sub)}</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {b.items.map(([label,href,blurb])=>(
            <Link key={href} to={href} className="group block">
              <Card hover className="h-full p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-bold text-[var(--ink-strong)]">{t(label)}</span>
                  <ArrowUpRight size={16} className="shrink-0 text-[var(--muted-2)] transition group-hover:text-[var(--accent-ink)]"/>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">{t(blurb)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>;

    case 'note':
      return <Card className={b.tone==='warn'?'border-[var(--warn-bright)] bg-[var(--warn-soft)] p-6':'bg-[var(--accent-soft)] p-6'}>
        <div className="flex gap-3.5">
          <Info size={19} className={`mt-0.5 shrink-0 ${b.tone==='warn'?'text-[var(--warn)]':'text-[var(--accent-ink)]'}`}/>
          <p className={`text-[13.5px] leading-relaxed ${b.tone==='warn'?'text-[var(--warn)]':'text-[var(--ink-2)]'}`}>{t(b.text)}</p>
        </div>
      </Card>;
  }
}

export function InfoPageView(){
  const {pathname}=useLocation();
  const id=pathname.replace(/^\//,'');
  const page=infoPages.find(p=>p.id===id);
  if(!page) return <NotFound/>;
  const siblings=infoPages.filter(p=>p.group===page.group&&p.id!==page.id);
  return <>
    <PageHero eyebrow={page.eyebrow} crumb={page.title} title={page.title} sub={page.sub} {...infoPageBanners[page.id]}/>
    <Section>
      <div className="mx-auto max-w-[860px] space-y-6">
        {page.blocks.map((b,i)=><BlockView key={i} b={b}/>)}
        {siblings.length>0&&<div>
          <h2 className="mb-4 text-[22px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('More in')} {t(page.group)}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {siblings.map(s=>(
              <Link key={s.id} to={'/'+s.id} className="group block">
                <Card hover className="h-full p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Tile name={String(s.icon)}/>
                    <ArrowUpRight size={16} className="mt-1 shrink-0 text-[var(--muted-2)] transition group-hover:text-[var(--accent-ink)]"/>
                  </div>
                  <div className="mt-4 text-[15px] font-bold text-[var(--ink-strong)]">{t(s.title)}</div>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">{t(s.sub)}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>}
      </div>
    </Section>
    <CtaBand/>
  </>;
}

export function NotFound(){
  return <div className="grid min-h-[60vh] place-items-center px-5 py-20 text-center">
    <div>
      <div className="text-[86px] font-black leading-none text-[var(--border)]">404</div>
      <h1 className="mt-3 text-[26px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t('We could not find that page')}</h1>
      <p className="mx-auto mt-3 max-w-[400px] text-[14.5px] leading-relaxed text-[var(--muted)]">{t('The link may be out of date. Try our loan products, or head back to the homepage.')}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Btn to="/">{t('Back to home')} <ArrowRight size={16}/></Btn>
        <Btn to="/loans" variant="outline">{t('Browse loans')}</Btn>
      </div>
    </div>
  </div>;
}

/* ---------- insurance ---------- */
const insureWhy:[string,string,string][]=[
  ['Cover priced on its own','We never bundle insurance into a loan to inflate the ticket. You see the premium as a separate line and can decline it.','Percent'],
  ['Claim support that shows up','Our team files and follows your claim with the insurer, including the document back-and-forth nobody warns you about.','Headphones'],
  ['Compare across insurers','Same sum assured, same rider set, side-by-side premiums from every partner insurer we work with.','TrendingUp'],
];
const insureFaqs:[string,string][]=[
  ['Is insurance mandatory when I take a loan?','No. Credit life cover is optional on every product we broker, and by RBI rule a lender cannot make a loan conditional on buying it. If a lender implies otherwise, tell your advisor and we will take it up with them.'],
  ['Can I keep the policy if I close the loan early?','Yes. Policies sold through us are issued in your name and are independent of the loan. Closing or transferring the loan does not cancel your cover.'],
  ['What happens during the free-look period?','Every policy carries a 15-day free-look window, or 30 days if it was sold electronically. Cancel inside it and you get the premium back, minus a pro-rata risk charge and any medical costs.'],
];

export function InsurancePage(){
  return <>
    <PageHero eyebrow="Insurances" crumb="Insurances" title="Cover that is priced honestly, not bundled quietly"
      sub="Seven categories of protection from our partner insurers. Compare the premium against the cover, and buy only what you actually need."
      art="/insurance-art.webp"/>
    <Section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insurance.map(([id,name,desc,cover,premium,icon])=>(
          <Card key={id} hover className="flex h-full flex-col p-6">
            <div className="flex items-start justify-between">
              <Tile name={icon}/>
              <Pill tone="green">{t(premium)}</Pill>
            </div>
            <div className="mt-4 text-[16px] font-bold text-[var(--ink-strong)]">{t(name)}</div>
            <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(desc)}</p>
            <div className="mt-5 flex items-end justify-between border-t border-[var(--border-2)] pt-4">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[var(--muted-2)]">{t('Cover up to')}</div>
                <div className="text-[18px] font-extrabold text-[var(--accent-ink)]">{t(cover)}</div>
              </div>
              <Btn to={`/insurance/${id}`} variant="outline">{t('Details')} <ArrowUpRight size={14}/></Btn>
            </div>
          </Card>
        ))}
      </div>
    </Section>
    <div className="bg-[var(--card)]">
      <Section>
        <Head eyebrow="How we sell it" title="Three things we do differently"/>
        <div className="grid gap-4 md:grid-cols-3">
          {insureWhy.map(([ttl,b,ic])=>(
            <Card key={ttl} className="p-6">
              <Tile name={ic}/>
              <div className="mt-4 text-[15.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
    <Section>
      <Head eyebrow="Questions" title="Before you buy a policy"/>
      <Faq items={insureFaqs}/>
    </Section>
    <CtaBand/>
  </>;
}

/* ---------- calculators ---------- */
const numField='w-[150px] rounded-[9px] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-right text-[14px] font-semibold outline-none focus:border-[var(--accent)]';
const numRow='flex items-center justify-between gap-4 border-b border-[var(--border-2)] py-3.5 last:border-0';

function Eligibility(){
  const [income,setIncome]=useState(90000);
  const [obligations,setObligations]=useState(12000);
  const [rate,setRate]=useState(8.5);
  const [years,setYears]=useState(5);
  const foir=0.5;
  const {maxEmi,maxLoan}=useMemo(()=>{
    const e=Math.max(income*foir-obligations,0);
    const r=rate/1200,n=years*12;
    return {maxEmi:e,maxLoan:r===0?e*n:e*(1-Math.pow(1+r,-n))/r};
  },[income,obligations,rate,years]);
  return <Card className="p-6 sm:p-8">
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <div className={numRow}>
          <span className="text-[13.5px] font-semibold text-[var(--ink-2)]">{t('Net monthly income')}</span>
          <input type="number" min={0} value={income} onChange={e=>setIncome(Number(e.target.value)||0)} className={numField}/>
        </div>
        <div className={numRow}>
          <span className="text-[13.5px] font-semibold text-[var(--ink-2)]">{t('Existing EMIs per month')}</span>
          <input type="number" min={0} value={obligations} onChange={e=>setObligations(Number(e.target.value)||0)} className={numField}/>
        </div>
        <div className={numRow}>
          <span className="text-[13.5px] font-semibold text-[var(--ink-2)]">{t('Interest rate (% p.a.)')}</span>
          <input type="number" min={1} step={0.05} value={rate} onChange={e=>setRate(Number(e.target.value)||0)} className={numField}/>
        </div>
        <div className={numRow}>
          <span className="text-[13.5px] font-semibold text-[var(--ink-2)]">{t('Tenure (years)')}</span>
          <input type="number" min={1} max={30} value={years} onChange={e=>setYears(Number(e.target.value)||1)} className={numField}/>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--muted-2)]">
          {t('Based on a FOIR of 50% — lenders typically allow total EMIs to reach half of net income. Your sanctioned amount also depends on credit score, employer category and the product itself.')}
        </p>
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--card-2)] p-6">
        <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-[var(--muted-2)]">{t('You could borrow up to')}</div>
        <div className="mt-1 text-[34px] font-extrabold leading-none tracking-[-.02em] text-[var(--ink-strong)]">{inr(maxLoan)}</div>
        <dl className="mt-6 space-y-2.5 border-t border-[var(--border)] pt-4 text-[13.5px]">
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Affordable EMI')}</dt><dd className="font-semibold text-[var(--ink)]">{inr(maxEmi)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Income considered')}</dt><dd className="font-semibold text-[var(--ink)]">{inr(income*foir)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Less existing EMIs')}</dt><dd className="font-semibold text-[var(--ink)]">−{inr(obligations)}</dd></div>
        </dl>
        <Btn to="/eligibility" className="mt-5 w-full">{t('Run a real eligibility check')} <ArrowRight size={16}/></Btn>
      </div>
    </div>
  </Card>;
}

function Sip(){
  const [monthly,setMonthly]=useState(10000);
  const [ret,setRet]=useState(12);
  const [years,setYears]=useState(10);
  const {fv,invested}=useMemo(()=>{
    const i=ret/1200,n=years*12;
    const v=i===0?monthly*n:monthly*((Math.pow(1+i,n)-1)/i)*(1+i);
    return {fv:v,invested:monthly*n};
  },[monthly,ret,years]);
  const gain=fv-invested;
  return <Card className="p-6 sm:p-8">
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <div className={numRow}>
          <span className="text-[13.5px] font-semibold text-[var(--ink-2)]">{t('Monthly investment')}</span>
          <input type="number" min={500} step={500} value={monthly} onChange={e=>setMonthly(Number(e.target.value)||0)} className={numField}/>
        </div>
        <div className={numRow}>
          <span className="text-[13.5px] font-semibold text-[var(--ink-2)]">{t('Expected return (% p.a.)')}</span>
          <input type="number" min={1} step={0.5} value={ret} onChange={e=>setRet(Number(e.target.value)||0)} className={numField}/>
        </div>
        <div className={numRow}>
          <span className="text-[13.5px] font-semibold text-[var(--ink-2)]">{t('Duration (years)')}</span>
          <input type="number" min={1} max={40} value={years} onChange={e=>setYears(Number(e.target.value)||1)} className={numField}/>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--muted-2)]">
          {t('Assumes a fixed contribution invested at the start of each month at a constant annual return. Real market returns vary year to year and are never guaranteed.')}
        </p>
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--card-2)] p-6">
        <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-[var(--muted-2)]">{t('Projected corpus')}</div>
        <div className="mt-1 text-[34px] font-extrabold leading-none tracking-[-.02em] text-[var(--ink-strong)]">{inr(fv)}</div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--border)]">
          <div className="h-full bg-[var(--accent)]" style={{width:`${Math.round((invested/fv)*100)}%`}}/>
        </div>
        <div className="mt-2.5 flex justify-between text-[11.5px] text-[var(--muted)]">
          <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"/>{t('Invested')}</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-[var(--border)]"/>{t('Gain')}</span>
        </div>
        <dl className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4 text-[13.5px]">
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Total invested')}</dt><dd className="font-semibold text-[var(--ink)]">{inr(invested)}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--muted)]">{t('Estimated gain')}</dt><dd className="font-semibold text-[var(--ok)]">{inr(gain)}</dd></div>
        </dl>
      </div>
    </div>
  </Card>;
}

/* ---------- calculator engine ----------
   Every calculator is a declaration: some fields and a pure compute(). That
   keeps eighteen of them honest — one slider component, one result panel, and
   the arithmetic sitting on its own where it can be read and checked. */

type Fmt='inr'|'pct'|'months'|'years'|'num';
type CField={key:string;label:string;min:number;max:number;step:number;def:number;fmt:Fmt};
type CResult={headline:[string,string];rows:[string,string][];split?:[number,number];note?:string};
type Calc={id:string;group:string;name:string;blurb:string;fields:CField[];compute:(v:Record<string,number>)=>CResult};

const fmt=(n:number,f:Fmt)=>f==='inr'?inr(n)
  :f==='pct'?`${n.toFixed(2)}%`
  :f==='months'?(n>=12?tf('{n} years',{n:(n/12).toFixed(n%12?1:0)}):`${n} months`)
  :f==='years'?tf('{n} years',{n})
  :String(n);

/* shared money maths */
const emiOf=(p:number,rate:number,months:number)=>{const r=rate/1200;
  return r===0?p/months:(p*r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1)};
const loanFromEmi=(emi:number,rate:number,months:number)=>{const r=rate/1200;
  return r===0?emi*months:emi*(1-Math.pow(1+r,-months))/r};
const balanceAfter=(p:number,rate:number,months:number,paid:number)=>{const r=rate/1200;
  if(r===0)return Math.max(p-(p/months)*paid,0);
  return p*(Math.pow(1+r,months)-Math.pow(1+r,paid))/(Math.pow(1+r,months)-1)};
const sipFv=(monthly:number,rate:number,months:number)=>{const i=rate/1200;
  return i===0?monthly*months:monthly*((Math.pow(1+i,months)-1)/i)*(1+i)};

const rateOf=(id:string,fallback:number)=>parseFloat(loans.find(l=>l.id===id)?.rate||'')||fallback;

const F=(key:string,label:string,min:number,max:number,step:number,def:number,fmt:Fmt):CField=>({key,label,min,max,step,def,fmt});
const amount=(def:number,max=20000000)=>F('amount','Loan amount',50000,max,50000,def,'inr');
const rateF=(def:number)=>F('rate','Interest rate',5,24,0.05,def,'pct');
const tenureF=(def:number,max=360)=>F('tenure','Tenure',6,max,6,def,'months');

/* an EMI calculator, parameterised per product */
const emiCalc=(id:string,name:string,blurb:string,def:number,rate:number,tenure:number,max?:number):Calc=>({
  id,group:'Loan EMI Calculators',name,blurb,
  fields:[amount(def,max),rateF(rate),tenureF(tenure)],
  compute:v=>{const e=emiOf(v.amount,v.rate,v.tenure);const total=e*v.tenure;const interest=total-v.amount;
    return {headline:['Monthly EMI',inr(e)],
      rows:[['Principal',inr(v.amount)],['Total interest',inr(interest)],['Total payable',inr(total)],
            ['Interest as % of principal',`${((interest/v.amount)*100).toFixed(1)}%`]],
      split:[v.amount,interest]};
  }});

/* eligibility, driven by FOIR */
const eligCalc=(id:string,name:string,blurb:string,foir:number,rate:number,tenure:number):Calc=>({
  id,group:'Loan Eligibility Calculators',name,blurb,
  fields:[F('income','Net monthly income',15000,1000000,5000,90000,'inr'),
          F('existing','Existing EMIs',0,300000,1000,12000,'inr'),
          rateF(rate),tenureF(tenure)],
  compute:v=>{const affordable=Math.max(v.income*foir-v.existing,0);
    const max=loanFromEmi(affordable,v.rate,v.tenure);
    return {headline:['You could borrow up to',inr(max)],
      rows:[['Affordable EMI',inr(affordable)],[tf('Income considered (FOIR {pct}%)',{pct:Math.round(foir*100)}),inr(v.income*foir)],
            ['Less existing EMIs',`−${inr(v.existing)}`],['Tenure',fmt(v.tenure,'months')]],
      note:tf('Lenders cap total EMIs at roughly {pct}% of net income for this product. Your sanctioned amount also depends on credit score and employer profile.',{pct:Math.round(foir*100)})};
  }});

/* prepayment: keep the EMI, shorten the loan */
const prepayCalc=(id:string,name:string,blurb:string,def:number,rate:number,tenure:number):Calc=>({
  id,group:'Loan Eligibility Calculators',name,blurb,
  fields:[amount(def),rateF(rate),tenureF(tenure),
          F('paid','Instalments already paid',0,240,6,24,'months'),
          F('prepay','Lump sum prepayment',10000,10000000,10000,500000,'inr')],
  compute:v=>{const e=emiOf(v.amount,v.rate,v.tenure);
    const paid=Math.min(v.paid,v.tenure-1);
    const bal=balanceAfter(v.amount,v.rate,v.tenure,paid);
    const remainingMonths=v.tenure-paid;
    const interestNoPrepay=e*remainingMonths-bal;
    const newBal=Math.max(bal-v.prepay,0);
    const r=v.rate/1200;
    let newMonths=0;
    if(newBal>0){
      if(r===0)newMonths=newBal/e;
      else if(e<=newBal*r)newMonths=remainingMonths;            // EMI cannot cover interest
      else newMonths=-Math.log(1-(r*newBal)/e)/Math.log(1+r);
    }
    newMonths=Math.min(Math.ceil(newMonths),remainingMonths);
    const interestAfter=Math.max(e*newMonths-newBal,0);
    const saved=Math.max(interestNoPrepay-interestAfter,0);
    return {headline:['Interest saved',inr(saved)],
      rows:[['Outstanding balance now',inr(bal)],['Balance after prepayment',inr(newBal)],
            ['Tenure left without prepaying',fmt(remainingMonths,'months')],
            ['Tenure left after prepaying',fmt(newMonths,'months')],
            ['Instalments saved',tf('{n} months',{n:remainingMonths-newMonths})],['EMI (unchanged)',inr(e)]],
      note:'Assumes the EMI stays the same and the prepayment shortens the tenure. Floating-rate home loans to individuals carry no foreclosure charge; check the terms on fixed-rate products.'};
  }});

const calculators:Calc[]=[
  /* ----- Investment ----- */
  {id:'fd',group:'Investment Calculators',name:'Fixed Deposit Calculator',
   blurb:'Maturity value of a bank FD, compounded quarterly as Indian banks do.',
   fields:[F('amount','Deposit amount',5000,10000000,5000,500000,'inr'),F('rate','Interest rate',3,12,0.05,7.1,'pct'),F('years','Tenure',1,10,1,5,'years')],
   compute:v=>{const n=4,a=v.amount*Math.pow(1+(v.rate/100)/n,n*v.years);const gain=a-v.amount;
     return {headline:['Maturity value',inr(a)],
       rows:[['Invested',inr(v.amount)],['Interest earned',inr(gain)],['Effective annual yield',`${(((Math.pow(1+(v.rate/100)/n,n))-1)*100).toFixed(2)}%`]],
       split:[v.amount,gain],note:'Compounded quarterly. Interest on FDs is taxable at your slab rate.'};
   }},
  {id:'gst',group:'Investment Calculators',name:'GST Calculator',
   blurb:'Add GST to a net price, or strip it out of a gross price.',
   fields:[F('amount','Amount',100,10000000,100,100000,'inr'),F('rate','GST rate',0,28,0.5,18,'pct')],
   compute:v=>{const add=v.amount*v.rate/100;const base=v.amount/(1+v.rate/100);const inc=v.amount-base;
     return {headline:['GST on this amount',inr(add)],
       rows:[['— Treating the amount as GST-exclusive —',''],['Net price',inr(v.amount)],['GST added',inr(add)],['Gross price',inr(v.amount+add)],
             ['— Treating the amount as GST-inclusive —',''],['Base price',inr(base)],['GST included',inr(inc)]],
       note:'Split as CGST + SGST for intra-state supply (half each), or IGST for inter-state.'};
   }},
  {id:'mutual-fund',group:'Investment Calculators',name:'Mutual Fund Calculator',
   blurb:'What a one-off lump sum could grow into at a given annual return.',
   fields:[F('amount','Lump sum invested',5000,20000000,5000,500000,'inr'),F('rate','Expected return',1,30,0.5,12,'pct'),F('years','Duration',1,40,1,10,'years')],
   compute:v=>{const a=v.amount*Math.pow(1+v.rate/100,v.years);const gain=a-v.amount;
     return {headline:['Projected value',inr(a)],
       rows:[['Invested',inr(v.amount)],['Estimated gain',inr(gain)],['Multiple of capital',`${(a/v.amount).toFixed(2)}×`]],
       split:[v.amount,gain],note:'Market returns are not guaranteed and vary year to year. This is an assumption you set, not a projection.'};
   }},
  {id:'nps',group:'Investment Calculators',name:'NPS Calculator',
   blurb:'Retirement corpus and indicative pension from monthly NPS contributions.',
   fields:[F('monthly','Monthly contribution',500,150000,500,5000,'inr'),F('age','Your age',18,59,1,30,'num'),
           F('rate','Expected return',6,14,0.5,10,'pct'),F('annuity','Annuity rate at 60',4,10,0.25,6,'pct')],
   compute:v=>{const months=Math.max((60-v.age)*12,1);
     const corpus=sipFv(v.monthly,v.rate,months);const invested=v.monthly*months;
     const annuityPart=corpus*0.4,lumpSum=corpus*0.6;
     const pension=annuityPart*(v.annuity/100)/12;
     return {headline:['Corpus at 60',inr(corpus)],
       rows:[['Total contributed',inr(invested)],['Growth',inr(corpus-invested)],
             ['Lump sum at 60 (60%)',inr(lumpSum)],['Annuity purchase (40%)',inr(annuityPart)],['Indicative monthly pension',inr(pension)]],
       split:[invested,corpus-invested],
       note:'NPS rules require at least 40% of the corpus to buy an annuity at 60; the rest can be withdrawn tax-free.'};
   }},
  {id:'post-office-fd',group:'Investment Calculators',name:'Post Office FD Calculator',
   blurb:'Post Office Time Deposit maturity, compounded quarterly.',
   fields:[F('amount','Deposit amount',1000,5000000,1000,200000,'inr'),F('rate','Interest rate',5,9,0.05,7.5,'pct'),F('years','Tenure',1,5,1,5,'years')],
   compute:v=>{const n=4,a=v.amount*Math.pow(1+(v.rate/100)/n,n*v.years);const gain=a-v.amount;
     return {headline:['Maturity value',inr(a)],
       rows:[['Invested',inr(v.amount)],['Interest earned',inr(gain)],['Annual interest (approx)',inr(gain/v.years)]],
       split:[v.amount,gain],note:'Post Office Time Deposits run for 1, 2, 3 or 5 years. The 5-year deposit qualifies for Section 80C.'};
   }},
  {id:'sip',group:'Investment Calculators',name:'SIP Calculator',
   blurb:'What a fixed monthly investment could grow into over time.',
   fields:[F('monthly','Monthly investment',500,500000,500,10000,'inr'),F('rate','Expected return',1,30,0.5,12,'pct'),F('years','Duration',1,40,1,10,'years')],
   compute:v=>{const months=v.years*12;const fv=sipFv(v.monthly,v.rate,months);const invested=v.monthly*months;
     return {headline:['Projected corpus',inr(fv)],
       rows:[['Total invested',inr(invested)],['Estimated gain',inr(fv-invested)],['Instalments',tf('{n} months',{n:months})]],
       split:[invested,fv-invested],note:'Assumes a fixed contribution at the start of each month and a constant annual return.'};
   }},

  /* ----- Loan EMI ----- */
  emiCalc('emi-personal','Personal Loan EMI Calculator','Unsecured borrowing for any purpose.',1000000,rateOf('personal',8.5),60,5000000),
  emiCalc('emi-home','Home Loan EMI Calculator','The longest commitment most people take on.',5000000,rateOf('home',8.35),240,100000000),
  emiCalc('emi-business','Business Loan EMI Calculator','Working capital and expansion finance.',2000000,rateOf('business',10.25),48,50000000),
  emiCalc('emi-lap','Loan Against Property EMI Calculator','Borrow against property you already own.',3000000,rateOf('mortgage',9.25),120,50000000),
  emiCalc('emi-gold','Gold Loan EMI Calculator','Secured against pledged gold, settled fastest.',300000,rateOf('gold',9.0),24,5000000),
  emiCalc('emi-term','Term Loan EMI Calculator','Fixed-tenure business borrowing.',2500000,11,60,50000000),
  emiCalc('emi-tractor','Tractor Loan EMI Calculator','Agricultural equipment finance.',800000,11.5,60,5000000),
  emiCalc('emi-mudra','Mudra Loan EMI Calculator','Micro-enterprise finance under PMMY, up to ₹10 lakh.',500000,9.5,36,1000000),

  /* ----- Eligibility & prepayment ----- */
  eligCalc('elig-personal','Personal Loan Eligibility Calculator','How much an unsecured lender is likely to sanction.',0.5,rateOf('personal',8.5),60),
  eligCalc('elig-home','Home Loan Eligibility Calculator','Home lenders allow a higher share of income.',0.55,rateOf('home',8.35),240),
  prepayCalc('prepay-home','Home Loan Prepayment Calculator','What a lump sum takes off a home loan.',5000000,rateOf('home',8.35),240),
  prepayCalc('prepay-personal','Personal Loan Prepayment Calculator','What a lump sum takes off a personal loan.',1000000,rateOf('personal',8.5),60),
];

const calcGroups=['Investment Calculators','Loan EMI Calculators','Loan Eligibility Calculators'];
const groupIcon:Record<string,string>={'Investment Calculators':'TrendingUp','Loan EMI Calculators':'Percent','Loan Eligibility Calculators':'Calculator'};

function CalcSlider({f,value,onChange}:{f:CField;value:number;onChange:(n:number)=>void}){
  const {t}=useLang();
  const pct=((value-f.min)/(f.max-f.min))*100;
  return <div>
    <div className="flex items-baseline justify-between gap-3">
      <label className="text-[13px] font-semibold text-[var(--ink-2)]">{t(f.label)}</label>
      <span className="text-[15px] font-extrabold text-[var(--ink-strong)]">{fmt(value,f.fmt)}</span>
    </div>
    <input type="range" min={f.min} max={f.max} step={f.step} value={value} aria-label={f.label}
      onChange={e=>onChange(Number(e.target.value))}
      className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[var(--accent)]"
      style={{background:`linear-gradient(90deg,var(--accent) ${pct}%,var(--border) ${pct}%)`}}/>
  </div>;
}

/* Year-by-year repayment schedule — what every established EMI calculator
   shows and the one thing ours was missing. Built from the same EMI the
   panel displays, so the two can never disagree. */
type AmortRow={year:number;principal:number;interest:number;total:number;balance:number};
function amortise(p:number,rate:number,months:number):AmortRow[]{
  const r=rate/1200;
  const e=r===0?p/months:(p*r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1);
  const rows:AmortRow[]=[];
  let bal=p,yr=1,accP=0,accI=0;
  for(let m=1;m<=months;m++){
    const interest=bal*r;
    const principal=Math.min(e-interest,bal);
    bal=Math.max(bal-principal,0);
    accP+=principal;accI+=interest;
    if(m%12===0||m===months){
      rows.push({year:yr++,principal:accP,interest:accI,total:accP+accI,balance:bal});
      accP=0;accI=0;
    }
  }
  return rows;
}

function Amortisation({principal,rate,months,label}:{principal:number;rate:number;months:number;label:string}){
  const [open,setOpen]=useState(false);
  const rows=useMemo(()=>amortise(principal,rate,months),[principal,rate,months]);
  const totals=useMemo(()=>rows.reduce((a,r)=>({p:a.p+r.principal,i:a.i+r.interest}),{p:0,i:0}),[rows]);

  const download=()=>{
    const head='Year,Principal paid,Interest paid,Total paid,Balance at year end\n';
    const body=rows.map(r=>[r.year,Math.round(r.principal),Math.round(r.interest),Math.round(r.total),Math.round(r.balance)].join(',')).join('\n');
    const blob=new Blob([head+body],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`${label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-schedule.csv`;a.click();
    URL.revokeObjectURL(url);
  };

  return <div className="mt-6 overflow-hidden rounded-[12px] border border-[var(--border)]">
    <button onClick={()=>setOpen(v=>!v)} aria-expanded={open}
      className="flex w-full items-center justify-between gap-3 bg-[var(--card-2)] px-5 py-3.5 text-left transition hover:bg-[var(--surface-3)]">
      <span>
        <span className="block text-[14.5px] font-bold text-[var(--ink-strong)]">{t('Repayment schedule')}</span>
        <span className="block text-[12.5px] text-[var(--muted)]">{t('Year by year, how much goes to principal and how much to interest')}</span>
      </span>
      <ChevronDown size={18} className={`shrink-0 text-[var(--muted)] transition-transform ${open?'rotate-180':''}`}/>
    </button>
    {open&&<>
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead className="sticky top-0 bg-[var(--card)]">
            <tr className="text-[11px] uppercase tracking-wide text-[var(--muted-2)]">
              {['Year','Principal paid','Interest paid','Total paid','Balance'].map(h=>(
                <th key={h} className="border-b border-[var(--border)] px-4 py-2.5 font-bold">{t(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-2)]">
            {rows.map(r=>(
              <tr key={r.year} className="text-[13px]">
                <td className="px-4 py-2.5 font-semibold text-[var(--ink)]">{t(r.year)}</td>
                <td className="px-4 py-2.5 text-[var(--ink-2)]">{inr(r.principal)}</td>
                <td className="px-4 py-2.5 text-[var(--ink-2)]">{inr(r.interest)}</td>
                <td className="px-4 py-2.5 text-[var(--ink-2)]">{inr(r.total)}</td>
                <td className="px-4 py-2.5 font-semibold text-[var(--ink-strong)]">{inr(r.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[var(--card-2)] text-[13px] font-bold">
              <td className="px-4 py-3 text-[var(--ink-strong)]">{t('Total')}</td>
              <td className="px-4 py-3 text-[var(--ink-strong)]">{inr(totals.p)}</td>
              <td className="px-4 py-3 text-[var(--ink-strong)]">{inr(totals.i)}</td>
              <td className="px-4 py-3 text-[var(--ink-strong)]">{inr(totals.p+totals.i)}</td>
              <td className="px-4 py-3 text-[var(--muted)]">₹0</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--card-2)] px-5 py-3">
        <span className="text-[12px] text-[var(--muted-2)]">{t('Interest is highest early on, when the outstanding balance is largest.')}</span>
        <button onClick={download}
          className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">
          <ArrowDownUp size={14}/> {t('Download CSV')}
        </button>
      </div>
    </>}
  </div>;
}

function CalcPanel({calc}:{calc:Calc}){
  const {t}=useLang();
  const [vals,setVals]=useState<Record<string,number>>(()=>Object.fromEntries(calc.fields.map(f=>[f.key,f.def])));
  const out=useMemo(()=>calc.compute(vals),[calc,vals]);
  const total=out.split?out.split[0]+out.split[1]:0;
  const share=total>0?Math.round((out.split![0]/total)*100):0;

  return <Card className="p-6 sm:p-8">
    <div className="mb-6">
      <h2 className="text-[20px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(calc.name)}</h2>
      <p className="mt-1 text-[13.5px] text-[var(--muted)]">{t(calc.blurb)}</p>
    </div>
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
      <div className="space-y-6">
        {calc.fields.map(f=>(
          <CalcSlider key={f.key} f={f} value={vals[f.key]??f.def} onChange={n=>setVals(v=>({...v,[f.key]:n}))}/>
        ))}
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--card-2)] p-6">
        <div className="text-[12px] font-semibold uppercase tracking-[.12em] text-[var(--muted-2)]">{t(out.headline[0])}</div>
        <div className="mt-1 text-[30px] font-extrabold leading-none tracking-[-.02em] text-[var(--ink-strong)]">{t(out.headline[1])}</div>
        {out.split&&<>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--border)]">
            <div className="h-full bg-[var(--accent)]" style={{width:`${share}%`}}/>
          </div>
          <div className="mt-2.5 flex justify-between text-[11.5px] text-[var(--muted)]">
            <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"/>{t('Invested')} {t(share)}%</span>
            <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full bg-[var(--border)]"/>{t('Returns')} {100-share}%</span>
          </div>
        </>}
        <dl className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4 text-[13.5px]">
          {out.rows.map(([k,v],i)=>v===''
            ? <div key={i} className="pt-2 text-[11px] font-bold uppercase tracking-[.1em] text-[var(--muted-2)]">{k.replace(/—/g,'').trim()}</div>
            : <div key={i} className="flex justify-between gap-3"><dt className="text-[var(--muted)]">{t(k)}</dt><dd className="text-right font-semibold text-[var(--ink)]">{t(v)}</dd></div>)}
        </dl>
        {calc.group!=='Investment Calculators'&&<Btn to="/apply" className="mt-5 w-full">{t('Apply for this loan')} <ArrowRight size={16}/></Btn>}
      </div>
    </div>
    {out.note&&<p className="mt-5 text-[12.5px] leading-relaxed text-[var(--muted-2)]">{t(out.note)}</p>}
    {calc.group==='Loan EMI Calculators'&&<Amortisation principal={vals.amount} rate={vals.rate} months={vals.tenure} label={calc.name}/>}
  </Card>;
}

export function CalculatorPage(){
  const [id,setId]=useState('emi-personal');
  const calc=calculators.find(c=>c.id===id)!;
  return <>
    <PageHero eyebrow="Calculator" crumb="Calculator" title="Eighteen calculators, one set of formulas"
      sub="The same arithmetic lenders and fund houses use. Nothing here is recorded, and none of it touches your credit file."
      image="/calculator-hero.webp" imageAspect="2129 / 739"
      mobileImage="/calculator-hero-m.webp" mobileAspect="949 / 739"
      crumbBox={{left:'3.6%',top:'19.5%',width:'3.4%',height:'6%'}}/>
    <Section>
      <CalcPanel key={calc.id} calc={calc}/>
    </Section>
    <div className="bg-[var(--card)]">
      <Section>
        <Head eyebrow="All calculators" title="Pick another calculator" center={false}/>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {calcGroups.map(g=>(
            <div key={g}>
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent-ink)]">
                  <Ico name={groupIcon[g]} size={16}/>
                </span>
                <h3 className="text-[15.5px] font-bold text-[var(--ink-strong)]">{t(g)}</h3>
              </div>
              <div className="mt-3 space-y-0.5">
                {calculators.filter(c=>c.group===g).map(c=>(
                  <button key={c.id} onClick={()=>{setId(c.id);window.scrollTo({top:0,behavior:'smooth'})}}
                    className={`block w-full rounded-[8px] px-3 py-2 text-left text-[13.5px] transition ${c.id===id
                      ? 'bg-[var(--accent-soft)] font-bold text-[var(--accent-ink)]'
                      : 'text-[var(--ink-2)] hover:bg-[var(--card-2)] hover:text-[var(--accent-ink)]'}`}>{t(c.name)}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
    <CtaBand/>
  </>;
}

/* ---------- share market ---------- */
const marketServices:[string,string,string][]=[
  ['Demat & trading account','Open a demat and trading account with our broking partners. Equity delivery at zero brokerage, intraday and F&O at a flat per-order fee.','CandlestickChart'],
  ['Loan against securities','Borrow against shares, mutual funds and bonds without selling them. Limits up to 50% of approved equity value, with interest charged only on what you draw.','Coins'],
  ['Mutual funds & SIPs','Direct-plan mutual funds with no commission built into the NAV, plus goal-based SIP planning reviewed twice a year.','PiggyBank'],
  ['IPO & bond access','Apply to mainboard IPOs through UPI, and reach corporate bond and G-Sec issues usually reserved for institutional desks.','TrendingUp'],
  ['Portfolio review','An annual read of concentration, expense drag and asset allocation against your actual goals, not a model portfolio.','LineChart'],
  ['Margin trading facility','Regulated MTF through partner brokers, with transparent funding rates and a clear pledge and haircut schedule.','Percent'],
];
const marketRates:[string,string,string][]=[
  ['Equity delivery','₹0 per order','Unlimited'],
  ['Intraday & F&O','₹20 per order','Flat, any order size'],
  ['Loan against securities','9.50% – 12.00% p.a.','Interest on drawn amount only'],
  ['Demat AMC','₹0 first year','₹300 p.a. thereafter'],
  ['Mutual funds (direct)','₹0 commission','No trail built into NAV'],
];

export function ShareMarketPage(){
  return <>
    <PageHero eyebrow="Share Market" crumb="Share Market" title="Invest, and borrow against what you already own"
      sub="Broking, mutual funds and securities-backed credit through SEBI-registered partners, so your portfolio can work without being liquidated."
      image="/share-market-hero.webp" imageAspect="2171 / 724"
      mobileImage="/share-market-hero-m.webp" mobileAspect="741 / 724"
      crumbBox={{left:'3.3%',top:'17.5%',width:'3.0%',height:'5%'}}/>
    <Section>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {marketServices.map(([ttl,b,ic])=>(
          <Card key={ttl} hover className="p-6">
            <Tile name={ic}/>
            <div className="mt-4 text-[16px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
          </Card>
        ))}
      </div>
    </Section>
    <div className="bg-[var(--card)]">
      <Section>
        <Head eyebrow="Pricing" title="What it costs, in full"/>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="bg-[var(--card-2)] text-[11.5px] uppercase tracking-wide text-[var(--muted-2)]">
                  {['Service','Charge','Notes'].map(h=><th key={h} className="px-6 py-3.5 font-bold">{t(h)}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-2)]">
                {marketRates.map(([a,b,c])=>(
                  <tr key={a} className="transition hover:bg-[var(--card-2)]">
                    <td className="px-6 py-4 text-[14px] font-bold text-[var(--ink-strong)]">{t(a)}</td>
                    <td className="px-6 py-4 text-[15px] font-extrabold text-[var(--accent-ink)]">{t(b)}</td>
                    <td className="px-6 py-4 text-[13.5px] text-[var(--muted)]">{t(c)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--muted-2)]">
          {t('Statutory charges — STT, exchange transaction fees, SEBI turnover fee, stamp duty and GST — apply on top and are set by the exchange and the government, not by us.')}
        </p>
      </Section>
    </div>
    <Section>
      <Head eyebrow="Plan it" title="What a monthly SIP could become" sub="Change the contribution, expected return and duration to see how compounding behaves over time."/>
      <Sip/>
    </Section>
    <div className="bg-[var(--card)]">
      <Section tight>
        <Card className="border-[var(--warn-bright)] bg-[var(--warn-soft)] p-6">
          <div className="flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[var(--warn-soft)] text-[var(--warn)]"><Info size={19}/></div>
            <div>
              <div className="text-[14.5px] font-bold text-[var(--warn)]">{t('Market risk disclosure')}</div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--warn)]">
                {t('Investments in securities and mutual funds are subject to market risk, including possible loss of principal. Past performance does not indicate future results, and the returns used in the calculator above are assumptions you choose rather than projections we stand behind. A loan against securities carries the additional risk of a margin call if pledged holdings fall in value. Read all scheme and offer documents carefully before investing. eLoans is not a SEBI-registered investment adviser and does not provide personalised investment advice.')}
              </p>
            </div>
          </div>
        </Card>
      </Section>
    </div>
    <CtaBand/>
  </>;
}

/* ---------- global business ---------- */
const globalServices:[string,string,string][]=[
  ['NRI home & property loans','Finance property in India from twelve countries, with repayment from an NRE or NRO account and no need to fly back for signing.','House'],
  ['Trade finance','Letters of credit, bank guarantees and buyer credit arranged through partner banks with correspondent networks in 40+ markets.','Ship'],
  ['Export & import credit','Pre-shipment and post-shipment credit in rupees or foreign currency, priced off the relevant benchmark rather than a flat markup.','Briefcase'],
  ['Forex & remittance','Interbank-linked rates for inward and outward remittance, with the margin disclosed rather than folded into the rate.','Globe'],
  ['Cross-border payments','Multi-currency collection accounts for exporters and businesses billing overseas clients, settling into your Indian account.','Wallet'],
  ['Overseas education finance','Loans covering tuition, living costs and travel for study abroad, with disbursal timed to each semester invoice.','GraduationCap'],
];
const corridors:[string,string,string,string][]=[
  ['United States','USD','NRI home loan · Remittance · Trade finance','8.45%'],
  ['United Arab Emirates','AED','NRI home loan · Remittance · Export credit','8.40%'],
  ['United Kingdom','GBP','NRI home loan · Education · Remittance','8.55%'],
  ['Singapore','SGD','Trade finance · Remittance · Property','8.50%'],
  ['Australia','AUD','Education · NRI home loan · Remittance','8.60%'],
  ['Canada','CAD','Education · NRI home loan · Remittance','8.60%'],
];

export function GlobalBusinessPage(){
  return <>
    <PageHero eyebrow="Global Business" crumb="Global Business" title="Finance that crosses borders without losing the plot"
      sub="NRI lending, trade finance and cross-border payments through partner banks with correspondent relationships in more than forty markets."
      image="/global-hero.webp" imageAspect="2172 / 724"
      mobileImage="/global-hero-m.webp" mobileAspect="752 / 684"
      crumbBox={{left:'3.4%',top:'21%',width:'3.2%',height:'5%'}}/>
    <div className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
        {([['40+','Markets covered'],['12','NRI lending corridors'],['$180M','Trade volume facilitated'],['2–5 days','Typical LC issuance']] as [string,string][]).map(([v,l])=>(
          <div key={l} className="py-7">
            <div className="text-[24px] font-extrabold tracking-[-.02em] text-[var(--ink-strong)]">{t(v)}</div>
            <div className="mt-1 text-[13px] text-[var(--muted)]">{t(l)}</div>
          </div>
        ))}
      </div>
    </div>
    <Section>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {globalServices.map(([ttl,b,ic])=>(
          <Card key={ttl} hover className="p-6">
            <Tile name={ic}/>
            <div className="mt-4 text-[16px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
          </Card>
        ))}
      </div>
    </Section>
    <div className="bg-[var(--card)]">
      <Section>
        <Head eyebrow="Corridors" title="Where we lend and settle"/>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="bg-[var(--card-2)] text-[11.5px] uppercase tracking-wide text-[var(--muted-2)]">
                  {['Country','Currency','Products available','NRI home loan from'].map(h=><th key={h} className="px-6 py-3.5 font-bold">{t(h)}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-2)]">
                {corridors.map(([country,ccy,products,rate])=>(
                  <tr key={country} className="transition hover:bg-[var(--card-2)]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[var(--logo-plate)] text-[10px] font-black text-white">{t(ccy)}</div>
                        <span className="text-[14px] font-bold text-[var(--ink-strong)]">{t(country)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13.5px] text-[var(--ink-2)]">{t(ccy)}</td>
                    <td className="px-6 py-4 text-[13.5px] text-[var(--muted)]">{t(products)}</td>
                    <td className="px-6 py-4 text-[15px] font-extrabold text-[var(--accent-ink)]">{t(rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--muted-2)]">
          {t("Rates are indicative for NRI applicants with documented overseas income and a resident co-applicant. Cross-border lending is subject to FEMA regulations and to each lender's country-risk policy.")}
        </p>
      </Section>
    </div>
    <Section>
      <Head eyebrow="Process" title="How a cross-border file moves"/>
      <div className="mx-auto max-w-[820px]">
        {([
          ['Structure the requirement','We map what you are financing against FEMA rules and each partner bank policy, so the file is not rejected on a technicality three weeks in.'],
          ['Documentation and attestation','Overseas income proof, passport and visa pages, and where required an apostilled power of attorney, so you never need to travel to sign.'],
          ['Sanction and currency terms','Sanction letter reviewed with you line by line, including the benchmark, the reset frequency and the exact remittance margin.'],
          ['Disbursal and repayment set-up','Funds released to the seller or beneficiary, and repayment mandated from your NRE or NRO account with conversion terms fixed in writing.'],
        ] as [string,string][]).map(([ttl,b],i,arr)=>(
          <div key={ttl} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[13px] font-bold text-white">{i+1}</div>
              {i<arr.length-1&&<div className="w-px flex-1 bg-[var(--border)]"/>}
            </div>
            <div className="pb-8">
              <div className="text-[15.5px] font-bold text-[var(--ink-strong)]">{t(ttl)}</div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted)]">{t(b)}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
    <CtaBand/>
  </>;
}
