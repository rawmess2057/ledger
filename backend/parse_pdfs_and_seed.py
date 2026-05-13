import sqlite3, json, re, os, uuid
from pypdf import PdfReader

DB_PATH = 'ledger_dev.db'
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

DOCS_DIR = "../docs"

EXAM_CONFIG = [
    {
        "id": "membership-june-2019",
        "title": "CA Membership - June 2019",
        "level": "MEMBERSHIP",
        "file": "CA_Membership_Suggested_Answer_June2019.pdf",
        "subjects": ["Corporate Laws", "Advanced Taxation"],
        "duration": 180
    },
    {
        "id": "membership-september-2021",
        "title": "CA Membership - September 2021",
        "level": "MEMBERSHIP",
        "file": "Suggested_Answer_Membership_Exam_September_2021.pdf",
        "subjects": ["Corporate Laws", "Advanced Taxation"],
        "duration": 180
    },
    {
        "id": "membership-march-2023",
        "title": "CA Membership - March 2023",
        "level": "MEMBERSHIP",
        "file": "Suggested_Answer_-_Member_Examination_March_2023.pdf",
        "subjects": ["Corporate Laws", "Advanced Taxation"],
        "duration": 180
    },
    {
        "id": "membership-september-2024",
        "title": "CA Membership - September 2024",
        "level": "MEMBERSHIP",
        "file": "Suggested_Answer-Membership_Examination_September_2024.pdf",
        "subjects": ["Corporate Laws", "Advanced Taxation"],
        "duration": 180
    },
    {
        "id": "cap1-dec-2022",
        "title": "CAP-I - December 2022",
        "level": "CAP-I",
        "file": "Suggested_CAP_I_Dec_2022.pdf",
        "subjects": ["Accounting", "Business Law"],
        "duration": 180
    },
    {
        "id": "cap2-dec-2022",
        "title": "CAP-II - December 2022",
        "level": "CAP-II",
        "file": "Suggested_CAP_II_Dec_2022_CAP_II_Group_I.pdf",
        "subjects": ["Advanced Accounting", "Audit and Assurance", "Corporate and Other Laws"],
        "duration": 180
    },
    {
        "id": "cap2-june-2022",
        "title": "CAP-II - June 2022",
        "level": "CAP-II",
        "file": "1__CAP-II_SA_Group-I_June2022.pdf",
        "subjects": ["Advanced Accounting", "Audit and Assurance", "Corporate and Other Laws"],
        "duration": 180
    },
    {
        "id": "cap3-dec-2022",
        "title": "CAP-III - December 2022 Group I",
        "level": "CAP-III",
        "file": "Suggested_December_2022_CAP_III_Group_I.pdf",
        "subjects": ["Advanced Taxation", "Advanced Assurance", "Strategic Finance"],
        "duration": 180
    },
]

# Ensure mock_tests table exists
cur.execute('''CREATE TABLE IF NOT EXISTS mock_tests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    subject TEXT,
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER DEFAULT 0,
    question_ids TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)''')


def extract_text(filepath):
    reader = PdfReader(filepath)
    text = ""
    for p in reader.pages:
        text += p.extract_text() + "\n"
    return text


def parse_sections(text, subjects):
    """Split text into subject sections and extract question-answer pairs"""
    lines = text.split("\n")
    
    # Find subject boundaries
    sections = {}
    current_subject = None
    subject_lines = []
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            continue
        
        matched_subject = None
        for subj in subjects:
            # Match subject headers (short lines containing subject name)
            if subj.lower() in stripped.lower() and len(stripped) < 50:
                # Avoid matching inside long question text
                if len(stripped) < 50 and not stripped.endswith(":"):
                    matched_subject = subj
                    break
        
        if matched_subject and matched_subject != current_subject:
            if current_subject and subject_lines:
                sections[current_subject] = "\n".join(subject_lines)
            current_subject = matched_subject
            subject_lines = [stripped]
        elif current_subject:
            subject_lines.append(stripped)
    
    if current_subject and subject_lines:
        sections[current_subject] = "\n".join(subject_lines)
    
    return sections


def extract_qa_pairs(text, prefix):
    """Extract question-answer pairs from section text"""
    pairs = []
    lines = text.split("\n")
    
    current_q = None
    current_q_lines = []
    current_a_lines = []
    in_answer = False
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Detect question number
        q_match = re.match(r'^(\d+)\.(?:\s|$)', stripped)
        sub_q = re.match(r'^([a-z]\))\s', stripped)
        
        if q_match and not in_answer:
            if current_q:
                pairs.append({
                    "id": f"{prefix}_Q{current_q}",
                    "question": "\n".join(current_q_lines).strip(),
                    "answer": "\n".join(current_a_lines).strip()
                })
            current_q = q_match.group(1)
            current_q_lines = [stripped]
            current_a_lines = []
            in_answer = False
        elif sub_q and current_q and not in_answer:
            current_q_lines.append(stripped)
        elif stripped.startswith("Answer") or stripped.startswith("Suggested Answer"):
            in_answer = True
            if current_a_lines:
                current_a_lines.append(stripped)
        elif in_answer:
            # Check if a new question number starts (not continuation)
            next_q = re.match(r'^(\d+)\.', stripped)
            if next_q:
                if current_q:
                    pairs.append({
                        "id": f"{prefix}_Q{current_q}",
                        "question": "\n".join(current_q_lines).strip(),
                        "answer": "\n".join(current_a_lines).strip()
                    })
                current_q = next_q.group(1)
                current_q_lines = [stripped]
                current_a_lines = []
                in_answer = False
            else:
                current_a_lines.append(stripped)
        elif current_q:
            current_q_lines.append(stripped)
    
    if current_q:
        pairs.append({
            "id": f"{prefix}_Q{current_q}",
            "question": "\n".join(current_q_lines).strip(),
            "answer": "\n".join(current_a_lines).strip()
        })
    
    return pairs


