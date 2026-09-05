import {useCallback,useEffect,useState} from 'react';

/* Theme lives on <html> as data-theme / data-accent, which is what the token
   layer in index.css keys off. Choices persist per browser; when the user has
   never chosen a mode we follow the OS. */

export type Mode='light'|'dark';
export type Accent='blue'|'green'|'purple';
export const accents:[Accent,string][]=[['blue','Blue'],['green','Green'],['purple','Purple']];

const MODE_KEY='eloans.theme.mode';
const ACCENT_KEY='eloans.theme.accent';
const read=(k:string)=>{try{return localStorage.getItem(k)}catch{return null}};
const write=(k:string,v:string)=>{try{localStorage.setItem(k,v)}catch{/* private mode */}};

const prefersDark=()=>typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches;
const initialMode=():Mode=>{const v=read(MODE_KEY);return v==='dark'||v==='light'?v:(prefersDark()?'dark':'light')};
const initialAccent=():Accent=>{const v=read(ACCENT_KEY);return v==='green'||v==='purple'||v==='blue'?v:'purple'};

/* Applied before first paint in main.tsx so there is no flash of the wrong theme. */
export function applyStoredTheme(){
  const el=document.documentElement;
  el.setAttribute('data-theme',initialMode());
  el.setAttribute('data-accent',initialAccent());
}

export function useTheme(){
  const [mode,setModeState]=useState<Mode>(initialMode);
  const [accent,setAccentState]=useState<Accent>(initialAccent);

  useEffect(()=>{document.documentElement.setAttribute('data-theme',mode)},[mode]);
  useEffect(()=>{document.documentElement.setAttribute('data-accent',accent)},[accent]);

  /* follow the OS until the user picks a mode themselves */
  useEffect(()=>{
    if(read(MODE_KEY)) return;
    if(typeof matchMedia!=='function') return;
    const mq=matchMedia('(prefers-color-scheme: dark)');
    const on=(e:MediaQueryListEvent)=>setModeState(e.matches?'dark':'light');
    mq.addEventListener('change',on);
    return ()=>mq.removeEventListener('change',on);
  },[]);

  const setMode=useCallback((m:Mode)=>{setModeState(m);write(MODE_KEY,m)},[]);
  const setAccent=useCallback((a:Accent)=>{setAccentState(a);write(ACCENT_KEY,a)},[]);
  const toggleMode=useCallback(()=>setMode(mode==='dark'?'light':'dark'),[mode,setMode]);

  return {mode,accent,setMode,setAccent,toggleMode};
}
