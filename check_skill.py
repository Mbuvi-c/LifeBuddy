import psycopg2
import json
conn = psycopg2.connect(host='localhost', port=5432, dbname='lifebuddy', user='postgres', password='database123')
cur = conn.cursor()
cur.execute("SELECT current_skill FROM learners WHERE id = '8312fa0c-9b5f-46d6-94df-40552fc6cc7c'")
row = cur.fetchone()
print('current_skill:', row)
cur.close()
conn.close()
