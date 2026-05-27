import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='lifebuddy', user='postgres', password='database123')
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'adaptation_logs'")
print(cur.fetchall())
cur.close()
conn.close()
