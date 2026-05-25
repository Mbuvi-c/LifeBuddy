import { useNavigate } from 'react-router-dom'

const simulations = [
  { id: 'money_transactions',     title: 'Money & Transactions',         emoji: '💵', description: 'Coins, notes, change, and budgeting' },
  { id: 'time_planning',          title: 'Time & Planning',              emoji: '🕐', description: 'Clocks, schedules, and planning ahead' },
  { id: 'digital_safety',         title: 'Digital Safety',               emoji: '🛡️', description: 'Stay safe online and on your phone' },
  { id: 'mobile_money',           title: 'Mobile Money & M-Pesa',        emoji: '📱', description: 'Send money, pay bills, stay safe' },
  { id: 'communication_advocacy', title: 'Communication & Self-Advocacy', emoji: '🗣️', description: 'Speak up, ask for help, know your rights' },
  { id: 'financial_planning',     title: 'Financial Planning',           emoji: '📊', description: 'Budgets, saving, needs vs wants' },
  { id: 'community_safety',       title: 'Community & Personal Safety',  emoji: '🏥', description: 'Health, emergencies, and getting help' },
  { id: 'workplace_readiness',    title: 'Workplace Readiness',          emoji: '💼', description: 'Work schedules, instructions, payslips' },
]

function SimulationSelect() {
  const navigate = useNavigate()
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose a Skill</h1>
      <div style={styles.grid}>
        {simulations.map(sim => (
          <div
            key={sim.id}
            style={styles.card}
            onClick={() => navigate(`/game/${sim.id}`)}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#4fffb0')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e2330')}
          >
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
  container: { padding: '40px 20px', maxWidth: '960px', margin: '0 auto' },
  title:     { fontSize: '32px', fontWeight: '800', color: '#4fffb0', marginBottom: '32px', textAlign: 'center' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' },
  card:      { background: '#13161e', border: '1px solid #1e2330', borderRadius: '12px', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' },
  emoji:     { fontSize: '40px', marginBottom: '14px' },
  simTitle:  { fontSize: '16px', fontWeight: '700', color: '#e8eaf0', marginBottom: '8px' },
  simDesc:   { fontSize: '13px', color: '#5a6070', lineHeight: '1.5' },
  backBtn:   { display: 'block', margin: '0 auto', padding: '12px 32px', background: 'transparent', color: '#5a6070', border: '1px solid #1e2330', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
}

export default SimulationSelect