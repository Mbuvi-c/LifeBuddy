import psycopg2
conn = psycopg2.connect(host='localhost', port=5432, dbname='lifebuddy', user='postgres', password='database123')
cur = conn.cursor()
cur.execute("UPDATE learner_profiles SET current_skill = 'money_transactions' WHERE current_skill = 'daily_routine'")
cur.execute("UPDATE learner_profiles SET current_skill = 'money_transactions' WHERE current_skill NOT IN ('money_transactions','time_planning','digital_safety','mobile_money','communication_advocacy','financial_planning','community_safety','workplace_readiness')")
conn.commit()
cur.close()
conn.close()
print('Done')
