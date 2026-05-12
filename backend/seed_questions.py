import re
import uuid
import sqlite3

DB_PATH = 'ledger_dev.db'

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

with open('../docker/seed.sql', 'r') as f:
    lines = f.readlines()

# Collect non-comment lines, joining multi-line strings
sql_lines = []
in_string = False
for line in lines:
    stripped = line.strip()
    if stripped.startswith('--'):
        continue
    if not in_string:
        # Start of a string?
        if "'" in stripped:
            # Determine if we're entering a string that spans multiple lines
            # Count quotes: even = start and end same line, odd = spans
            count = stripped.count("'")
            if count % 2 == 1:
                in_string = not in_string
    else:
        # Inside a multi-line string - look for closing quote
        if "'" in line:
            count = line.count("'")
            if count % 2 == 1:
                in_string = not in_string

    sql_lines.append(line.rstrip('\n'))

content = '\n'.join(sql_lines)

# Replace gen_random_uuid with real UUIDs
content = re.sub(r'gen_random_uuid\(\)', lambda _: "'" + str(uuid.uuid4()) + "'", content)

# Find questions INSERT block - look for the specific header
header_pat = r'INSERT INTO questions \(id, type, question, options, correct_answer, explanation, difficulty, topic, subtopic, subject, marks\)'
match = re.search(header_pat, content)
if not match:
    print("Could not find questions INSERT header!")
    conn.close()
    exit()

start_pos = match.start()
vals_pos = content.find('VALUES', start_pos) + 7
vals_text = content[vals_pos:].strip().rstrip(';').strip()

# Parse tuples: find () pairs at depth 0
tuples = []
depth = 0
buf = []
i = 0
while i < len(vals_text):
    c = vals_text[i]
    if c == "'":
        buf.append(c)
        i += 1
        while i < len(vals_text):
            c2 = vals_text[i]
            buf.append(c2)
            if c2 == "'":
                i += 1
                if i < len(vals_text) and vals_text[i] == "'":
                    buf.append("'")
                    i += 1
                else:
                    break
            else:
                i += 1
        continue
    if c == '(' and depth == 0:
        buf = []
        depth = 1
        i += 1
        continue
    elif c == '(':
        depth += 1
        buf.append(c)
        i += 1
        continue
    elif c == ')' and depth > 0:
        depth -= 1
        buf.append(c)
        i += 1
        if depth == 0:
            tuples.append(''.join(buf).strip().rstrip(',').strip())
            buf = []
        continue
    elif c == ')' and depth == 0:
        # Trailing close paren
        i += 1
        continue
    else:
        buf.append(c)
        i += 1

print(f"Found {len(tuples)} tuples")

cur.execute('DELETE FROM questions')

def parse_tuple(txt):
    """Split a tuple into individual field values"""
    fields = []
    cur_f = []
    in_str = False
    i = 0
    while i < len(txt):
        c = txt[i]
        if c == "'":
            in_str = not in_str
            cur_f.append(c)
            i += 1
            continue
        if in_str:
            cur_f.append(c)
            i += 1
            continue
        if c == ',':
            fields.append(''.join(cur_f).strip())
            cur_f = []
            i += 1
            continue
        cur_f.append(c)
        i += 1
    if cur_f:
        fields.append(''.join(cur_f).strip())
    return fields

def clean_val(v):
    v = v.strip()
    if v.upper() == 'NULL':
        return None
    if v.startswith("'") and v.endswith("'"):
        inner = v[1:-1]
        inner = inner.replace("''", "'")
        return inner
    return v

inserted = 0
for t in tuples:
    f = parse_tuple(t)
    if len(f) != 11:
        # Try to recover by looking for 11 NULL-separated chunks or something
        # Or just use the raw text and fix the field positions
        if len(f) > 11:
            # Some fields contain commas - join extras
            f = f[:10] + [', '.join(f[10:])]
        else:
            print(f"SKIP row: {len(f)} fields: {t[:80]}...")
            continue

    vals_clean = [clean_val(x) for x in f]
    try:
        vals_clean[10] = int(vals_clean[10])
    except:
        vals_clean[10] = 2

    stmt = """INSERT INTO questions (id, type, question, options, correct_answer, explanation, difficulty, topic, subtopic, subject, marks)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
    try:
        cur.execute(stmt, vals_clean)
        inserted += 1
    except Exception as e:
        print(f"ERR: {e} row: {t[:80]}...")
        break

conn.commit()
cur.execute('SELECT COUNT(*) FROM questions')
print(f"Inserted {inserted}, total: {cur.fetchone()[0]}")
for subj in ['accounting', 'assurance', 'business-finance', 'law', 'taxation']:
    cur.execute('SELECT COUNT(*) FROM questions WHERE subject = ?', (subj,))
    print(f"  {subj}: {cur.fetchone()[0]}")

conn.close()