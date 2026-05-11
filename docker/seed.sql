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
    );