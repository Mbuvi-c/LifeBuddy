import { useParams, useNavigate } from 'react-router-dom'

function Game() {
  const { simulationType } = useParams()
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/simulations')}>← Back</button>
        <h1 style={styles.title}>{simulationType?.replace(/-/g, ' ').toUpperCase()}</h1>
      </div>
      <div style={styles.canvas}>
        <p style={styles.placeholder}>Game Canvas — Coming Soon</p>
        <p style={styles.sub}>Phaser.js simulation will load here</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
  backBtn: { padding: '8px 16px', background: 'transparent', color: '#5a6070', border: '1px solid #1e2330', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  title: { fontSize: '24px', fontWeight: '700', color: '#4fffb0', textTransform: 'capitalize' },
  canvas: { background: '#13161e', border: '1px solid #1e2330', borderRadius: '12px', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: '24px', color: '#5a6070', marginBottom: '12px' },
  sub: { fontSize: '14px', color: '#2a3040' },
}

export default Game