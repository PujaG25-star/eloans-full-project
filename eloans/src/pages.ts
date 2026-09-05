import type * as Icons from 'lucide-react';

/* ------------------------------------------------------------------
   Content pages.

   Everything outside the loan catalogue is authored here as structured
   blocks and rendered by one component (InfoPage) using the existing
   Card / Section / Pill / Faq primitives. Adding a page means adding an
   entry — no new markup, so the design cannot drift.

   Compliance: no invented rates, amounts, fees, statistics, awards,
   partnerships or regulatory claims. Where a real business figure is
   needed the copy says [Add verified business information].
------------------------------------------------------------------ */

export type Block=
 |{t:'intro';text:string}
 |{t:'cards';title?:string;sub?:string;items:[string,string,string][]}      // icon, heading, body
 |{t:'list';title:string;sub?:string;items:string[]}
 |{t:'table';title:string;sub?:string;head:string[];rows:string[][];note?:string}
 |{t:'steps';title:string;sub?:string;items:[string,string][]}
 |{t:'faq';title:string;items:[string,string][]}
 |{t:'note';tone:'info'|'warn';text:string}
 |{t:'links';title:string;sub?:string;items:[string,string,string][]};      // label, href, blurb

export type InfoPage={
  id:string;                 // route path, without the leading slash
  group:string;              // nav section it belongs to
  eyebrow:string;
  title:string;
  sub:string;
  icon:keyof typeof Icons;
  blocks:Block[];
};

const PLACEHOLDER='[Add verified business information]';

/* reused disclaimers, written once */
const estimateNote:Block={t:'note',tone:'info',text:'Results from tools on this platform are estimates for guidance only. They are not offers of credit and do not guarantee approval. Your lender decides the final amount, rate and terms against your own profile.'};
const marketNote:Block={t:'note',tone:'warn',text:'Investments in securities and market-linked products are subject to market risk, including possible loss of principal. Past performance does not indicate future results. Read all scheme and offer documents carefully before investing.'};
const insuranceNote:Block={t:'note',tone:'info',text:'Cover, exclusions, waiting periods and claim conditions are set by the insurer and stated in the policy document. Read it in full before buying. Nothing here is a promise of cover.'};

