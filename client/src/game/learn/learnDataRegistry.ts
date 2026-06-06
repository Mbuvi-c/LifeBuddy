import { MONEY_LEARN_DATA } from './learnData_money'
import { TIME_LEARN_DATA } from './learnData_time'
import { DAILY_ROUTINE_LEARN_DATA } from './learnData_routine'

const REGISTRY: Record<string, Record<string, any>> = {
  money_transactions: MONEY_LEARN_DATA,
  time_planning: TIME_LEARN_DATA,
  daily_routine: DAILY_ROUTINE_LEARN_DATA,
}

export function getLearnData(skillId: string): Record<string, any> | undefined {
  return REGISTRY[skillId]
}
