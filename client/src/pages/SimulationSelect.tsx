import { useNavigate } from 'react-router-dom'

const simulations = [
  { id: 'time-management', title: 'Time Management', emoji: '⏰', description: 'Learn to manage time and schedules' },
  { id: 'object-sorting', title: 'Object Sorting', emoji: '📦', description: 'Sort objects into the right categories' },
  { id: 'daily-routine', title: 'Daily Routine', emoji: '📋', description: 'Practice daily living sequences' },
  { id: 'financial-transactions', title: 'Financial Transactions', emoji: '💰', description: 'Learn basic money skills' },
  { id: 'personal-hygiene', title: 'Personal Hygiene', emoji: '🧼', description: 'Practice personal care routines' },
]

function SimulationSelect() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose a Simulation</h1>
      <div style={styles.grid}>
        {simulations.map(sim => (
          <div key={sim.id} style={styles.card} onClick={() => navigate(`/game/${sim.id}`)}>
            <div style={styles.emoji}>{sim.emoji}</div>
            <h2 style={styles.simTitle}>{sim.title}</h2>
            <p style={styles.simDesc}>{sim.description}</p>
          </div>
        ))}
      </div>
      <button style={styles.backBtn} onClick={() => navigate('/')}>Back to Home</button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '40px 20px', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '32px', fontWeight: '800', color: '#4fffb0', marginBottom: '32px', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' },
  card: { background: '#13161e', border: '1px solid #1e2330', borderRadius: '12px', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' },
  emoji: { fontSize: '48px', marginBottom: '16px' },
  simTitle: { fontSize: '18px', fontWeight: '700', color: '#e8eaf0', marginBottom: '8px' },
  simDesc: { fontSize: '14px', color: '#5a6070', lineHeight: '1.5' },
  backBtn: { display: 'block', margin: '0 auto', padding: '12px 32px', background: 'transparent', color: '#5a6070', border: '1px solid #1e2330', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
}

export default SimulationSelect