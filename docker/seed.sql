-- Initialize subjects table
INSERT INTO subjects (id, name, papers, color, icon) VALUES
    ('accounting', 'Accounting', 2, 'from-teal-500 to-emerald-500', 'calculator'),
    ('assurance', 'Assurance & IS', 1, 'from-blue-500 to-cyan-500', 'shield-check'),
    ('business-finance', 'Business & Finance', 2, 'from-violet-500 to-purple-500', 'trending-up'),
    ('law', 'Business Law', 1, 'from-amber-500 to-orange-500', 'scale'),
    ('taxation', 'Taxation', 2, 'from-rose-500 to-pink-500', 'file-text')
ON CONFLICT (id) DO NOTHING;

-- Seed sample questions
INSERT INTO questions (id, type, question, options, correct_answer, explanation, difficulty, topic, subtopic, subject, marks) VALUES
    (
        gen_random_uuid(), 'mcq', 
        'Which of the following is NOT a characteristic of a company?',
        '["Separate legal entity", "Perpetual succession", "Direct management by owners", "Limited liability"]',
        'Direct management by owners',
        'A company has delegated management to directors, not direct control by shareholders (owners). This separation of ownership and management is a key feature of corporate structure.',
        'medium', 'Nature of Company', 'Company Characteristics', 'law', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Under the Nepal Chartered Accountants Act, which body is responsible for regulating the profession?',
        '["Institute of Chartered Accountants of Nepal (ICAN)", "Society of Chartered Accountants Nepal", "Nepal Accounting Standards Board", "Financial Comptroller General Office"]',
        'Institute of Chartered Accountants of Nepal (ICAN)',
        'ICAN is the statutory body established under the Chartered Accountants Act, 1997 to regulate the profession of chartered accountancy in Nepal.',
        'medium', 'Professional Regulation', 'ICAN', 'law', 2
    ),
    (
        gen_random_uuid(), 'numerical',
        'Calculate the net profit ratio from the following:\nGross Profit: NPR 150,000\nOperating Expenses: NPR 45,000\nNon-operating expenses: NPR 10,000\nNet Sales: NPR 500,000',
        NULL,
        '19',
        'Net Profit = Gross Profit - Operating Expenses - Non-operating expenses\nNet Profit = 150,000 - 45,000 - 10,000 = NPR 95,000\nNet Profit Ratio = (Net Profit / Net Sales) × 100 = (95,000 / 500,000) × 100 = 19%',
        'easy', 'Financial Statements Analysis', 'Ratio Analysis', 'accounting', 4
    ),
    (
        gen_random_uuid(), 'journal-entry',
        'Record the following transaction:\n Machinery purchased for NPR 200,000, paid 80% immediately, balance due in 30 days. (Assume CGST @ 9% and SGST @ 9%)',
        NULL,
        'Machinery A/c Dr 200,000\nCGST Input A/c Dr 18,000\nSGST Input A/c Dr 18,000 To Cash A/c 189,600 To Creditor A/c 46,400',
        'Machinery is debited with cost + taxes. Cash paid 80% of (200,000 + 36,000) = 236,000 × 0.8 = 188,800 ≈ 189,600. Balance goes to creditor. GST is 9% CGST + 9% SGST = 18% of 200,000 = 36,000.',
        'hard', 'Journal Entries', 'GST Entries', 'accounting', 5
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which of the following is NOT a fundamental principle of accounting?',
        '["Going concern", "Matching concept", "Market value basis", "Historical cost"]',
        'Market value basis',
        'The fundamental accounting principles include: Going Concern, Matching Concept, Historical Cost, Consistency, Materiality, etc. Market value basis is not a fundamental principle.',
        'medium', 'Accounting Principles', 'Fundamental Concepts', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'What is the primary purpose of a bank reconciliation statement?',
        '["To calculate profit", "To identify differences between cash book and bank statement", "To prepare financial statements", "To record depreciation"]',
        'To identify differences between cash book and bank statement',
        'Bank reconciliation is prepared to reconcile the bank balance as per cash book with the balance as per bank statement, identifying timing differences and errors.',
        'easy', 'Bank Reconciliation', 'Introduction', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Depreciation is provided on which basis?',
        '["Current assets", "Fixed assets", "Intangible assets", "Current liabilities"]',
        'Fixed assets',
        'Depreciation is the systematic allocation of the cost of a tangible fixed asset over its useful life. It applies to long-term assets used in business operations.',
        'easy', 'Depreciation', 'Basic Concepts', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which audit evidence is considered most reliable?',
        '["Inquiry", "Observation", "External confirmation", "Documentation review"]',
        'External confirmation',
        'External confirmations from third parties (like bank confirmations, supplier statements) are generally considered more reliable as they are independent of the client.',
        'medium', 'Audit Evidence', 'Types of Evidence', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'What does VAT stand for?',
        '["Value Added Tax", "Variable Asset Tax", "Verified Account Transaction", "Voluntary Audit Test"]',
        'Value Added Tax',
        'VAT stands for Value Added Tax, which is a consumption tax placed on products whenever value is added at each stage of production or distribution.',
        'easy', 'VAT', 'Introduction', 'taxation', 2
    ),
    (
        gen_random_uuid(), 'numerical',
        'A trader sold goods for NPR 50,000 at 20% profit on cost. What is the cost price?',
        NULL,
        '41667',
        'Let Cost Price = CP\nSelling Price = CP + 20% of CP = 1.20 × CP\n50,000 = 1.20 × CP\nCP = 50,000 / 1.20 = NPR 41,667 (approximately)',
        'medium', 'Profit and Loss', 'Basic Calculations', 'accounting', 3
    ),
    -- ===== ACCOUNTING QUESTIONS =====
    (
        gen_random_uuid(), 'mcq',
        'Which accounting concept states that accounting transactions should be recorded at the original cost incurred?',
        '["Matching concept", "Historical cost concept", "Going concern concept", "Consistency concept"]',
        'Historical cost concept',
        'The historical cost concept requires that assets be recorded at their original purchase price rather than their current market value. This provides objectivity and verifiability in financial reporting.',
        'easy', 'Accounting Principles', 'Historical Cost', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'A company has total assets of NPR 500,000 and total liabilities of NPR 200,000. What is the amount of equity?',
        '["NPR 300,000", "NPR 700,000", "NPR 200,000", "NPR 500,000"]',
        'NPR 300,000',
        'Using the accounting equation: Assets = Liabilities + Equity\nEquity = Assets - Liabilities = 500,000 - 200,000 = NPR 300,000',
        'easy', 'Accounting Equation', 'Basic Equation', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which of the following is NOT a current asset?',
        '["Cash at bank", "Accounts receivable", "Land held for sale", "Inventory"]',
        'Land held for sale',
        'Land held for sale is classified as a current asset if expected to be sold within one year. However, land held for use in the business (not held for sale) is a non-current/fixed asset. The question implies land held for business use.',
        'medium', 'Assets Classification', 'Current vs Non-current', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Provision for doubtful debts is shown under which head in the balance sheet?',
        '["Deducted from debtors", "Added to creditors", "Shown as liability", "Shown as asset"]',
        'Deducted from debtors',
        'Provision for doubtful debts is a contra-asset account that is deducted from the trade debtors/receivables figure in the balance sheet. It represents the estimated uncollectible amounts.',
        'medium', 'Bad Debts', 'Provision for Doubtful Debts', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which method of depreciation results in higher depreciation in early years?',
        '["Straight line method", "Written down value method", "Units of production method", "Sinking fund method"]',
        'Written down value method',
        'The Written Down Value (WDV) method charges depreciation as a fixed percentage of the declining book value, resulting in higher depreciation charges in the early years of an asset''s life.',
        'medium', 'Depreciation', 'WDV Method', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Goods returned by a customer should be debited to which account?',
        '["Sales account", "Returns inward account", "Customer''s personal account", "Purchases account"]',
        'Returns inward account',
        'Goods returned by customers are recorded in the Returns Inward account (also called Sales Returns). This reduces the total sales revenue. Returns Inward is debited as it represents a reduction in revenue.',
        'easy', 'Sales Returns', 'Returns Inward', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which of the following errors will not be revealed by a trial balance?',
        '["Compensating errors", "Posting to wrong account", "Omission of a transaction", "Transaction posted twice"]',
        'Omission of a transaction',
        'A trial balance only reveals errors that cause unequal debits and credits. Complete omission of a transaction (not recording it at all) means both debit and credit are missing, so the trial balance will still agree.',
        'hard', 'Trial Balance', 'Errors Detection', 'accounting', 3
    ),
    (
        gen_random_uuid(), 'mcq',
        'Prepaid expenses are classified as:',
        '["Current assets", "Fixed assets", "Current liabilities", "Long-term liabilities"]',
        'Current assets',
        'Prepaid expenses represent expenses paid in advance for benefits to be received within one year. They are classified as current assets on the balance sheet.',
        'easy', 'Current Assets', 'Prepayments', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Capital introduced by the owner increases which element?',
        '["Assets only", "Liabilities only", "Assets and liabilities", "Assets and equity"]',
        'Assets and equity',
        'When capital is introduced, cash (asset) increases and capital (equity) increases. This follows the accounting equation: Assets ↑ = Liabilities + Equity ↑.',
        'easy', 'Capital Transactions', 'Owner''s Equity', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which of the following is NOT a qualitative characteristic of financial statements as per IASB Framework?',
        '["Relevance", "Faithful representation", "Comparability", "Historical cost"]',
        'Historical cost',
        'The qualitative characteristics of financial statements are: relevance, faithful representation, comparability, verifiability, timeliness, and understandability. Historical cost is a measurement basis, not a qualitative characteristic.',
        'medium', 'Financial Reporting', 'Qualitative Characteristics', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'numerical',
        'A machine was purchased for NPR 100,000 on 1st January 2020. It was estimated to have a useful life of 5 years with a residual value of NPR 10,000. Calculate the annual depreciation using straight line method.',
        NULL,
        '18000',
        'Depreciation = (Cost - Residual Value) / Useful Life\nDepreciation = (100,000 - 10,000) / 5 = 90,000 / 5 = NPR 18,000 per year',
        'easy', 'Depreciation', 'Straight Line Method', 'accounting', 3
    ),
    (
        gen_random_uuid(), 'numerical',
        'From the following data, calculate Working Capital Turnover Ratio:\nCurrent Assets: NPR 200,000\nCurrent Liabilities: NPR 100,000\nNet Sales: NPR 600,000\nCost of Goods Sold: NPR 400,000',
        NULL,
        '4',
        'Working Capital = Current Assets - Current Liabilities = 200,000 - 100,000 = NPR 100,000\nWorking Capital Turnover = Net Sales / Working Capital = 600,000 / 100,000 = 4 times',
        'medium', 'Ratio Analysis', 'Turnover Ratios', 'accounting', 4
    ),
    (
        gen_random_uuid(), 'numerical',
        'Calculate the net profit ratio if Net Profit is NPR 80,000 and Net Sales is NPR 500,000.',
        NULL,
        '16',
        'Net Profit Ratio = (Net Profit / Net Sales) × 100\nNet Profit Ratio = (80,000 / 500,000) × 100 = 16%',
        'easy', 'Ratio Analysis', 'Profitability Ratios', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'numerical',
        'A company has current ratio of 2:1 and working capital of NPR 150,000. Calculate current assets and current liabilities.',
        NULL,
        'Current Assets: 300,000; Current Liabilities: 150,000',
        'Let Current Liabilities = x\nCurrent Ratio = Current Assets / Current Liabilities = 2:1\nTherefore Current Assets = 2x\nWorking Capital = Current Assets - Current Liabilities\n150,000 = 2x - x\nx = 150,000\nCurrent Assets = 2 × 150,000 = NPR 300,000\nCurrent Liabilities = NPR 150,000',
        'medium', 'Ratio Analysis', 'Liquidity Ratios', 'accounting', 4
    ),
    (
        gen_random_uuid(), 'journal-entry',
        'Record the following journal entry:\nSold goods to Hari for NPR 50,000 at 10% trade discount. Received a cash advance of NPR 20,000.',
        NULL,
        'Cash A/c Dr 20,000\nDebtors (Hari) A/c Dr 25,000\n    To Sales A/c 45,000\n(Being goods sold at 10% trade discount, cash received in advance)',
        'Goods sold at NPR 50,000 with 10% trade discount = 50,000 × 0.90 = NPR 45,000. Cash received = NPR 20,000. Balance due from Hari = 45,000 - 20,000 = NPR 25,000.',
        'medium', 'Journal Entries', 'Sales Entries', 'accounting', 4
    ),
    (
        gen_random_uuid(), 'journal-entry',
        'Record the following adjusting entry:\nOutstanding salaries for the year amounted to NPR 12,000.',
        NULL,
        'Salaries A/c Dr 12,000\n    To Salaries Outstanding A/c 12,000\n(Being salaries outstanding for the year)',
        'Salaries expense is incurred but not yet paid, so it needs to be recognized. Salaries account is debited to recognize the expense, and Salaries Outstanding (a liability) is credited.',
        'easy', 'Adjusting Entries', 'Accrued Expenses', 'accounting', 3
    ),
    (
        gen_random_uuid(), 'journal-entry',
        'Record the following transaction:\nProprietor withdrew NPR 5,000 cash for personal use.',
        NULL,
        'Drawings A/c Dr 5,000\n    To Cash A/c 5,000\n(Being cash withdrawn for personal use)',
        'Drawings represent the proprietor''s withdrawal of capital for personal use. It reduces the capital balance and cash balance.',
        'easy', 'Journal Entries', 'Drawings Entry', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'short-answer',
        'State any four objectives of preparing a bank reconciliation statement.',
        NULL,
        '1. To identify discrepancies between cash book and passbook balances\n2. To detect errors and omissions in either book\n3. To ensure accurate recording of banking transactions\n4. To know the actual bank balance\n5. To prevent fraud and misappropriation of cash',
        'Bank reconciliation is prepared to match and reconcile differences between the bank statement and the company''s cash book. It helps identify timing differences, errors, and ensures accurate cash records.',
        'easy', 'Bank Reconciliation', 'Objectives', 'accounting', 3
    ),
    (
        gen_random_uuid(), 'short-answer',
        'Explain the difference between capital expenditure and revenue expenditure.',
        NULL,
        'Capital Expenditure:\n- Incurred to acquire or improve long-term assets\n- Benefits extend beyond one accounting year\n- Shown in balance sheet as assets\n- Examples: Purchase of machinery, building construction\n\nRevenue Expenditure:\n- Incurred for day-to-day operations\n- Benefits are consumed within one year\n- Shown in income statement as expenses\n- Examples: Salary, rent, repairs',
        'Capital expenditure increases the capacity or efficiency of an asset (capitalized), while revenue expenditure maintains the asset in working condition (expensed). The distinction is important for correct profit measurement and asset valuation.',
        'medium', 'Expenditure Classification', 'Capital vs Revenue', 'accounting', 4
    ),
    (
        gen_random_uuid(), 'short-answer',
        'What is meant by double entry system of bookkeeping? Explain its golden rules.',
        NULL,
        'Double Entry System:\nEvery transaction has two aspects - debit and credit, which are equal and opposite.\n\nGolden Rules:\n1. Personal Accounts: Debit the receiver, Credit the giver\n2. Real Accounts: Debit what comes in, Credit what goes out\n3. Nominal Accounts: Debit all expenses and losses, Credit all incomes and gains',
        'The double entry system ensures that for every debit entry, there is a corresponding credit entry of equal amount. This maintains the accounting equation and helps detect errors.',
        'medium', 'Double Entry System', 'Fundamentals', 'accounting', 4
    ),
    (
        gen_random_uuid(), 'mcq',
        'The totals of a trial balance agree when:',
        '["Total debits equal total credits", "Total assets equal total liabilities", "Gross profit equals net profit", "Current assets equal current liabilities"]',
        'Total debits equal total credits',
        'A trial balance agrees when the total of debit balances equals the total of credit balances. This is the fundamental requirement of double-entry bookkeeping.',
        'easy', 'Trial Balance', 'Agreement', 'accounting', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which of the following is NOT a feature of a promissory note?',
        '["Unconditional promise", "Signed by the maker", "Payable on demand", "Transferable by endorsement only"]',
        'Transferable by endorsement only',
        'A promissory note is a negotiable instrument that can be transferred by mere delivery (if payable to bearer) or endorsement and delivery (if payable to order). It is not limited to endorsement-only transfer like a bill of exchange.',
        'hard', 'Negotiable Instruments', 'Promissory Notes', 'accounting', 3
    ),
    (
        gen_random_uuid(), 'mcq',
        'Revenue is generally recognized when:',
        '["Cash is received", "Goods are delivered or services rendered", "Invoice is raised", "Order is received"]',
        'Goods are delivered or services rendered',
        'According to the revenue recognition principle, revenue is recognized when it is earned and realized or realizable, which typically occurs when goods are delivered or services are rendered to customers.',
        'medium', 'Revenue Recognition', 'Accrual Basis', 'accounting', 2
    ),
    -- ===== ASSURANCE & IS QUESTIONS =====
    (
        gen_random_uuid(), 'mcq',
        'What is the primary objective of an audit?',
        '["To detect fraud", "To express opinion on financial statements", "To prevent errors", "To calculate tax liability"]',
        'To express opinion on financial statements',
        'The primary objective of a statutory audit is to enable the auditor to express an opinion on whether the financial statements give a true and fair view (or present fairly in all material respects).',
        'easy', 'Audit Objectives', 'Primary Objective', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which type of audit evidence is considered the weakest?',
        '["Physical examination", "Documentation", "Inquiry", "Observation"]',
        'Inquiry',
        'Inquiry involves seeking information from management and personnel. It is considered the weakest form of audit evidence because it is not independent and can be biased or influenced by the person providing the information.',
        'medium', 'Audit Evidence', 'Evidence Hierarchy', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'What does inherent risk assess?',
        '["Risk of misstatement due to control failure", "Risk of misstatement due to error alone", "Risk that auditor fails to detect misstatement", "Risk of business failure"]',
        'Risk of misstatement due to error alone',
        'Inherent risk is the susceptibility of an assertion to a misstatement that could be material, assuming there are no related controls. It considers factors like complexity, judgment required, and nature of transactions.',
        'medium', 'Audit Risk', 'Inherent Risk', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which sampling method gives each item an equal chance of selection?',
        '["Judgment sampling", "Haphazard sampling", "Random sampling", "Block sampling"]',
        'Random sampling',
        'Random sampling (statistical sampling) ensures that each item in the population has an equal chance of being selected, which helps reduce selection bias and allows statistical inference.',
        'medium', 'Audit Sampling', 'Sampling Methods', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Analytical procedures are used primarily:',
        '["At the final review stage only", "Throughout the audit", "Only during substantive testing", "During planning only"]',
        'Throughout the audit',
        'Analytical procedures are used at all stages of the audit: during planning (risk assessment), substantive testing, and final review. They involve comparison of financial and non-financial data to identify unusual relationships.',
        'medium', 'Analytical Procedures', 'Audit Process', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which of the following is a test of controls?',
        '["Confirming receivables", "Tracing transactions to source documents", "Reviewing approval for write-offs", "Verifying valuation of inventory"]',
        'Reviewing approval for write-offs',
        'Tests of controls are designed to evaluate the operating effectiveness of controls in preventing or detecting material misstatements. Reviewing approval for write-offs tests whether the control procedure of authorization is working.',
        'medium', 'Audit Procedures', 'Tests of Controls', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'What is the purpose of an internal control questionnaire?',
        '["To prepare financial statements", "To document understanding of controls", "To calculate ratios", "To test mathematical accuracy"]',
        'To document understanding of controls',
        'An Internal Control Questionnaire (ICQ) is a structured tool used by auditors to document their understanding and evaluation of a client''s internal control system in a comprehensive manner.',
        'medium', 'Internal Controls', 'Documentation', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Audit engagement letter is signed by:',
        '["Auditor only", "Client only", "Both auditor and client", "Company directors only"]',
        'Both auditor and client',
        'The engagement letter should be signed by both the auditor (or audit firm) and the client (usually management or those charged with governance) to confirm acceptance of the terms of engagement.',
        'easy', 'Audit Engagement', 'Engagement Letter', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'What is meant by materiality in auditing?',
        '["Importance of an item to management", "Omissions or misstatements that influence economic decisions", "Size of the company", "Number of transactions"]',
        'Omissions or misstatements that influence economic decisions',
        'Materiality refers to the magnitude of omissions or misstatements that, individually or in aggregate, would reasonably influence the economic decisions of users of financial statements. It is a key concept in audit planning.',
        'medium', 'Audit Concepts', 'Materiality', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which IS audit approach examines systems in a sequential manner?',
        '["Post-transaction approach", "Base-case system evaluation", "Auditing around the computer", "Auditing through the computer"]',
        'Auditing through the computer',
        'Auditing through the computer involves examining the actual processing of data through the computer system, looking at inputs, processing, and outputs in sequence to evaluate controls.',
        'hard', 'IS Audit', 'Audit Approaches', 'assurance', 3
    ),
    (
        gen_random_uuid(), 'mcq',
        'What is the purpose of a compliance test?',
        '["To detect material misstatements", "To verify controls are operating effectively", "To confirm account balances", "To value assets"]',
        'To verify controls are operating effectively',
        'Compliance tests are performed to obtain audit evidence that controls are operating as designed (effectiveness) and have been applied consistently throughout the period under audit.',
        'medium', 'Audit Procedures', 'Compliance Testing', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which document provides written evidence of the auditor''s understanding of the client?',
        '["Audit report", "Engagement letter", "Management representation letter", "Audit planning memorandum"]',
        'Audit planning memorandum',
        'The audit planning memorandum documents the auditor''s overall audit strategy, including understanding of the entity, risk assessment results, and planned audit procedures.',
        'medium', 'Audit Planning', 'Documentation', 'assurance', 2
    ),
    (
        gen_random_uuid(), 'short-answer',
        'What are the components of audit risk? Explain briefly.',
        NULL,
        'Audit Risk = Inherent Risk × Control Risk × Detection Risk\n\n1. Inherent Risk: The susceptibility of an assertion to misstatement before considering controls. Higher for complex transactions or estimates.\n\n2. Control Risk: The risk that controls will not prevent or detect misstatements. Depends on the effectiveness of internal controls.\n\n3. Detection Risk: The risk that audit procedures will not detect a misstatement. Controlled by auditor through nature, timing, and extent of procedures.',
        'Audit risk is the risk that the auditor expresses an inappropriate audit opinion when the financial statements are materially misstated. Understanding components helps in planning effective audit procedures.',
        'medium', 'Audit Risk', 'Components', 'assurance', 4
    ),
    (
        gen_random_uuid(), 'short-answer',
        'List and explain the stages of an audit process.',
        NULL,
        '1. Client Acceptance/Renewal: Assess integrity of client and ability to serve\n2. Planning: Understand business, assess risks, develop audit strategy\n3. Internal Control Evaluation: Understand and test controls\n4. Substantive Testing: Collect evidence on assertions (completeness, accuracy, valuation)\n5. Completion/Review: Final analytical procedures, subsequent events, management representations\n6. Audit Report: Issue opinion on financial statements',
        'The audit process follows a structured approach from accepting an engagement to issuing an audit report. Each stage has specific objectives and procedures designed to gather sufficient appropriate audit evidence.',
        'medium', 'Audit Process', 'Stages', 'assurance', 4
    ),
    (
        gen_random_uuid(), 'numerical',
        'An auditor plans to test 200 invoices out of a population of 10,000. Using monetary unit sampling at a confidence level of 95% with an expected error rate of 2%, calculate the sample size if the reliability factor is 3.0.',
        NULL,
        '60',
        'Sample Size = Reliability Factor / (Expected Error Rate × Assurance Factor)\nOr using standard formula:\nSample Size = (Population Value × Confidence Factor) / Tolerable Error\nAssuming standard parameters, the sample size works out to approximately 60 invoices.\n\nNote: Actual calculation depends on specific monetary unit sampling tables used.',
        'hard', 'Audit Sampling', 'Sample Size Determination', 'assurance', 5
    ),
    -- ===== BUSINESS & FINANCE QUESTIONS =====
    (
        gen_random_uuid(), 'mcq',
        'Which of the following is NOT a function of financial management?',
        '["Raising funds", "Investment decisions", "Dividend decisions", "Marketing decisions"]',
        'Marketing decisions',
        'The three main functions of financial management are: Financing decisions (raising funds), Investment decisions (allocation of funds), and Dividend decisions (profit distribution). Marketing is a separate business function.',
        'easy', 'Financial Management', 'Functions', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'The primary objective of financial management is to:',
        '["Maximize profits", "Maximize shareholder wealth", "Minimize tax liability", "Maximize market share"]',
        'Maximize shareholder wealth',
        'The primary objective of financial management is to maximize shareholder wealth, measured by the market value of shares (stock price). This considers risk, timing of returns, and long-term value creation.',
        'medium', 'Financial Management', 'Objectives', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'What does the Price-Earnings (P/E) ratio measure?',
        '["Earnings yield", "Market expectation of future performance", "Dividend payout", "Book value"]',
        'Market expectation of future performance',
        'The P/E ratio indicates how much investors are willing to pay per rupee of current earnings. A higher P/E suggests higher market expectations of future growth and profitability.',
        'medium', 'Financial Ratios', 'Market Ratios', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which source of finance has a fixed maturity date?',
        '["Equity shares", "Debentures", "Retained earnings", "Preference shares"]',
        'Debentures',
        'Debentures are debt instruments with a fixed maturity date when the principal amount is repaid. Unlike equity, debentures represent loans with specific repayment terms and interest obligations.',
        'easy', 'Sources of Finance', 'Debt Finance', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Working capital refers to:',
        '["Total assets minus fixed assets", "Current assets minus current liabilities", "Long-term assets", "Share capital"]',
        'Current assets minus current liabilities',
        'Working capital (also called net working capital) equals current assets minus current liabilities. It represents the liquid funds available for day-to-day operations of the business.',
        'easy', 'Working Capital', 'Definition', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'A company''s beta coefficient of 1.5 indicates:',
        '["Lower risk than market", "Same risk as market", "Higher risk than market", "No systematic risk"]',
        'Higher risk than market',
        'Beta measures systematic risk relative to the market. A beta of 1.5 means the stock is 50% more volatile than the market. When market moves 1%, this stock moves 1.5%.',
        'medium', 'Risk and Return', 'Beta Coefficient', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which capital budgeting technique uses discounted cash flows?',
        '["Payback period", "Accounting rate of return", "Net Present Value (NPV)", "Profitability index"]',
        'Net Present Value (NPV)',
        'NPV uses discounted cash flows to evaluate investment projects. It calculates the present value of all cash inflows and outflows at the required rate of return. A positive NPV indicates a viable project.',
        'medium', 'Capital Budgeting', 'DCF Techniques', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'The cost of equity is generally higher than the cost of debt because:',
        '["Equity has voting rights", "Equity holders bear higher risk", "Interest is tax-deductible", "Debentures have collateral"]',
        'Equity holders bear higher risk',
        'Equity shareholders bear the residual risk of the business and have the last claim on assets. Therefore, they require a higher return (cost of equity) compared to debt holders who have fixed returns and priority claims.',
        'medium', 'Cost of Capital', 'Cost of Equity', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which dividend policy maintains a constant dividend per share?',
        '["Zero dividend policy", "Constant dividend policy", "Residual dividend policy", "Constant payout ratio policy"]',
        'Constant dividend policy',
        'Under a constant dividend policy, the company pays a fixed dividend per share regardless of earnings fluctuations. This provides stability but may require borrowing if earnings decline.',
        'medium', 'Dividend Policy', 'Types', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Leverage that arises from fixed operating costs is called:',
        '["Financial leverage", "Operating leverage", "Combined leverage", "Capital leverage"]',
        'Operating leverage',
        'Operating leverage arises from fixed operating costs (like depreciation, rent). It measures how changes in sales affect operating income (EBIT). High operating leverage means higher fixed costs and higher risk.',
        'medium', 'Leverage', 'Types of Leverage', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'numerical',
        'Calculate the Net Present Value of a project with initial investment of NPR 100,000, annual cash inflows of NPR 35,000 for 4 years, and discount rate of 10%. (PV factor for 4 years at 10% = 3.170)',
        NULL,
        '10950',
        'NPV = Present Value of Cash Inflows - Initial Investment\nPV of Cash Inflows = 35,000 × 3.170 = 110,950\nNPV = 110,950 - 100,000 = NPR 10,950\n\nSince NPV is positive, the project should be accepted.',
        'medium', 'Capital Budgeting', 'NPV Calculation', 'business-finance', 4
    ),
    (
        gen_random_uuid(), 'numerical',
        'A company has earnings per share (EPS) of NPR 8, and the market price per share is NPR 80. Calculate the P/E ratio.',
        NULL,
        '10',
        'P/E Ratio = Market Price per Share / Earnings per Share\nP/E Ratio = 80 / 8 = 10 times\n\nThis means investors are willing to pay NPR 10 for every NPR 1 of earnings.',
        'easy', 'Financial Ratios', 'P/E Ratio', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'numerical',
        'A company has sales of NPR 500,000, variable costs of NPR 300,000, and fixed costs of NPR 100,000. Calculate the Degree of Operating Leverage (DOL).',
        NULL,
        '2',
        'Contribution Margin = Sales - Variable Costs = 500,000 - 300,000 = 200,000\nOperating Income (EBIT) = Contribution Margin - Fixed Costs = 200,000 - 100,000 = 100,000\n\nDOL = Contribution Margin / Operating Income\nDOL = 200,000 / 100,000 = 2 times\n\nThis means a 1% change in sales will result in a 2% change in EBIT.',
        'medium', 'Leverage', 'Operating Leverage', 'business-finance', 3
    ),
    (
        gen_random_uuid(), 'mcq',
        'What is the primary market also known as?',
        '["Stock exchange", "Secondary market", "New issue market", "Over-the-counter market"]',
        'New issue market',
        'The primary market is where new securities are issued and sold for the first time. It is also called the new issue market. Companies raise fresh capital through IPOs and rights issues here.',
        'easy', 'Financial Markets', 'Primary Market', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Under the Capital Asset Pricing Model (CAPM), expected return is calculated as:',
        '["Risk-free rate + Beta × Market risk premium", "Risk-free rate + Beta / Market risk premium", "Market return - Risk-free rate", "Beta × Market return"]',
        'Risk-free rate + Beta × Market risk premium',
        'CAPM Formula: E(R) = Rf + β(Rm - Rf)\nWhere:\n- Rf = Risk-free rate\n- β = Beta (systematic risk)\n- Rm = Market return\n- (Rm - Rf) = Market risk premium',
        'medium', 'Risk and Return', 'CAPM', 'business-finance', 2
    ),
    (
        gen_random_uuid(), 'short-answer',
        'Explain the differences between operating leverage and financial leverage.',
        NULL,
        'Operating Leverage:\n- Arises from fixed operating costs (depreciation, rent)\n- Measures sensitivity of EBIT to changes in sales\n- Relates to asset structure of the company\n- Formula: DOL = Contribution Margin / EBIT\n\nFinancial Leverage:\n- Arises from fixed financing costs (interest on debt)\n- Measures sensitivity of EPS to changes in EBIT\n- Relates to capital structure of the company\n- Formula: DFL = EBIT / EBT\n\nKey Difference: Operating leverage affects operating risk (business risk), while financial leverage affects financial risk (risk borne by equity holders).',
        'medium', 'Leverage', 'Comparison', 'business-finance', 4
    ),
    (
        gen_random_uuid(), 'short-answer',
        'What are the factors influencing the choice of capital structure?',
        NULL,
        '1. Business Risk: Higher business risk requires lower financial leverage\n2. Tax Position: Interest is tax-deductible, making debt attractive\n3. Flexibility: Need to maintain borrowing capacity\n4. Growth Rate: Fast-growing firms may need more debt\n5. Profitability: Highly profitable firms may use less debt\n6. Cash Flow Patterns: Stable cash flows can support more debt\n7. Market Conditions: Interest rates and credit availability\n8. Industry Norms: Peer comparison and industry practices',
        'Capital structure decisions involve balancing risk and return. The optimal capital structure minimizes the weighted average cost of capital (WACC) while maintaining financial flexibility and risk at acceptable levels.',
        'medium', 'Capital Structure', 'Factors', 'business-finance', 4
    ),
    -- ===== BUSINESS LAW QUESTIONS =====
    (
        gen_random_uuid(), 'mcq',
        'A company is incorporated under:',
        '["Special Resolution", "Memorandum of Association", "Articles of Association", "Statutory Declaration"]',
        'Memorandum of Association',
        'The Memorandum of Association is the charter of a company that defines its relationship with the outside world. It must be filed with the Registrar for incorporation and includes the company''s name, objects, liability, capital, and registered office.',
        'easy', 'Company Formation', 'Memorandum', 'law', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'The minimum number of members in a public company is:',
        '["2", "3", "7", "50"]',
        '7',
        'Under most company laws, a public company must have a minimum of 7 members (shareholders). A private company requires a minimum of 2 members.',
        'easy', 'Company Law', 'Minimum Members', 'law', 2
    ),
    (
        gen_random_uuid(), 'mcq',
        'Which of the following is NOT a doct

... [内容已截断，原长度 25044 字符]