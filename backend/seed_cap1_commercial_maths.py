import sqlite3, json, re, os, subprocess

DB_PATH = 'ledger_dev.db'
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

PDF_PATH = '/home/raw/Desktop/New Folder/ledger/public/doc/1573367563_CAP I_Paper 3B_MCQ.pdf'
TEMP_DIR = '/tmp/cap1_cms'

os.makedirs(TEMP_DIR, exist_ok=True)

answers_data = {
    1: 'a', 2: 'b', 3: 'b', 4: 'c', 5: 'd',
    6: 'a', 7: 'd', 8: 'c', 9: 'c', 10: 'b',
    11: 'c', 12: 'd', 13: 'c', 14: 'd', 15: 'c',
    16: 'a', 17: 'c', 18: 'c', 19: 'c', 20: 'a',
    21: 'a', 22: 'c', 23: 'c', 24: 'c', 25: 'd',
    26: 'd', 27: 'c', 28: 'c', 29: 'd', 30: 'b',
    31: 'a', 32: 'b', 33: 'd', 34: 'b', 35: 'c',
    36: 'd', 37: 'a', 38: 'b', 39: 'a', 40: 'b',
    41: 'a', 42: 'd', 43: 'c', 44: 'b', 45: 'c',
    46: 'a', 47: 'd', 48: 'd', 49: 'b', 50: 'c',
    51: 'c', 52: 'b', 53: 'd', 54: 'c', 55: 'b',
    56: 'a', 57: 'd', 58: 'a', 59: 'c', 60: 'b',
    61: 'd', 62: 'c', 63: 'b', 64: 'd', 65: 'a',
    66: 'd', 67: 'b', 68: 'b', 69: 'c', 70: 'a',
    71: 'd', 72: 'b', 73: 'b', 74: 'a', 75: 'd',
    76: 'b', 77: 'a', 78: 'c', 79: 'a', 80: 'b',
    81: 'b', 82: 'b', 83: 'c', 84: 'd', 85: 'a',
    86: 'b', 87: 'b', 88: 'a', 89: 'c', 90: 'b',
    91: 'a', 92: 'c', 93: 'b', 94: 'a', 95: 'a',
    96: 'b', 97: 'd', 98: 'c', 99: 'a', 100: 'a',
    101: 'c', 102: 'd', 103: 'c', 104: 'a', 105: 'a',
    106: 'c', 107: 'b', 108: 'c', 109: 'a', 110: 'c',
    111: 'd', 112: 'b', 113: 'b', 114: 'b', 115: 'b',
    116: 'a', 117: 'c', 118: 'c', 119: 'b', 120: 'b',
    121: 'c', 122: 'c', 123: 'a', 124: 'c', 125: 'b',
    126: 'c', 127: 'd', 128: 'b', 129: 'b', 130: 'a',
    131: 'b', 132: 'd', 133: 'c', 134: 'b', 135: 'a',
    136: 'b', 137: 'd', 138: 'c', 139: 'b', 140: 'd',
    141: 'b', 142: 'c', 143: 'a', 144: 'c', 145: 'c',
    146: 'c', 147: 'c', 148: 'c', 149: 'a', 150: 'a',
    151: 'c', 152: 'b', 153: 'b', 154: 'c', 155: 'c',
    156: 'd', 157: 'd', 158: 'b', 159: 'c', 160: 'b',
    161: 'c', 162: 'a', 163: 'd', 164: 'a', 165: 'a',
    166: 'c', 167: 'd', 168: 'b', 169: 'd', 170: 'd',
    171: 'c', 172: 'c', 173: 'c', 174: 'c', 175: 'b',
    176: 'a', 177: 'a', 178: 'c', 179: 'a', 180: 'b',
    181: 'd', 182: 'c', 183: 'b', 184: 'b', 185: 'b',
    186: 'd', 187: 'b', 188: 'c', 189: 'a', 190: 'b',
    191: 'd', 192: 'a', 193: 'b', 194: 'c', 195: 'b',
    196: 'c', 197: 'c', 198: 'b', 199: 'b', 200: 'b',
    201: 'c', 202: 'b', 203: 'c', 204: 'a', 205: 'c',
    206: 'a', 207: 'c', 208: 'b', 209: 'b', 210: 'b',
    211: 'c', 212: 'c', 213: 'b', 214: 'a', 215: 'a',
    216: 'd', 217: 'c', 218: 'a', 219: 'c', 220: 'c',
    221: 'c', 222: 'c', 223: 'a', 224: 'b', 225: 'a',
    226: 'c', 227: 'b', 228: 'c', 229: 'd', 230: 'c',
    231: 'd', 232: 'c', 233: 'b', 234: 'b', 235: 'c',
    236: 'a', 237: 'b', 238: 'b', 239: 'a', 240: 'c',
    241: 'b', 242: 'b', 243: 'd', 244: 'c', 245: 'a',
    246: 'a', 247: 'c', 248: 'b', 249: 'b', 250: 'a',
    251: 'b', 252: 'b', 253: 'c', 254: 'c', 255: 'c',
    256: 'a', 257: 'a', 258: 'c', 259: 'b', 260: 'a',
    261: 'a', 262: 'c', 263: 'b', 264: 'b', 265: 'a',
    266: 'c', 267: 'b', 268: 'd', 269: 'a', 270: 'c',
    271: 'd', 272: 'a', 273: 'b', 274: 'c', 275: 'c',
    276: 'c', 277: 'c', 278: 'c', 279: 'd', 280: 'c',
    281: 'b', 282: 'a', 283: 'b', 284: 'c', 285: 'd',
    286: 'a', 287: 'a', 288: 'b', 289: 'b', 290: 'c',
    291: 'a', 292: 'c', 293: 'b', 294: 'c', 295: 'c',
    296: 'c', 297: 'c', 298: 'c', 299: 'b', 300: 'a',
    301: 'c', 302: 'c', 303: 'a', 304: 'c', 305: 'b',
    306: 'c', 307: 'a', 308: 'a', 309: 'a', 310: 'c',
    311: 'c', 312: 'a', 313: 'a', 314: 'c', 315: 'a',
    316: 'c', 317: 'b', 318: 'a', 319: 'c', 320: 'b',
    321: 'c', 322: 'c', 323: 'b', 324: 'c', 325: 'a',
    326: 'c', 327: 'b', 328: 'd', 329: 'c', 330: 'b',
    331: 'c', 332: 'd', 333: 'b', 334: 'c', 335: 'b',
    336: 'c', 337: 'b', 338: 'c', 339: 'a', 340: 'c',
    341: 'c', 342: 'c', 343: 'b', 344: 'b', 345: 'c',
    346: 'c', 347: 'b', 348: 'a', 349: 'b', 350: 'c',
    351: 'c', 352: 'b', 353: 'b', 354: 'c', 355: 'c',
    356: 'c', 357: 'b', 358: 'c', 359: 'b', 360: 'c',
    361: 'b', 362: 'a', 363: 'b', 364: 'c', 365: 'b',
    366: 'a', 367: 'c', 368: 'b', 369: 'd', 370: 'a',
    371: 'c', 372: 'c', 373: 'b', 374: 'd', 375: 'c',
    376: 'a', 377: 'c', 378: 'a', 379: 'b', 380: 'b',
    381: 'd', 382: 'a', 383: 'd', 384: 'b', 385: 'b',
    386: 'a', 387: 'd', 388: 'b', 389: 'a', 390: 'a',
    391: 'c', 392: 'a', 393: 'b', 394: 'd', 395: 'a',
    396: 'c', 397: 'a', 398: 'b', 399: 'a', 400: 'b',
}

