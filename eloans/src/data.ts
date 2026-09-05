import type * as Icons from 'lucide-react';
import {products} from './content';

export type Loan={id:string;name:string;description:string;rate:string;max:string;tenure:string;icon:keyof typeof Icons;tag?:string};
export type Bank={id:string;name:string;rate:string;amount:string;tenure:string;fee:string;approval:string;rating:number;initials:string};

/* The catalogue in content.ts is the single source of truth. This projection
   keeps the shape the existing cards, carousels and submenus already consume,
   so a product is defined once and appears everywhere.
   Amounts and unverified rates surface as "On request" rather than invented
   figures. */
export const rateLabel=(r:string|null)=>r??'On request';
export const loans:Loan[]=products.map(p=>({
  id:p.id,name:p.name,description:p.description,icon:p.icon,tag:p.tag,
  rate:rateLabel(p.rate),
  max:/\d/.test(p.max)?p.max:'On request',
  tenure:p.tenure,
}));
/* Partner personal-loan rates and processing fees, taken from lenders' published
   starting rates as listed by BankBazaar, Paisabazaar, MoneyView and ClearTax.
   These are advertised minimums for the strongest applicant profiles — most
   borrowers are priced higher. Re-check before each release; rates move with the
   RBI repo rate. Customer ratings are illustrative, not sourced. */
export const RATES_AS_OF='September 2026';
export const banks:Bank[]=[{id:'hdfc',name:'HDFC Bank',rate:'9.99%',amount:'₹40L',tenure:'7 years',fee:'₹6,500 + GST',approval:'Fast',rating:4.7,initials:'HDFC'},{id:'axis',name:'Axis Bank',rate:'8.75%',amount:'₹25L',tenure:'7 years',fee:'Up to 2.00%',approval:'Fast',rating:4.4,initials:'AXIS'},{id:'union',name:'Union Bank of India',rate:'9.05%',amount:'₹22L',tenure:'7 years',fee:'1.00% (max ₹7,500)',approval:'Medium',rating:4.1,initials:'UNION'},{id:'bandhan',name:'Bandhan Bank',rate:'9.47%',amount:'₹15L',tenure:'5 years',fee:'Up to 3.00%',approval:'Fast',rating:4.0,initials:'BANDHAN'},{id:'icici',name:'ICICI Bank',rate:'9.99%',amount:'₹25L',tenure:'6 years',fee:'Up to 2.00%',approval:'Fast',rating:4.5,initials:'ICICI'},{id:'sbi',name:'SBI Bank',rate:'10.00%',amount:'₹30L',tenure:'7 years',fee:'Up to 1.50%',approval:'Medium',rating:4.6,initials:'SBI'},{id:'bajaj',name:'Bajaj Finserv',rate:'10.00%',amount:'₹35L',tenure:'8 years',fee:'Up to 3.93%',approval:'Fast',rating:4.4,initials:'BAJAJ'},{id:'bob',name:'Bank of Baroda',rate:'10.15%',amount:'₹20L',tenure:'7 years',fee:'Up to 2.00%',approval:'Medium',rating:4.3,initials:'BOB'},{id:'pnb',name:'Punjab National Bank',rate:'10.25%',amount:'₹20L',tenure:'7 years',fee:'0.35%',approval:'Medium',rating:4.2,initials:'PNB'},{id:'iob',name:'Indian Overseas Bank',rate:'10.50%',amount:'₹15L',tenure:'6 years',fee:'0.40% – 0.50%',approval:'Medium',rating:3.9,initials:'IOB'},{id:'boi',name:'Bank of India',rate:'10.85%',amount:'₹20L',tenure:'7 years',fee:'1.00%',approval:'Medium',rating:4.1,initials:'BOI'},{id:'canara',name:'Canara Bank',rate:'10.95%',amount:'₹25L',tenure:'7 years',fee:'Up to 1.00%',approval:'Medium',rating:4.3,initials:'CANARA'},{id:'kotak',name:'Kotak Mahindra Bank',rate:'10.99%',amount:'₹20L',tenure:'6 years',fee:'Up to 5.00%',approval:'Fast',rating:4.3,initials:'KOTAK'},{id:'indian',name:'Indian Bank',rate:'11.15%',amount:'₹18L',tenure:'7 years',fee:'₹470 (pre-approved)',approval:'Medium',rating:4.0,initials:'INDIAN'},{id:'indusind',name:'IndusInd Bank',rate:'12.00%',amount:'₹25L',tenure:'6 years',fee:'Up to 3.50%',approval:'Fast',rating:4.2,initials:'INDUS'},{id:'south-indian',name:'South Indian Bank',rate:'12.85%',amount:'₹15L',tenure:'6 years',fee:'On request',approval:'Medium',rating:4.0,initials:'SIB'}];

export const insurance:[string,string,string,string,string,string][]=[['life','Life Insurance','Protect your family’s financial future.','₹1 Cr+','₹899/mo','HeartPulse'],['health','Health Insurance','Comprehensive cover for medical expenses.','₹25L','₹650/mo','HeartHandshake'],['term','Term Insurance','High cover at affordable premiums.','₹2 Cr','₹1,100/mo','Shield'],['travel','Travel Insurance','Travel with confidence, anywhere.','₹50L','₹299/trip','Plane'],['property','Property Insurance','Protect your home and property.','₹1 Cr','₹499/mo','House'],['vehicle','Vehicle Insurance','Reliable protection for your vehicle.','₹50L','₹850/mo','CarFront'],['heavy','Heavy Vehicle Insurance','Specialized fleet and commercial cover.','₹1 Cr','₹1,900/mo','Truck']];