def estimate_marks(question_text):
    """Extract marks from question text"""
    marks = 5
    m = re.search(r'\((\d+)\s*\)', question_text)
    if m:
        parts = re.findall(r'\d+', m.group(1))
        marks = sum(int(p) for p in parts)
    # Also try patterns like (10 marks) or (8+2+10)
    m2 = re.search(r'(\d+(?:\s*\+\s*\d+)*)\s*(?:marks?|Marks?)', question_text)
    if m2:
        parts = re.findall(r'\d+', m2.group(1))
        marks = sum(int(p) for p in parts)
    return marks


inserted_q = 0
for config in EXAM_CONFIG:
    filepath = os.path.join(DOCS_DIR, config["file"])
    if not os.path.exists(filepath):
        print(f"Skipping {config['id']}: file not found")
        continue
    
    print(f"\n=== {config['id']} ({config['file']}) ===")
    text = extract_text(filepath)
    print(f"  Extracted {len(text)} chars")
    
    sections = parse_sections(text, config["subjects"])
    print(f"  Found {len(sections)} subject sections: {list(sections.keys())}")
    
    for subject, section_text in sections.items():
        qa_pairs = extract_qa_pairs(section_text, config["id"])
        print(f"  {subject}: {len(qa_pairs)} QA pairs")
        
        total_marks = 0
        qids_list = []
        
        for qa in qa_pairs:
            marks = estimate_marks(qa["question"])
            qid = qa["id"]
            
            # Seed question
            cur.execute("SELECT id FROM questions WHERE id=?", (qid,))
            if not cur.fetchone():
                qtype = "case-study" if marks >= 10 else "short-answer"
                difficulty = "hard" if marks >= 10 else ("medium" if marks >= 5 else "easy")
                
                try:
                    cur.execute(
                        "INSERT INTO questions (id, type, question, correct_answer, explanation, difficulty, topic, subject, marks, exam) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (qid, qtype, qa["question"], qa["answer"], qa["answer"][:200] if qa["answer"] else "", difficulty, subject, subject, marks, config["id"])
                    )
                    inserted_q += 1
                except Exception as e:
                    print(f"    Error inserting {qid}: {e}")
            
            total_marks += marks
            qids_list.append(qid)
        
        # Create/update mock test
        if qids_list:
            sanitized = subject.lower().replace(" ", "-").replace("&", "and")
            mt_id = f"{config['id']}-{sanitized}"
            
            # Also find existing CAP2 CSV questions for this subject
            cur.execute("SELECT id, marks FROM questions WHERE exam='cap2-dec-2022' AND subject=? ORDER BY marks DESC", (subject,))
            for row in cur.fetchall():
                if row[0] not in qids_list and row[0] not in qids_list:
                    qids_list.append(row[0])
                    try:
                        total_marks += row[1]
                    except:
                        pass
            
            cur.execute("SELECT id FROM mock_tests WHERE id=?", (mt_id,))
            if not cur.fetchone():
                cur.execute(
                    "INSERT INTO mock_tests (id, title, level, subject, duration_minutes, total_marks, question_ids) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (mt_id, f"{config['title']} - {subject}", config["level"], subject, config["duration"], total_marks, json.dumps(qids_list))
                )
                print(f"  Created mock test: {mt_id} ({len(qids_list)} q, {total_marks} mks)")
            else:
                cur.execute("UPDATE mock_tests SET total_marks=?, question_ids=? WHERE id=?", (total_marks, json.dumps(qids_list), mt_id))
                print(f"  Updated mock test: {mt_id} ({len(qids_list)} q, {total_marks} mks)")

conn.commit()

print(f"\n{'='*60}")
print(f"Inserted {inserted_q} new questions")
cur.execute("SELECT COUNT(*) FROM questions")
print(f"Total questions: {cur.fetchone()[0]}")
cur.execute("SELECT COUNT(*) FROM mock_tests")
print(f"Total mock tests: {cur.fetchone()[0]}")
cur.execute("SELECT id, title, level, total_marks FROM mock_tests ORDER BY level")
for r in cur.fetchall():
    print(f"  {r[0]}: {r[1]} ({r[2]}, {r[3]} mks)")
conn.close()
