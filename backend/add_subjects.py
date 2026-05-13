import sqlite3

DB_PATH = 'ledger_dev.db'
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Add new subjects
subjects = [
    ('corporate-laws', 'Corporate Laws', 1, 'from-amber-500 to-orange-500', 'file'),
    ('advanced-taxation', 'Advanced Taxation', 1, 'from-rose-500 to-pink-500', 'calculator'),
]

for s in subjects:
    try:
        cur.execute('INSERT OR IGNORE INTO subjects (id, name, papers, color, icon) VALUES (?, ?, ?, ?, ?)', s)
        print(f"Added subject: {s[1]}")
    except Exception as e:
        print(f"Error: {e}")

conn.commit()
conn.close()
print("Done")