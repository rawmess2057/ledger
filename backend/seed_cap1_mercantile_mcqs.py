import sqlite3, json, re, os, subprocess

DB_PATH = 'ledger_dev.db'
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

PDF_PATH = '/home/raw/Desktop/New Folder/ledger/public/doc/1573972756_Mercantile Laws MCQ.pdf'
TEMP_DIR = '/tmp/cap1_mcqs'

os.makedirs(TEMP_DIR, exist_ok=True)

CHAPTERS = [
    ("Preliminaries", 4, 9),
    ("Offer and Acceptance", 10, 18),
    ("Consideration", 19, 22),
    ("Capacity of Parties", 23, 26),
    ("Free Consent", 27, 32),
    ("Void and Other Contracts", 33, 40),
    ("Performance of Contracts", 41, 45),
    ("Breach of Contracts", 46, 49),
    ("Termination of Contracts", 50, 53),
    ("Special Contracts", 54, 54),
    ("Contract relating to Agency", 55, 58),
    ("Sale of Goods", 59, 61),
]

ANSWERS = {
    "Preliminaries": {1: 'a', 2: 'a', 3: 'c', 4: 'a', 5: 'b', 6: 'd', 7: 'd', 8: 'c', 9: 'b', 10: 'c', 11: 'b', 12: 'a', 13: 'd', 14: 'a', 15: 'b', 16: 'b', 17: 'a', 18: 'a', 19: 'b', 20: 'd', 21: 'c', 22: 'a', 23: 'a', 24: 'a', 25: 'c', 26: 'a', 27: 'c', 28: 'b', 29: 'a', 30: 'c', 31: 'a', 32: 'a', 33: 'a', 34: 'a', 35: 'd', 36: 'c', 37: 'c'},
    "Offer and Acceptance": {1: 'b', 2: 'a', 3: 'a', 4: 'd', 5: 'b', 6: 'b', 7: 'a', 8: 'a', 9: 'd', 10: 'c', 11: 'b', 12: 'c', 13: 'b', 14: 'd', 15: 'b', 16: 'd', 17: 'c', 18: 'b', 19: 'c', 20: 'a', 21: 'b', 22: 'c', 23: 'b', 24: 'c', 25: 'a', 26: 'd', 27: 'c', 28: 'b', 29: 'c', 30: 'c', 31: 'a', 32: 'b', 33: 'b', 34: 'c', 35: 'd', 36: 'c', 37: 'a', 38: 'b', 39: 'd', 40: 'd', 41: 'c', 42: 'c', 43: 'd', 44: 'c', 45: 'b', 46: 'd', 47: 'c', 48: 'c', 49: 'a', 50: 'a', 51: 'c', 52: 'b', 53: 'c', 54: 'c', 55: 'c', 56: 'b'},
    "Consideration": {1: 'c', 2: 'b', 3: 'a', 4: 'a', 5: 'b', 6: 'c', 7: 'b', 8: 'c', 9: 'c', 10: 'b', 11: 'a', 12: 'c', 13: 'b', 14: 'c', 15: 'a', 16: 'a', 17: 'd', 18: 'b', 19: 'a', 20: 'a', 21: 'c', 22: 'a', 23: 'c', 24: 'd'},
    "Capacity of Parties": {1: 'b', 2: 'c', 3: 'a', 4: 'b', 5: 'd', 6: 'c', 7: 'c', 8: 'a', 9: 'c', 10: 'd', 11: 'c', 12: 'a', 13: 'b', 14: 'b', 15: 'c', 16: 'd', 17: 'b', 18: 'c', 19: 'c', 20: 'c', 21: 'a'},
    "Free Consent": {1: 'b', 2: 'a', 3: 'a', 4: 'b', 5: 'b', 6: 'd', 7: 'c', 8: 'b', 9: 'd', 10: 'b', 11: 'c', 12: 'c', 13: 'c', 14: 'c', 15: 'a', 16: 'b', 17: 'a', 18: 'c', 19: 'd', 20: 'c', 21: 'b', 22: 'd', 23: 'a', 24: 'a', 25: 'c', 26: 'a', 27: 'a', 28: 'b', 29: 'd', 30: 'b', 31: 'a', 32: 'c', 33: 'a', 34: 'a'},
    "Void and Other Contracts": {1: 'c', 2: 'b', 3: 'c', 4: 'b', 5: 'd', 6: 'c', 7: 'c', 8: 'c', 9: 'c', 10: 'b', 11: 'a', 12: 'c', 13: 'd', 14: 'b', 15: 'c', 16: 'd', 17: 'c', 18: 'b', 19: 'c', 20: 'd', 21: 'b', 22: 'c', 23: 'c', 24: 'a', 25: 'd', 26: 'd', 27: 'b', 28: 'c', 29: 'd', 30: 'c', 31: 'b', 32: 'c', 33: 'b', 34: 'b', 35: 'c', 36: 'c', 37: 'd', 38: 'c', 39: 'a', 40: 'b'},
    "Performance of Contracts": {1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'b', 6: 'c', 7: 'c', 8: 'b', 9: 'c', 10: 'a', 11: 'd', 12: 'a', 13: 'b', 14: 'c', 15: 'c', 16: 'd', 17: 'd', 18: 'a', 19: 'c', 20: 'b', 21: 'c', 22: 'b'},
    "Breach of Contracts": {1: 'b', 2: 'b', 3: 'd', 4: 'c', 5: 'b', 6: 'b', 7: 'd', 8: 'c', 9: 'b', 10: 'a', 11: 'a', 12: 'd', 13: 'd', 14: 'b', 15: 'd', 16: 'b'},
    "Termination of Contracts": {1: 'c', 2: 'c', 3: 'c', 4: 'b', 5: 'a', 6: 'a', 7: 'd', 8: 'a', 9: 'a', 10: 'b', 11: 'd', 12: 'b', 13: 'd', 14: 'c', 15: 'b', 16: 'd', 17: 'd', 18: 'd', 19: 'a', 20: 'a', 21: 'a', 22: 'a', 23: 'b', 24: 'b'},
    "Special Contracts": {1: 'b', 2: 'd', 3: 'c', 4: 'b', 5: 'c', 6: 'b', 7: 'b', 8: 'c', 9: 'b', 10: 'a', 11: 'b', 12: 'd', 13: 'b'},
    "Contract relating to Agency": {1: 'a', 2: 'a', 3: 'c', 4: 'a', 5: 'a', 6: 'c', 7: 'a', 8: 'c', 9: 'b'},
    "Sale of Goods": {1: 'b', 2: 'c', 3: 'c', 4: 'a', 5: 'a', 6: 'a', 7: 'c', 8: 'd', 9: 'd', 10: 'd', 11: 'c', 12: 'b', 13: 'b'},
}