export const infoPages:InfoPage[]=[

  /* ================= BANKS & RATES ================= */
  {id:'rates/best',group:'Banks & Rates',icon:'Percent',eyebrow:'Banks & Rates',
   title:'Understanding the best interest rate',
   sub:'The lowest advertised rate is rarely the cheapest loan. Here is what actually determines what you pay.',
   blocks:[
    {t:'intro',text:'Lenders advertise a starting rate — the number offered to their strongest applicants. Very few borrowers receive it. What you actually pay depends on your credit profile, income, employer, loan size and tenure, and the true cost of borrowing includes fees that never appear in the headline.'},
    {t:'cards',title:'What makes up the real cost',items:[
      ['Percent','Interest rate','The advertised figure is a starting point. Your rate is set after the lender assesses your profile, and a wide band usually sits behind that single number.'],
      ['FileCheck2','Processing fee','A one-off charge, often a percentage of the amount, usually deducted at disbursal — so you receive less than you were sanctioned.'],
      ['Clock','Tenure','A longer tenure lowers the monthly instalment and raises the total interest. Two loans at the same rate can cost very differently.'],
      ['ShieldCheck','Insurance and add-ons','Credit life cover and other add-ons are optional on the products we list. Check whether one has been included in your quote.'],
      ['ArrowDownUp','Prepayment terms','Whether you can repay early without penalty affects the real cost if your circumstances change.'],
      ['Info','Other charges','Documentation, stamping, valuation and late-payment charges vary by lender and product.'],
    ]},
    {t:'steps',title:'How to compare properly',items:[
      ['Compare total payable, not the EMI','Multiply the instalment by the number of months, then add the processing fee. That single number is comparable across offers.'],
      ['Hold the tenure constant','An offer only looks cheaper because it runs longer. Compare like with like before deciding.'],
      ['Ask for the rate in writing','The sanction letter governs. Anything quoted verbally is not binding.'],
      ['Read the fee schedule','Ask specifically what is deducted at disbursal, and what you would pay to repay early.'],
    ]},
    estimateNote,
    {t:'faq',title:'Common questions',items:[
      ['Why is my rate higher than the advertised one?','Advertised rates are the lender’s best pricing for the strongest profiles — typically a high credit score, stable high income and a recognised employer. Most applicants are priced above it.'],
      ['Does a lower rate always mean a cheaper loan?','No. A lower rate with a high processing fee or a longer tenure can cost more overall. Compare the total amount repayable.'],
      ['Can I negotiate?','Often, yes — particularly if you hold a competing written offer, or have an existing relationship with the lender.'],
    ]},
   ]},

  {id:'rates/alerts',group:'Banks & Rates',icon:'Bell',eyebrow:'Banks & Rates',
   title:'Rate alerts',
   sub:'Keep track of when borrowing costs move, so you can act rather than react.',
   blocks:[
    {t:'intro',text:'Lending rates move as the RBI changes the repo rate and as lenders adjust their own spreads. If you are borrowing soon, or already hold a floating-rate loan, a change of even a quarter of a percent is worth knowing about — over a long tenure it adds up to a substantial sum.'},
    {t:'cards',title:'What is worth watching',items:[
      ['TrendingUp','Policy rate changes','The RBI reviews the repo rate periodically. Most floating retail loans are linked to it, so a change passes through to borrowers.'],
      ['Landmark','Lender spread changes','A lender can move its own margin over the benchmark independently of policy. Two borrowers on the same benchmark can pay different rates.'],
      ['BadgePercent','Promotional pricing','Lenders periodically reduce processing fees or offer festive pricing. These are time-bound and worth comparing against standing offers.'],
      ['ArrowDownUp','Your own reset date','Floating loans reset on a schedule set in your agreement. Knowing yours tells you when a change will reach your EMI.'],
    ]},
    {t:'list',title:'What to do when rates fall',items:[
      'Ask your existing lender for a rate review before considering a transfer — it is faster and cheaper.',
      'If they decline, compare a balance transfer, counting processing, legal and stamping costs.',
      'Decide whether to keep the EMI and shorten the tenure, or lower the EMI. Shortening saves far more interest.',
      'Check whether your loan is on a fixed rate, in which case a policy change will not reach you.',
    ]},
    {t:'note',tone:'info',text:'Alert preferences are a planned feature. ' + PLACEHOLDER + ' — confirm which channels (email, SMS, in-app) will be supported before publishing this page.'},
    {t:'faq',title:'Common questions',items:[
      ['How often do rates change?','The RBI reviews policy on a published schedule, and lenders can revise pricing between reviews. There is no fixed frequency for any individual lender.'],
      ['Will my EMI change automatically?','On a floating-rate loan, usually the tenure changes first and the EMI stays the same, unless you ask otherwise. Check your loan agreement.'],
    ]},
   ]},

  {id:'rates/track',group:'Banks & Rates',icon:'LineChart',eyebrow:'Banks & Rates',
   title:'How interest rates move',
   sub:'A plain explanation of what drives borrowing costs in India.',
   blocks:[
    {t:'intro',text:'Retail lending rates in India are largely anchored to an external benchmark. Since 2019 most floating-rate retail loans have been linked to one — usually the RBI repo rate — plus a spread the lender sets. Understanding that structure explains most of what you see in the market.'},
    {t:'cards',title:'The moving parts',items:[
      ['Landmark','The repo rate','The rate at which the RBI lends to banks. It is the anchor for most floating retail loans and is reviewed periodically.'],
      ['Percent','The lender’s spread','A margin added over the benchmark, reflecting the lender’s costs and your credit risk. It is fixed at sanction and changes only in defined circumstances.'],
      ['Gauge','Your credit profile','Score, income stability and existing obligations determine where within a lender’s band you are priced.'],
      ['Clock','Reset frequency','How often your rate is re-fixed against the benchmark. Your agreement sets this, commonly every three months.'],
    ]},
    {t:'table',title:'Fixed and floating compared',head:['','Fixed rate','Floating rate'],rows:[
      ['Rate movement','Stays the same for the agreed period','Moves with the benchmark'],
      ['Predictability','High — the EMI is known','Lower — the EMI or tenure can change'],
      ['Foreclosure charge','May apply','Nil for individuals, by RBI rule'],
      ['Typical pricing','Usually higher at the outset','Usually lower at the outset'],
      ['Suits','Borrowers who value certainty','Borrowers who can absorb variation'],
    ],note:'This is a general comparison. The terms that bind you are the ones in your own sanction letter.'},
    {t:'faq',title:'Common questions',items:[
      ['What is EBLR?','External Benchmark Lending Rate — the rate arrived at by adding a lender’s spread to an external benchmark such as the repo rate. Most floating retail loans are priced this way.'],
      ['Can my lender raise the spread?','The spread is generally fixed for the life of the loan, and can be changed only in circumstances set out in your agreement, such as a material change in your credit assessment.'],
    ]},
   ]},

  {id:'rates/lowest',group:'Banks & Rates',icon:'Search',eyebrow:'Banks & Rates',
   title:'Finding the lowest total cost',
   sub:'A method for working out which offer is genuinely cheapest for you.',
   blocks:[
    {t:'intro',text:'A "lowest rate finder" that only sorts by advertised rate will mislead you. The cheapest loan is the one with the lowest total cost over the period you will actually hold it — and that calculation includes fees, tenure and what happens if you repay early.'},
    {t:'steps',title:'Work it out in five steps',items:[
      ['Fix the amount and tenure','Decide what you need and over how long, then compare every offer on those same terms.'],
      ['Calculate the EMI for each offer','Use the EMI calculator. Note the monthly figure for each lender at your chosen tenure.'],
      ['Multiply out the total repayable','EMI multiplied by the number of months gives the total you will pay.'],
      ['Add every upfront charge','Processing fee, documentation, valuation and stamping. These are usually deducted at disbursal.'],
      ['Check the exit terms','If you may repay early, the foreclosure position can outweigh a small rate difference.'],
    ]},
    {t:'list',title:'Things that quietly change the answer',items:[
      'A processing fee expressed as a percentage grows with the loan size.',
      'A tenure one year longer can cost more in interest than a 0.5% higher rate.',
      'Insurance bundled into the loan increases both the principal and the interest paid on it.',
      'A lower rate offered only for an introductory period reverts later — check what it reverts to.',
    ]},
    estimateNote,
   ]},

  {id:'rates/pre-approved',group:'Banks & Rates',icon:'BadgeCheck',eyebrow:'Banks & Rates',
   title:'Pre-approved offers explained',
   sub:'What a pre-approved offer is, and importantly, what it is not.',
   blocks:[
    {t:'intro',text:'A pre-approved offer means a lender has looked at information it already holds — often your banking relationship or a bureau record — and indicated it is likely to lend to you. It is an invitation to apply, assessed on partial information. It is not a sanction, and it is not a guarantee of credit.'},
    {t:'cards',title:'What it does and does not mean',items:[
      ['Check','It means','A lender has screened you against its criteria on the data it holds, and expects your application to succeed.'],
      ['X','It does not mean','That the loan is approved, that the rate is final, or that the amount shown will be sanctioned.'],
      ['FileCheck2','What still happens','Full KYC, income verification, a credit check and the lender’s final credit decision.'],
      ['Info','What can change it','New borrowing, a missed payment, a change of employment, or information that does not match the lender’s records.'],
    ]},
    {t:'list',title:'Before you accept one',items:[
      'Compare it against the open market — a pre-approved offer is convenient, not automatically competitive.',
      'Check the processing fee, which is often not mentioned in the offer message.',
      'Confirm the rate is fixed at that level for your profile, in writing.',
      'Be wary of unsolicited offers arriving by SMS or messaging apps — verify through the lender’s own channel.',
    ]},
    {t:'note',tone:'warn',text:'Any offer is subject to the lender’s verification, credit policy and final approval. No offer on this platform constitutes a commitment to lend.'},
   ]},

  /* ================= CREDIT & TOOLS ================= */
  {id:'credit/score',group:'Credit & Tools',icon:'Gauge',eyebrow:'Credit & Tools',
   title:'What a credit score is',
   sub:'A three-digit summary of how you have handled borrowing, and why lenders lean on it so heavily.',
   blocks:[
    {t:'intro',text:'A credit score condenses your borrowing history into a number, generally between 300 and 900 in India. It is produced by credit information companies from data lenders report about you — what you have borrowed, whether you repaid on time, and how much credit you are currently using. Lenders use it as a first filter and as an input to pricing.'},
    {t:'cards',title:'What goes into it',items:[
      ['CalendarClock','Repayment history','The largest single influence. Payments made on time build the score; missed or late payments damage it, and the record persists for years.'],
      ['Gauge','Credit utilisation','How much of your available revolving credit you are using. Consistently running cards near their limit weighs against you.'],
      ['Clock','Length of history','A longer track record gives more evidence to assess. Closing your oldest card can shorten it.'],
      ['Files','Credit mix','A blend of secured and unsecured borrowing, handled well, reads better than one type alone.'],
      ['Search','Recent enquiries','Several hard enquiries in a short period can suggest credit stress. Soft enquiries, such as eligibility checks here, do not count.'],
    ]},
    {t:'table',title:'How lenders generally read a score',head:['Band','Typical reading'],rows:[
      ['750 and above','Usually qualifies for a lender’s better pricing'],
      ['700 – 749','Generally acceptable to most lenders'],
      ['650 – 699','May be approved, often at a higher rate'],
      ['Below 650','Approval is harder; secured borrowing may be more realistic'],
      ['No score','A thin file — some lenders assess on banking behaviour instead'],
    ],note:'Bands are indicative of general market practice. Every lender applies its own policy, and no score guarantees an outcome.'},
    {t:'note',tone:'info',text:'No action produces a specific score. Scores respond gradually to sustained repayment behaviour, and different bureaus may report different numbers for the same person.'},
   ]},

  {id:'credit/report',group:'Credit & Tools',icon:'FileText',eyebrow:'Credit & Tools',
   title:'Reading your credit report',
   sub:'The report is the evidence; the score is only the summary.',
   blocks:[
    {t:'intro',text:'Your credit report lists every credit account lenders have reported about you, along with their repayment history. It is worth reading in full at least once a year — errors are common, and they are far easier to correct before you apply for something important.'},
    {t:'cards',title:'What you will find in it',items:[
      ['User','Personal information','Name, date of birth, PAN, addresses and employment as reported by lenders. Mismatches here can cause application failures.'],
      ['WalletCards','Account details','Every loan and card, with sanctioned amount, outstanding balance, and whether the account is open or closed.'],
      ['CalendarClock','Payment history','A month-by-month record for each account, showing on-time payments and any days past due.'],
      ['Search','Enquiries','Every hard enquiry made when you applied for credit, with the lender and date.'],
      ['Info','Remarks','Flags such as settled, written off, or restructured. These carry substantial weight with lenders.'],
    ]},
    {t:'steps',title:'If you find an error',items:[
      ['Gather your evidence','Statements, closure letters or a no-objection certificate that contradict the entry.'],
      ['Raise a dispute with the bureau','Each credit information company has a dispute process. Submit the specific entry and your evidence.'],
      ['Follow up with the lender','The bureau reports what the lender submits, so the correction usually has to come from them.'],
      ['Re-check after resolution','Confirm the corrected entry appears, and keep a record of the correspondence.'],
    ]},
    {t:'note',tone:'info',text:'Under RBI rules you are entitled to obtain your credit report from each credit information company. Checking your own report is a soft enquiry and does not affect your score.'},
   ]},

  {id:'credit/improve',group:'Credit & Tools',icon:'TrendingUp',eyebrow:'Credit & Tools',
   title:'Building healthier credit',
   sub:'Practical habits that tend to help, stated honestly — none of them is a guarantee.',
   blocks:[
    {t:'intro',text:'There is no trick that raises a credit score quickly. Scores reflect sustained behaviour, and the things that help are unglamorous and slow. What follows is general guidance, not a promise of any particular outcome.'},
    {t:'cards',title:'Habits that generally help',items:[
      ['CalendarClock','Pay on time, every time','Repayment history carries more weight than anything else. Set up auto-debit or standing instructions so a payment is never missed by oversight.'],
      ['Gauge','Keep utilisation moderate','Using a large share of your available revolving credit reads as stress. Paying down a card before the statement date lowers the reported figure.'],
      ['Search','Apply sparingly','Several applications in a short window create multiple hard enquiries. Check eligibility first — a soft check costs you nothing.'],
      ['FileText','Review your report','Errors suppress scores. An annual read of your report catches them before they matter.'],
      ['Clock','Keep old accounts open','A long history helps. Closing your oldest card can shorten it and raise your utilisation at the same time.'],
      ['ShieldCheck','Settle rather than default — but understand the cost','A "settled" flag is better than a default, but both are visible to lenders for years. Paying in full is materially better than either.'],
    ]},
    {t:'note',tone:'warn',text:'Be sceptical of any service offering to raise your score for a fee, or to remove accurate negative information. Accurate entries cannot be deleted, and paying for such promises is a common way to lose money.'},
   ]},

  {id:'credit/bureaus',group:'Credit & Tools',icon:'Landmark',eyebrow:'Credit & Tools',
   title:'Credit bureaus in India',
   sub:'Who compiles your credit record, and why your score can differ between them.',
   blocks:[
    {t:'intro',text:'Credit information companies — commonly called credit bureaus — collect data that lenders report, and compile it into a report and score. India has several, licensed and supervised by the RBI. Lenders choose which they consult, and not every lender reports to every bureau.'},
    {t:'cards',title:'How they work',items:[
      ['Landmark','Regulated entities','Credit information companies operate under the Credit Information Companies (Regulation) Act and RBI supervision.'],
      ['Files','Lender-reported data','A bureau does not observe your accounts directly. It compiles what lenders submit, usually monthly.'],
      ['Gauge','Different scores','Each bureau uses its own model and may hold slightly different data, so scores can differ. None is the single official number.'],
      ['ShieldCheck','Your rights','You are entitled to access your report and to dispute entries you believe are wrong.'],
    ]},
    {t:'faq',title:'Common questions',items:[
      ['Why is my score different on two bureaus?','They use different scoring models and may hold different data, since not every lender reports to every bureau. A gap of some points is normal.'],
      ['Which score do lenders use?','It depends on the lender — many consult one bureau, some more than one. There is no way to know in advance which they will use.'],
      ['Does checking my own score lower it?','No. Checking your own report is a soft enquiry and has no effect. Only a lender’s hard enquiry when you apply is recorded against you.'],
    ]},
    {t:'note',tone:'info',text:'This platform does not issue credit scores. Reports and scores are produced by the credit information companies themselves.'},
   ]},

  /* ================= CARDS & PAYMENTS ================= */
  {id:'cards/credit-cards',group:'Cards & Payments',icon:'CreditCard',eyebrow:'Cards & Payments',
   title:'Credit cards',
   sub:'A revolving credit line that is inexpensive used well and expensive used badly.',
   blocks:[
    {t:'intro',text:'A credit card gives you a revolving limit you can draw on and repay. Pay the full statement balance each month and the credit is generally free — you get an interest-free period and any rewards. Carry a balance and it becomes one of the costliest forms of borrowing available to an individual.'},
    {t:'cards',title:'Common card types',items:[
      ['BadgePercent','Lifetime free cards','No joining or annual fee. Useful for building history without a recurring cost, though rewards are usually modest.'],
      ['Wallet','Cashback cards','Return a percentage of spending as statement credit. Read the caps and excluded categories — both are usually where the value is limited.'],
      ['Plane','Travel cards','Earn miles or points, sometimes with lounge access. Worth the fee only if you genuinely use the benefits.'],
      ['ShieldCheck','Secured cards','Issued against a fixed deposit. A practical route for someone with no credit history.'],
    ]},
    {t:'list',title:'The costs to understand',items:[
      'Interest applies from the transaction date on cash withdrawals — there is no interest-free period on them.',
      'Paying only the minimum due keeps the account current but lets interest compound on the rest.',
      'Late payment attracts a fee and is reported to bureaus, damaging your credit record.',
      'Annual fees may be waived on meeting a spending threshold — check the condition rather than assuming.',
      'Foreign currency transactions usually carry a mark-up in addition to the exchange rate.',
    ]},
    {t:'steps',title:'Using one responsibly',items:[
      ['Pay the full statement balance','Not the minimum. This is the single habit that separates cheap credit from expensive debt.'],
      ['Keep utilisation moderate','High utilisation affects your credit score even when you pay in full.'],
      ['Set up auto-debit','A missed payment through oversight is avoidable and costly.'],
      ['Review the statement','Check every line. Disputed transactions have time limits for reporting.'],
    ]},
    {t:'note',tone:'warn',text:'Card interest rates are typically far higher than personal loan rates. If you are carrying a balance month to month, consolidating it into a lower-rate loan is usually cheaper — provided you then stop revolving the card.'},
   ]},

  {id:'cards/emi-card',group:'Cards & Payments',icon:'CalendarClock',eyebrow:'Cards & Payments',
   title:'EMI and shopping cards',
   sub:'Converting a purchase into instalments — and what that conversion actually costs.',
   blocks:[
    {t:'intro',text:'An EMI facility lets you split a purchase into monthly instalments, either on a credit card or through a dedicated shopping card. The mechanics vary, and so does the cost. The important question is always whether interest is being charged, and if so, at what rate.'},
    {t:'cards',title:'How the common structures differ',items:[
      ['Percent','Standard EMI','The purchase is converted at a stated interest rate, plus a one-off conversion fee. You see the rate.'],
      ['BadgePercent','No-cost EMI','Marketed as interest-free. In practice the interest is usually absorbed through a discount the merchant would otherwise have given, or built into the price. GST on the interest component is still commonly payable.'],
      ['CreditCard','Card EMI','Converting an existing card transaction into instalments after the purchase. The limit stays blocked until repaid.'],
      ['Wallet','Merchant finance','Instalments arranged at the point of sale by a lender, assessed separately from your card.'],
    ]},
    {t:'list',title:'Before converting a purchase',items:[
      'Ask what the total repayable is, and compare it with the cash price.',
      'Check whether the conversion fee is charged upfront.',
      'Confirm whether the amount continues to block your credit limit.',
      'Ask what happens if you want to foreclose the EMI early.',
      'Remember that a "no-cost" EMI is a pricing structure, not a gift.',
    ]},
    {t:'note',tone:'info',text:'Cards, limits and EMI conversion terms are set by the issuing lender. Availability and pricing differ by card, merchant and product.'},
   ]},

  {id:'cards/upi',group:'Cards & Payments',icon:'Smartphone',eyebrow:'Cards & Payments',
   title:'UPI payments',
   sub:'How instant bank-to-bank payments work, and how to use them safely.',
   blocks:[
    {t:'intro',text:'UPI lets you move money directly between bank accounts using an identifier such as a UPI ID or a QR code, without sharing your account number. Payments are instant and available at any hour. Because they are instant, they are also effectively irreversible — which is what makes fraud awareness so important.'},
    {t:'cards',title:'The essentials',items:[
      ['Smartphone','How it works','You link a bank account to a UPI app, set a UPI PIN, and authorise each payment with that PIN.'],
      ['ShieldCheck','Your PIN is for paying','You never need to enter a UPI PIN to receive money. Anyone asking you to is attempting fraud.'],
      ['Search','Verify before you send','Check the recipient name the app displays before confirming. A transfer to the wrong account is difficult to recover.'],
      ['Info','Limits apply','Banks and NPCI set per-transaction and daily limits, which vary by bank and transaction type.'],
    ]},
    {t:'list',title:'Staying safe',items:[
      'Never share your UPI PIN, OTP or card details with anyone, including someone claiming to be from your bank.',
      'Approving a "collect request" sends money out of your account — read what you are approving.',
      'Screenshots of QR codes sent by strangers are a common fraud vector. Scan only codes you trust.',
      'Report a fraudulent transaction to your bank immediately, and to the national cybercrime helpline.',
    ]},
    {t:'note',tone:'warn',text:'No genuine bank, lender or platform will ask for your UPI PIN, OTP, card CVV or full card number. Treat any such request as fraud.'},
   ]},

  {id:'cards/bills',group:'Cards & Payments',icon:'Files',eyebrow:'Cards & Payments',
   title:'Bill payments and recharges',
   sub:'Paying recurring bills in one place, and what to watch for.',
   blocks:[
    {t:'intro',text:'Recurring bills — electricity, gas, water, broadband, mobile, insurance premiums and loan instalments — can be paid through a single interface rather than several. The convenience is real; the thing to manage is making sure automated payments stay under your control.'},
    {t:'cards',title:'Ways to pay',items:[
      ['CalendarClock','One-off payment','You initiate each payment. Most control, most effort.'],
      ['ArrowDownUp','Auto-pay mandate','The biller collects automatically on the due date. Convenient, and the usual way to avoid missing a loan EMI.'],
      ['Bell','Reminders only','You are notified and pay manually. A middle path where amounts vary a lot.'],
      ['ShieldCheck','Standing instruction','Set with your bank rather than the biller. Changing it goes through the bank.'],
    ]},
    {t:'list',title:'Managing automated payments',items:[
      'Keep enough balance before the due date — a failed auto-debit can attract charges from both the biller and your bank.',
      'Review your mandates periodically and cancel ones you no longer need.',
      'For variable bills, consider a cap on the mandate where your bank supports one.',
      'Keep the payment confirmation until the biller’s statement reflects it.',
    ]},
    {t:'note',tone:'info',text:'Available billers and payment methods depend on the providers integrated with the platform. ' + PLACEHOLDER + ' before publishing a biller list.'},
   ]},
/* ================= INVESTMENTS ================= */
  {id:'investments/live-market',group:'Investments',icon:'CandlestickChart',eyebrow:'Investments',
   title:'Following the market',
   sub:'What the headline indices actually tell you, and what they do not.',
   blocks:[
    {t:'intro',text:'The Sensex and Nifty are indices — baskets of large listed companies whose combined movement is used as shorthand for "the market". They are useful as a temperature reading. They say very little about whether any particular investment suits you.'},
    {t:'cards',title:'Reading the numbers',items:[
      ['LineChart','Indices','The Sensex tracks 30 companies on the BSE; the Nifty 50 tracks 50 on the NSE. Both are weighted, so the largest companies move them most.'],
      ['TrendingUp','Gainers and losers','A daily list of the biggest movers. Sharp single-day moves often reflect news specific to one company rather than a trend.'],
      ['Info','Market news','Context for why prices moved. Useful for understanding; a poor basis for reacting.'],
      ['Clock','Time horizon','Daily movement matters to traders. For a long-term investor it is mostly noise.'],
    ]},
    {t:'note',tone:'warn',text:'Live market data, where shown, is provided for information only and may be delayed. It is not a recommendation to buy or sell. [Add verified market data provider and delay disclosure]'},
    marketNote,
   ]},

  {id:'investments/mutual-funds',group:'Investments',icon:'PiggyBank',eyebrow:'Investments',
   title:'Mutual funds',
   sub:'Pooled, professionally managed investing — and the categories worth understanding first.',
   blocks:[
    {t:'intro',text:'A mutual fund pools money from many investors and invests it according to a stated objective. You own units rather than the underlying securities, and the value of those units moves with the portfolio. Funds are regulated by SEBI and every scheme publishes a document setting out exactly what it may invest in.'},
    {t:'cards',title:'The main categories',items:[
      ['TrendingUp','Equity funds','Invest mainly in shares. Higher potential return over long periods, and higher volatility. Generally suited to horizons of five years or more.'],
      ['Landmark','Debt funds','Invest in bonds and money-market instruments. Steadier than equity, but not risk-free — they carry interest-rate and credit risk.'],
      ['ArrowDownUp','Hybrid funds','Hold a mix of equity and debt in a stated proportion, aiming for a middle path on risk and return.'],
      ['BadgePercent','ELSS / tax-saving','Equity funds qualifying for deduction under Section 80C, with a three-year lock-in — the shortest among 80C options.'],
    ]},
    {t:'list',title:'What to check before investing',items:[
      'The scheme objective and where it may invest — stated in the scheme information document.',
      'The expense ratio, which is deducted from returns every year.',
      'Whether it is a direct plan or a regular plan. Direct plans carry no distributor commission and therefore a lower expense ratio.',
      'Exit load and lock-in, which determine what it costs to leave early.',
      'Whether the risk level genuinely matches your horizon and your tolerance for a fall.',
    ]},
    marketNote,
   ]},

  {id:'investments/digital-gold',group:'Investments',icon:'Gem',eyebrow:'Investments',
   title:'Digital gold',
   sub:'Buying gold in small amounts without holding it physically.',
   blocks:[
    {t:'intro',text:'Digital gold lets you buy gold in very small quantities, stored in insured vaults by the provider on your behalf. It removes the making charges, storage worries and purity uncertainty of jewellery, but introduces considerations of its own.'},
    {t:'cards',title:'How it compares',items:[
      ['Gem','Digital gold','Small ticket sizes, 24K purity, vault storage. Convenient, but sits outside the securities regulator’s framework — check the provider carefully.'],
      ['Landmark','Sovereign Gold Bonds','Government-issued, pay periodic interest in addition to gold price movement, with a defined maturity. Issued in tranches rather than continuously.'],
      ['LineChart','Gold ETFs and funds','Exchange-traded or fund routes, held in demat or a folio, regulated by SEBI.'],
      ['Wallet','Physical gold','Tangible and usable as jewellery, but carries making charges, storage cost and purity risk.'],
    ]},
    {t:'list',title:'Things to weigh',items:[
      'A buy–sell spread applies, so the price you can sell at is below the price you buy at.',
      'Storage is usually free only for a defined period; check what happens afterwards.',
      'Gold produces no income — its return is price movement alone.',
      'Confirm who holds the gold, how it is insured, and how redemption works before buying.',
      'Digital gold is not currently regulated by SEBI in the way mutual funds and securities are.',
    ]},
    marketNote,
   ]},

  {id:'investments/stocks',group:'Investments',icon:'CandlestickChart',eyebrow:'Investments',
   title:'Stocks and demat accounts',
   sub:'What you need in place to buy shares directly, and what direct investing demands of you.',
   blocks:[
    {t:'intro',text:'Buying shares directly requires two things: a demat account, which holds the securities electronically, and a trading account, which places the orders. Both are opened with a SEBI-registered broker or depository participant. Direct equity gives you control and demands research and temperament in return.'},
    {t:'steps',title:'Opening an account',items:[
      ['Choose a registered broker','Verify the SEBI registration number independently on the regulator’s own website.'],
      ['Complete KYC','PAN, Aadhaar, bank proof and in-person verification, usually completed online.'],
      ['Link a bank account','Funds move between this account and your trading account.'],
      ['Understand the charges','Brokerage, statutory charges, demat annual maintenance and transaction fees all apply.'],
    ]},
    {t:'list',title:'Before you buy your first share',items:[
      'Understand that a share is part-ownership of a business, not a ticker to be traded on sentiment.',
      'Diversify — a concentrated portfolio can fall a very long way.',
      'Know the difference between delivery, intraday and derivatives. The latter two carry materially higher risk.',
      'Never invest borrowed money you cannot afford to lose.',
      'Beware of tips circulated on messaging apps and social media; many are coordinated manipulation.',
    ]},
    marketNote,
   ]},

  {id:'investments/fixed-deposits',group:'Investments',icon:'Landmark',eyebrow:'Investments',
   title:'Fixed deposits',
   sub:'A defined return over a defined term — the reference point most other products are judged against.',
   blocks:[
    {t:'intro',text:'A fixed deposit places money with a bank or NBFC for an agreed term at an agreed rate. The return is contractual rather than market-linked, which makes an FD the natural benchmark when weighing up riskier alternatives.'},
    {t:'cards',title:'What determines your return',items:[
      ['Clock','Tenure','Rates vary by term, and the longest tenure is not always the best rate.'],
      ['Percent','Compounding frequency','Most bank FDs compound quarterly, so the effective yield is slightly above the stated rate.'],
      ['Landmark','Institution','Small finance banks and NBFCs often offer more, reflecting different risk. Deposit insurance limits apply per bank.'],
      ['BadgePercent','Special categories','Senior citizens usually receive an additional margin. Tax-saving five-year deposits qualify under Section 80C but are locked in.'],
    ]},
    {t:'list',title:'Points worth knowing',items:[
      'Interest is taxable at your slab rate, and TDS applies above a threshold. The post-tax return is what matters.',
      'Breaking a deposit early usually attracts a penalty and a reduced rate.',
      'A loan against the deposit is often cheaper than breaking it for a short-term need.',
      'Deposit insurance covers deposits per depositor per bank up to a limit set by the DICGC.',
    ]},
    {t:'note',tone:'info',text:'Deposit rates are set by each institution and change frequently. Confirm the current rate with the bank before investing.'},
   ]},

  {id:'investments/portfolio',group:'Investments',icon:'LayoutGrid',eyebrow:'Investments',
   title:'Tracking your portfolio',
   sub:'Why seeing everything in one place changes the decisions you make.',
   blocks:[
    {t:'intro',text:'Most households hold investments across several places — a fund folio here, a demat account there, deposits at two banks, some gold. Scattered holdings make it hard to answer basic questions: how much equity do I actually own, and what would a bad year cost me?'},
    {t:'cards',title:'What a consolidated view gives you',items:[
      ['LayoutGrid','Asset allocation','The split across equity, debt, gold and cash — the single biggest driver of both return and risk.'],
      ['TrendingUp','Concentration','Whether one holding, sector or fund house dominates more than you realised.'],
      ['ArrowDownUp','Rebalancing','Whether your mix has drifted away from what you intended as markets moved.'],
      ['Percent','Cost drag','What you are paying in expense ratios and charges across the whole portfolio.'],
    ]},
    {t:'note',tone:'info',text:'Portfolio tracking is informational. Nothing shown constitutes investment advice or a recommendation. [Add verified data sources and any regulatory registrations before offering advisory features]'},
    marketNote,
   ]},

  /* ================= GLOBAL BUSINESS ================= */
  {id:'global/cross-border-payments',group:'Global Business',icon:'Globe',eyebrow:'Global Business',
   title:'Cross-border payments',
   sub:'Moving money in and out of India, and what governs it.',
   blocks:[
    {t:'intro',text:'Payments across borders are regulated under FEMA. Every transfer has a stated purpose, documented and reported by the bank handling it. Understanding the purpose codes and the cost structure is what separates an efficient transfer from an expensive one.'},
    {t:'cards',title:'What determines the cost',items:[
      ['Percent','Exchange rate margin','Usually the largest cost, and often invisible. Compare the rate offered against the live interbank rate.'],
      ['Files','Transfer fee','A stated charge from the sending institution, and sometimes from intermediaries in the chain.'],
      ['Landmark','Correspondent charges','Deducted en route on some corridors, which is why the recipient may get less than expected.'],
      ['Clock','Speed','Faster rails usually cost more. Decide whether same-day settlement is actually needed.'],
    ]},
    {t:'list',title:'Documentation you should expect',items:[
      'Purpose of remittance, declared and coded as required under FEMA.',
      'KYC for both sender and beneficiary.',
      'Invoices or contracts for trade-related payments.',
      'Form 15CA / 15CB for certain outward remittances, where applicable.',
      'Tax collected at source may apply on some outward remittances under the Liberalised Remittance Scheme.',
    ]},
    {t:'note',tone:'info',text:'Cross-border transactions are subject to FEMA, RBI guidance and the policies of the banks involved. Limits and documentation change; confirm the current position with your bank.'},
   ]},

  {id:'global/business-loans',group:'Global Business',icon:'BriefcaseBusiness',eyebrow:'Global Business',
   title:'International business finance',
   sub:'Funding a business that trades, buys or sells across borders.',
   blocks:[
    {t:'intro',text:'A business with international operations faces funding questions a domestic one does not — currency exposure, longer cash conversion cycles, and counterparties in jurisdictions the lender cannot easily assess. Facilities are structured around those realities.'},
    {t:'cards',title:'Common facilities',items:[
      ['Ship','Buyer’s and supplier’s credit','Financing arranged for an importer, often at rates linked to international benchmarks.'],
      ['Wallet','Foreign currency loans','Borrowing denominated in a foreign currency, which removes conversion cost but adds currency risk.'],
      ['ArrowDownUp','Cross-border working capital','Facilities sized around an operating cycle that spans shipping and customs clearance.'],
      ['ShieldCheck','Guarantees and standby credit','Instruments that let a counterparty rely on your bank’s standing rather than yours.'],
    ]},
    {t:'list',title:'What lenders assess',items:[
      'Trading history, and the concentration of your customers and suppliers.',
      'Currency exposure and whether it is hedged.',
      'Country risk of the markets you trade with.',
      'Regulatory compliance — FEMA, customs and export documentation.',
    ]},
    {t:'note',tone:'info',text:'Cross-border lending is subject to FEMA and each lender’s country-risk policy. Availability varies by market and by borrower.'},
   ]},

  {id:'global/trade-finance',group:'Global Business',icon:'Ship',eyebrow:'Global Business',
   title:'Export and import finance',
   sub:'The instruments that let two strangers in different countries trade with confidence.',
   blocks:[
    {t:'intro',text:'Trade finance exists to solve a trust problem. An exporter wants payment before shipping; an importer wants goods before paying. Banking instruments sit in between, substituting a bank’s creditworthiness for the counterparties’ own.'},
    {t:'cards',title:'The main instruments',items:[
      ['FileCheck2','Letter of credit','The importer’s bank undertakes to pay once the exporter presents documents that comply exactly with the stated terms.'],
      ['ShieldCheck','Bank guarantee','An undertaking to pay if the applicant fails to perform an obligation.'],
      ['ArrowDownUp','Pre-shipment credit','Working capital to buy raw material and manufacture against a confirmed export order.'],
      ['Wallet','Post-shipment credit','Finance against export receivables once goods have shipped, bridging the wait for payment.'],
    ]},
    {t:'list',title:'Where trade finance goes wrong',items:[
      'Documents that do not match the letter of credit exactly are rejected — precision matters more than intent.',
      'Currency movement between contract and payment can erase a thin margin.',
      'Country and counterparty risk remain yours unless specifically covered.',
      'Timelines slip through customs and shipping; facilities should allow for it.',
    ]},
    {t:'note',tone:'info',text:'Trade finance is documentary and technical. Work with your bank’s trade desk on the exact wording of any instrument before committing.'},
   ]},

  {id:'global/forex',group:'Global Business',icon:'Percent',eyebrow:'Global Business',
   title:'Forex services',
   sub:'Currency conversion for travel, study and business, and how to compare it.',
   blocks:[
    {t:'intro',text:'Every foreign exchange service earns a margin between the rate it gets and the rate it gives you. That margin, not the advertised fee, is usually the real cost. Comparing providers means comparing the rate you are actually offered against the live interbank rate at the same moment.'},
    {t:'cards',title:'Ways to hold and spend foreign currency',items:[
      ['Wallet','Forex card','A prepaid card loaded in a chosen currency, locking a rate at the time of loading. Check reload, ATM and inactivity fees.'],
      ['CreditCard','Credit or debit card abroad','Convenient, but usually carries a foreign-currency mark-up in addition to the exchange rate.'],
      ['Landmark','Wire transfer','Suited to larger amounts such as tuition. Compare the rate margin, not just the fee.'],
      ['Files','Currency notes','Useful for small immediate needs on arrival; rarely the cheapest way to move a large sum.'],
    ]},
    {t:'list',title:'Comparing properly',items:[
      'Ask for the all-in rate you will receive, not the "market rate plus fee".',
      'Check whether dynamic currency conversion is being applied at the point of sale — always choose to be billed in the local currency.',
      'Understand that TCS may apply on certain outward remittances under the Liberalised Remittance Scheme.',
      'Keep documentation, particularly for education and medical remittances.',
    ]},
    {t:'note',tone:'info',text:'Foreign exchange transactions are governed by FEMA and executed by authorised dealers. Rates move continuously.'},
   ]},

  {id:'global/overseas-education',group:'Global Business',icon:'GraduationCap',eyebrow:'Global Business',
   title:'Overseas education loans',
   sub:'Funding study abroad, where the loan is only part of the planning.',
   blocks:[
    {t:'intro',text:'An overseas education loan covers tuition, living costs and travel for study outside India. Lenders weigh the institution and course heavily — a recognised university with strong employment outcomes materially improves both approval odds and terms.'},
    {t:'cards',title:'What lenders look at',items:[
      ['GraduationCap','Institution and course','Many lenders maintain lists of recognised institutions, with better terms for those on them.'],
      ['User','Co-applicant','A resident co-applicant with documented income is effectively always required, and is fully liable.'],
      ['Building2','Collateral','Loans above a threshold generally require security, often family property.'],
      ['Globe','Country and visa','Admission confirmation and visa status form part of the assessment and the disbursal schedule.'],
    ]},
    {t:'list',title:'Costs beyond tuition',items:[
      'Living expenses, which vary enormously by city.',
      'Health insurance, mandatory in most destination countries.',
      'Travel, visa fees and initial setup costs.',
      'Currency movement — a depreciating rupee raises the real cost through the course.',
      'Interest accruing during the moratorium, if you do not service it while studying.',
    ]},
    {t:'note',tone:'info',text:'Interest paid on an education loan is deductible under Section 80E with no upper limit, for up to eight years from when repayment begins. Confirm your position with a tax adviser.'},
   ]},

  /* ================= RESOURCES ================= */
  {id:'resources/loan-guides',group:'Resources',icon:'BookOpen',eyebrow:'Resources',
   title:'Loan guides',
   sub:'How borrowing actually works, explained from first principles.',
   blocks:[
    {t:'intro',text:'These guides assume no prior knowledge. They explain the mechanics of borrowing so you can read a sanction letter, compare two offers and understand what you are committing to.'},
    {t:'cards',title:'How personal loans work',items:[
      ['WalletCards','Unsecured borrowing','No asset is pledged. The lender relies on your income and credit record, and prices for that risk.'],
      ['Percent','How your rate is set','A base linked to a benchmark, plus a spread reflecting your profile. Two applicants at the same lender can be quoted very differently.'],
      ['CalendarClock','How the EMI is built','Each instalment covers interest on the outstanding balance first; the remainder reduces the principal. Early instalments are mostly interest.'],
    ]},
    {t:'steps',title:'How to compare two personal loans',items:[
      ['Set the same amount and tenure','Comparison is meaningless otherwise.'],
      ['Work out the total repayable','EMI multiplied by months, for each offer.'],
      ['Add the processing fee','And anything else deducted at disbursal.'],
      ['Compare the exit terms','What it costs to repay early, if you might.'],
      ['Then compare the rate','By this point the rate is confirming what you already know.'],
    ]},
    {t:'cards',title:'Fixed versus floating',items:[
      ['ShieldCheck','Fixed','The rate is locked for a period. Certainty, usually at a higher starting price, and foreclosure charges may apply.'],
      ['TrendingUp','Floating','Moves with the benchmark. Usually cheaper at the outset, no foreclosure charge for individuals, but the cost can rise.'],
      ['Gauge','Which suits you','Depends on whether your budget can absorb an increase, and how long you expect to hold the loan.'],
    ]},
    {t:'list',title:'Before you sign anything',items:[
      'Read the sanction letter in full — it, not the sales conversation, is what binds you.',
      'Confirm the rate, tenure, EMI, all fees and the foreclosure terms in writing.',
      'Check whether insurance has been added, and whether you want it.',
      'Be certain the EMI fits your budget with room for a bad month.',
      'Understand what happens if you miss a payment.',
    ]},
   ]},

  {id:'resources/investment-guides',group:'Resources',icon:'TrendingUp',eyebrow:'Resources',
   title:'Investment guides',
   sub:'The basics of investing, without jargon or hype.',
   blocks:[
    {t:'intro',text:'Investing is the practice of putting money to work with a horizon and a tolerance for risk. These guides cover the fundamentals that apply regardless of which product you eventually choose.'},
    {t:'cards',title:'Mutual fund basics',items:[
      ['PiggyBank','What you own','Units in a pooled portfolio, not the underlying securities directly. Value moves with the portfolio.'],
      ['Percent','What it costs','An annual expense ratio, deducted from returns. Direct plans cost less than regular plans because they carry no distributor commission.'],
      ['Files','Where to look','The scheme information document sets out exactly what the fund may invest in. It is worth reading once.'],
    ]},
    {t:'cards',title:'SIP basics',items:[
      ['CalendarClock','What it is','Investing a fixed amount at regular intervals rather than a lump sum.'],
      ['ArrowDownUp','Why it helps','You buy more units when prices are low and fewer when high, which averages your entry price and removes the need to time the market.'],
      ['Info','What it is not','A guarantee against loss. A SIP into a falling market still falls; it simply averages the cost of entry.'],
    ]},
    {t:'cards',title:'Understanding risk',items:[
      ['TrendingUp','Volatility','How much a value moves. High volatility is tolerable over a long horizon and painful over a short one.'],
      ['Landmark','Credit risk','The chance a borrower does not repay — the main risk in debt funds and corporate bonds.'],
      ['Clock','Horizon','The single most important input. Money needed in two years does not belong in equity.'],
      ['LayoutGrid','Diversification','Spreading across assets so a single failure does not dominate the outcome.'],
    ]},
    marketNote,
   ]},

  {id:'resources/credit-guides',group:'Resources',icon:'Gauge',eyebrow:'Resources',
   title:'Credit guides',
   sub:'How credit records work, and how to keep yours healthy.',
   blocks:[
    {t:'intro',text:'Your credit record follows you across lenders and across years. Understanding how it is built, and how it is read, puts you in a stronger position every time you borrow.'},
    {t:'cards',title:'How credit scores work',items:[
      ['CalendarClock','Repayment history','The dominant factor. A single missed payment is visible for years.'],
      ['Gauge','Utilisation','How much of your revolving credit you use. High utilisation reads as stress even when you pay in full.'],
      ['Clock','History length','Longer is better. Closing your oldest account can work against you.'],
      ['Search','Enquiries','Hard enquiries from applications are recorded. Soft checks, like eligibility checks here, are not.'],
    ]},
    {t:'steps',title:'How to read a credit report',items:[
      ['Check your identity details','Errors here cause application failures and can indicate mixed files.'],
      ['Review every account','Confirm each one is yours, and that closed accounts show as closed.'],
      ['Read the payment grid','Look for days-past-due markers you do not recognise.'],
      ['Check the remarks','"Settled" and "written off" carry substantial weight with lenders.'],
      ['Dispute anything wrong','With the bureau, and follow up with the lender that reported it.'],
    ]},
    {t:'list',title:'Building healthy credit',items:[
      'Automate payments so nothing is missed by oversight.',
      'Keep revolving utilisation moderate, not just under the limit.',
      'Space out credit applications.',
      'Keep long-standing accounts open where there is no cost to doing so.',
      'Read your report once a year.',
    ]},
    {t:'note',tone:'warn',text:'No action guarantees a particular score. Scores respond gradually to sustained behaviour, and no legitimate service can remove accurate information from your report.'},
   ]},

  /* ================= SERVICES & SUPPORT ================= */
  {id:'support/refer',group:'Services & Support',icon:'Users',eyebrow:'Services & Support',
   title:'Refer a friend',
   sub:'Share the platform with someone who is comparing their options.',
   blocks:[
    {t:'intro',text:'If the comparison tools, calculators and guides here were useful to you, they may help someone else deciding whether and how to borrow. Referring someone simply points them to the platform.'},
    {t:'note',tone:'info',text:'Referral rewards, eligibility and terms: [Add verified business information]. No reward is offered or implied until those terms are published. Any programme would be subject to its own conditions.'},
    {t:'list',title:'What a referral does',items:[
      'Points someone to the comparison tools and calculators.',
      'Does not share any of your personal or financial information with them.',
      'Does not affect your own applications, offers or credit record.',
    ]},
   ]},

  {id:'support/grievance',group:'Services & Support',icon:'LifeBuoy',eyebrow:'Services & Support',
   title:'Grievance redressal',
   sub:'How to raise a complaint, and what to expect at each stage.',
   blocks:[
    {t:'intro',text:'If something has gone wrong, you are entitled to a clear process and a considered response. This page explains how to escalate — first with us, and where a lender or insurer is involved, with them and with the relevant regulator.'},
    {t:'steps',title:'The escalation path',items:[
      ['Raise it with support first','Use the support channels with your details and any reference numbers. Most issues are resolved at this stage.'],
      ['Escalate to the grievance officer','If you are not satisfied, ask for the complaint to be escalated. [Add verified grievance officer name, address and contact details]'],
      ['Go to the lender or insurer','Where the complaint concerns a loan or policy, the provider has its own grievance process and nodal officer.'],
      ['Approach the regulator','If the provider does not resolve it within their stated timeline, the RBI Integrated Ombudsman Scheme covers regulated entities, and IRDAI handles insurance complaints.'],
    ]},
    {t:'list',title:'What to include in a complaint',items:[
      'Your name and registered contact details.',
      'Application, loan or policy reference numbers.',
      'What happened, with dates, stated plainly.',
      'What you have already been told, and by whom.',
      'What outcome you are asking for.',
    ]},
    {t:'note',tone:'info',text:'Response timelines: [Add verified service levels]. We do not publish a turnaround commitment we have not verified we can meet.'},
   ]},

  {id:'support/account',group:'Services & Support',icon:'ClipboardList',eyebrow:'Services & Support',
   title:'Managing your account',
   sub:'Where to find your application status, documents and repayment information.',
   blocks:[
    {t:'intro',text:'Everything connected to an application or an active loan lives in your account area. This page explains what each section does and where to go for what.'},
    {t:'links',title:'Where things live',items:[
      ['Application status','/applications','Track each application from submission through verification to disbursal.'],
      ['My loans','/my-loans','Active loans, outstanding balances and repayment progress.'],
      ['EMI payments','/payments','Upcoming instalments, payment history and receipts.'],
      ['Documents','/documents','Upload and manage KYC and income documents.'],
      ['Credit score','/credit-score','Your score and the factors behind it.'],
      ['Profile and security','/profile','Personal details, password, two-factor authentication and login activity.'],
    ]},
    {t:'list',title:'Good practice',items:[
      'Keep contact details current — lenders use them for verification.',
      'Upload clear, complete documents; unreadable scans are the commonest cause of delay.',
      'Ensure the account for auto-debit has sufficient balance before each due date.',
      'Review login activity periodically and report anything you do not recognise.',
    ]},
   ]},

  {id:'support/app',group:'Services & Support',icon:'Smartphone',eyebrow:'Services & Support',
   title:'Using the platform on mobile',
   sub:'The full platform works in a mobile browser, with no download required.',
   blocks:[
    {t:'intro',text:'Every page, calculator and form here is built to work on a phone as well as a desktop. You can compare loans, run the calculators and manage an application from a mobile browser without installing anything.'},
    {t:'cards',title:'On a phone you can',items:[
      ['Calculator','Run every calculator','All eighteen calculators, including the repayment schedule, work on a small screen.'],
      ['LayoutGrid','Compare lenders','The comparison table scrolls horizontally so no column is lost.'],
      ['FileCheck2','Upload documents','Photograph and upload documents directly from your device.'],
      ['Bell','Track applications','Check status and repayment information wherever you are.'],
    ]},
    {t:'note',tone:'info',text:'Mobile app availability: [Add verified business information]. No app store listing is claimed until one exists.'},
   ]},

  /* ================= ABOUT ================= */
  {id:'about/careers',group:'About',icon:'BriefcaseBusiness',eyebrow:'About',
   title:'Careers',
   sub:'Building financial tools people can actually understand.',
   blocks:[
    {t:'intro',text:'We are interested in people who care about making financial decisions clearer for someone who is not a financial expert — engineers, designers, writers, analysts and advisers who would rather explain something properly than market it aggressively.'},
    {t:'cards',title:'How we work',items:[
      ['Users','Small teams','People close to the problem, with the context to make decisions.'],
      ['ShieldCheck','Honest by default','If a product is not right for a user, we say so. That principle shapes the work.'],
      ['BookOpen','Explain, don’t sell','Clear writing is treated as product work, not marketing decoration.'],
      ['LayoutGrid','Remote-friendly','[Add verified working arrangements and locations]'],
    ]},
    {t:'note',tone:'info',text:'Open positions, benefits, locations and the application process: [Add verified business information]. We do not list roles that are not genuinely open.'},
   ]},

  {id:'about/partners',group:'About',icon:'Landmark',eyebrow:'About',
   title:'Lending partners',
   sub:'How the platform works with banks and NBFCs.',
   blocks:[
    {t:'intro',text:'This platform is a marketplace. It does not lend on its own account. Loans are sanctioned and disbursed by RBI-registered banks and NBFCs, at their sole discretion and under their own credit policy.'},
    {t:'cards',title:'What that means for you',items:[
      ['Landmark','The lender decides','Approval, amount, rate and terms are the lender’s decision, not ours.'],
      ['Percent','How we are paid','A commission from the lender after a loan is disbursed. Our fee does not vary with your interest rate, so we have no incentive to steer you toward a costlier loan.'],
      ['ShieldCheck','Your data','Documents you upload are shared only with lenders you choose to apply to.'],
      ['Files','Your agreement is with them','The sanction letter and loan agreement are between you and the lender.'],
    ]},
    {t:'note',tone:'warn',text:'Partnership listings, agreements and lender relationships: [Add verified business information]. No lender relationship is claimed on this page until it is documented.'},
   ]},

  {id:'about/media',group:'About',icon:'Files',eyebrow:'About',
   title:'Media and press',
   sub:'Information for journalists and researchers.',
   blocks:[
    {t:'intro',text:'For press enquiries, background on the platform, or comment on lending and personal finance topics, contact the communications team through the details below.'},
    {t:'note',tone:'info',text:'Press contact, media kit, brand assets, company milestones, coverage and awards: [Add verified business information]. Nothing is listed here that has not been verified — no awards, recognition or coverage is claimed.'},
    {t:'links',title:'Related',items:[
      ['About us','/about','What the platform does and how it is paid.'],
      ['Contact','/contact','General enquiries and advisory contact.'],
      ['Lending partners','/about/partners','How the marketplace model works.'],
    ]},
   ]},
/* ================= INSURANCE ================= */
  {id:'insurance/health',group:'Insurance',icon:'HeartPulse',eyebrow:'Insurance',
   title:'Health insurance',
   sub:'Cover for hospitalisation and treatment costs, and the details that decide whether a claim is paid.',
   blocks:[
    {t:'intro',text:'Health insurance pays for hospitalisation and related treatment up to a sum insured. What matters is not the headline cover but the conditions attached to it — waiting periods, sub-limits, room-rent caps and exclusions all determine what you actually receive when you claim.'},
    {t:'cards',title:'The main plan types',items:[
      ['User','Individual plan','Covers one person with a dedicated sum insured. Premium reflects that person’s age and health.'],
      ['Users','Family floater','One sum insured shared across the family. Usually cheaper than separate policies, but a single large claim can exhaust it for everyone.'],
      ['HeartPulse','Critical illness','Pays a lump sum on diagnosis of a listed condition, regardless of treatment cost. Complements, rather than replaces, a hospitalisation policy.'],
      ['ShieldCheck','Top-up and super top-up','Additional cover that begins above a threshold. An economical way to raise total cover if you already hold a base policy.'],
    ]},
    {t:'list',title:'What to check before buying',items:[
      'Waiting periods — for pre-existing conditions, and for specific procedures.',
      'Room-rent limits, which can proportionately reduce the whole claim if breached.',
      'Sub-limits on particular treatments, and any co-payment you must bear.',
      'Whether day-care procedures and pre- and post-hospitalisation costs are covered.',
      'The insurer’s cashless hospital network in your city.',
      'Exclusions — read this section first, not last.',
    ]},
    insuranceNote,
   ]},

  {id:'insurance/life',group:'Insurance',icon:'ShieldCheck',eyebrow:'Insurance',
   title:'Life insurance',
   sub:'Replacing income for the people who depend on it, and why the simplest product is usually the right one.',
   blocks:[
    {t:'intro',text:'Life insurance exists to protect the people who depend on your income. Term cover does that job at the lowest cost. Products combining insurance with investment do both jobs less well, which is why they should be compared carefully rather than assumed.'},
    {t:'cards',title:'Term and savings plans compared',items:[
      ['ShieldCheck','Term plan','Pure protection. Pays out on death during the term and nothing if you survive it — which is why it costs a fraction of the alternatives for the same cover.'],
      ['PiggyBank','Savings and ULIP','Combine insurance with an investment component. Cover is typically far smaller for the same premium, and charges reduce returns.'],
      ['Calculator','How much cover','A common starting point is a multiple of annual income, adjusted for debts and dependants’ needs. Your own circumstances decide it.'],
      ['FileCheck2','Disclosure','Answer every health and lifestyle question truthfully. Non-disclosure is the most common reason claims are rejected.'],
    ]},
    {t:'list',title:'Points worth knowing',items:[
      'Cover bought younger costs less and stays level for the term.',
      'Riders such as critical illness or waiver of premium can be added, each at a cost.',
      'A claim is paid to the nominee — keep nomination details current.',
      'Loan protection cover is not a substitute for adequate personal life cover.',
    ]},
    insuranceNote,
   ]},

  {id:'insurance/vehicle',group:'Insurance',icon:'CarFront',eyebrow:'Insurance',
   title:'Vehicle insurance',
   sub:'What is legally required, what actually protects you, and how claims affect your premium.',
   blocks:[
    {t:'intro',text:'Third-party motor insurance is mandatory in India. It covers injury or damage you cause to others, but nothing of your own. Comprehensive cover adds damage to your own vehicle, and is what most owners actually need.'},
    {t:'cards',title:'What each cover does',items:[
      ['ShieldCheck','Third-party','Legally required. Covers liability to others; your own vehicle is not covered at all.'],
      ['CarFront','Comprehensive','Third-party liability plus damage to your own vehicle from accident, theft, fire and natural events.'],
      ['Percent','Own-damage only','For owners holding a valid long-term third-party policy who want to add own-damage cover separately.'],
      ['Bike','Two-wheeler','Same structure as car insurance, with its own premium and IDV calculation.'],
    ]},
    {t:'list',title:'Things that decide your payout',items:[
      'Insured Declared Value (IDV) — the maximum payable on total loss. Setting it artificially low to cut premium reduces your claim.',
      'Depreciation on parts, unless you buy zero-depreciation cover.',
      'The compulsory deductible, plus any voluntary excess you chose.',
      'No-claim bonus, which accumulates for claim-free years and is lost when you claim.',
      'Add-ons such as engine protection and roadside assistance, each priced separately.',
    ]},
    insuranceNote,
   ]},

  {id:'insurance/loan-protection',group:'Insurance',icon:'FileCheck2',eyebrow:'Insurance',
   title:'Loan protection insurance',
   sub:'Cover intended to repay a loan if the borrower cannot — and the questions to ask before buying it.',
   blocks:[
    {t:'intro',text:'Loan protection, sometimes called credit life cover, is designed to repay an outstanding loan if the borrower dies or, on some policies, becomes unable to earn. It can prevent a debt passing to a family already dealing with a loss. It is also frequently mis-sold, so it deserves scrutiny.'},
    {t:'cards',title:'How it usually works',items:[
      ['ShieldCheck','What it covers','Typically the outstanding balance, with cover reducing as the loan is repaid.'],
      ['Percent','How it is paid for','Often a single premium financed into the loan itself — so you pay interest on the premium for the whole tenure.'],
      ['User','Who benefits','The lender is normally the beneficiary, with the payout settling the loan rather than reaching your family.'],
      ['Info','Whether you need it','If you already hold adequate term life cover, that may serve the same purpose more cheaply and more flexibly.'],
    ]},
    {t:'note',tone:'warn',text:'This cover is optional. A lender may not make a loan conditional on buying it. If a loan is presented as conditional on taking insurance, ask for that in writing and raise it with the lender’s grievance officer.'},
    {t:'list',title:'Before you agree to it',items:[
      'Ask whether the premium is being added to the loan, and what that costs in interest over the tenure.',
      'Compare the cost against simply increasing your term life cover.',
      'Check what is excluded, and any waiting period.',
      'Confirm what happens to the cover if you prepay or transfer the loan.',
    ]},
    insuranceNote,
   ]},

  {id:'insurance/travel',group:'Insurance',icon:'Plane',eyebrow:'Insurance',
   title:'Travel insurance',
   sub:'Medical and trip cover away from home, where the exclusions matter more than the headline sum.',
   blocks:[
    {t:'intro',text:'Travel insurance mainly protects against medical costs abroad, which can be very large, along with trip disruption and lost belongings. Several countries require it for a visa. As with all insurance, the exclusions decide its real value.'},
    {t:'cards',title:'What it typically covers',items:[
      ['HeartPulse','Emergency medical','Treatment and hospitalisation abroad, usually the single most valuable component.'],
      ['Plane','Trip disruption','Cancellation, curtailment and missed connections, subject to the listed reasons.'],
      ['Files','Baggage and documents','Lost or delayed baggage, and assistance replacing a lost passport.'],
      ['ShieldCheck','Personal liability','Injury or damage you cause to others while travelling.'],
    ]},
    {t:'list',title:'Check before you buy',items:[
      'Whether pre-existing conditions are covered, and on what terms.',
      'Exclusions for adventure sports and high-risk activities.',
      'Geographic scope — some policies price the United States separately.',
      'Any visa-mandated minimum cover for your destination.',
      'The claim process and emergency assistance number, saved before you travel.',
    ]},
    insuranceNote,
   ]},

  {id:'insurance/buy-renew',group:'Insurance',icon:'ArrowDownUp',eyebrow:'Insurance',
   title:'Buying and renewing online',
   sub:'How the online process works, and why letting a policy lapse costs more than the premium.',
   blocks:[
    {t:'intro',text:'Most policies can now be bought and renewed entirely online. The process is quick, but the two things that decide whether it works for you are honest disclosure at the outset and renewing before the policy lapses.'},
    {t:'steps',title:'Buying a policy',items:[
      ['Work out what you need','Cover amount and type first — the premium follows from that, not the other way round.'],
      ['Compare on terms, not price','Waiting periods, sub-limits and exclusions differ more than premiums do.'],
      ['Disclose fully and truthfully','Health history, occupation, existing policies. Non-disclosure is the leading cause of rejected claims.'],
      ['Read the policy wording','Not the brochure. The wording is the contract.'],
      ['Use the free-look period','You generally have 15 days, or 30 if sold electronically, to cancel for a refund less pro-rata charges.'],
    ]},
    {t:'list',title:'Renewing',items:[
      'Renew before expiry — a lapse can restart waiting periods and, in health cover, lose continuity benefits.',
      'Review the sum insured each year against rising treatment costs.',
      'Check whether a no-claim bonus has increased your cover automatically.',
      'Update any change in health, address or vehicle details at renewal.',
      'Motor policies must be renewed to stay legally compliant on the road.',
    ]},
    insuranceNote,
   ]},

  /* ================= RESOURCES: FAQ HUB ================= */
  {id:'resources/faqs',group:'Resources',icon:'CircleHelp',eyebrow:'Resources',
   title:'Frequently asked questions',
   sub:'The questions people most often ask about borrowing, credit, insurance and this platform.',
   blocks:[
    {t:'faq',title:'Loans and eligibility',items:[
      ['Who can apply for a loan?','Broadly, an Indian resident with documented income and a credit record the lender finds acceptable. Each product sets its own criteria — age, income, employment type and, for secured loans, the asset being pledged.'],
      ['Does checking eligibility affect my credit score?','No. An eligibility check here is a soft enquiry — invisible to other lenders and with no effect on your score. Only a hard enquiry, made when you formally apply, is recorded.'],
      ['Why was my application declined?','Lenders are not obliged to give detailed reasons. Common factors are credit score, existing obligations relative to income, employment stability and inconsistencies in documents. Your credit report is the best place to start looking.'],
      ['Can I apply with a co-applicant?','Most products allow it, and it can improve eligibility since both incomes count. Both applicants become equally liable for repayment.'],
    ]},
    {t:'faq',title:'Interest, EMI and repayment',items:[
      ['How is EMI calculated?','From three inputs: principal, interest rate and tenure. Each instalment covers the interest due on the outstanding balance first; the remainder reduces the principal. The repayment schedule on any EMI calculator shows the split year by year.'],
      ['Why is my rate higher than the advertised one?','Advertised rates are the lender’s best pricing for its strongest applicants. Your rate reflects your own credit profile, income and the product.'],
      ['What happens if I miss an EMI?','A penal charge applies and the missed payment is reported to credit bureaus, which affects your score. Repeated misses can lead to recovery action. Speak to your lender before missing a payment, not after.'],
      ['Should I choose a longer or shorter tenure?','A longer tenure lowers the instalment and raises the total interest, often substantially. Choose the shortest tenure whose EMI you can comfortably sustain.'],
    ]},
    {t:'faq',title:'Prepayment and transfer',items:[
      ['Can I repay early?','Usually. Floating-rate loans to individuals carry no foreclosure charge under RBI rules. Fixed-rate products may charge, and the terms are in your sanction letter.'],
      ['Is it better to reduce the EMI or the tenure?','Keeping the EMI and shortening the tenure saves considerably more interest. Reducing the EMI eases monthly cash flow instead.'],
      ['Is a balance transfer worth it?','Only if the interest saved exceeds the processing, legal and stamping costs of switching. A transfer late in a tenure rarely pays, because most interest has already been charged.'],
    ]},
    {t:'faq',title:'Documents and the application process',items:[
      ['What documents will I need?','For most unsecured loans: PAN, Aadhaar, three months of bank statements, and salary slips or two years of ITR. Secured loans additionally need documents for the asset. Each product page lists its own set.'],
      ['How long does approval take?','It depends on the product and the lender. Unsecured loans are generally faster; secured loans need valuation and legal checks. No timeline is guaranteed.'],
      ['Do I have to submit documents more than once?','You upload once here, and they are shared only with the lenders you choose to apply to. A lender may still request additional items directly.'],
    ]},
    {t:'faq',title:'Credit score',items:[
      ['What is a good credit score?','Most lenders look for 700 or above, with the best pricing usually reserved for 750 and above. Every lender applies its own policy, and no score guarantees approval.'],
      ['How can I improve my score?','Pay on time, keep credit utilisation moderate, avoid several applications in quick succession, and review your report for errors. Improvement is gradual, and no action produces a specific score.'],
      ['Why do bureaus show different scores?','Each uses its own model and may hold different data, since not every lender reports to every bureau. A difference of some points is normal.'],
    ]},
    {t:'faq',title:'Insurance and investments',items:[
      ['Is insurance compulsory with a loan?','No. Credit life cover is optional on the products listed here, and a lender may not make a loan conditional on buying it.'],
      ['Are investment returns guaranteed?','No. Market-linked products carry risk including possible loss of principal. Only contractual products such as fixed deposits offer a defined return, subject to the institution’s standing.'],
      ['Does this platform give investment advice?','No. The content here is educational. Nothing on the platform is a personal recommendation.'],
    ]},
    {t:'faq',title:'Security and support',items:[
      ['How is my information handled?','Details you provide are used to match you with lenders and shared only with those you choose to apply to. Documents are not sold to third parties.'],
      ['Will anyone ask for my OTP or PIN?','Never. No genuine lender, insurer or platform will ask for your OTP, UPI PIN, card CVV or passwords. Treat any such request as fraud.'],
      ['How do I raise a complaint?','Start with support, then escalate to the grievance officer. Where a lender or insurer is involved, they have their own process, and the RBI and IRDAI ombudsman schemes sit above that.'],
    ]},
   ]},

  /* ================= ABOUT ================= */
  {id:'about/story',group:'About',icon:'BookOpen',eyebrow:'About',
   title:'Our story, mission and vision',
   sub:'Why the platform exists and what it is trying to do.',
   blocks:[
    {t:'intro',text:'Borrowing in India is often opaque. The advertised rate is rarely the rate you get, fees appear late in the process, and the document that actually binds you arrives after the decision feels made. This platform exists to put the comparison, the arithmetic and the plain-English explanation in front of people before they commit.'},
    {t:'cards',title:'What we are working towards',items:[
      ['Sparkles','Our mission','To help people understand what borrowing genuinely costs, and to choose products that fit their circumstances rather than the seller’s.'],
      ['TrendingUp','Our vision','A market where the total cost of a financial product is as easy to compare as its headline rate.'],
      ['ShieldCheck','How we are paid','A commission from the lender after a loan is disbursed. It does not vary with your interest rate, so we gain nothing from steering you toward a costlier loan.'],
      ['BookOpen','What we will not do','Publish invented rates or statistics, claim partnerships we do not have, or present a product as suitable when it is not.'],
    ]},
    {t:'note',tone:'info',text:'Founding date, company registration, entity details and operating history: [Add verified business information]. Nothing is stated here that has not been confirmed.'},
   ]},

  {id:'about/leadership',group:'About',icon:'Users',eyebrow:'About',
   title:'Leadership',
   sub:'The people responsible for the platform.',
   blocks:[
    {t:'intro',text:'This page will list the leadership team, their responsibilities and their professional backgrounds.'},
    {t:'note',tone:'warn',text:'[Add verified business information] — names, roles, biographies and photographs of the leadership team. This page deliberately lists no one until real details are supplied. Publishing fictional leadership on a financial services site would be misleading and, in some contexts, unlawful.'},
    {t:'links',title:'Related',items:[
      ['Our story','/about/story','Why the platform exists and how it is paid.'],
      ['Lending partners','/about/partners','How the marketplace model works.'],
      ['Careers','/about/careers','How we work and what we look for.'],
    ]},
   ]},

  {id:'about/investors',group:'About',icon:'LineChart',eyebrow:'About',
   title:'Investor relations',
   sub:'Information for current and prospective investors.',
   blocks:[
    {t:'intro',text:'This page will hold corporate information for investors — company structure, governance, financial disclosures and the appropriate contact for investor enquiries.'},
    {t:'note',tone:'warn',text:'[Add verified business information] — investor details, funding history, financial statements, governance documents and regulatory filings. No investor, valuation or funding claim is made here until documented. Statements of this kind on a financial platform carry legal consequences if inaccurate.'},
   ]},

  /* ================= CONTACT ================= */
  {id:'contact/partner',group:'Contact',icon:'Landmark',eyebrow:'Contact',
   title:'Partner with us',
   sub:'For banks, NBFCs, insurers and distribution partners.',
   blocks:[
    {t:'intro',text:'We work with regulated lenders and insurers who want to reach borrowers who have already compared their options and understand what they are applying for. If that is of interest, the partnerships team can discuss how it works.'},
    {t:'cards',title:'Who we work with',items:[
      ['Landmark','Banks and NBFCs','RBI-registered lenders across retail and business lending.'],
      ['ShieldCheck','Insurers','IRDAI-registered insurers for health, life, motor and travel cover.'],
      ['Users','Distribution partners','Advisers and intermediaries who want to use the comparison and calculation tools.'],
      ['Globe','Technology partners','Providers of data, verification and payment infrastructure.'],
    ]},
    {t:'list',title:'What we would need to discuss',items:[
      'Your regulatory registration and the products you want listed.',
      'The credit or underwriting policy that determines who qualifies.',
      'Published rates, fees and terms, and how often they change.',
      'How applications and data would be exchanged securely.',
      'Service levels for decisions and disbursal.',
    ]},
    {t:'note',tone:'info',text:'Partnerships contact and onboarding process: [Add verified business information]. No existing partnership is claimed or implied on this page.'},
   ]},
];
