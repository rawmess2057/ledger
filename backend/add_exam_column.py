import sqlite3

DB_PATH = 'ledger_dev.db'
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Add exam column to questions table
try:
    cur.execute('ALTER TABLE questions ADD COLUMN exam TEXT')
    print("Added exam column")
except Exception as e:
    print(f"Column might already exist: {e}")

# Tag CA Membership questions with exam
# The questions we added earlier are from June 2019
# Let's tag questions with subject 'Corporate Laws' or 'Advanced Taxation' as 'june-2019'
cur.execute("UPDATE questions SET exam = 'june-2019' WHERE subject IN ('Corporate Laws', 'Advanced Taxation')")

conn.commit()
print(f"Updated {cur.rowcount} questions with exam tag")

# Verify
cur.execute("SELECT exam, COUNT(*) FROM questions GROUP BY exam")
for row in cur.fetchall():
    print(f"  {row[0]}: {row[1]} questions")

conn.close()