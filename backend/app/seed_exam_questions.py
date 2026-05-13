import asyncio
import uuid
from sqlalchemy import select
from app.database import AsyncSessionLocal, init_db
from app.models.quiz import Question, QuizSession, QuizAnswer
from app.models.user import User, UserStats, SubjectMastery, Subject


async def seed_ca_membership_questions():
    await init_db()
    
    questions = [
        # Corporate Laws - Question 1a (Company Criminal Liability)
        {
            "type": "case-study",
            "question": "Kathmandu Supermarket Limited advertised to sell washing soap kits with 65% discount. Niruta purchased 20 pieces at Rs. 200 per kit (normal price) as the price tag was not lowered due to negligence. Niruta claimed compensation for fraud. The supermarket argued they cannot be held criminally liable as a company. Explain: (i) Why a company cannot be held criminally liable? (ii) What are the theories of corporate criminal liability? (iii) Can the company be held liable for fraud?",
            "correct_answer": "(i) Companies cannot be held criminally liable because criminal liability requires mens rea (guilty mind) and actus reus (guilty act) which are developed for individual offenders. Companies lack legal personality to have intent or knowledge. (ii) Theories: 1) Doctrine of Vicarious Liability - corporation liable for acts of employees within scope of employment. 2) Doctrine of Attribution - corporation liable when directing mind and will of company commits offense. (iii) No, the company is not liable because the sales man is a subordinate employee whose acts cannot be treated as company's acts. The directing mind test in Tesco v Nattrass shows only directors/managing directors can bind the company.",
            "explanation": "This case illustrates the doctrine of attribution and vicarious liability in corporate criminal law.",
            "difficulty": "hard",
            "topic": "Company Law - Criminal Liability",
            "subtopic": "Corporate Personality",
            "subject": "Corporate Laws",
            "marks": 10
        },
        # Corporate Laws - Question 1b (BAFIA)
        {
            "type": "case-study",
            "question": "Shangrilla Commercial Bank Ltd decided to disburse loan of Rs. 5,000,000 to Excell Trading Pvt. Ltd where Mr. Rajan Sharma (son of Mr. Rajendra Sharma, a Board Director) was appointed as Managing Director with majority shares. Rajendra Sharma provided guarantee. NRB objected. Refer to BAFIA, 2073 and advise: (i) What types of acts cannot be carried out by bank/financial institution? (ii) Whether the loan disbursement is valid?",
            "correct_answer": "(i) Under Section 50 of BAFIA, 2073, banks cannot: (a) Purchase/sell goods for commercial purpose or construct building except for own use; (b) Advance credit against security of its own shares; (c) Supply credit to directors, persons holding 1%+ shares, chief executive, their family members, or entities where they have substantial interest; (d) Supply credit exceeding prescribed limit to single customer; (e) Supply credit against guarantee given by promoters/directors/chief executive; (f) Invest in securities of classified A, B, C banks; (g) Invest beyond prescribed limit in other institutions; (h) Create monopoly in financial transactions; (i) Create artificial obstruction in competitive environment. (ii) Invalid - Section 50(1)(e) prohibits supplying credit against guarantee given by promoters/directors/chief executive.",
            "explanation": "BAFIA prohibits conflicts of interest and ensures proper lending practices.",
            "difficulty": "hard",
            "topic": "BAFIA 2073",
            "subtopic": "Prohibited Activities",
            "subject": "Corporate Laws",
            "marks": 10
        },
        # Corporate Laws - Question 2a (Public Procurement)
        {
            "type": "short-answer",
            "question": "You are the chief of a Public Entity. Your office requires procurement of Data Server in Fiscal Year 2076/077. Who is responsible for procuring Data Server? What are the acts to be carried out by a Public Entity regarding public procurement?",
            "correct_answer": "The chief of the concerned Public Entity shall be responsible for preparing a procurement plan and carrying out all activities relating to procurement. The chief must carry out procurement through an employee with prescribed qualifications and knowledge on procurement. Acts to be carried out: (a) Prepare procurement plan; (b) Prepare prequalification documents, bidding documents by following standard documents from Public Procurement Monitoring Office; (c) Prepare consultancy proposal documents; (d) Publish procurement notice; (e) Issue bidding documents; (f) Receive and safely keep proposals; (g) Submit to evaluation committee; (h) Notify acceptance; (i) Obtain and examine performance guarantee; (j) Examine quality standards; (k) Provide information to Monitoring Office; (l) Perform other prescribed functions.",
            "explanation": "Public Procurement Act governs all government procurement activities.",
            "difficulty": "medium",
            "topic": "Public Procurement",
            "subtopic": "Procedures",
            "subject": "Corporate Laws",
            "marks": 7
        },
        # Corporate Laws - Question 2b (ICAN Disciplinary)
        {
            "type": "case-study",
            "question": "Pioneer Finance Company appointed Pramod Jha, a Chartered Accountant and ICAN member, as auditor. The company lodged complaint with ICAN charging that the auditor disclosed business-related information acquired in professional service without company's approval to its rival, prejudicing the company's interests. Explain: (i) How is this charge investigated? (ii) What punishment can be imposed under Nepal Chartered Accountant Act, 2053? (iii) Can he challenge the punishment?",
            "correct_answer": "(i) Section 34(5) prohibits members from disclosing information acquired in course of business. Section 35 allows complaints to ICAN. Executive Directors submit motion with facts to Council. Section 14 governs the case. (ii) Disciplinary Committee investigates and recommends to Council. Council may impose: (a) Reprimanding; (b) Removal from membership up to 5 years; (c) Prohibiting from carrying on accountancy for specific period; (d) Cancelling professional certificate or membership. (iii) Yes, under Section 14(8), he can appeal to concerned High Court against Council's decision.",
            "explanation": "ICAN maintains professional ethics and discipline among chartered accountants.",
            "difficulty": "hard",
            "topic": "Chartered Accountant Act",
            "subtopic": "Disciplinary Proceedings",
            "subject": "Corporate Laws",
            "marks": 7
        },
        # Corporate Laws - Question 2c (NRB Provisions)
        {
            "type": "short-answer",
            "question": " Nepal Rastra Bank (NRB) provides loan and refinance facilities to commercial banks and financial institutions. State the loan and refinance provisions as mentioned in the NRB Act, 2058.",
            "correct_answer": "Under Section 49 of NRB Act, 2058: NRB can provide loan/refinance for maximum 1 year against: (a) International negotiable instruments; (b) Government of Nepal debt bonds payable within Nepal; (c) Deposits in NRB or gold and precious metals; (d) Bill of exchange or promissory notes; (e) Other securities as prescribed. For public interest: NRB can provide credit for max 1 year where Government of Nepal deems it appropriate for public interest/welfare and provides guarantee, or in extraordinary circumstances as lender of last resort. Credit can be renewed for additional 1 year.",
            "explanation": "NRB acts as lender of last resort and provides liquidity to banking system.",
            "difficulty": "medium",
            "topic": "NRB Act",
            "subtopic": "Loan and Refinance",
            "subject": "Corporate Laws",
            "marks": 6
        },
        # Corporate Laws - Question 3a (Money Laundering)
        {
            "type": "short-answer",
            "question": "State the role of Financial Information Unit in combating Money Laundering and Financing of Terrorism under the existing Asset (Money) Laundering Prevention Act, 2064.",
            "correct_answer": "Under Section 11 of Asset (Money) Laundering Prevention Act, 2064, FIU functions include: (a) Receive threshold transaction reports; (b) Receive suspicious transaction reports; (c) Receive currency and BNI reports; (d) Receive other relevant information; (e) Analyze suspicious transactions; (f) Disseminate analysis to Department/investigation agency if ML/TF suspected; (g) Provide training on ML/TF; (h) Provide feedback/guidance to reporting entities; (i) Prepare and submit annual report to Government through NRB; (j) Assist in supervision of reporting entities; (k) Conclude MOU with foreign counterparts; (l) Carry out other prescribed functions.",
            "explanation": "FIU is the central agency for receiving and analyzing financial intelligence.",
            "difficulty": "medium",
            "topic": "Money Laundering Prevention",
            "subtopic": "FIU Functions",
            "subject": "Corporate Laws",
            "marks": 7
        },
        # Corporate Laws - Question 3b (IEA Additional Facilities)
        {
            "type": "short-answer",
            "question": "Industrial Enterprise Act, 2073 (IEA) provides various exemptions, facilities and concessions. State the additional facilities and concessions provided for various sector industries.",
            "correct_answer": "Under Section 23 of IEA, 2073, additional facilities include: (1) Industries based on forest products can get possessory right over forest through lease under prescribed conditions. (2) No fees/royalty on electricity produced by industry for own consumption; surplus electricity can be sold at agreed rate. (3) Additional exemptions for export-based industries and industries in Special Economic Zone or Industrial Estate via Nepal Gazette. (4) Additional exemptions for National Priority Industries or industries using domestic raw materials/labor/skill or inventing new technology, upon recommendation of Industries and Investment Promotion Board. (5) Exemptions in Demand Charge in electricity cost under prescribed conditions. (6) Seed capital assistance to cooperatives, micro, small and cottage industries in Developed Region. (7) Industries with foreign investment can import goods from head office for production, market development for prescribed period.",
            "explanation": "IEA provides incentives to promote industrial development in Nepal.",
            "difficulty": "medium",
            "topic": "Industrial Enterprise Act",
            "subtopic": "Additional Facilities",
            "subject": "Corporate Laws",
            "marks": 7
        },
        # Corporate Laws - Question 3c (FITTA Dispute Settlement)
        {
            "type": "short-answer",
            "question": "State the legal provisions for settlement of dispute between Nepali and foreign investor under Foreign Investment and Technology Transfer Act (FITTA), 2049.",
            "correct_answer": "Under Section 7 of FITTA, 2049: (1) Parties must first settle dispute by mutual consultations in presence of Department of Industries. (2) If not settled, settle by arbitration under UNCITRAL Rules. (3) Arbitration held in Kathmandu; Nepal laws applicable. (4) Disputes regarding foreign investment in prescribed industries may be settled as per foreign investment agreement. Relevant laws include Industrial Enterprises Act, taxation laws, labour law, Contract law, Arbitration Act, Trade law.",
            "explanation": "FITTA provides dispute resolution mechanisms for foreign investors.",
            "difficulty": "medium",
            "topic": "FITTA",
            "subtopic": "Dispute Settlement",
            "subject": "Corporate Laws",
            "marks": 6
        },
        # Corporate Laws - Question 4a (AGM Procedures)
        {
            "type": "short-answer",
            "question": "Annual General Meeting (AGM) of Bhrikuti Public Company is to be held on 18th June 2019. How is AGM conducted, discussion made, and decision arrived at in a public limited company under Companies Act, 2063?",
            "correct_answer": "Under Companies Act, 2063: Public notice under Section 67 served twice in national newspaper before AGM. Section 68 requires compulsory presence of all board directors. Quorum: more than 50% presence of shareholdings. Section 74 procedures: (1) Chair by Chairperson of board; in absence, person nominated by directors. (2) Every matter presented as resolution; Chairperson declares adoption. (3) Majority opinion deemed as decision; voting by show of hands, voice voting, poll or other method. Special resolution requires 75% shareholders present voting in favor. If evenly divided, Chairperson may exercise casting vote but still has right to vote as shareholder.",
            "explanation": "AGM is the supreme decision-making body of a company.",
            "difficulty": "medium",
            "topic": "Companies Act",
            "subtopic": "AGM Procedures",
            "subject": "Corporate Laws",
            "marks": 8
        },
        # Corporate Laws - Question 4b (Insurance Board)
        {
            "type": "short-answer",
            "question": "Insurance Act, 2049 established Insurance Board to develop and regulate insurance business. Answer: (i) How is Insurance Board formed? (ii) How does it function, fulfill duties and exercise powers?",
            "correct_answer": "(i) Board formation under Section 3: Members include: (a) Nepal Government nominated person as Chairperson; (b) Ministry of Law representative; (c) Ministry of Finance representative; (d) Person with special knowledge in insurance business; (e) Person nominated from among insured. Secretary designated by Board. Tenure 4 years, renewable up to twice. (ii) Functions under Section 8: (a) Suggestion to Government for insurance policy; (b) Frame investment policy and priority sectors; (c) Register/renew/cancel Insurer, Agent, Surveyor, Broker; (d) Arbitrate disputes between Insurer and Insured; (e) Decide on complaints from Insured; (f) Issue directives; (g) Formulate basis for protection of Insured interests; (h) Other necessary functions. Board can constitute sub-committees under Section 9.",
            "explanation": "Insurance Board regulates and develops Nepal's insurance sector.",
            "difficulty": "medium",
            "topic": "Insurance Act",
            "subtopic": "Board Functions",
            "subject": "Corporate Laws",
            "marks": 7
        },
        # Corporate Laws - Question 5a (Problematic Banks)
        {
            "type": "short-answer",
            "question": "Some customers of a commercial bank have applied that the bank is in problematic condition. Discuss circumstances in which banks/financial institutions will be deemed problematic as per Nepal Rastra Bank Act, 2058.",
            "correct_answer": "Under Section 86B of NRB Act, 2058, NRB declares bank/financial institution problematic when: (a) Action against interest of depositors/shareholders/creditors/public evident; (b) Not fulfilling financial liabilities or no probability to do so; (c) Insolvent or going to be insolvent or facing material financial difficulties; (d) Non-compliance with NRB Act, banking laws, terms of license or directives; (e) License obtained based on false/fraudulent/wrong documents; (f) Unable to maintain capital fund as per law; (g) Legal proceedings for liquidation/resolution initiated; (h) Undue delay in voluntary liquidation; (i) For joint venture with foreign bank - when foreign bank is insolvent/liquidated/license terminated; (j) If NRB convinced bank unable to pay dues or can negatively affect its liabilities/duties.",
            "explanation": "NRB monitors and takes action against problematic financial institutions.",
            "difficulty": "hard",
            "topic": "NRB Act",
            "subtopic": "Problematic Institutions",
            "subject": "Corporate Laws",
            "marks": 5
        },
        # Corporate Laws - Question 5b (Auditor General Powers)
        {
            "type": "short-answer",
            "question": "What is meant by audit? State powers that can be exercised by Auditor General in course of audit under Audit Act, 2048.",
            "correct_answer": "Audit under Section 2(c) means examination of accounts and analysis/evaluation thereof, including resolution of past audit issues. Powers under Section 3(2): (a) Check status of programs/projects under Government grants and examine account documents; (b) Require contractors/suppliers to produce relevant contract documents; also get tax audit file from Inland Revenue; (c) Hire expert services for audit if necessary. Section 3(3): Retrieve system information from software by assistants from all government offices, corporations fully/partially owned, or government organizations.",
            "explanation": "Auditor General has comprehensive powers to audit government finances.",
            "difficulty": "medium",
            "topic": "Audit Act",
            "subtopic": "Auditor General Powers",
            "subject": "Corporate Laws",
            "marks": 5
        },
        # Corporate Laws - Question 5c (International Financial Transactions)
        {
            "type": "short-answer",
            "question": "State objectives of International Financial Transactions Act, 2054 and role of Promotion Board to achieve those objectives.",
            "correct_answer": "Objectives from Preamble: Develop Nepal as center for international financial transactions to foster economic development in context of open, liberal, market-oriented policies and globalization of international financial markets; regulate and manage financial activities of international financial entities of Nepal. Promotion Board functions: (a) Frame necessary policies for promotion; (b) Cooperate with Government in formulating laws; (c) Maintain coordination among governmental, non-governmental and international entities; (d) Make recommendations on exemptions, facilities and concessions for international financial entities; (e) Hear appeals against suspension/revocation of license by Accreditation Committee; (f) Perform other necessary functions.",
            "explanation": "Act aims to make Nepal an international financial hub.",
            "difficulty": "medium",
            "topic": "International Financial Transactions Act",
            "subtopic": "Objectives and Board Functions",
            "subject": "Corporate Laws",
            "marks": 5
        },
        # Advanced Taxation - Question 1 (Merger)
        {
            "type": "numerical",
            "question": "Organic Foods Company (OFC) and Fast Foods Company (FFC) merged from 1st Baishakh 2076. Share exchange ratio: OFC 1:1, FFC 1:2. Par value Rs. 100. Transactions for 1st Shrawan to 30th Chaitra 2075 provided. Additional info: (i) OFC invoiced FFC Rs. 10,000,000 + VAT for management service during Shrawan-Chaitra 2075 post merger decision; (ii) OFC has interest expense Rs. 1,000,000 on loan Rs. 20,000,000 for land not yet transferred; (iii) Tax assessment completed for IY 2074/75; (iv) OFC has carried forward loss Rs. 30,000,000 as on end of Ashadh 2075. Discuss relevant provisions of Income Tax Act, 2058 and suggest total tax payable by both companies on date of merger.",
            "correct_answer": "No special merger treatment under ITA except for Banks/Financial/Insurance under Section 47Ka. Both entities dissolved, tax calculated on disposal: (a) Disposal under Section 40 - Gain/Loss on assets/liabilities; (b) Dividend Tax under Section 55. OFC Calculation: Sales 50M - COGS 20M - Depreciation 5M - Interest 9M (land not transferred, not deductible) = 16M + Gain on Current Liabilities 0.5M + Gain on Provisions 1M + Gain on Inventory 10M = 27.5M. FFC: 100M - 40M - 10M - 5M - Management Fee 10M (not allowed) = 45M + Gain on Inventory 1M = 46M. Loss adjustment: OFC loss 30M cannot be carried forward. Tax @ 20% (Special Industry): OFC 0, FFC 9.2M. Dividend Tax: OFC Distribution 12M @ 5% = 0.6M; FFC Distribution 11.8M @ 5% = 0.59M. Total Tax: FFC Income Tax 9.2M + Dividend Tax 1.19M = 10.39M.",
            "explanation": "Merger taxation involves deemed disposal and dividend distribution.",
            "difficulty": "hard",
            "topic": "Income Tax Act",
            "subtopic": "Merger",
            "subject": "Advanced Taxation",
            "marks": 20
        },
        # Advanced Taxation - Question 2a (Insurance Company Tax)
        {
            "type": "numerical",
            "question": "Naulo General Insurance Nepal Ltd provided provisional financial information for IY 2075/76: Net premium received 700M, Commission on insurance ceded 24.8M, Opening unexpired risk reserve 251M, Opening claims outstanding 40.02M, Commission expense on reinsurance accepted 17.4M, Agent commission 26.1M, Management expenses 186M, Claim paid 174M, Closing claims outstanding 52.2M, Interest income on fixed deposits (Gross) 87M, Allowable depreciation 104.4M, Miscellaneous income 43.5M, Claim received from reinsurance 97M, Carried forward loss from IY 2074/75 194M. Additional: (i) Sale of salvage Rs. 50,000; (ii) Depreciation as per ITA is Rs. 70M; (iii) Management expenses include telephone Rs. 100,000 of Jestha-Ashadh 2075. Calculate tax liability.",
            "correct_answer": "As per Section 60 of ITA for general insurance: Inclusions: Net Premium 700M + Commission on ceded 24.8M + Opening Unexpired Risk Reserve 251M + Opening Claims Outstanding 40.02M + Interest Income 87M + Misc Income 43.5M + Reinsurance Claim 97M + Salvage 50K = 1,243,370,000. Deductions: Commission on accepted 17.4M + Agent Commission 26.1M + Management (186M - 100K prior period) 185.9M + Claims Paid 174M + Closing Claims Outstanding (115% x 52.2M = 60.03M) + Closing Unexpired Risk Reserve (50% x 700M = 350M) + Depreciation 70M + Carried forward loss 194M = 1,077,430,000. Assessable Income = 165,940,000. Tax @ 30% = 49,782,000.",
            "explanation": "Insurance companies have special tax computation under Section 60.",
            "difficulty": "hard",
            "topic": "Income Tax Act",
            "subtopic": "Insurance Company Tax",
            "subject": "Advanced Taxation",
            "marks": 7
        },
        # Advanced Taxation - Question 2b (Bank Provisions)
        {
            "type": "numerical",
            "question": "ABC Bank Ltd has balances: Loans 23B (2074/75) to 24B (2075/76); Non-Banking Assets 2B both years; Loan Loss Provision 1.4B to 1.45B. Calculate inclusion/deduction under Section 59(1Ka) of ITA for IY 2075/76.",
            "correct_answer": "Closing Loans + NBA = 24B + 2B = 26B. 5% = 1,300,000. Opening 23B + 2B = 25B. 5% = 1,250,000. Opening LLP 1,400,000. PY disallowed = 150,000. This year's deduction: LLP for year 50,000 + PY not allowed 150,000 = 200,000 (A). This year's 5% of closing = 1,300,000; Previous year's deducted = 1,250,000; Eligible balance = 50,000 (B). Deduction is lesser of (A) or (B) = 50,000.",
            "explanation": "Bank loan loss provisions have specific deduction rules under Section 59.",
            "difficulty": "medium",
            "topic": "Income Tax Act",
            "subtopic": "Bank Provisions",
            "subject": "Advanced Taxation",
            "marks": 7
        },
        # Advanced Taxation - Question 2b(ii) (Bank Dividend)
        {
            "type": "short-answer",
            "question": "ABC Bank Ltd acquired PQR Bank on Ashadh 31, 2074. On Baisakh end 2076, ABC distributed Rs. 1,000,000 as dividend to shareholders who held shares on or before merger. Calculate applicable TDS. If dividend distributed to shareholders who subscribed Further Public Offer on Poush End 2075, would advice differ?",
            "correct_answer": "Under Section 47Ka(5) of ITA, if bank merged/acquired another bank and distributes dividend to shareholders holding shares at date of merger/acquisition, no dividend distribution tax for two years from merger date. Hence no TDS on dividend to pre-merger shareholders. Yes, advice differs: If dividend to shareholders who subscribed FPO on Poush End 2075, not exempted from TDS. Applicable TDS would be 5% of dividend.",
            "explanation": "Merged banks get tax holiday on dividends to pre-merger shareholders.",
            "difficulty": "medium",
            "topic": "Income Tax Act",
            "subtopic": "Bank Dividend",
            "subject": "Advanced Taxation",
            "marks": 7
        },
        # Advanced Taxation - Question 2c (Capital Gain on House)
        {
            "type": "numerical",
            "question": "Ram Sharma bought house for Rs. 10,000,000 on 1st Baishakh 2050 (residing since then). Land area 10 anna, house on 4 anna. Bought additional 10 anna land on 1st Baishakh 2072 for Rs. 15,000,000. Sold entire property on 1st Jestha 2076 for Rs. 50,000,000 (10M house, 40M land). Fair market value on 2058 Chaitra 19 was 20M (5M house + 15M land). Calculate tax to be paid on disposal under ITA 2058.",
            "correct_answer": "As per Section 2(Da), house where resided 10+ years is personal asset, not NBCA. House + 4 anna land + equal land (4 anna) = 8 anna not NBCA. Remaining 2 anna is NBCA. Section 40(5): Value as of commencement = FMV on Chaitra 19, 2058. House property: Cost of 2 anna = 15M/10 x 2 = 3M. Sale of 2 anna: 40M/20 x 2 = 4M. Gain = 1M. Tax @ 2.5% = 25,000. Additional land: Cost 15M, Sale 20M. Gain = 5M. Tax @ 5% = 250,000. Total Tax = 275,000.",
            "explanation": "Capital gains on personal residence and NBCA have different tax rates.",
            "difficulty": "hard",
            "topic": "Income Tax Act",
            "subtopic": "Capital Gain",
            "subject": "Advanced Taxation",
            "marks": 6
        },
        # Advanced Taxation - Question 4a (VAT Assessment)
        {
            "type": "case-study",
            "question": "Sungabha Chemicals Limited filed VAT return for Magh 2075 within due date, paid VAT liability Rs. 117,000 on 25th Falgun 2075 via cheque encashed 28th Falgun 2075. Transactions: Local sales to VAT registered party 6M + 780K VAT; to unregistered party 2.26M (no VAT); to registered exempt 1M. Purchases: Goods 2.5M + 325K VAT; Service dated 1st Mangsir 2074 500K + 65K VAT; Car for CEO 2M + 260K VAT; Liquor expenses 100K + 13K VAT. Other transactions ignored: (i) Service from foreign consultant for internal audit Rs. 1M; (ii) VAT items worth 500K given to local party without bill. As VAT Officer, carry out assessment citing relevant provisions. Calculate penalty, additional charges and interest.",
            "correct_answer": "VAT adjustments: (1) Sales to unregistered party of VAT items: 2,260,000 is inclusive, so VAT = 260,000 (Rule 17). Penalty u/s 29(2) = 260,000. (2) Service bill >1 year old: No credit allowed (Rule 39(2)). Credit reversed = 65,000. (3) Car for CEO: Only 40% credit allowed (Rule 41(2)). Additional 156,000 disallowed. (4) Liquor expenses: No credit (Rule 41(1)). 13,000 disallowed. (5) Foreign consultant: Reverse VAT u/s 8(2) = 130,000. (6) Goods given without bill: Reverse VAT u/s 40(1) = 65,000. (7) Exempt sales proportion: Exempt/Total = 1M/9M = 11.11%. Proportionate credit reversal = 47,662. Total VAT Liability = 1,040,000 + 1,040,000 = 1,040,000 - Credit 429,000 = 611,000 + Adjustments 242,662 = 853,662. Paid 117,000, Shortfall 736,662. Penalty = 736,662. Additional fee: On total VAT for 3 days late = 702; On shortfall for 32 days = 6,458; Total = 7,160. Interest: On total 1 month = 10,671; On shortfall 2 months = 18,417; Total = 29,088. Total Payable = 853,662 + 736,662 + 7,160 + 29,088 = 1,626,572.",
            "explanation": "VAT assessment involves multiple compliance checks and penalties.",
            "difficulty": "hard",
            "topic": "VAT Act",
            "subtopic": "Assessment",
            "subject": "Advanced Taxation",
            "marks": 10
        },
        # Advanced Taxation - Question 4b (Customs)
        {
            "type": "case-study",
            "question": "Email correspondence: VRS Pvt Ltd kept 10,000 litres Sprite (HS 2207.20.00) in Sumi Warehouse, Birgunj on 1st Nov 2018. In Dec 2018, found shortage of 1,000 litres due to mishandling. Cost per litre Rs. 1,100, market price Rs. 1,500. Sumi replied goods should be cleared within 45 days so no claim. Customs duty Rs. 30 per litre. Advise: (i) Is Sumi's argument correct? (ii) Is amount claimed correct? (iii) How much to pay? (iv) Explain customs duty provisions.",
            "correct_answer": "(i) Not correct. Rule 32 of Customs Rules allows goods in warehouse for maximum 60 days (not 45). Sprite is not perishable, so 60 days available. (ii) Not correct. Rule 56: Claim = Invoice price + 5% additional. Not market price. Amount = 1,000 x 1,100 = 1,100,000 + 55,000 = 1,155,000. (iii) Pay Rs. 1,155,000 to VRS. Plus customs duty Rs. 30 x 1,000 = 30,000 to customs office within 7 days of payment (Rule 56(3)). (iv) Warehouse operator liable for damage and must pay customs duty on damaged goods.",
            "explanation": "Customs rules govern warehouse storage and damage claims.",
            "difficulty": "hard",
            "topic": "Customs Act",
            "subtopic": "Warehouse",
            "subject": "Advanced Taxation",
            "marks": 10
        },
        # Advanced Taxation - Question 5a (Customs Refund)
        {
            "type": "short-answer",
            "question": "Trade Syndicate Limited imported machine parts costing Rs. 1 million, sold to unit in Special Economic Zone, paid customs duty Rs. 150,000. Now wants refund. Is claim valid in view of Custom Rule 18?",
            "correct_answer": "No, claim is not valid. Custom Rule 18 allows refund only if: (1) SEZ exports goods produced using imported goods purchased from local importer; (2) Notice of locally imported goods used in exported goods must be proved and SEZ received payment in convertible currency; (3) Local importer furnished bank guarantee for customs duty. Here, machinery supplied cannot be used as raw material for export by SEZ. Therefore no refund.",
            "explanation": "Customs duty refund for SEZ has specific conditions.",
            "difficulty": "medium",
            "topic": "Customs Rules",
            "subtopic": "Refund",
            "subject": "Advanced Taxation",
            "marks": 7
        },
        # Advanced Taxation - Question 5b (Excise)
        {
            "type": "short-answer",
            "question": "Sita Packaging Industries has stock Rs. 10,000,000 at Kalanki godown with excise duty Rs. 500,000. Insured goods Rs. 6,000,000, remaining uninsured. Fire destroyed all goods. Advise on provisions in Excise Act, 2058 and Rules for offset of excise duty on damaged goods.",
            "correct_answer": "Under Section 3Ka(4) of Excise Act, 2058, excise duty on goods damaged due to fire, theft, accident, riot or expiry can be waived. Process: (1) Give prompt intimation to Department. If not, owner bears loss. (2) For insured goods: Apply with insurance claim details and payment proof within 30 days of receipt. Department verifies and waives duty. (3) For uninsured goods: File application with prescribed documents. (4) Department verifies with team and allows waiver if satisfied. Excise return must be filed for all periods.",
            "explanation": "Excise duty can be waived on damaged goods under specific conditions.",
            "difficulty": "medium",
            "topic": "Excise Act",
            "subtopic": "Damaged Goods",
            "subject": "Advanced Taxation",
            "marks": 7
        },
        # Advanced Taxation - Question 5c (VAT Relief)
        {
            "type": "short-answer",
            "question": "Trader claimed purchase of Rs. 3 million in VAT return but purchase of Rs. 1 million was not correlated by sales invoices of respective supplier as per VAT office. Based on VAT Act provisions, what action should he take to get relief?",
            "correct_answer": "Process: (1) Approach tax officer to find difference in bills with supplier. (2) Verify bills issued by such trader during month with those discovered by Tax Office. (3) If bills required, produce original purchase bills with copies so Tax Office can verify and retain copies, return originals. (4) If verified with supplier's copies, Tax Office must give credit for verified bills. (5) If discrepancy remains, deposit 1/3 of disputed amount and follow appeal procedure if sufficient grounds. Otherwise accept discrepancy and deposit VAT with interest and additional fees.",
            "explanation": "VAT Act provides mechanism to resolve input tax correlation issues.",
            "difficulty": "medium",
            "topic": "VAT Act",
            "subtopic": "Correlation",
            "subject": "Advanced Taxation",
            "marks": 6
        },
        # Advanced Taxation - Question 6a (Capital Neutrality)
        {
            "type": "short-answer",
            "question": "What do you understand by Capital Export Neutrality and Capital Import Neutrality in context of double taxation?",
            "correct_answer": "Capital Export Neutrality: When capital invested abroad, tax should not increase cost of capital through levy of tax. Ensures domestic investors not disadvantaged when investing overseas. Capital Import Neutrality: When capital brought into country, tax should not increase cost of capital to investor. Ensures foreign investors not disadvantaged compared to domestic investors. Both aim to make tax neutral for investment decisions. Countries achieve this through Double Taxation Avoidance Agreements (DTAA).",
            "explanation": "Tax neutrality is essential for international investment and trade.",
            "difficulty": "medium",
            "topic": "International Taxation",
            "subtopic": "Capital Neutrality",
            "subject": "Advanced Taxation",
            "marks": 5
        },
        # Advanced Taxation - Question 6b (Thai Airways)
        {
            "type": "short-answer",
            "question": "Thai Airways, Thailand has regular flights Bangkok-Kathmandu-Bangkok and working base in Kathmandu. Discuss income tax liability in Nepal.",
            "correct_answer": "Under Section 2(KaDa)(3) of ITA, place from where business provided for more than 90 days in previous continuous 12 months is Permanent Establishment. PE in Nepal makes foreign entity a resident person under Section 2(KaNga), requiring tax on global income. However, Section 73 gives priority to DTAA over local law. Article 8 of Nepal-Thailand DTAA (shipping, air transport) stipulates income from operation of aircraft in international traffic taxable only in contracting state where enterprise is based. Therefore, Thai Airways has no income tax liability in Nepal.",
            "explanation": "DTAA overrides domestic law for international air transport.",
            "difficulty": "medium",
            "topic": "International Taxation",
            "subtopic": "Permanent Establishment",
            "subject": "Advanced Taxation",
            "marks": 5
        },
    ]
    
    async with AsyncSessionLocal() as db:
        for q in questions:
            # Check if question exists
            result = await db.execute(
                select(Question).where(
                    Question.question == q["question"]
                )
            )
            existing = result.scalar_one_or_none()
            
            if not existing:
                question = Question(
                    id=str(uuid.uuid4()),
                    type=q["type"],
                    question=q["question"],
                    correct_answer=q["correct_answer"],
                    explanation=q.get("explanation"),
                    difficulty=q["difficulty"],
                    topic=q["topic"],
                    subtopic=q.get("subtopic"),
                    subject=q["subject"],
                    marks=q["marks"]
                )
                db.add(question)
        
        await db.commit()
        print(f"Seeded {len(questions)} CA Membership exam questions")


if __name__ == "__main__":
    asyncio.run(seed_ca_membership_questions())