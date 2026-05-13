import sqlite3
import uuid

DB_PATH = 'ledger_dev.db'

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

questions = [
    # Corporate Laws - Question 1a (Company Criminal Liability)
    (str(uuid.uuid4()), "case-study", 
     "Kathmandu Supermarket Limited advertised to sell washing soap kits with 65% discount. Niruta purchased 20 pieces at Rs. 200 per kit (normal price) as the price tag was not lowered due to negligence. Niruta claimed compensation for fraud. The supermarket argued they cannot be held criminally liable as a company. Explain: (i) Why a company cannot be held criminally liable? (ii) What are the theories of corporate criminal liability? (iii) Can the company be held liable for fraud?",
     None,
     "(i) Companies cannot be held criminally liable because criminal liability requires mens rea (guilty mind) and actus reus (guilty act) which are developed for individual offenders. Companies lack legal personality to have intent or knowledge. (ii) Theories: 1) Doctrine of Vicarious Liability - corporation liable for acts of employees within scope of employment. 2) Doctrine of Attribution - corporation liable when directing mind and will of company commits offense. (iii) No, the company is not liable because the sales man is a subordinate employee whose acts cannot be treated as company's acts. The directing mind test in Tesco v Nattrass shows only directors/managing directors can bind the company.",
     "This case illustrates the doctrine of attribution and vicarious liability in corporate criminal law.",
     "hard", "Company Law - Criminal Liability", "Corporate Personality", "Corporate Laws", 10),
    
    # Corporate Laws - Question 1b (BAFIA)
    (str(uuid.uuid4()), "case-study",
     "Shangrilla Commercial Bank Ltd decided to disburse loan of Rs. 5,000,000 to Excell Trading Pvt. Ltd where Mr. Rajan Sharma (son of Mr. Rajendra Sharma, a Board Director) was appointed as Managing Director with majority shares. Rajendra Sharma provided guarantee. NRB objected. Refer to BAFIA, 2073 and advise: (i) What types of acts cannot be carried out by bank/financial institution? (ii) Whether the loan disbursement is valid?",
     None,
     "(i) Under Section 50 of BAFIA, 2073, banks cannot: (a) Purchase/sell goods for commercial purpose except for own use; (b) Advance credit against security of its own shares; (c) Supply credit to directors, persons holding 1%+ shares, chief executive, their family members; (d) Supply credit exceeding prescribed limit to single customer; (e) Supply credit against guarantee given by promoters/directors/chief executive; (f) Invest in securities of classified A, B, C banks; (g) Invest beyond prescribed limit in other institutions; (h) Create monopoly in financial transactions. (ii) Invalid - Section 50(1)(e) prohibits supplying credit against guarantee given by promoters/directors.",
     "BAFIA prohibits conflicts of interest and ensures proper lending practices.",
     "hard", "BAFIA 2073", "Prohibited Activities", "Corporate Laws", 10),

    # Corporate Laws - Question 2a (Public Procurement)
    (str(uuid.uuid4()), "short-answer",
     "You are the chief of a Public Entity. Your office requires procurement of Data Server in Fiscal Year 2076/077. Who is responsible for procuring Data Server? What are the acts to be carried out by a Public Entity regarding public procurement?",
     None,
     "The chief of the concerned Public Entity shall be responsible for preparing a procurement plan and carrying out all activities relating to procurement. The chief must carry out procurement through an employee with prescribed qualifications. Acts include: (a) Prepare procurement plan; (b) Prepare bidding documents; (c) Publish procurement notice; (d) Issue bidding documents; (e) Receive and safely keep proposals; (f) Submit to evaluation committee; (g) Notify acceptance; (h) Obtain performance guarantee; (i) Examine quality standards; (j) Provide information to Monitoring Office.",
     "Public Procurement Act governs all government procurement activities.",
     "medium", "Public Procurement", "Procedures", "Corporate Laws", 7),

    # Corporate Laws - Question 2b (ICAN Disciplinary)
    (str(uuid.uuid4()), "case-study",
     "Pioneer Finance Company appointed Pramod Jha, a Chartered Accountant and ICAN member, as auditor. The company lodged complaint with ICAN charging that the auditor disclosed business-related information acquired in professional service without company's approval to its rival. Explain: (i) How is this charge investigated? (ii) What punishment can be imposed under Nepal Chartered Accountant Act, 2053? (iii) Can he challenge the punishment?",
     None,
     "(i) Section 34(5) prohibits members from disclosing information. Section 35 allows complaints to ICAN. Executive Directors submit motion to Council. Section 14 governs the case. (ii) Disciplinary Committee investigates and recommends to Council. Council may impose: (a) Reprimanding; (b) Removal from membership up to 5 years; (c) Prohibiting from carrying on accountancy; (d) Cancelling professional certificate. (iii) Yes, under Section 14(8), he can appeal to High Court.",
     "ICAN maintains professional ethics and discipline among chartered accountants.",
     "hard", "Chartered Accountant Act", "Disciplinary Proceedings", "Corporate Laws", 7),

    # Corporate Laws - Question 2c (NRB Provisions)
    (str(uuid.uuid4()), "short-answer",
     " Nepal Rastra Bank (NRB) provides loan and refinance facilities to commercial banks and financial institutions. State the loan and refinance provisions as mentioned in the NRB Act, 2058.",
     None,
     "Under Section 49 of NRB Act, 2058: NRB can provide loan/refinance for maximum 1 year against: (a) International negotiable instruments; (b) Government of Nepal debt bonds; (c) Deposits in NRB or gold and precious metals; (d) Bill of exchange or promissory notes; (e) Other securities as prescribed. For public interest: NRB can provide credit where Government provides guarantee, or as lender of last resort. Credit can be renewed for additional 1 year.",
     "NRB acts as lender of last resort and provides liquidity to banking system.",
     "medium", "NRB Act", "Loan and Refinance", "Corporate Laws", 6),

    # Corporate Laws - Question 3a (Money Laundering)
    (str(uuid.uuid4()), "short-answer",
     "State the role of Financial Information Unit in combating Money Laundering and Financing of Terrorism under the existing Asset (Money) Laundering Prevention Act, 2064.",
     None,
     "Under Section 11 of Asset (Money) Laundering Prevention Act, 2064, FIU functions include: (a) Receive threshold transaction reports; (b) Receive suspicious transaction reports; (c) Receive currency and BNI reports; (d) Analyze suspicious transactions; (e) Disseminate analysis to investigation agency if ML/TF suspected; (f) Provide training on ML/TF; (g) Provide feedback to reporting entities; (h) Prepare annual report to Government through NRB; (i) Assist in supervision of reporting entities; (j) Conclude MOU with foreign counterparts.",
     "FIU is the central agency for receiving and analyzing financial intelligence.",
     "medium", "Money Laundering Prevention", "FIU Functions", "Corporate Laws", 7),

    # Corporate Laws - Question 3b (IEA Additional Facilities)
    (str(uuid.uuid4()), "short-answer",
     "Industrial Enterprise Act, 2073 (IEA) provides various exemptions, facilities and concessions. State the additional facilities and concessions provided for various sector industries.",
     None,
     "Under Section 23 of IEA, 2073: (1) Forest-based industries can get possessory right over forest through lease. (2) No fees on electricity for own consumption; surplus can be sold. (3) Additional exemptions for export-based industries and industries in SEZ. (4) Additional exemptions for National Priority Industries. (5) Exemptions in Demand Charge in electricity. (6) Seed capital assistance to cooperatives, micro, small industries. (7) Foreign investment industries can import goods from head office.",
     "IEA provides incentives to promote industrial development in Nepal.",
     "medium", "Industrial Enterprise Act", "Additional Facilities", "Corporate Laws", 7),

    # Corporate Laws - Question 3c (FITTA Dispute Settlement)
    (str(uuid.uuid4()), "short-answer",
     "State the legal provisions for settlement of dispute between Nepali and foreign investor under Foreign Investment and Technology Transfer Act (FITTA), 2049.",
     None,
     "Under Section 7 of FITTA, 2049: (1) Parties must first settle by mutual consultations in presence of Department of Industries. (2) If not settled, settle by arbitration under UNCITRAL Rules. (3) Arbitration held in Kathmandu; Nepal laws applicable. (4) Disputes regarding foreign investment may be settled as per foreign investment agreement.",
     "FITTA provides dispute resolution mechanisms for foreign investors.",
     "medium", "FITTA", "Dispute Settlement", "Corporate Laws", 6),

    # Corporate Laws - Question 4a (AGM Procedures)
    (str(uuid.uuid4()), "short-answer",
     "Annual General Meeting (AGM) of Bhrikuti Public Company is to be held on 18th June 2019. How is AGM conducted, discussion made, and decision arrived at in a public limited company under Companies Act, 2063?",
     None,
     "Under Companies Act, 2063: Public notice under Section 67 served twice in national newspaper. Section 68 requires all board directors present. Quorum: more than 50% shareholding. Section 74: (1) Chair by Chairperson; in absence, person nominated by directors. (2) Every matter as resolution; Chairperson declares adoption. (3) Majority opinion is decision; voting by show of hands, voice, poll. Special resolution requires 75% in favor. If evenly divided, Chairperson may exercise casting vote.",
     "AGM is the supreme decision-making body of a company.",
     "medium", "Companies Act", "AGM Procedures", "Corporate Laws", 8),

    # Corporate Laws - Question 4b (Insurance Board)
    (str(uuid.uuid4()), "short-answer",
     "Insurance Act, 2049 established Insurance Board to develop and regulate insurance business. Answer: (i) How is Insurance Board formed? (ii) How does it function, fulfill duties and exercise powers?",
     None,
     "(i) Board: Nepal Government nominated person as Chairperson; Ministry of Law and Finance representatives; Person with insurance knowledge; Person from insured. Tenure 4 years, renewable. (ii) Functions: (a) Suggestion to Government for insurance policy; (b) Frame investment policy; (c) Register/renew/cancel Insurer, Agent, Surveyor; (d) Arbitrate disputes; (e) Decide on complaints; (f) Issue directives; (g) Protect Insured interests.",
     "Insurance Board regulates and develops Nepal's insurance sector.",
     "medium", "Insurance Act", "Board Functions", "Corporate Laws", 7),

    # Corporate Laws - Question 5a (Problematic Banks)
    (str(uuid.uuid4()), "short-answer",
     "Some customers of a commercial bank have applied that the bank is in problematic condition. Discuss circumstances in which banks/financial institutions will be deemed problematic as per Nepal Rastra Bank Act, 2058.",
     None,
     "Under Section 86B of NRB Act, 2058, NRB declares problematic when: (a) Action against depositors/shareholders interest; (b) Not fulfilling financial liabilities; (c) Insolvent; (d) Non-compliance with NRB Act or directives; (e) License obtained by fraud; (f) Unable to maintain capital fund; (g) Legal proceedings for liquidation; (h) Undue delay in voluntary liquidation; (i) Joint venture with foreign bank that is insolvent; (j) If bank unable to pay dues.",
     "NRB monitors and takes action against problematic financial institutions.",
     "hard", "NRB Act", "Problematic Institutions", "Corporate Laws", 5),

    # Corporate Laws - Question 5b (Auditor General Powers)
    (str(uuid.uuid4()), "short-answer",
     "What is meant by audit? State powers that can be exercised by Auditor General in course of audit under Audit Act, 2048.",
     None,
     "Audit under Section 2(c) means examination of accounts and analysis/evaluation. Powers under Section 3(2): (a) Check programs/projects under Government grants; (b) Require contractors to produce contract documents; get tax audit file; (c) Hire expert services. Section 3(3): Retrieve system information from software from government offices.",
     "Auditor General has comprehensive powers to audit government finances.",
     "medium", "Audit Act", "Auditor General Powers", "Corporate Laws", 5),

    # Corporate Laws - Question 5c (International Financial Transactions)
    (str(uuid.uuid4()), "short-answer",
     "State objectives of International Financial Transactions Act, 2054 and role of Promotion Board to achieve those objectives.",
     None,
     "Objectives: Develop Nepal as center for international financial transactions to foster economic development in context of open, market-oriented policies and globalization. Regulation of financial activities of international financial entities. Board functions: (a) Frame policies; (b) Cooperate with Government; (c) Maintain coordination; (d) Recommend exemptions for international entities; (e) Hear appeals; (f) Other functions.",
     "Act aims to make Nepal an international financial hub.",
     "medium", "International Financial Transactions Act", "Objectives and Board Functions", "Corporate Laws", 5),

    # Advanced Taxation - Question 1 (Merger)
    (str(uuid.uuid4()), "numerical",
     "Organic Foods Company (OFC) and Fast Foods Company (FFC) merged from 1st Baishakh 2076. Share exchange: OFC 1:1, FFC 1:2. Par value Rs. 100. Transactions: OFC Sales 50M, COGS 20M, Depreciation 5M, Interest 9M; FFC Sales 100M, COGS 40M, Depreciation 10M, Interest 5M, Mgmt Fee 10M. Additional: OFC invoiced FFC Rs. 10M post-merger; Interest on land not transferred not deductible; OFC has 30M carried forward loss. Discuss tax payable under ITA 2058.",
     None,
     "No special merger treatment except Banks/Insurance under Section 47Ka. Both dissolved, tax on disposal: OFC Income 16M + Gains 11.5M = 27.5M, loss cannot be forward, Tax 0. FFC Income 45M + Gain 1M = 46M, Tax @20% = 9.2M. Dividend Tax: OFC 12M @5% = 0.6M; FFC 11.8M @5% = 0.59M. Total Tax = 10.39M.",
     "Merger taxation involves deemed disposal and dividend distribution.",
     "hard", "Income Tax Act", "Merger", "Advanced Taxation", 20),

    # Advanced Taxation - Question 2a (Insurance Company Tax)
    (str(uuid.uuid4()), "numerical",
     "Naulo General Insurance Nepal Ltd: Net Premium 700M, Commission on Ceded 24.8M, Opening Unexpired Risk 251M, Opening Claims 40.02M, Commission on Accepted 17.4M, Agent Commission 26.1M, Management 186M, Claims Paid 174M, Closing Claims 52.2M, Interest 87M, Depreciation 104.4M, Misc Income 43.5M, Reinsurance Claim 97M, Carried Forward Loss 194M. Additional: Salvage 50K, Depreciation per ITA 70M, Management includes 100K prior period. Calculate tax liability for IY 2075/76.",
     None,
     "Inclusions: 700M + 24.8M + 251M + 40.02M + 87M + 43.5M + 97M + 50K = 1,243,370,000. Deductions: 17.4M + 26.1M + 185.9M + 174M + 60.03M + 350M + 70M + 194M = 1,077,430,000. Assessable = 165,940,000. Tax @30% = 49,782,000.",
     "Insurance companies have special tax computation under Section 60.",
     "hard", "Income Tax Act", "Insurance Company Tax", "Advanced Taxation", 7),

    # Advanced Taxation - Question 2b (Bank Provisions)
    (str(uuid.uuid4()), "numerical",
     "ABC Bank: Loans 23B (2074/75) to 24B (2075/76), NBA 2B both years, LLP 1.4B to 1.45B. Calculate inclusion/deduction under Section 59(1Ka) for IY 2075/76.",
     None,
     "Closing 26B x 5% = 1,300,000. Opening 25B x 5% = 1,250,000. Opening LLP 1,400,000. PY disallowed = 150,000. This year: LLP 50,000 + PY 150,000 = 200,000 (A). Eligible balance = 1,300,000 - 1,250,000 = 50,000 (B). Deduction = lesser of 200,000 and 50,000 = 50,000.",
     "Bank loan loss provisions have specific deduction rules under Section 59.",
     "medium", "Income Tax Act", "Bank Provisions", "Advanced Taxation", 7),

    # Advanced Taxation - Question 2c (Capital Gain on House)
    (str(uuid.uuid4()), "numerical",
     "Ram Sharma bought house for Rs. 10M on 1st Baishakh 2050 (residing since then). Land 10 anna, house on 4 anna. Bought additional 10 anna for Rs. 15M on 1st Baishakh 2072. Sold entire property on 1st Jestha 2076 for Rs. 50M (10M house, 40M land). FMV on Chaitra 19, 2058 was 20M (5M house + 15M land). Calculate tax under ITA 2058.",
     None,
     "House + 8 anna (4+4) not NBCA, 2 anna is NBCA. Cost of 2 anna = 15M/10 x 2 = 3M. Sale of 2 anna = 40M/20 x 2 = 4M. Gain = 1M @ 2.5% = 25,000. Additional land: Cost 15M, Sale 20M, Gain 5M @ 5% = 250,000. Total Tax = 275,000.",
     "Capital gains on personal residence and NBCA have different tax rates.",
     "hard", "Income Tax Act", "Capital Gain", "Advanced Taxation", 6),

    # Advanced Taxation - Question 4a (VAT Assessment)
    (str(uuid.uuid4()), "case-study",
     "Sungabha Chemicals filed VAT return for Magh 2075 within due date, paid Rs. 117,000 on 25th Falgun via cheque encashed 28th Falgun. Sales: VAT registered 6M + 780K, Unregistered 2.26M no VAT, Exempt 1M. Purchases: Goods 2.5M + 325K, Service 500K + 65K, Car 2M + 260K, Liquor 100K + 13K. Other: Foreign consultant 1M, Goods given without bill 500K. Calculate penalty, additional charges, interest.",
     None,
     "Adjustments: (1) Unregistered VAT 260K + penalty 260K. (2) Service >1yr - credit 65K. (3) Car - only 40% credit, 156K disallowed. (4) Liquor - 13K disallowed. (5) Foreign consultant reverse 130K. (6) Goods without bill reverse 65K. (7) Exempt proportion 11.11% x 429K = 47,662. Total VAT = 853,662. Paid 117,000, Shortfall 736,662. Penalty = 736,662. Additional fee = 7,160. Interest = 29,088. Total = 1,626,572.",
     "VAT assessment involves multiple compliance checks and penalties.",
     "hard", "VAT Act", "Assessment", "Advanced Taxation", 10),

    # Advanced Taxation - Question 4b (Customs)
    (str(uuid.uuid4()), "case-study",
     "VRS kept 10,000L Sprite in Sumi Warehouse on 1st Nov 2018. Shortage of 1,000L found in Dec 2018. Cost Rs. 1,100/L, Market Rs. 1,500/L. Sumi replied goods should clear within 45 days so no claim. Customs duty Rs. 30/L. Advise: (i) Is Sumi correct? (ii) Amount claimed? (iii) How much to pay? (iv) Customs provisions.",
     None,
     "(i) Not correct - Rule 32 allows 60 days (not 45), Sprite not perishable. (ii) Not correct - Rule 56: Invoice + 5%, not market. 1,100,000 + 55,000 = 1,155,000. (iii) Pay 1,155,000 to VRS + customs 30,000 to customs within 7 days. (iv) Warehouse operator liable for damage.",
     "Customs rules govern warehouse storage and damage claims.",
     "hard", "Customs Act", "Warehouse", "Advanced Taxation", 10),

    # Advanced Taxation - Question 5a (Customs Refund)
    (str(uuid.uuid4()), "short-answer",
     "Trade Syndicate imported machine parts Rs. 1M, sold to SEZ unit, paid customs Rs. 150,000. Now wants refund. Valid under Custom Rule 18?",
     None,
     "No. Custom Rule 18 allows refund only if: (1) SEZ exports goods produced using imported goods; (2) Notice proved and payment in convertible currency; (3) Bank guarantee furnished. Here machinery cannot be raw material for SEZ export. No refund.",
     "Customs duty refund for SEZ has specific conditions.",
     "medium", "Customs Rules", "Refund", "Advanced Taxation", 7),

    # Advanced Taxation - Question 5b (Excise)
    (str(uuid.uuid4()), "short-answer",
     "Sita Packaging: Stock Rs. 10M, Excise Rs. 500,000. Insured Rs. 6M, uninsured Rs. 4M. Fire destroyed all. Provisions in Excise Act for offset?",
     None,
     "Under Section 3Ka(4), excise on goods damaged by fire can be waived. Process: (1) Prompt intimation to Department. (2) Insured: Apply with claim details within 30 days of receipt. (3) Uninsured: Application with documents. (4) Department verifies and waives. Must file returns for all periods.",
     "Excise duty can be waived on damaged goods under specific conditions.",
     "medium", "Excise Act", "Damaged Goods", "Advanced Taxation", 7),

    # Advanced Taxation - Question 5c (VAT Relief)
    (str(uuid.uuid4()), "short-answer",
     "Trader claimed purchase Rs. 3M in VAT return but Rs. 1M not correlated with supplier invoices. Action for relief under VAT Act?",
     None,
     "Process: (1) Approach tax officer to find difference. (2) Verify bills with supplier. (3) Produce original bills with copies for verification. (4) If verified, Tax Office gives credit. (5) If discrepancy: deposit 1/3 disputed and appeal if grounds; otherwise deposit with interest and fees.",
     "VAT Act provides mechanism to resolve input tax correlation issues.",
     "medium", "VAT Act", "Correlation", "Advanced Taxation", 6),

    # Advanced Taxation - Question 6a (Capital Neutrality)
    (str(uuid.uuid4()), "short-answer",
     "What do you understand by Capital Export Neutrality and Capital Import Neutrality in context of double taxation?",
     None,
     "Capital Export Neutrality: Tax should not increase cost of capital when investing abroad - domestic investors not disadvantaged. Capital Import Neutrality: Tax should not increase cost of capital when bringing in capital - foreign investors not disadvantaged. Both aim for tax neutrality. Achieved through DTAA.",
     "Tax neutrality is essential for international investment and trade.",
     "medium", "International Taxation", "Capital Neutrality", "Advanced Taxation", 5),

    # Advanced Taxation - Question 6b (Thai Airways)
    (str(uuid.uuid4()), "short-answer",
     "Thai Airways has regular flights Bangkok-Kathmandu and base in Kathmandu. Income tax liability in Nepal?",
     None,
     "Under Section 2(KaDa)(3), place for >90 days in 12 months is PE. PE in Nepal makes foreign entity resident under Section 2(KaNga). However, Section 73 gives priority to DTAA. Article 8 Nepal-Thailand DTAA: income from aircraft operation in international traffic taxable only in contracting state. No tax liability in Nepal.",
     "DTAA overrides domestic law for international air transport.",
     "medium", "International Taxation", "Permanent Establishment", "Advanced Taxation", 5),
]

stmt = """INSERT INTO questions (id, type, question, options, correct_answer, explanation, difficulty, topic, subtopic, subject, marks)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""

inserted = 0
for q in questions:
    try:
        cur.execute(stmt, q)
        inserted += 1
    except Exception as e:
        print(f"Error: {e}")
        break

conn.commit()
cur.execute('SELECT COUNT(*) FROM questions')
print(f"Inserted {inserted} questions, total: {cur.fetchone()[0]}")

conn.close()