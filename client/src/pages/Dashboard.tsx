import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Caregiver Dashboard</h1>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← Home</button>
      </div>
      <div style={styles.placeholder}>
        <p style={styles.placeholderText}>Dashboard — Coming Soon</p>
        <p style={styles.sub}>Learner progress and session history will appear here</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '40px 20px', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#4fffb0' },
  backBtn: { padding: '8px 16px', background: 'transparent', color: '#5a6070', border: '1px solid #1e2330', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  placeholder: { background: '#13161e', border: '1px solid #1e2330', borderRadius: '12px', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: '24px', color: '#5a6070', marginBottom: '12px' },
  sub: { fontSize: '14px', color: '#2a3040' },
}

export default Dashboard