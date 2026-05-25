import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ScenePlayer from '../game/scenes/ScenePlayer'
import { SKILL_SCENES } from '../game/scenes/sceneData'
import SimulationEngine from '../game/engine/SimulationEngine'

// Hardcoded for now — will come from auth/session later
const LEARNER_ID = '8312fa0c-9b5f-46d6-94df-40552fc6cc7c'

function Game() {
  const { simulationType } = useParams()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'scenes' | 'simulation'>('scenes')

  const skillId = simulationType ?? 'money_transactions'
  const scenes  = SKILL_SCENES[skillId] ?? SKILL_SCENES['money_transactions']

  if (phase === 'scenes') {
    return (
      <ScenePlayer
        skillId={skillId}
        scenes={scenes}
        onComplete={() => setPhase('simulation')}
      />
    )
  }

  return (
    <SimulationEngine
      skillId={skillId}
      learnerId={LEARNER_ID}
      onComplete={() => navigate('/simulations')}
      onHome={() => navigate('/simulations')}
    />
  )
}

export default Game