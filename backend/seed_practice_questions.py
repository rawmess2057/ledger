import sqlite3
import json

DB_PATH = 'ledger_dev.db'
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

questions = [
    # ====== Corporate Laws (MCQ) ======
    ("corp-mcq-1", "mcq",
     "Which of the following is NOT a characteristic of a company under Companies Act, 2063?",
     json.dumps(["Separate legal entity", "Limited liability", "Direct management by all shareholders", "Perpetual succession"]),
     "Direct management by all shareholders",
     "A company is managed by board of directors, not by all shareholders directly.",
     "easy", "Companies Act", "Corporate Laws", 2),

    ("corp-mcq-2", "mcq",
     "Under Section 50 of BAFIA, 2073, a bank cannot supply credit to which of the following?",
     json.dumps(["General public", "Directors of the bank", "Government enterprises", "Foreign institutional investors"]),
     "Directors of the bank",
     "BAFIA Section 50(1)(c) prohibits banks from supplying credit to directors, their family members, and persons holding 1% or more shares.",
     "medium", "BAFIA 2073", "Corporate Laws", 2),

    ("corp-mcq-3", "mcq",
     "What is the minimum number of directors required for a public company under Companies Act, 2063?",
     json.dumps(["1", "3", "5", "7"]),
     "3",
     "A public company must have at least 3 directors under Companies Act, 2063.",
     "easy", "Companies Act", "Corporate Laws", 1),

    ("corp-mcq-4", "mcq",
     "Which theory holds that a corporation is liable for acts of its employees within the scope of employment?",
     json.dumps(["Alter ego theory", "Doctrine of Vicarious Liability", "Doctrine of Ultra Vires", "Doctrine of Indoor Management"]),
     "Doctrine of Vicarious Liability",
     "The Doctrine of Vicarious Liability makes the corporation liable for acts of employees within the scope of employment.",
     "medium", "Company Law - Criminal Liability", "Corporate Laws", 2),

    ("corp-mcq-5", "mcq",
     "Under NRB Act, 2058, NRB can provide loan or refinance facility for a maximum period of:",
     json.dumps(["6 months", "1 year", "2 years", "5 years"]),
     "1 year",
     "Under Section 49 of NRB Act, NRB can provide loan/refinance for maximum 1 year, renewable for additional 1 year.",
     "medium", "NRB Act", "Corporate Laws", 2),

    ("corp-mcq-6", "mcq",
     "Which body is responsible for investigating complaints against Chartered Accountants in Nepal?",
     json.dumps(["Nepal Rastra Bank", "Office of Auditor General", "ICAN Disciplinary Committee", "Company Registrar's Office"]),
     "ICAN Disciplinary Committee",
     "Under Nepal Chartered Accountant Act, 2053, the Disciplinary Committee of ICAN investigates complaints against members.",
     "medium", "Chartered Accountant Act", "Corporate Laws", 2),

    ("corp-mcq-7", "mcq",
     "Under Public Procurement Act, who is responsible for preparing the procurement plan in a public entity?",
     json.dumps(["The evaluation committee", "The chief of the public entity", "The line ministry", "The Public Procurement Monitoring Office"]),
     "The chief of the public entity",
     "The chief of the concerned Public Entity shall be responsible for preparing a procurement plan.",
     "easy", "Public Procurement", "Corporate Laws", 2),

    ("corp-mcq-8", "mcq",
     "A special resolution requires what percentage of votes in favor under Companies Act, 2063?",
     json.dumps(["51%", "66%", "75%", "90%"]),
     "75%",
     "Under Section 74 of Companies Act, 2063, a special resolution requires 75% of votes in favor.",
     "easy", "Companies Act", "Corporate Laws", 1),

    ("corp-mcq-9", "mcq",
     "The Financial Information Unit (FIU) functions under which Act?",
     json.dumps(["NRB Act, 2058", "Asset (Money) Laundering Prevention Act, 2064", "BAFIA, 2073", "Companies Act, 2063"]),
     "Asset (Money) Laundering Prevention Act, 2064",
     "FIU is established under Section 11 of Asset (Money) Laundering Prevention Act, 2064.",
     "medium", "Money Laundering Prevention", "Corporate Laws", 2),

    ("corp-mcq-10", "mcq",
     "Under FITTA, 2049, if a dispute between Nepali and foreign investor is not settled by mutual consultation, it is settled by:",
     json.dumps(["Nepal Supreme Court", "International Court of Justice", "Arbitration under UNCITRAL Rules", "ICAN"]),
     "Arbitration under UNCITRAL Rules",
     "Under Section 7 of FITTA, disputes not settled by consultation are resolved by arbitration under UNCITRAL Rules.",
     "medium", "FITTA", "Corporate Laws", 2),

    ("corp-mcq-11", "mcq",
     "Which of the following is NOT a function of the Insurance Board under Insurance Act, 2049?",
     json.dumps(["Register insurers and agents", "Frame investment policy for insurers", "Collect insurance premiums directly", "Protect insured interests"]),
     "Collect insurance premiums directly",
     "Insurance Board regulates but does not collect premiums. Premiums are collected by insurance companies.",
     "medium", "Insurance Act", "Corporate Laws", 2),

    ("corp-mcq-12", "mcq",
     "Under Industrial Enterprise Act, 2073, which type of industries can get possessory right over forest through lease?",
     json.dumps(["Service industries", "Forest-based industries", "Manufacturing industries", "Export-based industries"]),
     "Forest-based industries",
     "Section 23 of IEA provides that forest-based industries can obtain possessory right over forest through lease.",
     "medium", "Industrial Enterprise Act", "Corporate Laws", 2),

    ("corp-mcq-13", "mcq",
     "The quorum for a general meeting of a public company requires more than what percentage of shareholding?",
     json.dumps(["25%", "33%", "50%", "75%"]),
     "50%",
     "Under Companies Act, 2063, quorum requires more than 50% shareholding.",
     "easy", "Companies Act", "Corporate Laws", 1),

    ("corp-mcq-14", "mcq",
     "Under Audit Act, 2048, the Auditor General can exercise powers to:",
     json.dumps(["Collect taxes from public", "Appoint company directors", "Check programs/projects under government grants", "Issue banking licenses"]),
     "Check programs/projects under government grants",
     "Section 3(2) of Audit Act gives Auditor General power to check programs/projects receiving government grants.",
     "easy", "Audit Act", "Corporate Laws", 1),

    # ====== Advanced Taxation (MCQ) ======
    ("tax-mcq-1", "mcq",
     "Under Income Tax Act, 2058, what is the tax rate applicable to a resident company in Nepal?",
     json.dumps(["15%", "20%", "25%", "30%"]),
     "25%",
     "The standard corporate income tax rate for a resident company in Nepal is 25%.",
     "easy", "Income Tax Act", "Advanced Taxation", 1),

    ("tax-mcq-2", "mcq",
     "Under VAT Act, what is the standard VAT rate in Nepal?",
     json.dumps(["10%", "13%", "15%", "18%"]),
     "13%",
     "The standard VAT rate in Nepal is 13%.",
     "easy", "VAT Act", "Advanced Taxation", 1),

    ("tax-mcq-3", "mcq",
     "Which of the following is NOT treated as an allowable deduction under Income Tax Act, 2058?",
     json.dumps(["Business expenses wholly incurred for earning income", "Interest expense on borrowed capital", "Personal expenses of the taxpayer", "Depreciation on business assets"]),
     "Personal expenses of the taxpayer",
     "Personal expenses are not deductible for tax purposes. Only expenses incurred wholly for earning income are deductible.",
     "easy", "Income Tax Act", "Advanced Taxation", 1),

    ("tax-mcq-4", "mcq",
     "Under Customs Act, goods stored in a warehouse must be cleared within how many days?",
     json.dumps(["30 days", "45 days", "60 days", "90 days"]),
     "60 days",
     "Customs Rule 32 allows goods to remain in warehouse for up to 60 days.",
     "medium", "Customs Act", "Advanced Taxation", 2),

    ("tax-mcq-5", "mcq",
     "What is the capital gains tax rate on sale of shares of a listed company held for more than one year?",
     json.dumps(["5%", "7.5%", "10%", "15%"]),
     "7.5%",
     "Long-term capital gains on listed shares held >1 year are taxed at 7.5%.",
     "medium", "Income Tax Act", "Advanced Taxation", 2),

    ("tax-mcq-6", "mcq",
     "Under Excise Act, excise duty on goods destroyed by fire can be:",
     json.dumps(["Fully collected with penalty", "Waived by the Department", "Deferred to next period", "Converted to income tax credit"]),
     "Waived by the Department",
     "Section 3Ka(4) of Excise Act allows excise on fire-damaged goods to be waived by the Department.",
     "medium", "Excise Act", "Advanced Taxation", 2),

    ("tax-mcq-7", "mcq",
     "Under the concept of Capital Import Neutrality:",
     json.dumps(["Tax should not increase cost of capital when investing abroad", "Tax should not increase cost of capital when bringing foreign capital into the country", "All capital gains are tax-free", "Only resident entities are taxed"]),
     "Tax should not increase cost of capital when bringing foreign capital into the country",
     "Capital Import Neutrality means the tax system should not increase the cost of capital for foreign investors bringing capital into the country.",
     "medium", "International Taxation", "Advanced Taxation", 2),

    ("tax-mcq-8", "mcq",
     "A VAT-registered person must file VAT returns:",
     json.dumps(["Weekly", "Monthly", "Bi-monthly", "Quarterly"]),
     "Monthly",
     "VAT returns in Nepal must be filed monthly by the 25th of the following month.",
     "easy", "VAT Act", "Advanced Taxation", 1),

    ("tax-mcq-9", "mcq",
     "Under Income Tax Act, a Permanent Establishment (PE) exists if a foreign enterprise carries on business in Nepal for more than:",
     json.dumps(["30 days in 12 months", "60 days in 12 months", "90 days in 12 months", "180 days in 12 months"]),
     "90 days in 12 months",
     "Under Section 2(KaDa)(3) of ITA, a place of business in Nepal for >90 days in 12 months constitutes a PE.",
     "hard", "International Taxation", "Advanced Taxation", 2),

    ("tax-mcq-10", "mcq",
     "Which of the following is subject to 1% VAT under the VAT Act?",
     json.dumps(["Export of goods", "Retail sale of exempt goods", "Supply of goods by unregistered persons", "Import of goods by VAT-registered persons"]),
     "Import of goods by VAT-registered persons",
     "Import of goods by VAT-registered persons is subject to 1% VAT at the import stage.",
     "hard", "VAT Act", "Advanced Taxation", 3),

    ("tax-mcq-11", "mcq",
     "Under Income Tax Act, 2058, the tax rate for an individual resident is based on:",
     json.dumps(["Flat rate of 25%", "Progressive slab rates", "Turnover-based rate", "Sector-based rate"]),
     "Progressive slab rates",
     "Individual resident taxpayers are taxed on progressive slab rates under the Income Tax Act.",
     "easy", "Income Tax Act", "Advanced Taxation", 1),

    ("tax-mcq-12", "mcq",
     "If a VAT return is not filed by the due date, what is the additional charge under VAT Act?",
     json.dumps(["No additional charge for first month", "10% of VAT due for each month", "A fixed late fee per day", "Interest at 15% per annum"]),
     "Interest at 15% per annum",
     "Late filing of VAT return attracts interest at 15% per annum on the amount of VAT due.",
     "medium", "VAT Act", "Advanced Taxation", 2),

    # ====== Audit and Assurance (MCQ) ======
    ("audit-mcq-1", "mcq",
     "What type of audit opinion is issued when the auditor concludes that the financial statements are presented fairly in all material respects?",
     json.dumps(["Adverse opinion", "Disclaimer of opinion", "Qualified opinion", "Unmodified opinion"]),
     "Unmodified opinion",
     "An unmodified (clean) opinion is issued when financial statements are fairly presented in all material respects.",
     "easy", "Audit Concepts", "Audit and Assurance", 1),

    ("audit-mcq-2", "mcq",
     "The risk that an auditor expresses an inappropriate audit opinion when the financial statements are materially misstated is called:",
     json.dumps(["Inherent risk", "Control risk", "Detection risk", "Audit risk"]),
     "Audit risk",
     "Audit risk is the risk of expressing an inappropriate opinion when financial statements are materially misstated.",
     "easy", "Audit Risk", "Audit and Assurance", 1),

    ("audit-mcq-3", "mcq",
     "Which of the following is NOT a type of audit evidence?",
     json.dumps(["Inspection of documents", "Confirmation from third parties", "Management forecast", "Physical verification"]),
     "Management forecast",
     "Management forecasts are future-oriented and not considered reliable audit evidence.",
     "medium", "Audit Evidence", "Audit and Assurance", 2),

    ("audit-mcq-4", "mcq",
     "Under auditing standards, materiality is determined based on:",
     json.dumps(["The auditor's professional judgment", "A fixed percentage of total assets only", "Management's discretion", "Regulatory requirements exclusively"]),
     "The auditor's professional judgment",
     "Materiality is a matter of professional judgment based on the needs of financial statement users.",
     "medium", "Audit Concepts", "Audit and Assurance", 2),

    ("audit-mcq-5", "mcq",
     "An audit procedure where the auditor directly contacts third parties to verify information is called:",
     json.dumps(["Inquiry", "Confirmation", "Observation", "Re-performance"]),
     "Confirmation",
     "Confirmation is obtaining direct written evidence from third parties to verify account balances or transactions.",
     "easy", "Audit Procedures", "Audit and Assurance", 1),

    ("audit-mcq-6", "mcq",
     "The internal control component that includes the entity's process for identifying and responding to business risks is:",
     json.dumps(["Control environment", "Risk assessment", "Information and communication", "Monitoring activities"]),
     "Risk assessment",
     "Risk assessment is the entity's process for identifying and responding to business risks that may affect financial reporting.",
     "medium", "Internal Controls", "Audit and Assurance", 2),

    ("audit-mcq-7", "mcq",
     "When an auditor discovers a fraud, the auditor should:",
     json.dumps(["Conceal the finding to protect client reputation", "Report it to management and those charged with governance", "Immediately report to law enforcement", "Resign from the engagement"]),
     "Report it to management and those charged with governance",
     "Auditors must report fraud to management and those charged with governance, and consider regulatory reporting requirements.",
     "medium", "Fraud detection", "Audit and Assurance", 2),

    ("audit-mcq-8", "mcq",
     "Analytical procedures performed during the planning stage of an audit help the auditor to:",
     json.dumps(["Identify areas of potential misstatement", "Issue the audit opinion", "Prepare the financial statements", "Design internal controls"]),
     "Identify areas of potential misstatement",
     "Analytical procedures in planning help identify areas with higher risk of material misstatement.",
     "medium", "Audit Planning", "Audit and Assurance", 2),

    # ====== Corporate and Other Laws (MCQ) ======
    ("col-mcq-1", "mcq",
     "Under Securities Board of Nepal Act, for a company to issue FPO at premium, what is required?",
     json.dumps(["Only board resolution", "Approval from Securities Board of Nepal", "Shareholder approval by simple majority", "Approval from NRB"]),
     "Approval from Securities Board of Nepal",
     "Issuing FPO at premium requires approval from the Securities Board of Nepal under relevant securities regulations.",
     "medium", "Securities Board", "Corporate and Other Laws", 2),

    ("col-mcq-2", "mcq",
     "A promissory note under the prevalent laws must contain:",
     json.dumps(["An unconditional promise to pay", "A conditional undertaking to deliver goods", "A request to pay", "An acknowledgement of debt only"]),
     "An unconditional promise to pay",
     "A promissory note is an instrument in writing containing an unconditional promise to pay a certain sum of money.",
     "easy", "Promissory note", "Corporate and Other Laws", 1),

    ("col-mcq-3", "mcq",
     "Under Insurance Act, which authority can cancel or suspend the registration of an insurer?",
     json.dumps(["NRB", "Insurance Board", "Company Registrar", "Ministry of Finance"]),
     "Insurance Board",
     "The Insurance Board has the authority to register, renew, or cancel the registration of insurers under Insurance Act.",
     "easy", "Insurance registration cancellation", "Corporate and Other Laws", 1),

    ("col-mcq-4", "mcq",
     "A proxy appointed to attend a company meeting under Companies Act has the right to:",
     json.dumps(["Speak at the meeting", "Vote on a poll", "Chair the meeting", "Propose resolutions"]),
     "Vote on a poll",
     "A proxy has the right to vote on a poll but generally cannot speak or vote on a show of hands unless permitted by the Articles.",
     "medium", "Proxy appointment", "Corporate and Other Laws", 2),

    ("col-mcq-5", "mcq",
     "Under Labor Act, an employer can lay off workers due to:",
     json.dumps(["Personal disagreement with workers", "Seasonal nature of business", "Lack of raw materials or financial crisis", "Workers' union activities"]),
     "Lack of raw materials or financial crisis",
     "Lay-off is permitted due to shortage of raw materials, financial crisis, or similar circumstances beyond employer's control.",
     "medium", "Labor lay-off", "Corporate and Other Laws", 2),

    # ====== Advanced Accounting (MCQ) ======
    ("aa-mcq-1", "mcq",
     "In partnership accounting, if a partner is admitted, the revaluation of assets and liabilities is recorded through:",
     json.dumps(["Profit and Loss Account", "Revaluation Account", "Partner's Capital Account", "Goodwill Account"]),
     "Revaluation Account",
     "Revaluation Account is used to record changes in the value of assets and liabilities upon admission of a new partner.",
     "medium", "Partnership accounting", "Advanced Accounting", 2),

    ("aa-mcq-2", "mcq",
     "Under hire purchase system, the buyer records the asset at:",
     json.dumps(["Cash price", "Hire purchase price", "Down payment only", "Market value"]),
     "Cash price",
     "Under hire purchase, the asset is recorded at cash price, and the difference between HP price and cash price is treated as interest.",
     "medium", "Hire purchase", "Advanced Accounting", 2),

    ("aa-mcq-3", "mcq",
     "In consolidated financial statements, minority interest represents:",
     json.dumps(["Parent company's share in subsidiary", "External shareholders' share in subsidiary's net assets", "Goodwill on consolidation", "Inter-company profits"]),
     "External shareholders' share in subsidiary's net assets",
     "Minority interest (NCI) represents the equity in a subsidiary not attributable to the parent company.",
     "hard", "Amalgamation of companies", "Advanced Accounting", 3),

    ("aa-mcq-4", "mcq",
     "Under AS 9 (Revenue Recognition), revenue from the sale of goods should be recognized when:",
     json.dumps(["Order is received", "Goods are manufactured", "Significant risks and rewards of ownership are transferred", "Payment is received"]),
     "Significant risks and rewards of ownership are transferred",
     "Revenue from sales is recognized when significant risks and rewards of ownership are transferred to the buyer.",
     "medium", "Revenue recognition", "Advanced Accounting", 2),

    ("aa-mcq-5", "mcq",
     "Which inventory valuation method gives the highest profit during periods of rising prices?",
     json.dumps(["FIFO", "LIFO", "Weighted Average", "Specific Identification"]),
     "FIFO",
     "FIFO (First-In-First-Out) results in higher profits during rising prices because older, cheaper costs are matched against current revenues.",
     "easy", "Inventory valuation", "Advanced Accounting", 1),

    # ====== Accounting (CAP-I) (MCQ) ======
    ("acct-mcq-1", "mcq",
     "The accounting principle that requires expenses to be matched with related revenues is called:",
     json.dumps(["Going concern concept", "Matching principle", "Conservatism principle", "Materiality concept"]),
     "Matching principle",
     "The matching principle requires expenses to be recognized in the same period as the revenues they helped generate.",
     "easy", "Accounting Principles", "Accounting", 1),

    ("acct-mcq-2", "mcq",
     "Which of the following is NOT a current asset?",
     json.dumps(["Cash", "Inventory", "Goodwill", "Accounts receivable"]),
     "Goodwill",
     "Goodwill is an intangible asset classified as a non-current asset, not a current asset.",
     "easy", "Current Assets", "Accounting", 1),

    ("acct-mcq-3", "mcq",
     "The formula for calculating the quick ratio (acid test ratio) is:",
     json.dumps(["Current Assets / Current Liabilities", "(Current Assets - Inventory) / Current Liabilities", "Net Profit / Sales", "Total Debt / Total Equity"]),
     "(Current Assets - Inventory) / Current Liabilities",
     "Quick ratio excludes inventory from current assets as it is the least liquid current asset.",
     "easy", "Ratio Analysis", "Accounting", 1),

    ("acct-mcq-4", "mcq",
     "A credit purchase of equipment for NPR 50,000 on account should be recorded as:",
     json.dumps(["Debit Equipment, Credit Cash", "Debit Equipment, Credit Accounts Payable", "Debit Purchases, Credit Accounts Payable", "Debit Expense, Credit Equipment"]),
     "Debit Equipment, Credit Accounts Payable",
     "Credit purchase of an asset increases Equipment (debit) and increases Accounts Payable (credit).",
     "easy", "Journal Entries", "Accounting", 1),

    ("acct-mcq-5", "mcq",
     "Depreciation is provided on fixed assets to comply with which accounting concept?",
     json.dumps(["Going concern concept", "Accrual concept", "Consistency concept", "All of the above"]),
     "All of the above",
     "Depreciation aligns with going concern (assets used over life), accrual (matching cost with revenue), and consistency (same method each year).",
     "medium", "Depreciation", "Accounting", 2),

    ("acct-mcq-6", "mcq",
     "If the trial balance does not balance, the difference is temporarily placed in:",
     json.dumps(["Profit and Loss Account", "Suspense Account", "Balance Sheet", "Capital Account"]),
     "Suspense Account",
     "A suspense account is used to temporarily hold the difference in a trial balance until errors are located and corrected.",
     "easy", "Trial Balance", "Accounting", 1),

    ("acct-mcq-7", "mcq",
     "Which of the following is an example of an intangible asset?",
     json.dumps(["Land", "Building", "Patent right", "Inventory"]),
     "Patent right",
     "Patent rights are intangible assets as they have no physical substance but provide economic benefits.",
     "easy", "Assets Classification", "Accounting", 1),

    # ====== Business & Finance (additional MCQs) ======
    ("bf-mcq-1", "mcq",
     "Weighted Average Cost of Capital (WACC) represents:",
     json.dumps(["Cost of debt only", "Average cost of all sources of financing weighted by their proportion", "Cost of equity only", "Risk-free rate of return"]),
     "Average cost of all sources of financing weighted by their proportion",
     "WACC is the average after-tax cost of all capital sources weighted by their respective proportions in the capital structure.",
     "medium", "Cost of Capital", "business-finance", 2),

    ("bf-mcq-2", "mcq",
     "The dividend irrelevance theory is associated with:",
     json.dumps(["Gordon", "Walter", "Modigliani and Miller", "Keynes"]),
     "Modigliani and Miller",
     "Modigliani and Miller argued that dividend policy does not affect the value of the firm under perfect market conditions.",
     "hard", "Dividend Policy", "business-finance", 3),

    ("bf-mcq-3", "mcq",
     "A project with an NPV of zero indicates that the project:",
     json.dumps(["Should be rejected", "Is earning exactly the required rate of return", "Has no cash flows", "Is making a loss"]),
     "Is earning exactly the required rate of return",
     "NPV of zero means the present value of cash inflows equals the initial investment, earning exactly the required rate of return.",
     "medium", "Capital Budgeting", "business-finance", 2),

    # ====== Assurance (additional MCQs) ======
    ("assur-mcq-1", "mcq",
     "The primary objective of an IS audit is to:",
     json.dumps(["Improve system performance", "Evaluate the confidentiality, integrity, and availability of information systems", "Reduce IT costs", "Increase system speed"]),
     "Evaluate the confidentiality, integrity, and availability of information systems",
     "IS audit evaluates the controls related to confidentiality, integrity, and availability (CIA triad) of information systems.",
     "medium", "IS Audit", "assurance", 2),

    ("assur-mcq-2", "mcq",
     "Sampling risk in auditing refers to the risk that:",
     json.dumps(["The sample is not representative of the population", "The auditor selects too many items", "The client does not cooperate", "The audit fee is too high"]),
     "The sample is not representative of the population",
     "Sampling risk is the risk that the auditor's conclusion based on a sample differs from the conclusion if the entire population were tested.",
     "medium", "Audit Sampling", "assurance", 2),

    ("assur-mcq-3", "mcq",
     "The audit procedure of tracing from source documents to accounting records primarily tests which assertion?",
     json.dumps(["Completeness", "Existence", "Valuation", "Rights and obligations"]),
     "Completeness",
     "Tracing from source documents to accounting records tests completeness - ensuring all transactions are recorded.",
     "hard", "Audit Procedures", "assurance", 3),

    # ====== Business Law (CAP-I) (new subject) ======
    ("bl-mcq-1", "mcq",
     "Under Contract Act, a contract entered into by a minor is:",
     json.dumps(["Valid", "Void ab initio", "Voidable at minor's option", "Enforceable with guardian's consent"]),
     "Void ab initio",
     "A contract with a minor is void from the beginning (void ab initio) as a minor lacks contractual capacity.",
     "easy", "Contract Law", "Business Law", 1),

    ("bl-mcq-2", "mcq",
     "The Partnership Act defines a partnership as relation between persons who have agreed to share profits of a business carried on by:",
     json.dumps(["All partners jointly", "One partner only", "All or any of them acting for all", "A separate legal entity"]),
     "All or any of them acting for all",
     "Partnership is the relation between persons who have agreed to share profits of a business carried on by all or any of them acting for all.",
     "medium", "Partnership Law", "Business Law", 2),

    ("bl-mcq-3", "mcq",
     "Under the Company Act, 2063, the minimum number of members required to form a private company is:",
     json.dumps(["1", "2", "3", "7"]),
     "1",
     "A private company can be formed with just 1 member under Companies Act, 2063 (OPC - One Person Company).",
     "easy", "Company Formation", "Business Law", 1),

    ("bl-mcq-4", "mcq",
     "An offer that is accepted with modifications is considered as:",
     json.dumps(["A valid contract", "A counter-offer", "An invitation to offer", "A void agreement"]),
     "A counter-offer",
     "An acceptance with modifications is a counter-offer, which rejects the original offer and creates a new offer.",
     "easy", "Contract Law", "Business Law", 1),

    ("bl-mcq-5", "mcq",
     "Under the Negotiable Instruments Act, a cheque payable to bearer can be transferred by:",
     json.dumps(["Endorsement and delivery", "Simple delivery without endorsement", "Registration", "Written agreement"]),
     "Simple delivery without endorsement",
     "A bearer instrument is transferred by mere delivery without any endorsement.",
     "medium", "Negotiable Instruments", "Business Law", 2),
]

stmt = """INSERT OR IGNORE INTO questions (id, type, question, options, correct_answer, explanation, difficulty, topic, subject, marks)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""

inserted = 0
for q in questions:
    try:
        cur.execute(stmt, q)
        inserted += 1
    except Exception as e:
        print(f"Error inserting {q[0]}: {e}")

conn.commit()

cur.execute("SELECT COUNT(*) FROM questions")
total = cur.fetchone()[0]
print(f"Inserted {inserted} new practice questions, total questions: {total}")

cur.execute("SELECT subject, COUNT(*) FROM questions GROUP BY subject ORDER BY COUNT(*) DESC")
print("\nQuestions per subject:")
for r in cur.fetchall():
    print(f"  {r[0]:35s} {r[1]}")

cur.execute("SELECT type, COUNT(*) FROM questions GROUP BY type ORDER BY COUNT(*) DESC")
print("\nQuestions per type:")
for r in cur.fetchall():
    print(f"  {r[0]:20s} {r[1]}")

conn.close()