chapter_ranges = [
    (1, 31, "Basic Arithmetic and Algebra"),
    (32, 80, "Percentage and their applications in Business"),
    (81, 127, "Permutations and combinations"),
    (128, 155, "Progressions"),
    (156, 175, "Sources of data, presentation and use"),
    (176, 235, "Measures of Central tendency"),
    (236, 295, "Measures of Dispersion, skewness and kurtosis"),
    (296, 335, "Regression and correlation methods"),
    (336, 365, "Time series analysis"),
    (366, 385, "Index Numbers"),
    (386, 398, "Sampling methods"),
    (399, 400, "Probability"),
]

def extract_questions():
    result = subprocess.run(['pdftotext', '-layout', PDF_PATH, '-'], capture_output=True, text=True)
    lines = result.stdout.split('\n')
    
    questions = []
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Match "1.    Question text" pattern
        m = re.match(r'^(\d+)\.\s+(.+)$', line)
        if m and int(m.group(1)) <= 400:
            q_num = int(m.group(1))
            q_text = m.group(2).strip()
            
            # Collect rest of question text until we hit options
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                if re.match(r'^[a-d]\)', next_line, re.IGNORECASE):
                    break
                if next_line:
                    q_text += ' ' + next_line
                j += 1
            
            # Now collect options
            options = []
            opt_start = j
            
            for opt_idx in range(4):
                found_opt = False
                for k in range(opt_start, min(opt_start + 3, len(lines))):
                    opt_line = lines[k].strip()
                    
                    opt_char = chr(ord('a') + opt_idx)
                    if re.match(rf'^{opt_char}\)\s*(.+)$', opt_line, re.IGNORECASE):
                        match = re.match(rf'^{opt_char}\)\s*(.+)$', opt_line, re.IGNORECASE)
                        options.append(match.group(1).strip())
                        opt_start = k + 1
                        found_opt = True
                        break
                
                if not found_opt and opt_start < len(lines):
                    # Try to get option from next non-empty line
                    opt_start += 1
            
            if len(options) >= 4:
                questions.append({
                    'number': q_num,
                    'question': q_text.strip()[:500],
                    'options': options[:4]
                })
                i = opt_start
                continue
        
        i += 1
    
    return questions