def parse_page_questions(text, chapter):
    questions = []
    lines = [l.strip() for l in text.split('\n') if l.strip()]

    i = 0
    while i < len(lines):
        line = lines[i]

        match = re.match(r'^(\d+)\.\s+(.+)$', line)
        if match:
            q_num = int(match.group(1))
            q_text = match.group(2).strip()

            options = []
            for j in range(i+1, min(i+10, len(lines))):
                opt_line = lines[j].strip()
                opt_match = re.match(r'^([a-d])\.\s+(.+)$', opt_line, re.IGNORECASE)
                if opt_match:
                    options.append(opt_match.group(2).strip())
                elif not opt_line or re.match(r'^\d+\.', opt_line):
                    break

            if len(options) >= 4:
                correct_ans = ANSWERS.get(chapter, {}).get(q_num, 'a')
                correct_idx = ord(correct_ans) - ord('a')
                questions.append({
                    'number': q_num,
                    'question': q_text[:400],
                    'options': options[:4],
                    'correct': options[correct_idx] if correct_idx < len(options) else options[0]
                })

        i += 1

    return questions

print("Starting CAP-I Mercantile Laws MCQ seed...")

all_questions = []

for chapter, start_page, end_page in CHAPTERS:
    chapter_qs = []

    for page_num in range(start_page, end_page + 1):
        txt_file = os.path.join(TEMP_DIR, f'page_{page_num}.txt')
        subprocess.run(['pdftotext', '-f', str(page_num), '-l', str(page_num), PDF_PATH, txt_file], capture_output=True)

        if os.path.exists(txt_file):
            with open(txt_file, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()

            if text[:50].upper().find('CONTENTS') >= 0 or text[:30].upper().find('ANSWER') >= 0:
                continue

            parsed = parse_page_questions(text, chapter)
            for q in parsed:
                q['chapter'] = chapter
            chapter_qs.extend(parsed)

    print(f"{chapter}: {len(chapter_qs)} questions")
    all_questions.extend(chapter_qs)

print(f"\nTotal: {len(all_questions)} questions")

stmt = """INSERT OR REPLACE INTO questions
          (id, type, question, options, correct_answer, explanation, difficulty, topic, subtopic, subject, marks, exam)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""

inserted = 0
for q in all_questions:
    chapter_slug = q['chapter'].lower().replace(' ', '-').replace('&', 'and')
    qid = f"cap1-ml-{chapter_slug}-{q['number']}"

    try:
        cur.execute(stmt, (
            qid, 'mcq', q['question'], json.dumps(q['options']), q['correct'],
            f"Mercantile Laws - {q['chapter']} - Q{q['number']}", 'easy', q['chapter'], None,
            'cap-i', 1, 'cap1-mercantile-laws-2019'
        ))
        inserted += 1
    except Exception as e:
        print(f"Error inserting {qid}: {e}")

conn.commit()

cur.execute("SELECT COUNT(*) FROM questions WHERE subject='cap-i'")
print(f"\nInserted: {inserted}")
print(f"Total CAP-I: {cur.fetchone()[0]}")

for chapter, _, _ in CHAPTERS:
    cur.execute("SELECT COUNT(*) FROM questions WHERE subject='cap-i' AND topic=?", (chapter,))
    c = cur.fetchone()[0]
    if c:
        print(f"  {chapter}: {c}")

conn.close()

import shutil
shutil.rmtree(TEMP_DIR, ignore_errors=True)
print("\nDone!")