import psycopg2
import json
conn = psycopg2.connect(host='localhost', port=5432, dbname='lifebuddy', user='postgres', password='database123')
cur = conn.cursor()
cur.execute("SELECT skill, created_at FROM adaptation_logs WHERE learner_id = '8312fa0c-9b5f-46d6-94df-40552fc6cc7c' ORDER BY created_at DESC LIMIT 5")
rows = cur.fetchall()
for r in rows:
    print(r)
cur.close()
conn.close()