print("Starting CAP-I Commercial Mathematics and Statistics MCQ seed...")

questions = extract_questions()
print(f"Extracted {len(questions)} questions")

# Assign chapters
for q in questions:
    for start, end, chapter in chapter_ranges:
        if start <= q['number'] <= end:
            q['chapter'] = chapter
            break

# Count by chapter
chapter_counts = {}
for q in questions:
    ch = q.get('chapter', 'Unknown')
    chapter_counts[ch] = chapter_counts.get(ch, 0) + 1

for ch, cnt in sorted(chapter_counts.items()):
    print(f"  {ch}: {cnt}")

# Insert into database
stmt = """INSERT OR REPLACE INTO questions
          (id, type, question, options, correct_answer, explanation, difficulty, topic, subtopic, subject, marks, exam)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""

cur.execute("DELETE FROM questions WHERE subject='cap-i' AND exam='cap1-commercial-maths-2019'")

inserted = 0
for q in questions:
    chapter = q.get('chapter', 'General')
    chapter_slug = chapter.lower().replace(' ', '-').replace('&', 'and').replace(',', '')
    qid = f"cap1-cms-{chapter_slug}-{q['number']}"
    
    correct_ans = answers_data.get(q['number'], 'a')
    correct_idx = ord(correct_ans) - ord('a')
    correct_text = q['options'][correct_idx] if correct_idx < len(q['options']) else q['options'][0]
    
    try:
        cur.execute(stmt, (
            qid, 'mcq', q['question'], json.dumps(q['options']), correct_text,
            f"Commercial Mathematics and Statistics - {chapter} - Q{q['number']}", 'medium', chapter, None,
            'cap-i', 1, 'cap1-commercial-maths-2019'
        ))
        inserted += 1
    except Exception as e:
        print(f"Error: {q['number']} - {e}")

conn.commit()

cur.execute("SELECT COUNT(*) FROM questions WHERE subject='cap-i' AND exam='cap1-commercial-maths-2019'")
print(f"\nInserted: {inserted}")
print(f"Total: {cur.fetchone()[0]}")

conn.close()
print("\nDone!")