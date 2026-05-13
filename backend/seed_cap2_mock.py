import sqlite3
import uuid
import csv

DB_PATH = 'ledger_dev.db'
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

CSV_PATH = '../docs/CAP2_DEC2022_QUESTIONS_DATASET.csv'

TYPE_MAP = {
    "Comprehensive": "case-study",
    "Problem-solving": "case-study",
    "Calculation": "numerical",
    "Financial Analysis": "case-study",
    "Concept-based": "short-answer",
    "Analysis": "short-answer",
    "Professional Opinion": "short-answer",
    "Regulatory Analysis": "short-answer",
    "Regulatory Guidance": "short-answer",
    "Short notes": "short-answer",
    "Journal entries": "journal-entry",
    "Legal Analysis": "short-answer",
    "Distinction": "short-answer",
    "International organization": "short-answer",
}

DIFF_MAP = {
    "Hard": "hard",
    "Medium": "medium",
    "Easy": "easy"
}

SUBJECT_MAP = {
    "Advanced Accounting": "Advanced Accounting",
    "Audit and Assurance": "Audit and Assurance",
    "Corporate and Other Laws": "Corporate and Other Laws"
}

stmt = """INSERT OR IGNORE INTO questions (id, type, question, correct_answer, explanation, difficulty, topic, subtopic, subject, marks, exam)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""


def map_type(ct):
    return TYPE_MAP.get(ct, "short-answer")


def map_diff(d):
    return DIFF_MAP.get(d.strip(), "medium")


inserted = 0
with open(CSV_PATH, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        qid = row['question_id']
        if not qid or not qid.strip():
            continue
        qid = qid.strip()
        question_text = row['question_text']
        if not question_text or not question_text.strip():
            continue
        question_text = question_text.strip()

        qtype = map_type(row['question_type'].strip() if row['question_type'] else "")
        difficulty = map_diff(row['difficulty_level'].strip() if row['difficulty_level'] else "Medium")
        subject = row['paper_name'].strip() if row['paper_name'] else ""
        topic = row['topic_1'].strip() if row['topic_1'] else "General"
        subtopic = row['topic_2'].strip() if row.get('topic_2') and row['topic_2'].strip() else None
        marks = int(row['marks'].strip()) if row['marks'] else 5
        requirements = row['requirements'].strip() if row.get('requirements') and row['requirements'].strip() else ""
        key_points = row['key_points'].strip() if row.get('key_points') and row['key_points'].strip() else ""

        # Build full question with requirements
        full_question = question_text
        if requirements:
            full_question += "\n\nRequirements:\n" + requirements

        # Check if already exists
        cur.execute("SELECT id FROM questions WHERE id=?", (qid,))
        if cur.fetchone():
            continue

        vals = (
            qid,
            qtype,
            full_question,
            key_points,
            key_points,
            difficulty,
            topic,
            subtopic,
            subject,
            marks,
            "cap2-dec-2022"
        )
        try:
            cur.execute(stmt, vals)
            inserted += 1
        except Exception as e:
            print(f"Error inserting {qid}: {e}")

conn.commit()

# Tag existing CAP questions
cur.execute("UPDATE questions SET exam = 'cap2-dec-2022' WHERE exam IS NULL AND subject IN ('Advanced Accounting', 'Audit and Assurance', 'Corporate and Other Laws') AND exam IS NOT 'cap2-dec-2022'")

# Create the mock test
papers = [
    ("CAP II - Advanced Accounting (Dec 2022)", "Advanced Accounting", 60, 60),
    ("CAP II - Audit and Assurance (Dec 2022)", "Audit and Assurance", 60, 60),
    ("CAP II - Corporate and Other Laws (Dec 2022)", "Corporate and Other Laws", 60, 60),
]

import json
try:
    cur.execute('''CREATE TABLE IF NOT EXISTS mock_tests (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        level TEXT NOT NULL,
        subject TEXT,
        duration_minutes INTEGER NOT NULL,
        total_marks INTEGER NOT NULL,
        question_ids TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    print("Created mock_tests table")
except:
    pass

for title, subject, dur, _ in papers:
    cur.execute("SELECT id, marks FROM questions WHERE subject=? AND exam='cap2-dec-2022' ORDER BY marks DESC", (subject,))
    rows = cur.fetchall()
    qids = [r[0] for r in rows]
    qmarks = sum(r[1] for r in rows)
    if qids:
        mt_id = f"cap2-{subject.lower().replace(' ','-').replace('&','and')}-dec2022"
        cur.execute("SELECT id FROM mock_tests WHERE id=?", (mt_id,))
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO mock_tests (id, title, level, subject, duration_minutes, total_marks, question_ids) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (mt_id, title, "CAP-II", subject, dur, qmarks, json.dumps(qids))
            )
        else:
            # Update marks and question_ids
            cur.execute(
                "UPDATE mock_tests SET total_marks=?, question_ids=? WHERE id=?",
                (qmarks, json.dumps(qids), mt_id)
            )

conn.commit()

conn.commit()

cur.execute("SELECT COUNT(*) FROM questions WHERE exam='cap2-dec-2022'")
total = cur.fetchone()[0]
print(f"Inserted {inserted} new questions, total CAP-II questions: {total}")

cur.execute("SELECT id, title, total_marks FROM mock_tests")
for r in cur.fetchall():
    print(f"  Mock Test: {r[0]} - {r[1]} ({r[2]} marks)")

conn.close()
