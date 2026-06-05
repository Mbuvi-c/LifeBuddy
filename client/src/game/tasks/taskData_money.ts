// taskData_money.ts
// Money & Transactions — 63 tasks
// 3 Tiers × 3 Difficulties × 7 Tasks = 63
// Types: tap_select, true_false, fill_blank, drag_drop, scenario_choice, sequential_steps

// taskData_money.ts
// Money & Transactions — 63 tasks

export type Task = {
  id: string
  skill: string
  tier: 1 | 2 | 3
  difficulty: 'easy' | 'intermediate' | 'advanced'
  type: 'tap_select' | 'scenario_choice' | 'true_false' | 'fill_blank' | 'sequential_steps' | 'drag_drop'
  topic: string
  question: string
  context?: string
  options?: { id: string; label: string; correct: boolean }[]
  steps?: { id: string; label: string; order: number }[]
  dragItems?: { id: string; label: string; targetZone: string }[]
  dropZones?: { id: string; label: string }[]
  hint: string
  explanation: string
  image?: string
}



export const MONEY_TRANSACTIONS_TASKS: Task[] = [

  // =========================================================================
  // TIER 1 — FOUNDATION
  // Goal: Recognition — identify the correct answer when shown options
  // =========================================================================

  // ── Tier 1 / Easy ─────────────────────────────────────────────────────────

  {
    id: 'mt_t1_easy_1',
    skill: 'money_transactions', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'identifying coins',
    question: 'Which coin is worth KES 20?',
    context: 'Three coins are shown. Tap the one worth KES 20.',
    options: [
      { id: 'a', label: 'KES 5 — small silver coin', correct: false },
      { id: 'b', label: 'KES 20 — large gold coin', correct: true },
      { id: 'c', label: 'KES 1 — very small coin', correct: false },
    ],
    hint: 'The KES 20 coin is gold coloured and larger than the others.',
    explanation: 'The KES 20 coin is gold coloured and the largest of the small coins. Learning to tell coins apart by size and colour is essential.',
    image: 'coin_kes20.png',
  },
  {
    id: 'mt_t1_easy_2',
    skill: 'money_transactions', tier: 1, difficulty: 'easy',
    type: 'true_false', topic: 'identifying notes',
    question: 'A KES 100 note is worth more than a KES 50 note.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Which number is bigger — 100 or 50?',
    explanation: 'KES 100 is worth more than KES 50. Higher numbers always mean more value in Kenyan currency.',
  },
  {
    id: 'mt_t1_easy_3',
    skill: 'money_transactions', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'identifying coins',
    question: 'Which of these is the smallest coin in Kenya?',
    options: [
      { id: 'a', label: 'KES 50', correct: false },
      { id: 'b', label: 'KES 10', correct: false },
      { id: 'c', label: 'KES 1', correct: true },
      { id: 'd', label: 'KES 20', correct: false },
    ],
    hint: 'The smallest coin has the smallest value.',
    explanation: 'KES 1 is the smallest coin in Kenya. It is very small and silver coloured.',
    image: 'coins_size_comparison.png',
  },
  {
    id: 'mt_t1_easy_4',
    skill: 'money_transactions', tier: 1, difficulty: 'easy',
    type: 'true_false', topic: 'identifying notes',
    question: 'Kenya has a KES 1,000 note.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Think about the highest value note you have seen.',
    explanation: 'Kenya has notes of KES 50, 100, 200, 500, and 1,000. The KES 1,000 note is the highest value note.',
  },
  {
    id: 'mt_t1_easy_5',
    skill: 'money_transactions', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'KES notes',
    question: 'Which is the highest value note in Kenya?',
    options: [
      { id: 'a', label: 'KES 500', correct: false },
      { id: 'b', label: 'KES 200', correct: false },
      { id: 'c', label: 'KES 1,000', correct: true },
      { id: 'd', label: 'KES 100', correct: false },
    ],
    hint: 'The biggest number is the highest value.',
    explanation: 'KES 1,000 is the highest value note in Kenya. It is brown and used for large purchases.',
  },
  {
    id: 'mt_t1_easy_6',
    skill: 'money_transactions', tier: 1, difficulty: 'easy',
    type: 'true_false', topic: 'identifying coins',
    question: 'Kenya has a coin worth KES 40.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Think about the less common coins in Kenya — there is one worth KES 40.',
    explanation: 'Kenya has coins worth KES 1, 5, 10, 20, and 40. The KES 40 coin is less commonly used but is legal tender.',
    image: 'coin_kes40.png',
  },
  {
    id: 'mt_t1_easy_7',
    skill: 'money_transactions', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'identifying notes',
    question: 'You have a green note. Which note is it most likely to be?',
    options: [
      { id: 'a', label: 'KES 50', correct: false },
      { id: 'b', label: 'KES 500', correct: true },
      { id: 'c', label: 'KES 1,000', correct: false },
      { id: 'd', label: 'KES 200', correct: false },
    ],
    hint: 'Each Kenyan note has a unique colour. The green note is a high value one.',
    explanation: 'The KES 1,000 is brown, KES 500 note is green, KES 200 is blue , KES 100 is purple and KES 50 is reddish.',
    image: 'notes_colours.png',
  },

  // ── Tier 1 / Intermediate ─────────────────────────────────────────────────

  {
    id: 'mt_t1_int_1',
    skill: 'money_transactions', tier: 1, difficulty: 'intermediate',
    type: 'tap_select', topic: 'comparing values',
    question: 'A pencil costs KES 10. Which of these is enough to pay for it?',
    options: [
      { id: 'a', label: 'KES 5', correct: false },
      { id: 'b', label: 'KES 10', correct: true },
      { id: 'c', label: 'KES 1', correct: false },
      { id: 'd', label: 'KES 2', correct: false },
    ],
    hint: 'You need at least the same amount as the price.',
    explanation: 'KES 10 is exactly the price. You need at least KES 10 to buy the pencil.',
  },
  {
    id: 'mt_t1_int_2',
    skill: 'money_transactions', tier: 1, difficulty: 'intermediate',
    type: 'drag_drop', topic: 'identifying notes',
    question: 'Sort these notes into the correct value groups.',
    context: 'Drag each note to the correct group — Small (KES 50–100) or Large (KES 500–1000).',
    dragItems: [
      { id: 'n1', label: 'KES 50 note',    targetZone: 'small' },
      { id: 'n2', label: 'KES 1,000 note', targetZone: 'large' },
      { id: 'n3', label: 'KES 100 note',   targetZone: 'small' },
      { id: 'n4', label: 'KES 500 note',   targetZone: 'large' },
    ],
    dropZones: [
      { id: 'small', label: 'Small value (KES 50–100)' },
      { id: 'large', label: 'Large value (KES 500–1000)' },
    ],
    hint: 'KES 50 and 100 are smaller notes. KES 500 and 1,000 are larger notes.',
    explanation: 'KES 50 and 100 are used for everyday purchases. KES 500 and 1,000 are for bigger transactions.',
    image: 'notes_small_large.png',
  },
  {
    id: 'mt_t1_int_3',
    skill: 'money_transactions', tier: 1, difficulty: 'intermediate',
    type: 'true_false', topic: 'comparing values',
    question: 'Two KES 50 notes are worth the same as one KES 100 note.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Add the two KES 50 notes: 50 + 50 = ?',
    explanation: '50 + 50 = 100. Two KES 50 notes equal one KES 100 note.',
  },
  {
    id: 'mt_t1_int_4',
    skill: 'money_transactions', tier: 1, difficulty: 'intermediate',
    type: 'tap_select', topic: 'comparing values',
    question: 'Which combination of coins makes exactly KES 30?',
    options: [
      { id: 'a', label: 'One KES 20 coin and one KES 5 coin', correct: false },
      { id: 'b', label: 'One KES 20 coin and one KES 10 coin', correct: true },
      { id: 'c', label: 'Three KES 5 coins', correct: false },
      { id: 'd', label: 'Two KES 10 coins', correct: false },
    ],
    hint: 'Add each combination to see which equals 30.',
    explanation: 'KES 20 + KES 10 = KES 30. The other options give KES 25, KES 15, and KES 20.',
  },
  {
    id: 'mt_t1_int_5',
    skill: 'money_transactions', tier: 1, difficulty: 'intermediate',
    type: 'fill_blank', topic: 'comparing values',
    question: 'You have two KES 20 coins and one KES 10 coin. You have KES ___ in total.',
    options: [
      { id: 'a', label: 'KES 40', correct: false },
      { id: 'b', label: 'KES 50', correct: true },
      { id: 'c', label: 'KES 30', correct: false },
    ],
    hint: 'Add: 20 + 20 + 10 = ?',
    explanation: '20 + 20 + 10 = KES 50. Always add your coins together to know your total.',
  },
  {
    id: 'mt_t1_int_6',
    skill: 'money_transactions', tier: 1, difficulty: 'intermediate',
    type: 'true_false', topic: 'comparing values',
    question: 'KES 500 is worth more than KES 200.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Compare the numbers: which is bigger, 500 or 200?',
    explanation: '500 is greater than 200. The KES 500 note buys more than the KES 200 note.',
  },
  {
    id: 'mt_t1_int_7',
    skill: 'money_transactions', tier: 1, difficulty: 'intermediate',
    type: 'tap_select', topic: 'KES notes',
    question: 'Which note would you use to buy something costing KES 80 if you only have one note?',
    options: [
      { id: 'a', label: 'KES 50 note', correct: false },
      { id: 'b', label: 'KES 100 note', correct: true },
      { id: 'c', label: 'KES 20 note', correct: false },
    ],
    hint: 'You need a note worth more than KES 80.',
    explanation: 'KES 100 is the smallest note worth more than KES 80. KES 50 is not enough. You would receive KES 20 change.',
  },

  // ── Tier 1 / Advanced ─────────────────────────────────────────────────────

  {
    id: 'mt_t1_adv_1',
    skill: 'money_transactions', tier: 1, difficulty: 'advanced',
    type: 'tap_select', topic: 'comparing values',
    question: 'You have a KES 50 note. A loaf of bread costs KES 55. Can you buy it?',
    options: [
      { id: 'a', label: 'Yes — KES 50 is enough', correct: false },
      { id: 'b', label: 'No — KES 50 is less than KES 55', correct: true },
      { id: 'c', label: 'Yes — give the note and get change', correct: false },
      { id: 'd', label: 'Yes — the shopkeeper will accept it', correct: false },
    ],
    hint: 'Is KES 50 more or less than KES 55?',
    explanation: 'KES 50 is less than KES 55. You are KES 5 short and cannot buy the bread without more money.',
  },
  {
    id: 'mt_t1_adv_2',
    skill: 'money_transactions', tier: 1, difficulty: 'advanced',
    type: 'true_false', topic: 'identifying coins',
    question: 'Three KES 20 coins can pay for something costing KES 50.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Add three KES 20 coins: 20 + 20 + 20 = ?',
    explanation: '3 × KES 20 = KES 60. KES 60 is more than KES 50, so yes — you can pay and receive KES 10 change.',
  },
  {
    id: 'mt_t1_adv_3',
    skill: 'money_transactions', tier: 1, difficulty: 'advanced',
    type: 'tap_select', topic: 'comparing values',
    question: 'Which is the best way to pay exactly KES 45?',
    options: [
      { id: 'a', label: 'Two KES 20 coins and one KES 5 coin', correct: true },
      { id: 'b', label: 'One KES 50 coin', correct: false },
      { id: 'c', label: 'Four KES 10 coins', correct: false },
      { id: 'd', label: 'One KES 20 and one KES 10', correct: false },
    ],
    hint: 'Which combination adds up to exactly 45?',
    explanation: '20 + 20 + 5 = 45. One KES 50 is too much. Four KES 10 = KES 40. One KES 20 + one KES 10 = KES 30.',
  },
  {
    id: 'mt_t1_adv_4',
    skill: 'money_transactions', tier: 1, difficulty: 'advanced',
    type: 'fill_blank', topic: 'comparing values',
    question: 'You have one KES 200 note, one KES 50 note, and two KES 10 coins. You have KES ___ in total.',
    options: [
      { id: 'a', label: 'KES 260', correct: false },
      { id: 'b', label: 'KES 270', correct: true },
      { id: 'c', label: 'KES 250', correct: false },
    ],
    hint: 'Add all amounts: 200 + 50 + 10 + 10 = ?',
    explanation: '200 + 50 + 10 + 10 = KES 270.',
  },
  {
    id: 'mt_t1_adv_5',
    skill: 'money_transactions', tier: 1, difficulty: 'advanced',
    type: 'true_false', topic: 'comparing values',
    question: 'You can make KES 100 using five KES 20 coins.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Multiply: 5 × 20 = ?',
    explanation: '5 × KES 20 = KES 100. This is correct.',
  },
  {
    id: 'mt_t1_adv_6',
    skill: 'money_transactions', tier: 1, difficulty: 'advanced',
    type: 'tap_select', topic: 'identifying notes',
    question: 'You need to pay KES 350. You only have KES 200 and KES 100 notes. What is the minimum number of notes you need?',
    options: [
      { id: 'a', label: '1 note', correct: false },
      { id: 'b', label: '2 notes', correct: false },
      { id: 'c', label: '3 notes', correct: true },
      { id: 'd', label: '5 notes', correct: false },
    ],
    hint: '200 + 100 = 300. You still need KES 50 more. You only have KES 100 notes left, so you overpay.',
    explanation: 'KES 200 + KES 100 = KES 300 — still KES 50 short. Adding another KES 100 gives KES 400. So you pay KES 400 with 3 notes and receive KES 50 change.',
  },
  {
    id: 'mt_t1_adv_7',
    skill: 'money_transactions', tier: 1, difficulty: 'advanced',
    type: 'drag_drop', topic: 'comparing values',
    question: 'Sort these amounts from smallest to largest by dragging them into order.',
    dragItems: [
      { id: 'v1', label: 'KES 50',    targetZone: 'pos1' },
      { id: 'v2', label: 'KES 500',   targetZone: 'pos4' },
      { id: 'v3', label: 'KES 200',   targetZone: 'pos3' },
      { id: 'v4', label: 'KES 100',   targetZone: 'pos2' },
      { id: 'v5', label: 'KES 1,000', targetZone: 'pos5' },
    ],
    dropZones: [
      { id: 'pos1', label: '1st — Smallest' },
      { id: 'pos2', label: '2nd' },
      { id: 'pos3', label: '3rd' },
      { id: 'pos4', label: '4th' },
      { id: 'pos5', label: '5th — Largest' },
    ],
    hint: 'Start with the smallest number and work up.',
    explanation: 'Correct order: KES 50 → KES 100 → KES 200 → KES 500 → KES 1,000.',
    image: 'notes_all_values.png',
  },

  // =========================================================================
  // TIER 2 — APPLICATION
  // Goal: Decision making — apply the skill in a real scenario
  // =========================================================================

  // ── Tier 2 / Easy ─────────────────────────────────────────────────────────

  {
    id: 'mt_t2_easy_1',
    skill: 'money_transactions', tier: 2, difficulty: 'easy',
    type: 'fill_blank', topic: 'calculating change',
    question: 'You buy a soda for KES 50. You give KES 100. Your change is KES ___.',
    options: [
      { id: 'a', label: 'KES 40', correct: false },
      { id: 'b', label: 'KES 50', correct: true },
      { id: 'c', label: 'KES 60', correct: false },
    ],
    hint: 'Change = Amount given − Price. 100 − 50 = ?',
    explanation: 'KES 100 − KES 50 = KES 50 change.',
  },
  {
    id: 'mt_t2_easy_2',
    skill: 'money_transactions', tier: 2, difficulty: 'easy',
    type: 'scenario_choice', topic: 'receiving change',
    question: 'You buy bread for KES 60 and give KES 100. The shopkeeper gives you KES 30 back. What should you do?',
    options: [
      { id: 'a', label: 'Say nothing — it is probably correct', correct: false },
      { id: 'b', label: 'Politely say: "Excuse me, I think my change is short by KES 10"', correct: true },
      { id: 'c', label: 'Shout at the shopkeeper', correct: false },
    ],
    hint: '100 − 60 = 40. You should have received KES 40, not KES 30.',
    explanation: 'You are entitled to correct change. Politely point out the mistake. Always calculate change before leaving.',
  },
  {
    id: 'mt_t2_easy_3',
    skill: 'money_transactions', tier: 2, difficulty: 'easy',
    type: 'fill_blank', topic: 'calculating change',
    question: 'A pen costs KES 20. You give KES 50. Your change is KES ___.',
    options: [
      { id: 'a', label: 'KES 20', correct: false },
      { id: 'b', label: 'KES 30', correct: true },
      { id: 'c', label: 'KES 40', correct: false },
    ],
    hint: '50 − 20 = ?',
    explanation: 'KES 50 − KES 20 = KES 30 change.',
  },
  {
    id: 'mt_t2_easy_4',
    skill: 'money_transactions', tier: 2, difficulty: 'easy',
    type: 'true_false', topic: 'receiving change',
    question: 'You should count your change before leaving the shop.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'What happens if you leave and the change was wrong?',
    explanation: 'Always count change at the counter. It is much harder to correct a mistake once you have left the shop.',
  },
  {
    id: 'mt_t2_easy_5',
    skill: 'money_transactions', tier: 2, difficulty: 'easy',
    type: 'tap_select', topic: 'paying for items',
    question: 'Milk costs KES 55. Which is the best note to use if you only have one note?',
    options: [
      { id: 'a', label: 'KES 50 note', correct: false },
      { id: 'b', label: 'KES 100 note', correct: true },
      { id: 'c', label: 'KES 500 note', correct: false },
    ],
    hint: 'Use the note closest to the price that is still enough.',
    explanation: 'KES 100 is the closest note above KES 55. Using KES 500 would work but gives unnecessary large change.',
  },
  {
    id: 'mt_t2_easy_6',
    skill: 'money_transactions', tier: 2, difficulty: 'easy',
    type: 'scenario_choice', topic: 'paying for items',
    question: 'You are at the duka. Sugar costs KES 120. You have a KES 200 note. How much change should you receive?',
    options: [
      { id: 'a', label: 'KES 70', correct: false },
      { id: 'b', label: 'KES 80', correct: true },
      { id: 'c', label: 'KES 90', correct: false },
      { id: 'd', label: 'KES 60', correct: false },
    ],
    hint: '200 − 120 = ?',
    explanation: 'KES 200 − KES 120 = KES 80 change.',
  },
  {
    id: 'mt_t2_easy_7',
    skill: 'money_transactions', tier: 2, difficulty: 'easy',
    type: 'true_false', topic: 'paying for items',
    question: 'If something costs KES 75 and you give KES 100, your change is KES 35.',
    options: [
      { id: 'true', label: 'True', correct: false },
      { id: 'false', label: 'False', correct: true },
    ],
    hint: '100 − 75 = ?',
    explanation: '100 − 75 = KES 25, not KES 35. Always calculate change carefully.',
  },

  // ── Tier 2 / Intermediate ─────────────────────────────────────────────────

  {
    id: 'mt_t2_int_1',
    skill: 'money_transactions', tier: 2, difficulty: 'intermediate',
    type: 'fill_blank', topic: 'calculating change',
    question: 'You buy milk for KES 75 and sugar for KES 120. You pay with KES 200. Your change is KES ___.',
    options: [
      { id: 'a', label: 'KES 5', correct: true },
      { id: 'b', label: 'KES 15', correct: false },
      { id: 'c', label: 'KES 25', correct: false },
    ],
    hint: 'First add prices: 75 + 120 = 195. Then subtract: 200 − 195 = ?',
    explanation: '75 + 120 = KES 195. 200 − 195 = KES 5 change.',
  },
  {
    id: 'mt_t2_int_2',
    skill: 'money_transactions', tier: 2, difficulty: 'intermediate',
    type: 'drag_drop', topic: 'making a shopping list',
    question: 'You have KES 300. Sort these items into what you can afford and what you cannot — buying all affordable items together.',
    context: 'Bread KES 50, Milk KES 70, Cooking oil KES 200, Biscuits KES 120, Sugar KES 130.',
    dragItems: [
      { id: 'i1', label: 'Bread KES 50',        targetZone: 'affordable' },
      { id: 'i2', label: 'Milk KES 70',          targetZone: 'affordable' },
      { id: 'i3', label: 'Cooking oil KES 200',  targetZone: 'affordable' },
      { id: 'i4', label: 'Biscuits KES 120',     targetZone: 'notaffordable' },
      { id: 'i5', label: 'Sugar KES 130',         targetZone: 'notaffordable' },
    ],
    dropZones: [
      { id: 'affordable',    label: 'I can afford this' },
      { id: 'notaffordable', label: 'Too expensive with my budget' },
    ],
    hint: 'Bread (50) + Milk (70) + Oil (200) = KES 320. Already over KES 300. Think about which items to prioritise.',
    explanation: 'Bread + Milk + Oil = KES 320 — over budget. A better combination: Bread (50) + Milk (70) + Biscuits (120) = KES 240 — within budget.',
  },
  {
    id: 'mt_t2_int_3',
    skill: 'money_transactions', tier: 2, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'receiving change',
    question: 'You buy three items: KES 30, KES 45, KES 25. You pay KES 200. The shopkeeper gives you KES 90 change. Is this correct?',
    options: [
      { id: 'a', label: 'Yes — KES 90 is correct', correct: false },
      { id: 'b', label: 'No — the correct change is KES 100', correct: true },
      { id: 'c', label: 'No — the correct change is KES 80', correct: false },
    ],
    hint: 'Add the items: 30 + 45 + 25 = ? Then subtract from 200.',
    explanation: '30 + 45 + 25 = KES 100. 200 − 100 = KES 100 change. The shopkeeper gave KES 10 too little.',
  },
  {
    id: 'mt_t2_int_4',
    skill: 'money_transactions', tier: 2, difficulty: 'intermediate',
    type: 'fill_blank', topic: 'calculating change',
    question: 'You buy airtime for KES 50 and a snack for KES 35. You pay KES 100. Your change is KES ___.',
    options: [
      { id: 'a', label: 'KES 10', correct: false },
      { id: 'b', label: 'KES 15', correct: true },
      { id: 'c', label: 'KES 20', correct: false },
    ],
    hint: '50 + 35 = 85. 100 − 85 = ?',
    explanation: '50 + 35 = KES 85. 100 − 85 = KES 15 change.',
  },
  {
    id: 'mt_t2_int_5',
    skill: 'money_transactions', tier: 2, difficulty: 'intermediate',
    type: 'true_false', topic: 'making a shopping list',
    question: 'If your shopping list totals KES 480 and you have KES 500, you have enough money.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Is KES 500 more than KES 480?',
    explanation: 'KES 500 is more than KES 480. You have enough and will receive KES 20 change.',
  },
  {
    id: 'mt_t2_int_6',
    skill: 'money_transactions', tier: 2, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'paying for items',
    question: 'You want to buy bread (KES 50), eggs (KES 90), and milk (KES 70). You have KES 200. Can you buy all three?',
    options: [
      { id: 'a', label: 'Yes — and you will have KES 10 left over', correct: false },
      { id: 'b', label: 'No — the total is KES 210 which is more than KES 200', correct: true },
      { id: 'c', label: 'Yes — exactly KES 200', correct: false },
    ],
    hint: 'Add: 50 + 90 + 70 = ?',
    explanation: '50 + 90 + 70 = KES 210. You are KES 10 short. You cannot buy all three with KES 200.',
  },
  {
    id: 'mt_t2_int_7',
    skill: 'money_transactions', tier: 2, difficulty: 'intermediate',
    type: 'sequential_steps', topic: 'receiving change',
    question: 'Put these steps in the correct order for checking your change is correct.',
    steps: [
      { id: 's1', label: 'Note the price of your item before paying',             order: 1 },
      { id: 's2', label: 'Decide how much money you will hand over',              order: 2 },
      { id: 's3', label: 'Calculate the change you expect in your head',          order: 3 },
      { id: 's4', label: 'Receive the change from the shopkeeper',                order: 4 },
      { id: 's5', label: 'Count the change and verify it matches your calculation', order: 5 },
    ],
    hint: 'Think about what happens before, during, and after you hand over your money.',
    explanation: 'Always know the price first, decide what to pay, calculate expected change, receive it, then verify. Do not leave until you have confirmed it is correct.',
  },

  // ── Tier 2 / Advanced ─────────────────────────────────────────────────────

  {
    id: 'mt_t2_adv_1',
    skill: 'money_transactions', tier: 2, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'budgeting',
    question: 'You have KES 500 for the week. You spend KES 180 on food, KES 90 on transport, and KES 150 on airtime. Is there enough left for an emergency expense of KES 100?',
    options: [
      { id: 'a', label: 'Yes — KES 180 left, more than enough', correct: false },
      { id: 'b', label: 'No — only KES 80 left, not enough for KES 100', correct: true },
      { id: 'c', label: 'Yes — exactly KES 100 left', correct: false },
    ],
    hint: 'Add spending: 180 + 90 + 150 = ? Then subtract from 500.',
    explanation: '180 + 90 + 150 = KES 420. 500 − 420 = KES 80 left. KES 80 < KES 100, so you cannot cover the emergency.',
  },
  {
    id: 'mt_t2_adv_2',
    skill: 'money_transactions', tier: 2, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'impulse buying',
    question: 'You are at the market with KES 400 to buy items totalling KES 350. You see nice biscuits for KES 80. What is the best decision?',
    options: [
      { id: 'a', label: 'Buy them — you still have KES 50 after your list', correct: false },
      { id: 'b', label: 'Do not buy them — 350 + 80 = KES 430, which is over your KES 400 budget', correct: true },
      { id: 'c', label: 'Buy them and skip one item from your list', correct: false },
      { id: 'd', label: 'Ask someone to lend you KES 30', correct: false },
    ],
    hint: 'Add your planned spending to the biscuit cost. Does it stay within KES 400?',
    explanation: 'KES 350 + KES 80 = KES 430. This exceeds KES 400 by KES 30. Stick to your list.',
  },
  {
    id: 'mt_t2_adv_3',
    skill: 'money_transactions', tier: 2, difficulty: 'advanced',
    type: 'fill_blank', topic: 'calculating change',
    question: 'You buy: rice KES 180, beans KES 90, tomatoes KES 40. You pay with KES 500. Your change is KES ___.',
    options: [
      { id: 'a', label: 'KES 180', correct: false },
      { id: 'b', label: 'KES 190', correct: true },
      { id: 'c', label: 'KES 200', correct: false },
    ],
    hint: 'Add the items: 180 + 90 + 40 = 310. Then subtract from 500.',
    explanation: '180 + 90 + 40 = KES 310. 500 − 310 = KES 190 change.',
  },
  {
    id: 'mt_t2_adv_4',
    skill: 'money_transactions', tier: 2, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'keeping money safe',
    question: 'You sell some items at the market and receive KES 2,500 in cash. What is the safest thing to do with the money immediately?',
    options: [
      { id: 'a', label: 'Count it loudly at the market stall so customers can see you are doing well', correct: false },
      { id: 'b', label: 'Put it directly into your bag or inner pocket without counting it publicly', correct: true },
      { id: 'c', label: 'Leave it on the table while you serve more customers', correct: false },
      { id: 'd', label: 'Give it to a friend to hold for you', correct: false },
    ],
    hint: 'Think about who might be watching when you handle large amounts of cash in public.',
    explanation: 'Count money privately and secure it immediately. Never display large amounts of cash in public — it attracts thieves.',
  },
  {
    id: 'mt_t2_adv_5',
    skill: 'money_transactions', tier: 2, difficulty: 'advanced',
    type: 'drag_drop', topic: 'making a shopping list',
    question: 'You have KES 600 for groceries. Drag items to your basket — stop when you reach or get closest to KES 600 without going over.',
    dragItems: [
      { id: 'g1', label: 'Unga 2kg — KES 180',    targetZone: 'basket' },
      { id: 'g2', label: 'Cooking oil — KES 200',  targetZone: 'basket' },
      { id: 'g3', label: 'Sugar 1kg — KES 130',    targetZone: 'basket' },
      { id: 'g4', label: 'Bread — KES 60',          targetZone: 'basket' },
      { id: 'g5', label: 'Eggs 6pcs — KES 90',     targetZone: 'leave' },
      { id: 'g6', label: 'Soda — KES 80',           targetZone: 'leave' },
    ],
    dropZones: [
      { id: 'basket', label: 'In my basket' },
      { id: 'leave',  label: 'Leave behind' },
    ],
    hint: 'Unga + Oil + Sugar + Bread = 180 + 200 + 130 + 60 = KES 570. Adding eggs (90) = KES 660 — over budget.',
    explanation: 'Unga (180) + Oil (200) + Sugar (130) + Bread (60) = KES 570 — within budget with KES 30 to spare. Adding eggs would go over to KES 660.',
    image: 'grocery_items.png',
  },
  {
    id: 'mt_t2_adv_6',
    skill: 'money_transactions', tier: 2, difficulty: 'advanced',
    type: 'true_false', topic: 'budgeting',
    question: 'If you spend KES 150 on Monday, KES 200 on Tuesday, and KES 180 on Wednesday, and your weekly budget is KES 600, you have overspent.',
    options: [
      { id: 'true', label: 'True', correct: false },
      { id: 'false', label: 'False', correct: true },
    ],
    hint: 'Add the spending: 150 + 200 + 180 = ? Compare to KES 600.',
    explanation: '150 + 200 + 180 = KES 530. KES 530 is less than KES 600. You have KES 70 remaining — you have not overspent.',
  },
  {
    id: 'mt_t2_adv_7',
    skill: 'money_transactions', tier: 2, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'receiving change',
    question: 'You buy four items totalling KES 385. You pay with a KES 500 note. The shopkeeper gives you two KES 50 notes as change. Is this correct?',
    options: [
      { id: 'a', label: 'Yes — two KES 50 notes is KES 100, which is correct', correct: false },
      { id: 'b', label: 'No — correct change is KES 115, not KES 100', correct: true },
      { id: 'c', label: 'Yes — KES 100 is close enough', correct: false },
    ],
    hint: '500 − 385 = ? Two KES 50 notes = KES 100. Is that right?',
    explanation: '500 − 385 = KES 115. Two KES 50 notes = KES 100. You are short by KES 15. Politely ask for the correct change.',
  },

  // =========================================================================
  // TIER 3 — INDEPENDENCE
  // Goal: Navigate a full real-world multi-step situation
  // =========================================================================

  // ── Tier 3 / Easy ─────────────────────────────────────────────────────────

  {
    id: 'mt_t3_easy_1',
    skill: 'money_transactions', tier: 3, difficulty: 'easy',
    type: 'sequential_steps', topic: 'paying for items',
    question: 'Put these steps in the correct order for buying something at a shop.',
    steps: [
      { id: 's1', label: 'Check the price of the item',            order: 1 },
      { id: 's2', label: 'Check that you have enough money',        order: 2 },
      { id: 's3', label: 'Hand the money to the shopkeeper',        order: 3 },
      { id: 's4', label: 'Calculate how much change you expect',    order: 4 },
      { id: 's5', label: 'Count your change before leaving',        order: 5 },
    ],
    hint: 'Think about what you do first when you arrive at a shop.',
    explanation: 'Check price → confirm you have enough → pay → calculate expected change → verify change received. Never leave before checking.',
  },
  {
    id: 'mt_t3_easy_2',
    skill: 'money_transactions', tier: 3, difficulty: 'easy',
    type: 'scenario_choice', topic: 'keeping money safe',
    question: 'You are at a crowded matatu stage and need to pay your fare of KES 50. What is the safest way?',
    context: 'You have KES 500 in your pocket.',
    options: [
      { id: 'a', label: 'Take out all your money and count it to find KES 50', correct: false },
      { id: 'b', label: 'Before leaving home, keep KES 50 separately so you only take out what you need', correct: true },
      { id: 'c', label: 'Ask someone nearby to hold your money while you board', correct: false },
    ],
    hint: 'Think about what draws attention to your money in a crowded place.',
    explanation: 'Preparing your fare in advance means you never show large amounts of cash in public. Never let a stranger hold your money.',
  },
  {
    id: 'mt_t3_easy_3',
    skill: 'money_transactions', tier: 3, difficulty: 'easy',
    type: 'scenario_choice', topic: 'receiving change',
    question: 'You buy a pen for KES 30 and give KES 100. The shopkeeper gives you KES 60. Before you leave, you count it. What do you notice?',
    options: [
      { id: 'a', label: 'KES 60 is correct — no problem', correct: false },
      { id: 'b', label: 'KES 60 is KES 10 too little — you should have KES 70', correct: true },
      { id: 'c', label: 'KES 60 is KES 10 too much — give some back', correct: false },
    ],
    hint: '100 − 30 = ? Compare to what you received.',
    explanation: '100 − 30 = KES 70. You received KES 60. You are short by KES 10. Politely ask for the correct change.',
  },
  {
    id: 'mt_t3_easy_4',
    skill: 'money_transactions', tier: 3, difficulty: 'easy',
    type: 'true_false', topic: 'paying for items',
    question: 'If you do not have the exact change, it is fine to give more money and receive change back.',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Think about how most purchases work in shops.',
    explanation: 'This is exactly how shopping works. You give a note bigger than the price and the shopkeeper gives you change for the difference.',
  },
  {
    id: 'mt_t3_easy_5',
    skill: 'money_transactions', tier: 3, difficulty: 'easy',
    type: 'tap_select', topic: 'making a shopping list',
    question: 'You have KES 150. You need bread (KES 50) and milk (KES 80). After buying both, how much do you have left?',
    options: [
      { id: 'a', label: 'KES 10', correct: false },
      { id: 'b', label: 'KES 20', correct: true },
      { id: 'c', label: 'KES 30', correct: false },
    ],
    hint: 'Add the items: 50 + 80 = 130. Then subtract from 150.',
    explanation: '50 + 80 = KES 130. 150 − 130 = KES 20 remaining.',
  },
  {
    id: 'mt_t3_easy_6',
    skill: 'money_transactions', tier: 3, difficulty: 'easy',
    type: 'scenario_choice', topic: 'impulse buying',
    question: 'You go to buy only bread (KES 50) with KES 100. At the counter you see sweets for KES 30. You buy them too. How much change do you get?',
    options: [
      { id: 'a', label: 'KES 50', correct: false },
      { id: 'b', label: 'KES 20', correct: true },
      { id: 'c', label: 'KES 30', correct: false },
    ],
    hint: 'Add both items: 50 + 30 = 80. Then subtract from 100.',
    explanation: '50 + 30 = KES 80. 100 − 80 = KES 20 change. The unplanned sweet cost you KES 30 from your budget.',
  },
  {
    id: 'mt_t3_easy_7',
    skill: 'money_transactions', tier: 3, difficulty: 'easy',
    type: 'fill_blank', topic: 'calculating change',
    question: 'You buy three items costing KES 20, KES 35, and KES 15. You pay KES 100. Your change is KES ___.',
    options: [
      { id: 'a', label: 'KES 20', correct: false },
      { id: 'b', label: 'KES 30', correct: true },
      { id: 'c', label: 'KES 40', correct: false },
    ],
    hint: '20 + 35 + 15 = 70. 100 − 70 = ?',
    explanation: '20 + 35 + 15 = KES 70. 100 − 70 = KES 30 change.',
  },

  // ── Tier 3 / Intermediate ─────────────────────────────────────────────────

  {
    id: 'mt_t3_int_1',
    skill: 'money_transactions', tier: 3, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'budgeting',
    question: 'Your aunt gives you KES 800 for the week. You need: school lunch KES 300, bus fare KES 200, airtime KES 100. You want to save KES 50. How much spending money do you have left?',
    options: [
      { id: 'a', label: 'KES 100', correct: false },
      { id: 'b', label: 'KES 150', correct: true },
      { id: 'c', label: 'KES 200', correct: false },
      { id: 'd', label: 'KES 50', correct: false },
    ],
    hint: 'Add all expenses including savings: 300 + 200 + 100 + 50 = ? Then subtract from 800.',
    explanation: '300 + 200 + 100 + 50 = KES 650. 800 − 650 = KES 150 left for other spending.',
  },
  {
    id: 'mt_t3_int_2',
    skill: 'money_transactions', tier: 3, difficulty: 'intermediate',
    type: 'drag_drop', topic: 'making a shopping list',
    question: 'You have KES 1,000 for the week. Sort each expense into Essential or Non-Essential.',
    dragItems: [
      { id: 'e1', label: 'Unga (flour) KES 180',     targetZone: 'essential' },
      { id: 'e2', label: 'Chapati at hotel KES 200',  targetZone: 'nonessential' },
      { id: 'e3', label: 'Bus fare KES 150',           targetZone: 'essential' },
      { id: 'e4', label: 'Mobile data KES 100',        targetZone: 'essential' },
      { id: 'e5', label: 'New phone case KES 350',     targetZone: 'nonessential' },
      { id: 'e6', label: 'Vegetables KES 120',         targetZone: 'essential' },
    ],
    dropZones: [
      { id: 'essential',    label: 'Essential — must buy' },
      { id: 'nonessential', label: 'Non-Essential — can wait' },
    ],
    hint: 'Essentials are things you need to survive and function. Non-essentials are wants.',
    explanation: 'Essentials: Unga (180) + Bus fare (150) + Data (100) + Vegetables (120) = KES 550. Non-essentials: Hotel chapati (200) + Phone case (350) = KES 550.',
    image: 'essential_nonessential.png',
  },
  {
    id: 'mt_t3_int_3',
    skill: 'money_transactions', tier: 3, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'receiving change',
    question: 'You buy groceries worth KES 645. You pay with a KES 500 note and a KES 200 note. How much change should you receive?',
    options: [
      { id: 'a', label: 'KES 45', correct: false },
      { id: 'b', label: 'KES 55', correct: true },
      { id: 'c', label: 'KES 65', correct: false },
    ],
    hint: '500 + 200 = 700. 700 − 645 = ?',
    explanation: 'KES 500 + KES 200 = KES 700 paid. KES 700 − KES 645 = KES 55 change.',
  },
  {
    id: 'mt_t3_int_4',
    skill: 'money_transactions', tier: 3, difficulty: 'intermediate',
    type: 'sequential_steps', topic: 'budgeting',
    question: 'Put these steps in the correct order for planning your weekly spending.',
    steps: [
      { id: 's1', label: 'Write down how much money you have for the week',     order: 1 },
      { id: 's2', label: 'List all your essential expenses',                     order: 2 },
      { id: 's3', label: 'Add up all essential expenses',                        order: 3 },
      { id: 's4', label: 'Subtract essentials from total — what is left?',       order: 4 },
      { id: 's5', label: 'Decide how much of the remainder to save',             order: 5 },
      { id: 's6', label: 'Use whatever is left after savings for wants',         order: 6 },
    ],
    hint: 'Start with knowing what you have. End with what you can enjoy guilt-free.',
    explanation: 'This is the correct budgeting order: Know your money → List essentials → Total essentials → Find remainder → Save first → Spend what is left.',
  },
  {
    id: 'mt_t3_int_5',
    skill: 'money_transactions', tier: 3, difficulty: 'intermediate',
    type: 'fill_blank', topic: 'budgeting',
    question: 'You have KES 1,200. You spend KES 400 on food, KES 150 on transport, and KES 200 on school materials. You have KES ___ left.',
    options: [
      { id: 'a', label: 'KES 350', correct: false },
      { id: 'b', label: 'KES 450', correct: true },
      { id: 'c', label: 'KES 550', correct: false },
    ],
    hint: '400 + 150 + 200 = ? Then subtract from 1,200.',
    explanation: '400 + 150 + 200 = KES 750. 1,200 − 750 = KES 450 remaining.',
  },
  {
    id: 'mt_t3_int_6',
    skill: 'money_transactions', tier: 3, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'impulse buying',
    question: 'You go shopping with exactly KES 500 for a list of items totalling KES 480. At the checkout you see a magazine for KES 50. What should you do?',
    options: [
      { id: 'a', label: 'Buy it — you are close enough and can borrow KES 30', correct: false },
      { id: 'b', label: 'Do not buy it — 480 + 50 = KES 530, which is KES 30 over your budget', correct: true },
      { id: 'c', label: 'Buy it and remove one item from your list', correct: false },
    ],
    hint: 'Add your list total to the magazine cost. Do you have enough?',
    explanation: '480 + 50 = KES 530. You only have KES 500. You cannot afford the magazine without going over budget.',
  },
  {
    id: 'mt_t3_int_7',
    skill: 'money_transactions', tier: 3, difficulty: 'intermediate',
    type: 'true_false', topic: 'budgeting',
    question: 'Saving money should only happen after you have bought everything you want.',
    options: [
      { id: 'true', label: 'True', correct: false },
      { id: 'false', label: 'False', correct: true },
    ],
    hint: 'Think about the correct order: essentials, savings, then wants.',
    explanation: 'Savings should come BEFORE wants — this is called paying yourself first. If you save after wants, there is usually nothing left to save.',
  },

  // ── Tier 3 / Advanced ─────────────────────────────────────────────────────

  {
    id: 'mt_t3_adv_1',
    skill: 'money_transactions', tier: 3, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'budgeting',
    question: 'You buy: rice KES 400, oil KES 350, sugar KES 200, milk KES 300, bread KES 150. The shopkeeper says your total is KES 1,500 and gives you KES 400 change from KES 2,000. Is everything correct?',
    options: [
      { id: 'a', label: 'Yes — everything is correct', correct: false },
      { id: 'b', label: 'No — the real total is KES 1,400 so change should be KES 600', correct: true },
      { id: 'c', label: 'No — total is right but change should be KES 500', correct: false },
      { id: 'd', label: 'Yes — trust the shopkeeper', correct: false },
    ],
    hint: 'Add the items yourself: 400 + 350 + 200 + 300 + 150 = ?',
    explanation: '400+350+200+300+150 = KES 1,400. The shopkeeper overcharged by KES 100. Correct change from KES 2,000 is KES 600.',
    image: 'shopkeeper_scenario.png',
  },
  {
    id: 'mt_t3_adv_2',
    skill: 'money_transactions', tier: 3, difficulty: 'advanced',
    type: 'sequential_steps', topic: 'budgeting',
    question: 'Your parent gives you KES 1,000 for the week. Put these financial steps in the correct order.',
    steps: [
      { id: 's1', label: 'Set aside bus fare for the whole week — KES 200',          order: 1 },
      { id: 's2', label: 'Set aside money for school lunch — KES 300',               order: 2 },
      { id: 's3', label: 'Save KES 100 before spending on anything else',            order: 3 },
      { id: 's4', label: 'Set aside airtime — KES 100',                              order: 4 },
      { id: 's5', label: 'Use the remaining KES 300 for other things you want',      order: 5 },
    ],
    hint: 'Essentials and savings always come before wants.',
    explanation: 'Bus fare first (get to school), then lunch (eat), then savings (future), then airtime (stay connected), then wants. This protects you from running out of money for important things.',
  },
  {
    id: 'mt_t3_adv_3',
    skill: 'money_transactions', tier: 3, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'keeping money safe',
    question: 'You collect KES 3,500 from selling items. On your way home you pass a busy shopping area. What is the safest set of actions?',
    options: [
      { id: 'a', label: 'Count the money publicly to make sure it is all there, then put it in your bag', correct: false },
      { id: 'b', label: 'Put the money directly into an inner pocket or zipped bag without counting publicly, then count it when you reach a safe private place', correct: true },
      { id: 'c', label: 'Call a friend and tell them how much money you have on you', correct: false },
      { id: 'd', label: 'Stop at a shop to break the money into smaller notes so it is less obvious', correct: false },
    ],
    hint: 'Think about what information you should keep private when carrying large amounts of cash.',
    explanation: 'Never count large sums publicly. Keep cash in a secure inner pocket. Telling others how much you have — even friends — creates risk. Count in private only.',
  },
  {
    id: 'mt_t3_adv_4',
    skill: 'money_transactions', tier: 3, difficulty: 'advanced',
    type: 'fill_blank', topic: 'budgeting',
    question: 'You earn KES 2,500 this month from odd jobs. You spend KES 800 on food, KES 400 on transport, KES 300 on airtime, and save KES 200. You have KES ___ left for other spending.',
    options: [
      { id: 'a', label: 'KES 700', correct: false },
      { id: 'b', label: 'KES 800', correct: true },
      { id: 'c', label: 'KES 900', correct: false },
    ],
    hint: 'Add all committed money: 800 + 400 + 300 + 200 = ? Then subtract from 2,500.',
    explanation: '800 + 400 + 300 + 200 = KES 1,700. 2,500 − 1,700 = KES 800 left for other spending.',
  },
  {
    id: 'mt_t3_adv_5',
    skill: 'money_transactions', tier: 3, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'receiving change',
    question: 'You buy 5 items totalling KES 1,275. You pay with a KES 1,000 note and a KES 500 note. The shopkeeper gives you KES 200 change. Is this correct?',
    options: [
      { id: 'a', label: 'Yes — KES 200 is correct', correct: false },
      { id: 'b', label: 'No — correct change is KES 225', correct: true },
      { id: 'c', label: 'No — correct change is KES 175', correct: false },
    ],
    hint: '1,000 + 500 = 1,500. 1,500 − 1,275 = ?',
    explanation: 'KES 1,000 + KES 500 = KES 1,500 paid. KES 1,500 − KES 1,275 = KES 225 correct change. The shopkeeper gave KES 25 too little.',
  },
  {
    id: 'mt_t3_adv_6',
    skill: 'money_transactions', tier: 3, difficulty: 'advanced',
    type: 'drag_drop', topic: 'budgeting',
    question: 'You have KES 2,000 for the month. Sort these into Must Pay This Month and Can Wait Until Next Month.',
    dragItems: [
      { id: 'm1', label: 'Rent contribution KES 800',       targetZone: 'must' },
      { id: 'm2', label: 'New clothes KES 600',             targetZone: 'wait' },
      { id: 'm3', label: 'Food for the month KES 700',      targetZone: 'must' },
      { id: 'm4', label: 'Cinema ticket KES 200',            targetZone: 'wait' },
      { id: 'm5', label: 'Transport KES 300',               targetZone: 'must' },
      { id: 'm6', label: 'Video game KES 400',              targetZone: 'wait' },
    ],
    dropZones: [
      { id: 'must', label: 'Must Pay This Month' },
      { id: 'wait', label: 'Can Wait Until Next Month' },
    ],
    hint: 'Must pay: things that keep you housed, fed, and able to get around. Can wait: things that are enjoyable but not urgent.',
    explanation: 'Must: Rent (800) + Food (700) + Transport (300) = KES 1,800 — within KES 2,000. Can wait: Clothes + Cinema + Video game = KES 1,200 — these are wants that can be saved for.',
  },
  {
    id: 'mt_t3_adv_7',
    skill: 'money_transactions', tier: 3, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'budgeting',
    question: 'At the end of the month you have KES 150 left. You were planning to save KES 200. What is the best decision?',
    options: [
      { id: 'a', label: 'Save KES 150 — something is better than nothing', correct: true },
      { id: 'b', label: 'Spend the KES 150 since you could not reach your savings goal anyway', correct: false },
      { id: 'c', label: 'Borrow KES 50 from someone so you can save your full KES 200', correct: false },
      { id: 'd', label: 'Do not save this month — wait until next month', correct: false },
    ],
    hint: 'What is better — saving a smaller amount or saving nothing at all?',
    explanation: 'Always save whatever you can, even if it is less than your goal. KES 150 saved is better than KES 0. Borrowing to save makes no financial sense — you end up owing money.',
  },

]