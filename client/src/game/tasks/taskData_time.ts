// taskData_time.ts
// Time & Planning — 63 tasks
// 3 Tiers × 3 Difficulties × 7 Tasks = 63

export type TaskTime = {
  id: string
  skill: string
  tier: 1 | 2 | 3
  difficulty: 'easy' | 'intermediate' | 'advanced'
  type: 'tap_select' | 'scenario_choice' | 'true_false' | 'fill_blank' | 'sequential_steps' | 'drag_drop'
  topic: string
  question: string
  context?: string
  options?: { id: string; label: string; correct: boolean; image?: string }[]
  steps?: { id: string; label: string; order: number }[]
  dragItems?: { id: string; label: string; targetZone: string }[]
  dropZones?: { id: string; label: string }[]
  hint: string
  explanation: string
  questionImage?: string
  imageLayout?: 'context' | 'options'
}

export const TIME_PLANNING_TASKS: TaskTime[] = [

  // =========================================================================
  // TIER 1 — FOUNDATION
  // =========================================================================

  // Tier 1 / Easy
  {
    id: 'tp_t1_easy_1', skill: 'time_planning', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'clock_reading',
    question: 'Which hand on a clock shows the hour?',
    questionImage: 'clock_face.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'The long hand', correct: false },
      { id: 'b', label: 'The short hand', correct: true },
      { id: 'c', label: 'Both hands', correct: false },
      { id: 'd', label: 'The numbers', correct: false },
    ],
    hint: 'The hour hand is shorter and moves slowly.',
    explanation: 'The short hand is the hour hand. The long hand shows the minutes.',
  },
  {
    id: 'tp_t1_easy_2', skill: 'time_planning', tier: 1, difficulty: 'easy',
    type: 'true_false', topic: 'clock_reading',
    question: 'A clock face has 12 numbers on it.',
    questionImage: 'clock_face.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Count the numbers on a clock face — start from 1.',
    explanation: 'Every clock face has numbers 1 through 12 arranged in a circle.',
  },
  {
    id: 'tp_t1_easy_3', skill: 'time_planning', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'clock_reading',
    question: 'What time does this clock show?',
    questionImage: 'clock_300.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '3:00', correct: true },
      { id: 'b', label: '6:00', correct: false },
      { id: 'c', label: '9:00', correct: false },
      { id: 'd', label: '12:00', correct: false },
    ],
    hint: 'The short hand points to 3. The long hand points to 12.',
    explanation: 'Short hand on 3, long hand on 12 = 3 o\'clock.',
  },
  {
    id: 'tp_t1_easy_4', skill: 'time_planning', tier: 1, difficulty: 'easy',
    type: 'true_false', topic: 'clock_reading',
    question: 'The long hand on a clock shows the minutes.',
    questionImage: 'clock_face.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'The long hand moves faster and goes all the way around every hour.',
    explanation: 'The long hand is the minute hand. It completes one full circle every 60 minutes.',
  },
  {
    id: 'tp_t1_easy_5', skill: 'time_planning', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'am_pm',
    question: 'School starts at 8 in the morning. Is this AM or PM?',
    questionImage: 'morning_school.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'AM', correct: true },
      { id: 'b', label: 'PM', correct: false },
    ],
    hint: 'AM is morning. PM is afternoon and evening.',
    explanation: 'AM means morning hours from midnight to noon. 8 in the morning is 8 AM.',
  },
  {
    id: 'tp_t1_easy_6', skill: 'time_planning', tier: 1, difficulty: 'easy',
    type: 'true_false', topic: 'am_pm',
    question: 'Noon is 12 PM.',
    questionImage: 'noon_sun.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Noon is the middle of the day.',
    explanation: '12 PM is noon. 12 AM is midnight.',
  },
  {
    id: 'tp_t1_easy_7', skill: 'time_planning', tier: 1, difficulty: 'easy',
    type: 'tap_select', topic: 'clock_reading',
    question: 'What time does this clock show?',
    questionImage: 'clock_600.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '6:00', correct: true },
      { id: 'b', label: '3:00', correct: false },
      { id: 'c', label: '9:00', correct: false },
      { id: 'd', label: '12:00', correct: false },
    ],
    hint: 'The short hand points to 6. The long hand points to 12.',
    explanation: 'Short hand on 6, long hand on 12 = 6 o\'clock.',
  },

  // Tier 1 / Intermediate
  {
    id: 'tp_t1_int_1', skill: 'time_planning', tier: 1, difficulty: 'intermediate',
    type: 'tap_select', topic: 'half_hours',
    question: 'What does half past 3 mean?',
    questionImage: 'clock_330.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '3:30', correct: true },
      { id: 'b', label: '3:15', correct: false },
      { id: 'c', label: '3:45', correct: false },
      { id: 'd', label: '4:00', correct: false },
    ],
    hint: 'Half past means 30 minutes after the hour.',
    explanation: 'Half past 3 = 3:30. The long hand points to 6 which means 30 minutes have passed.',
  },
  {
    id: 'tp_t1_int_2', skill: 'time_planning', tier: 1, difficulty: 'intermediate',
    type: 'true_false', topic: 'half_hours',
    question: 'Half past 7 is the same as 7:30.',
    questionImage: 'clock_730.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Half past means 30 minutes past the hour.',
    explanation: 'Half past any hour always means 30 minutes after that hour. Half past 7 = 7:30.',
  },
  {
    id: 'tp_t1_int_3', skill: 'time_planning', tier: 1, difficulty: 'intermediate',
    type: 'fill_blank', topic: 'time_calculation',
    question: 'If it is 5 o\'clock now, in two hours it will be ___ o\'clock.',
    questionImage: 'clock_500.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '7', correct: true },
      { id: 'b', label: '6', correct: false },
      { id: 'c', label: '8', correct: false },
    ],
    hint: 'Count forward two hours from 5.',
    explanation: '5 + 2 = 7. Two hours after 5 o\'clock is 7 o\'clock.',
  },
  {
    id: 'tp_t1_int_4', skill: 'time_planning', tier: 1, difficulty: 'intermediate',
    type: 'tap_select', topic: 'time_calculation',
    question: 'It is 9 AM now. School ends at 3 PM. How many hours is that?',
    questionImage: 'clock_900.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '6 hours', correct: true },
      { id: 'b', label: '4 hours', correct: false },
      { id: 'c', label: '8 hours', correct: false },
      { id: 'd', label: '5 hours', correct: false },
    ],
    hint: 'Count from 9 AM to 3 PM — 9, 10, 11, 12, 1, 2, 3.',
    explanation: 'From 9 AM to 3 PM is 6 hours. This is a typical school day length.',
  },
  {
    id: 'tp_t1_int_5', skill: 'time_planning', tier: 1, difficulty: 'intermediate',
    type: 'true_false', topic: 'time_calculation',
    question: 'There are 24 hours in one day.',
    questionImage: 'day_cycle.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'A day starts at midnight and ends at the next midnight.',
    explanation: 'One full day has 24 hours — 12 AM hours and 12 PM hours.',
  },
  {
    id: 'tp_t1_int_6', skill: 'time_planning', tier: 1, difficulty: 'intermediate',
    type: 'tap_select', topic: 'half_hours',
    question: 'This clock shows half past 10. What time is it?',
    questionImage: 'clock_1030.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '10:30', correct: true },
      { id: 'b', label: '10:00', correct: false },
      { id: 'c', label: '11:00', correct: false },
      { id: 'd', label: '9:30', correct: false },
    ],
    hint: 'Half past means 30 minutes after the hour shown.',
    explanation: 'Half past 10 = 10:30. The short hand is between 10 and 11, the long hand points to 6.',
  },
  {
    id: 'tp_t1_int_7', skill: 'time_planning', tier: 1, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'time_calculation',
    question: 'You need to be at the market by 8 AM. It takes 30 minutes to get there. What time should you leave home?',
    questionImage: 'morning_school.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '7:30 AM', correct: true },
      { id: 'b', label: '8:00 AM', correct: false },
      { id: 'c', label: '7:00 AM', correct: false },
      { id: 'd', label: '8:30 AM', correct: false },
    ],
    hint: 'Subtract the travel time from the time you need to arrive.',
    explanation: '8:00 AM minus 30 minutes = 7:30 AM. Leave at 7:30 AM to arrive by 8:00 AM.',
  },

  // Tier 1 / Advanced
  {
    id: 'tp_t1_adv_1', skill: 'time_planning', tier: 1, difficulty: 'advanced',
    type: 'tap_select', topic: 'quarter_hours',
    question: 'What does quarter past 4 mean?',
    questionImage: 'clock_415.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '4:15', correct: true },
      { id: 'b', label: '4:30', correct: false },
      { id: 'c', label: '4:45', correct: false },
      { id: 'd', label: '3:15', correct: false },
    ],
    hint: 'Quarter past means 15 minutes after the hour.',
    explanation: 'Quarter past 4 = 4:15. A quarter of 60 minutes is 15 minutes.',
  },
  {
    id: 'tp_t1_adv_2', skill: 'time_planning', tier: 1, difficulty: 'advanced',
    type: 'true_false', topic: 'quarter_hours',
    question: 'Quarter to 6 means 5:45.',
    questionImage: 'clock_545.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Quarter to means 15 minutes BEFORE the next hour.',
    explanation: 'Quarter to 6 = 15 minutes before 6 = 5:45.',
  },
  {
    id: 'tp_t1_adv_3', skill: 'time_planning', tier: 1, difficulty: 'advanced',
    type: 'fill_blank', topic: 'am_pm',
    question: 'A school day runs from 7:30 AM to 3:30 PM. The school day is ___ hours long.',
    questionImage: 'schedule_school.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '8', correct: true },
      { id: 'b', label: '6', correct: false },
      { id: 'c', label: '10', correct: false },
    ],
    hint: 'Count from 7:30 AM to 3:30 PM.',
    explanation: 'From 7:30 AM to 3:30 PM is 8 hours. That is a full school day.',
  },
  {
    id: 'tp_t1_adv_4', skill: 'time_planning', tier: 1, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'time_calculation',
    question: 'Your appointment is at 2:15 PM. It is now 1:45 PM. How long until your appointment?',
    questionImage: 'clock_145.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '30 minutes', correct: true },
      { id: 'b', label: '15 minutes', correct: false },
      { id: 'c', label: '45 minutes', correct: false },
      { id: 'd', label: '1 hour', correct: false },
    ],
    hint: 'Count from 1:45 to 2:15.',
    explanation: '1:45 to 2:00 = 15 minutes. 2:00 to 2:15 = 15 minutes. Total = 30 minutes.',
  },
  {
    id: 'tp_t1_adv_5', skill: 'time_planning', tier: 1, difficulty: 'advanced',
    type: 'tap_select', topic: 'quarter_hours',
    question: 'Which of these times means quarter to 8?',
    questionImage: 'clock_745.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '7:45', correct: true },
      { id: 'b', label: '8:15', correct: false },
      { id: 'c', label: '8:45', correct: false },
      { id: 'd', label: '7:15', correct: false },
    ],
    hint: 'Quarter to 8 means 15 minutes before 8 o\'clock.',
    explanation: '15 minutes before 8:00 = 7:45.',
  },
  {
    id: 'tp_t1_adv_6', skill: 'time_planning', tier: 1, difficulty: 'advanced',
    type: 'true_false', topic: 'am_pm',
    question: 'Midnight is 12 AM and noon is 12 PM.',
    questionImage: 'day_cycle.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Midnight starts a new day. Noon is the middle of the day.',
    explanation: '12 AM = midnight. 12 PM = noon.',
  },
  {
    id: 'tp_t1_adv_7', skill: 'time_planning', tier: 1, difficulty: 'advanced',
    type: 'sequential_steps', topic: 'daily_routine',
    question: 'Put these daily events in the correct order.',
    questionImage: 'daily_routine.jpg', imageLayout: 'context',
    steps: [
      { id: 's1', label: 'Wake up', order: 1 },
      { id: 's2', label: 'Eat breakfast', order: 2 },
      { id: 's3', label: 'Go to school or work', order: 3 },
      { id: 's4', label: 'Eat lunch', order: 4 },
      { id: 's5', label: 'Return home', order: 5 },
      { id: 's6', label: 'Sleep', order: 6 },
    ],
    hint: 'Think about what happens first when you wake up in the morning.',
    explanation: 'A typical day: wake up → breakfast → school/work → lunch → home → sleep.',
  },

  // =========================================================================
  // TIER 2 — APPLICATION
  // Goal: Decision making — apply the skill in a real scenario
  // =========================================================================

  // Tier 2 / Easy
  {
    id: 'tp_t2_easy_1', skill: 'time_planning', tier: 2, difficulty: 'easy',
    type: 'tap_select', topic: 'schedule_reading',
    question: 'A bus leaves at 7:00 AM. You arrive at the stage at 7:15 AM. Did you miss the bus?',
    questionImage: 'bus_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Yes — the bus already left at 7:00 AM', correct: true },
      { id: 'b', label: 'No — the bus waits for passengers', correct: false },
      { id: 'c', label: 'No — 7:15 is before 7:00', correct: false },
    ],
    hint: '7:15 AM is 15 minutes after 7:00 AM.',
    explanation: 'The bus left at 7:00 AM. You arrived at 7:15 AM — 15 minutes too late. Always arrive early.',
  },
  {
    id: 'tp_t2_easy_2', skill: 'time_planning', tier: 2, difficulty: 'easy',
    type: 'true_false', topic: 'schedule_reading',
    question: 'If a clinic opens at 8:00 AM, you can be seen at 7:45 AM.',
    questionImage: 'clinic_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: false },
      { id: 'false', label: 'False', correct: true },
    ],
    hint: '7:45 AM is before 8:00 AM. The clinic is not open yet.',
    explanation: 'The clinic opens at 8:00 AM. 7:45 AM is 15 minutes before opening. You cannot be seen yet.',
  },
  {
    id: 'tp_t2_easy_3', skill: 'time_planning', tier: 2, difficulty: 'easy',
    type: 'fill_blank', topic: 'time_calculation',
    question: 'You leave home at 6:30 AM. It takes 45 minutes to reach school. You arrive at school at ___.',
    questionImage: 'morning_school.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '7:15 AM', correct: true },
      { id: 'b', label: '7:00 AM', correct: false },
      { id: 'c', label: '7:30 AM', correct: false },
    ],
    hint: 'Add 45 minutes to 6:30. 6:30 + 30 = 7:00, then add 15 more.',
    explanation: '6:30 AM + 45 minutes = 7:15 AM.',
  },
  {
    id: 'tp_t2_easy_4', skill: 'time_planning', tier: 2, difficulty: 'easy',
    type: 'scenario_choice', topic: 'schedule_reading',
    question: 'The market is open from 7 AM to 6 PM. You arrive at 6:30 PM. What happens?',
    questionImage: 'market_hours.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'You can shop — the market closes at 7 PM', correct: false },
      { id: 'b', label: 'The market is closed — it closed at 6 PM', correct: true },
      { id: 'c', label: 'You can shop for 30 minutes', correct: false },
    ],
    hint: '6:30 PM is 30 minutes after 6 PM closing time.',
    explanation: 'The market closes at 6 PM. 6:30 PM is too late — the market is already closed.',
  },
  {
    id: 'tp_t2_easy_5', skill: 'time_planning', tier: 2, difficulty: 'easy',
    type: 'tap_select', topic: 'time_calculation',
    question: 'You have a meeting at 10:00 AM. It takes 20 minutes to get there. What is the latest time you should leave?',
    questionImage: 'clock_940.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '9:40 AM', correct: true },
      { id: 'b', label: '9:30 AM', correct: false },
      { id: 'c', label: '10:00 AM', correct: false },
      { id: 'd', label: '9:50 AM', correct: false },
    ],
    hint: 'Subtract 20 minutes from 10:00 AM.',
    explanation: '10:00 AM minus 20 minutes = 9:40 AM. Leave by 9:40 AM at the latest.',
  },
  {
    id: 'tp_t2_easy_6', skill: 'time_planning', tier: 2, difficulty: 'easy',
    type: 'true_false', topic: 'schedule_reading',
    question: 'A TV programme that starts at 8 PM and lasts 1 hour ends at 9 PM.',
    questionImage: 'tv_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Add 1 hour to 8 PM.',
    explanation: '8 PM + 1 hour = 9 PM. The programme ends at 9 PM.',
  },
  {
    id: 'tp_t2_easy_7', skill: 'time_planning', tier: 2, difficulty: 'easy',
    type: 'scenario_choice', topic: 'time_calculation',
    question: 'School starts at 7:30 AM. You wake up at 6:00 AM. How much time do you have to get ready?',
    questionImage: 'morning_school.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '1 hour 30 minutes', correct: true },
      { id: 'b', label: '1 hour', correct: false },
      { id: 'c', label: '2 hours', correct: false },
      { id: 'd', label: '30 minutes', correct: false },
    ],
    hint: 'Count from 6:00 AM to 7:30 AM.',
    explanation: '6:00 AM to 7:00 AM = 1 hour. 7:00 AM to 7:30 AM = 30 minutes. Total = 1 hour 30 minutes.',
  },

  // Tier 2 / Intermediate
  {
    id: 'tp_t2_int_1', skill: 'time_planning', tier: 2, difficulty: 'intermediate',
    type: 'drag_drop', topic: 'schedule_reading',
    question: 'Sort these activities into Morning (AM) or Afternoon/Evening (PM).',
    questionImage: 'daily_routine.jpg', imageLayout: 'context',
    dragItems: [
      { id: 'a1', label: 'Wake up 6:00 AM', targetZone: 'am' },
      { id: 'a2', label: 'School assembly 7:30 AM', targetZone: 'am' },
      { id: 'a3', label: 'Lunch 1:00 PM', targetZone: 'pm' },
      { id: 'a4', label: 'Dinner 7:00 PM', targetZone: 'pm' },
      { id: 'a5', label: 'Morning tea 9:00 AM', targetZone: 'am' },
      { id: 'a6', label: 'Evening news 9:00 PM', targetZone: 'pm' },
    ],
    dropZones: [
      { id: 'am', label: 'Morning — AM' },
      { id: 'pm', label: 'Afternoon/Evening — PM' },
    ],
    hint: 'AM is before noon. PM is after noon.',
    explanation: 'AM activities happen before 12:00 noon. PM activities happen after noon.',
  },
  {
    id: 'tp_t2_int_2', skill: 'time_planning', tier: 2, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'schedule_reading',
    question: 'You have three errands: post office (closes 5 PM), bank (closes 3 PM), market (closes 6 PM). It is 2:00 PM. Which should you do first?',
    questionImage: 'schedule_errands.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Bank — it closes earliest at 3 PM', correct: true },
      { id: 'b', label: 'Market — it stays open longest', correct: false },
      { id: 'c', label: 'Post office — it is in the middle', correct: false },
    ],
    hint: 'Do the errand that closes soonest first.',
    explanation: 'The bank closes at 3 PM — only 1 hour away. Do it first or you will miss it.',
  },
  {
    id: 'tp_t2_int_3', skill: 'time_planning', tier: 2, difficulty: 'intermediate',
    type: 'fill_blank', topic: 'time_calculation',
    question: 'A meeting starts at 9:30 AM and lasts 2 hours 30 minutes. It ends at ___.',
    questionImage: 'clock_930.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '12:00 PM', correct: true },
      { id: 'b', label: '11:30 AM', correct: false },
      { id: 'c', label: '12:30 PM', correct: false },
    ],
    hint: 'Add 2 hours 30 minutes to 9:30 AM.',
    explanation: '9:30 AM + 2 hours = 11:30 AM. 11:30 AM + 30 minutes = 12:00 PM.',
  },
  {
    id: 'tp_t2_int_4', skill: 'time_planning', tier: 2, difficulty: 'intermediate',
    type: 'true_false', topic: 'schedule_reading',
    question: 'If you have appointments at 10 AM, 12 PM, and 3 PM, you have a 2-hour gap between the first and second appointment.',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Count from 10 AM to 12 PM.',
    explanation: '10 AM to 12 PM = 2 hours. Yes, there is a 2-hour gap.',
  },
  {
    id: 'tp_t2_int_5', skill: 'time_planning', tier: 2, difficulty: 'intermediate',
    type: 'tap_select', topic: 'time_calculation',
    question: 'You cook ugali for 20 minutes and sukuma wiki for 15 minutes. If you start at 5:30 PM, when will both dishes be ready if cooked one after the other?',
    questionImage: 'cooking_time.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '6:05 PM', correct: true },
      { id: 'b', label: '5:50 PM', correct: false },
      { id: 'c', label: '6:15 PM', correct: false },
      { id: 'd', label: '6:00 PM', correct: false },
    ],
    hint: 'Add 20 + 15 = 35 minutes to 5:30 PM.',
    explanation: '5:30 PM + 35 minutes = 6:05 PM.',
  },
  {
    id: 'tp_t2_int_6', skill: 'time_planning', tier: 2, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'You need to wake up at 5:30 AM to catch a 6:00 AM bus. It is now 10:00 PM. How many hours of sleep will you get?',
    questionImage: 'sleep_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '7 hours 30 minutes', correct: true },
      { id: 'b', label: '8 hours', correct: false },
      { id: 'c', label: '6 hours 30 minutes', correct: false },
      { id: 'd', label: '7 hours', correct: false },
    ],
    hint: 'Count from 10:00 PM to 5:30 AM.',
    explanation: '10:00 PM to 5:00 AM = 7 hours. 5:00 AM to 5:30 AM = 30 minutes. Total = 7 hours 30 minutes.',
  },
  {
    id: 'tp_t2_int_7', skill: 'time_planning', tier: 2, difficulty: 'intermediate',
    type: 'sequential_steps', topic: 'daily_planning',
    question: 'Put these morning tasks in a sensible order before leaving for school.',
    questionImage: 'morning_school.jpg', imageLayout: 'context',
    steps: [
      { id: 's1', label: 'Wake up and wash face', order: 1 },
      { id: 's2', label: 'Eat breakfast', order: 2 },
      { id: 's3', label: 'Pack school bag', order: 3 },
      { id: 's4', label: 'Check the time', order: 4 },
      { id: 's5', label: 'Leave the house', order: 5 },
    ],
    hint: 'Think about what you need to do before you are ready to leave.',
    explanation: 'Wash up → eat → pack → check time → leave. This ensures you are ready and on time.',
  },

  // Tier 2 / Advanced
  {
    id: 'tp_t2_adv_1', skill: 'time_planning', tier: 2, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'You have: school from 7:30 AM–3:30 PM, homework needs 1 hour, chores need 30 minutes, and you want to sleep by 9:30 PM. You get home at 4:00 PM. Can you fit everything in?',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Yes — 4:00 PM to 9:30 PM is 5.5 hours, enough for 1.5 hours of tasks', correct: true },
      { id: 'b', label: 'No — there is not enough time', correct: false },
      { id: 'c', label: 'Yes — but only if you skip dinner', correct: false },
    ],
    hint: 'Calculate total free time: 4:00 PM to 9:30 PM = 5.5 hours. Tasks = 1.5 hours.',
    explanation: '4:00 PM to 9:30 PM = 5.5 hours. Homework (1 hr) + chores (0.5 hr) = 1.5 hours. Plenty of time.',
  },
  {
    id: 'tp_t2_adv_2', skill: 'time_planning', tier: 2, difficulty: 'advanced',
    type: 'drag_drop', topic: 'schedule_reading',
    question: 'You have 3 hours free this afternoon. Sort these tasks into Can Do Today and Must Wait.',
    questionImage: 'schedule_errands.jpg', imageLayout: 'context',
    dragItems: [
      { id: 't1', label: 'Visit doctor — 2 hours', targetZone: 'today' },
      { id: 't2', label: 'Shop for groceries — 1 hour', targetZone: 'today' },
      { id: 't3', label: 'Watch 3-hour movie', targetZone: 'wait' },
      { id: 't4', label: 'Clean room — 2 hours', targetZone: 'wait' },
    ],
    dropZones: [
      { id: 'today', label: 'Can Do Today' },
      { id: 'wait', label: 'Must Wait' },
    ],
    hint: 'Doctor (2hr) + groceries (1hr) = 3 hours exactly. Movie (3hr) + cleaning (2hr) = 5 hours — too much.',
    explanation: 'Doctor + groceries = exactly 3 hours. Movie and cleaning together need 5 hours — too much for today.',
  },
  {
    id: 'tp_t2_adv_3', skill: 'time_planning', tier: 2, difficulty: 'advanced',
    type: 'fill_blank', topic: 'time_calculation',
    question: 'You work from 8:00 AM to 5:00 PM with a 1-hour lunch break. How many working hours did you complete?',
    questionImage: 'work_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '8 hours', correct: true },
      { id: 'b', label: '9 hours', correct: false },
      { id: 'c', label: '7 hours', correct: false },
    ],
    hint: '8 AM to 5 PM = 9 hours total. Subtract 1 hour lunch.',
    explanation: '8:00 AM to 5:00 PM = 9 hours. Minus 1 hour lunch = 8 working hours.',
  },
  {
    id: 'tp_t2_adv_4', skill: 'time_planning', tier: 2, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'Your phone alarm is set for 5:45 AM but you accidentally set it to PM. What time will it actually ring?',
    questionImage: 'phone_alarm.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '5:45 PM — in the evening', correct: true },
      { id: 'b', label: '5:45 AM — as planned', correct: false },
      { id: 'c', label: 'It will not ring at all', correct: false },
    ],
    hint: 'PM is evening — not morning.',
    explanation: '5:45 PM is in the evening. You will miss your early morning plans. Always double-check AM/PM.',
  },
  {
    id: 'tp_t2_adv_5', skill: 'time_planning', tier: 2, difficulty: 'advanced',
    type: 'tap_select', topic: 'schedule_reading',
    question: 'A matatu leaves every 30 minutes starting at 6:00 AM. If you arrive at the stage at 7:20 AM, when is the next matatu?',
    questionImage: 'bus_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '7:30 AM', correct: true },
      { id: 'b', label: '7:00 AM', correct: false },
      { id: 'c', label: '7:20 AM', correct: false },
      { id: 'd', label: '8:00 AM', targetZone: 'wait', correct: false },
    ],
    hint: 'Matatus leave at 6:00, 6:30, 7:00, 7:30, 8:00... You arrived at 7:20.',
    explanation: 'The schedule is 6:00, 6:30, 7:00, 7:30. You arrived at 7:20 — the next one is at 7:30.',
  },
  {
    id: 'tp_t2_adv_6', skill: 'time_planning', tier: 2, difficulty: 'advanced',
    type: 'true_false', topic: 'daily_planning',
    question: 'If you need 8 hours of sleep and must wake up at 5:30 AM, you should sleep by 9:30 PM.',
    questionImage: 'sleep_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Count 8 hours back from 5:30 AM.',
    explanation: '5:30 AM minus 8 hours = 9:30 PM. Sleep at 9:30 PM to wake rested at 5:30 AM.',
  },
  {
    id: 'tp_t2_adv_7', skill: 'time_planning', tier: 2, difficulty: 'advanced',
    type: 'sequential_steps', topic: 'daily_planning',
    question: 'Put these steps in the correct order for planning your day the night before.',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    steps: [
      { id: 's1', label: 'Write down everything you need to do tomorrow', order: 1 },
      { id: 's2', label: 'Estimate how long each task will take', order: 2 },
      { id: 's3', label: 'Assign a time slot to each task', order: 3 },
      { id: 's4', label: 'Check for conflicts or overlaps', order: 4 },
      { id: 's5', label: 'Prepare what you need the night before', order: 5 },
    ],
    hint: 'Start by listing tasks, then estimate time, then schedule them.',
    explanation: 'Good planning: list → estimate → schedule → check conflicts → prepare. This saves time in the morning.',
  },

  // =========================================================================
  // TIER 3 — INDEPENDENCE
  // Goal: Navigate full real-world multi-step time situations
  // =========================================================================

  // Tier 3 / Easy
  {
    id: 'tp_t3_easy_1', skill: 'time_planning', tier: 3, difficulty: 'easy',
    type: 'scenario_choice', topic: 'schedule_reading',
    question: 'You have a hospital appointment at 9:00 AM. The hospital is 1 hour away and you need 30 minutes to get ready. What time should you wake up?',
    questionImage: 'clinic_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '7:30 AM', correct: true },
      { id: 'b', label: '8:00 AM', correct: false },
      { id: 'c', label: '7:00 AM', correct: false },
      { id: 'd', label: '8:30 AM', correct: false },
    ],
    hint: 'Add preparation time and travel time, then subtract from appointment time.',
    explanation: '9:00 AM minus 1 hour travel = 8:00 AM. 8:00 AM minus 30 minutes to get ready = 7:30 AM.',
  },
  {
    id: 'tp_t3_easy_2', skill: 'time_planning', tier: 3, difficulty: 'easy',
    type: 'true_false', topic: 'daily_planning',
    question: 'Arriving 10 minutes early to an appointment is better than arriving exactly on time.',
    questionImage: 'clinic_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Think about what can go wrong on the way.',
    explanation: 'Arriving early gives you buffer time for unexpected delays. It also shows respect for others\' time.',
  },
  {
    id: 'tp_t3_easy_3', skill: 'time_planning', tier: 3, difficulty: 'easy',
    type: 'tap_select', topic: 'time_calculation',
    question: 'You start work at 8:00 AM and work for 4 hours. You then take a 30-minute break and work 3 more hours. What time do you finish?',
    questionImage: 'work_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '3:30 PM', correct: true },
      { id: 'b', label: '3:00 PM', correct: false },
      { id: 'c', label: '4:00 PM', correct: false },
      { id: 'd', label: '2:30 PM', correct: false },
    ],
    hint: '8:00 + 4 hours = 12:00. 12:00 + 30 minutes = 12:30. 12:30 + 3 hours = 3:30 PM.',
    explanation: '8:00 AM + 4hrs = 12:00 PM. + 30min break = 12:30 PM. + 3hrs = 3:30 PM.',
  },
  {
    id: 'tp_t3_easy_4', skill: 'time_planning', tier: 3, difficulty: 'easy',
    type: 'true_false', topic: 'schedule_reading',
    question: 'A shop that opens Monday to Saturday is open on Sunday.',
    questionImage: 'market_hours.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: false },
      { id: 'false', label: 'False', correct: true },
    ],
    hint: 'Monday to Saturday does not include Sunday.',
    explanation: 'Monday to Saturday is 6 days. Sunday is not included — the shop is closed on Sunday.',
  },
  {
    id: 'tp_t3_easy_5', skill: 'time_planning', tier: 3, difficulty: 'easy',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'You promised to call your friend at 3:00 PM. It is now 2:45 PM and you are in a shop. What should you do?',
    questionImage: 'phone_alarm.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Quickly finish shopping and call at 3:00 PM as promised', correct: true },
      { id: 'b', label: 'Forget the call — your shopping is more important', correct: false },
      { id: 'c', label: 'Call now from the shop even though it is noisy', correct: false },
      { id: 'd', label: 'Wait until you finish shopping even if it takes until 4 PM', correct: false },
    ],
    hint: 'You have 15 minutes. Can you finish shopping in time?',
    explanation: 'You have 15 minutes. Wrap up shopping and honour your commitment at 3:00 PM as promised.',
  },
  {
    id: 'tp_t3_easy_6', skill: 'time_planning', tier: 3, difficulty: 'easy',
    type: 'fill_blank', topic: 'time_calculation',
    question: 'You need to travel 60km. The matatu travels at 60km per hour. The journey takes ___ hour(s).',
    questionImage: 'bus_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '1', correct: true },
      { id: 'b', label: '2', correct: false },
      { id: 'c', label: '30 minutes', correct: false },
    ],
    hint: 'Distance divided by speed = time.',
    explanation: '60km ÷ 60km/h = 1 hour. Always estimate travel time before leaving.',
  },
  {
    id: 'tp_t3_easy_7', skill: 'time_planning', tier: 3, difficulty: 'easy',
    type: 'sequential_steps', topic: 'daily_planning',
    question: 'Put these steps in the correct order for getting to an important appointment on time.',
    questionImage: 'clinic_schedule.jpg', imageLayout: 'context',
    steps: [
      { id: 's1', label: 'Find out the appointment time and location', order: 1 },
      { id: 's2', label: 'Calculate how long the journey will take', order: 2 },
      { id: 's3', label: 'Set an alarm to wake up in time', order: 3 },
      { id: 's4', label: 'Prepare what you need the night before', order: 4 },
      { id: 's5', label: 'Leave home with extra time to spare', order: 5 },
    ],
    hint: 'Start by knowing when and where, then work backwards.',
    explanation: 'Good preparation: know the details → plan travel → set alarm → prepare → leave early.',
  },

  // Tier 3 / Intermediate
  {
    id: 'tp_t3_int_1', skill: 'time_planning', tier: 3, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'You have 5 tasks today: cooking (1hr), shopping (45min), homework (2hrs), laundry (30min), and a phone call (15min). You have 5 hours free. Can you do everything?',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Yes — total time is 4 hours 30 minutes, within 5 hours', correct: true },
      { id: 'b', label: 'No — it will take more than 5 hours', correct: false },
      { id: 'c', label: 'Yes — but only if you rush', correct: false },
    ],
    hint: 'Add up all task times: 60 + 45 + 120 + 30 + 15 = ?',
    explanation: '60 + 45 + 120 + 30 + 15 = 270 minutes = 4 hours 30 minutes. Less than 5 hours — you can do it all.',
  },
  {
    id: 'tp_t3_int_2', skill: 'time_planning', tier: 3, difficulty: 'intermediate',
    type: 'drag_drop', topic: 'schedule_reading',
    question: 'Sort these events into the correct time of day.',
    questionImage: 'daily_routine.jpg', imageLayout: 'context',
    dragItems: [
      { id: 'e1', label: 'Morning prayers 5:00 AM', targetZone: 'earlymorning' },
      { id: 'e2', label: 'Breakfast 7:00 AM', targetZone: 'morning' },
      { id: 'e3', label: 'Lunch break 12:30 PM', targetZone: 'afternoon' },
      { id: 'e4', label: 'Evening walk 6:00 PM', targetZone: 'evening' },
      { id: 'e5', label: 'Late night news 10:00 PM', targetZone: 'night' },
    ],
    dropZones: [
      { id: 'earlymorning', label: 'Early Morning (before 6 AM)' },
      { id: 'morning', label: 'Morning (6 AM–12 PM)' },
      { id: 'afternoon', label: 'Afternoon (12 PM–6 PM)' },
      { id: 'evening', label: 'Evening (6 PM–9 PM)' },
      { id: 'night', label: 'Night (after 9 PM)' },
    ],
    hint: 'Match each event to the time bracket it falls in.',
    explanation: 'Each event matches its bracket: 5 AM = early morning, 7 AM = morning, 12:30 PM = afternoon, 6 PM = evening, 10 PM = night.',
  },
  {
    id: 'tp_t3_int_3', skill: 'time_planning', tier: 3, difficulty: 'intermediate',
    type: 'fill_blank', topic: 'time_calculation',
    question: 'You work 5 days a week, 8 hours a day. In one week you work ___ hours total.',
    questionImage: 'work_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '40', correct: true },
      { id: 'b', label: '35', correct: false },
      { id: 'c', label: '45', correct: false },
    ],
    hint: 'Multiply: 5 days × 8 hours = ?',
    explanation: '5 × 8 = 40 hours per week. This is a standard full-time working week.',
  },
  {
    id: 'tp_t3_int_4', skill: 'time_planning', tier: 3, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'You are late for an important meeting. You can either take a matatu (25 minutes) or walk (50 minutes). The meeting starts in 30 minutes. What should you do?',
    questionImage: 'bus_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Take the matatu — 25 minutes is within the 30-minute window', correct: true },
      { id: 'b', label: 'Walk — it is healthier', correct: false },
      { id: 'c', label: 'Cancel the meeting', correct: false },
    ],
    hint: 'Compare travel times to the time remaining.',
    explanation: 'Matatu takes 25 minutes — you will arrive with 5 minutes to spare. Walking takes 50 minutes — you would be 20 minutes late.',
  },
  {
    id: 'tp_t3_int_5', skill: 'time_planning', tier: 3, difficulty: 'intermediate',
    type: 'true_false', topic: 'schedule_reading',
    question: 'If an event runs from 10:30 AM to 2:00 PM, it lasts 3 hours and 30 minutes.',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Count from 10:30 AM to 2:00 PM.',
    explanation: '10:30 to 11:30 = 1hr. 11:30 to 12:30 = 1hr. 12:30 to 2:00 = 1.5hr. Total = 3.5 hours.',
  },
  {
    id: 'tp_t3_int_6', skill: 'time_planning', tier: 3, difficulty: 'intermediate',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'Your child has school at 7:30 AM, you have work at 8:30 AM, and both places are 20 minutes apart from your home. What is the best plan?',
    questionImage: 'morning_school.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Drop child at 7:10 AM, go home, leave for work at 8:10 AM', correct: false },
      { id: 'b', label: 'Drop child at 7:10 AM then go directly toward work — arrive at work by 8:10 AM', correct: true },
      { id: 'c', label: 'Send child alone and leave for work at 8:00 AM', correct: false },
    ],
    hint: 'Think about the most efficient route without going back home.',
    explanation: 'Drop child (7:10) → head to work directly (20 min) → arrive work 7:30 AM. Early and efficient.',
  },
  {
    id: 'tp_t3_int_7', skill: 'time_planning', tier: 3, difficulty: 'intermediate',
    type: 'sequential_steps', topic: 'daily_planning',
    question: 'Put these steps in the correct order for planning a week ahead.',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    steps: [
      { id: 's1', label: 'List all fixed commitments for the week', order: 1 },
      { id: 's2', label: 'Identify free time slots', order: 2 },
      { id: 's3', label: 'Assign tasks to free slots', order: 3 },
      { id: 's4', label: 'Add buffer time for unexpected events', order: 4 },
      { id: 's5', label: 'Review the plan each morning', order: 5 },
    ],
    hint: 'Start with what is fixed, then plan around it.',
    explanation: 'Fixed commitments first → find gaps → fill gaps → add buffer → review daily.',
  },

  // Tier 3 / Advanced
  {
    id: 'tp_t3_adv_1', skill: 'time_planning', tier: 3, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'You have a job interview at 10:00 AM across town. Travel takes 1 hour 15 minutes. You need 45 minutes to prepare. What is the absolute latest you can wake up?',
    questionImage: 'work_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: '8:00 AM', correct: true },
      { id: 'b', label: '8:30 AM', correct: false },
      { id: 'c', label: '7:45 AM', correct: false },
      { id: 'd', label: '9:00 AM', correct: false },
    ],
    hint: 'Add prep time and travel time, subtract from 10:00 AM.',
    explanation: '10:00 AM − 1hr15min travel = 8:45 AM departure. 8:45 AM − 45min prep = 8:00 AM wake up.',
  },
  {
    id: 'tp_t3_adv_2', skill: 'time_planning', tier: 3, difficulty: 'advanced',
    type: 'drag_drop', topic: 'daily_planning',
    question: 'You have 4 hours free today. Sort these tasks by priority — what to do today vs what can wait.',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    dragItems: [
      { id: 'p1', label: 'Take medicine at 2 PM — 5 minutes', targetZone: 'today' },
      { id: 'p2', label: 'Call doctor for appointment — 10 minutes', targetZone: 'today' },
      { id: 'p3', label: 'Rearrange bedroom furniture — 3 hours', targetZone: 'wait' },
      { id: 'p4', label: 'Buy groceries before shops close at 6 PM — 1 hour', targetZone: 'today' },
      { id: 'p5', label: 'Watch a movie — 2 hours', targetZone: 'wait' },
    ],
    dropZones: [
      { id: 'today', label: 'Do Today' },
      { id: 'wait', label: 'Can Wait' },
    ],
    hint: 'Health and time-sensitive tasks come first.',
    explanation: 'Medicine, doctor call, and grocery shopping are time-sensitive. Rearranging furniture and watching a movie can wait.',
  },
  {
    id: 'tp_t3_adv_3', skill: 'time_planning', tier: 3, difficulty: 'advanced',
    type: 'fill_blank', topic: 'time_calculation',
    question: 'You earn KES 150 per hour. You work from 8:00 AM to 4:30 PM with a 30-minute lunch break. You earn KES ___ today.',
    questionImage: 'work_schedule.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'KES 1,200', correct: true },
      { id: 'b', label: 'KES 1,275', correct: false },
      { id: 'c', label: 'KES 1,050', correct: false },
    ],
    hint: '8:00 AM to 4:30 PM = 8.5 hours. Minus 0.5 hour lunch = 8 hours. 8 × 150 = ?',
    explanation: '8:00 AM to 4:30 PM = 8.5 hours. Minus 30 min lunch = 8 hours worked. 8 × KES 150 = KES 1,200.',
  },
  {
    id: 'tp_t3_adv_4', skill: 'time_planning', tier: 3, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'schedule_reading',
    question: 'You missed a dose of medicine that should be taken every 8 hours. Your last dose was at 6:00 AM. You remembered at 3:30 PM. What should you do?',
    questionImage: 'phone_alarm.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Take the missed dose now and adjust the next dose to 11:30 PM', correct: true },
      { id: 'b', label: 'Skip the missed dose and wait for the next scheduled time', correct: false },
      { id: 'c', label: 'Take two doses now to catch up', correct: false },
      { id: 'd', label: 'Stop taking the medicine since you missed a dose', correct: false },
    ],
    hint: '6:00 AM + 8 hours = 2:00 PM was the scheduled dose. You remembered at 3:30 PM.',
    explanation: 'Take the missed dose now (3:30 PM) and schedule the next one 8 hours later at 11:30 PM. Never double dose.',
  },
  {
    id: 'tp_t3_adv_5', skill: 'time_planning', tier: 3, difficulty: 'advanced',
    type: 'scenario_choice', topic: 'daily_planning',
    question: 'You want to start a new habit of exercising for 30 minutes every morning. You currently wake up at 7:00 AM and leave at 7:45 AM. What should you change?',
    questionImage: 'morning_school.jpg', imageLayout: 'context',
    options: [
      { id: 'a', label: 'Wake up at 6:15 AM to fit in 30 minutes exercise plus getting ready', correct: true },
      { id: 'b', label: 'Exercise after work instead — mornings are too rushed', correct: false },
      { id: 'c', label: 'Skip getting ready to fit exercise in', correct: false },
      { id: 'd', label: 'Exercise only on weekends', correct: false },
    ],
    hint: 'You need 30 minutes exercise + 45 minutes to get ready = 75 minutes before leaving.',
    explanation: 'Leave at 7:45 AM. Need 75 minutes before that = wake at 6:30 AM minimum. 6:15 AM gives comfortable buffer.',
  },
  {
    id: 'tp_t3_adv_6', skill: 'time_planning', tier: 3, difficulty: 'advanced',
    type: 'true_false', topic: 'schedule_reading',
    question: 'If a weekly market happens every Wednesday and today is Monday the 3rd, the next market is on Wednesday the 5th.',
    questionImage: 'market_hours.jpg', imageLayout: 'context',
    options: [
      { id: 'true', label: 'True', correct: true },
      { id: 'false', label: 'False', correct: false },
    ],
    hint: 'Monday the 3rd + 2 days = Wednesday the 5th.',
    explanation: 'Monday + 1 day = Tuesday. Tuesday + 1 day = Wednesday. Monday 3rd + 2 days = Wednesday 5th.',
  },
  {
    id: 'tp_t3_adv_7', skill: 'time_planning', tier: 3, difficulty: 'advanced',
    type: 'sequential_steps', topic: 'daily_planning',
    question: 'You need to organise a family meeting for next Saturday. Put these planning steps in the correct order.',
    questionImage: 'schedule_day.jpg', imageLayout: 'context',
    steps: [
      { id: 's1', label: 'Decide the purpose and agenda of the meeting', order: 1 },
      { id: 's2', label: 'Choose a time that works for everyone', order: 2 },
      { id: 's3', label: 'Confirm the venue and any refreshments needed', order: 3 },
      { id: 's4', label: 'Inform all family members at least 2 days before', order: 4 },
      { id: 's5', label: 'Set a reminder for yourself the day before', order: 5 },
    ],
    hint: 'Plan the content first, then logistics, then communication.',
    explanation: 'Agenda → time → venue → inform others → set reminder. Good organisation ensures everyone is prepared.',
  },
]
