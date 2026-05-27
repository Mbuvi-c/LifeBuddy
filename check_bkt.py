import psycopg2
import json
conn = psycopg2.connect(host='localhost', port=5432, dbname='lifebuddy', user='postgres', password='database123')
cur = conn.cursor()
cur.execute("SELECT bkt_profile, current_difficulty_tier FROM learners WHERE id = '8312fa0c-9b5f-46d6-94df-40552fc6cc7c'")
row = cur.fetchone()
print(json.dumps(row[0], indent=2) if row else 'Not found')
cur.close()
conn.close()
