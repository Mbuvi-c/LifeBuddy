import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='lifebuddy', user='postgres', password='database123')
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
print(cur.fetchall())
cur.close()
conn.close()
