import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>LifeBuddy</h1>
        <p style={styles.subtitle}>Adaptive Learning for Neurodiverse Individuals</p>
        <div style={styles.buttons}>
          <button style={styles.primaryBtn} onClick={() => navigate('/simulations')}>
            Start Learning
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/dashboard')}>
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' },
  card: { background: '#13161e', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '480px', width: '100%', border: '1px solid #1e2330' },
  title: { fontSize: '48px', fontWeight: '800', color: '#4fffb0', marginBottom: '12px' },
  subtitle: { fontSize: '16px', color: '#5a6070', marginBottom: '40px', lineHeight: '1.5' },
  buttons: { display: 'flex', flexDirection: 'column', gap: '16px' },
  primaryBtn: { padding: '16px', background: '#4fffb0', color: '#0d2e1e', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: '700', cursor: 'pointer' },
  secondaryBtn: { padding: '16px', background: 'transparent', color: '#4fffb0', border: '2px solid #4fffb0', borderRadius: '8px', fontSize: '18px', fontWeight: '700', cursor: 'pointer' },
}

export default Home