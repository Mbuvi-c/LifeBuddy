import psycopg2
import json
conn = psycopg2.connect(host='localhost', port=5432, dbname='lifebuddy', user='postgres', password='database123')
cur = conn.cursor()
cur.execute("SELECT bkt_profile FROM learners WHERE id = '8312fa0c-9b5f-46d6-94df-40552fc6cc7c'")
row = cur.fetchone()
profile = row[0]
profile['money_transactions'] = {
    'mastery': 0.15,
    'attempts': 0,
    'consecutive_correct': 0
}
cur.execute(
    "UPDATE learners SET bkt_profile = %s WHERE id = '8312fa0c-9b5f-46d6-94df-40552fc6cc7c'",
    [json.dumps(profile)]
)
conn.commit()
cur.close()
conn.close()
print('Reset done')
