import type { LearnModule } from './learnData_money'

export const TIME_LEARN_DATA: Record<string, LearnModule> = {

  easy: {
    title: 'Reading the Clock',
    slides: [
      { subSlides: [{ image: 'clock_face.jpg', caption: 'A clock has a face with numbers 1 to 12 arranged in a circle.' }] },
      { subSlides: [
        { image: 'clock_hands.jpg', caption: 'The short hand points to the hour.' },
        { image: 'clock_face.jpg', caption: 'The long hand shows the minutes.' },
      ]},
      { subSlides: [
        { image: 'clock_300.jpg', caption: 'Short hand on 3, long hand on 12 — that is 3 o\'clock.' },
        { image: 'clock_600.jpg', caption: 'Short hand on 6, long hand on 12 — that is 6 o\'clock.' },
      ]},
      { subSlides: [
        { image: 'morning_school.jpg', caption: 'AM is morning — from midnight to noon.' },
        { image: 'noon_sun.jpg', caption: 'PM is afternoon and evening — from noon to midnight.' },
        { image: 'clock_face.jpg', caption: 'Noon is 12 PM. Midnight is 12 AM.' },
      ]},
    ],
  },

  intermediate: {
    title: 'Hours and Half Hours',
    slides: [
      { subSlides: [{ image: 'clock_face.jpg', caption: 'There are 60 minutes in one hour.' }] },
      { subSlides: [
        { image: 'clock_330.jpg', caption: 'When the long hand points to 6, it is half past the hour — 30 minutes have passed.' },
        { image: 'clock_730.jpg', caption: 'Half past 7 is written as 7:30.' },
        { image: 'clock_1030.jpg', caption: 'Half past 10 is written as 10:30.' },
      ]},
      { subSlides: [
        { image: 'clock_500.jpg', caption: 'To add hours, count forward on the clock.' },
        { image: 'clock_700.jpg', caption: '5 o\'clock plus 2 hours = 7 o\'clock.' },
      ]},
      { subSlides: [
        { image: 'morning_school.jpg', caption: 'To get somewhere on time, subtract travel time from when you need to arrive.' },
        { image: 'clock_730.jpg', caption: 'Need to be there at 8:00 AM? Travel takes 30 minutes? Leave at 7:30 AM.' },
      ]},
      { subSlides: [{ image: 'day_cycle.jpg', caption: 'One full day has 24 hours — 12 AM hours and 12 PM hours.' }] },
    ],
  },

  advanced: {
    title: 'Quarter Hours and AM/PM',
    slides: [
      { subSlides: [{ image: 'clock_face.jpg', caption: 'A quarter of an hour is 15 minutes.' }] },
      { subSlides: [
        { image: 'clock_415.jpg', caption: 'Quarter past 4 means 15 minutes after 4 — written as 4:15.' },
        { image: 'clock_545.jpg', caption: 'Quarter to 6 means 15 minutes before 6 — written as 5:45.' },
      ]},
      { subSlides: [
        { image: 'clock_145.jpg', caption: 'To find time between two moments, count forward from the earlier time.' },
        { image: 'clock_415.jpg', caption: '1:45 to 2:15 — count 15 minutes to 2:00, then 15 more to 2:15. Total: 30 minutes.' },
      ]},
      { subSlides: [
        { image: 'morning_school.jpg', caption: 'AM is before noon. PM is after noon.' },
        { image: 'noon_sun.jpg', caption: '12 PM is noon. 12 AM is midnight.' },
        { image: 'schedule_school.jpg', caption: 'A school day from 7:30 AM to 3:30 PM lasts 8 hours.' },
      ]},
      { subSlides: [{ image: 'daily_routine.jpg', caption: 'A typical day follows a sequence — wake, eat, work, eat, home, sleep.' }] },
    ],
  },

  tier2_easy: {
    title: 'Reading Schedules',
    slides: [
      { subSlides: [{ image: 'bus_schedule.jpg', caption: 'A schedule tells you when something starts or happens.' }] },
      { subSlides: [
        { image: 'bus_schedule.jpg', caption: 'If a bus leaves at 7:00 AM and you arrive at 7:15 AM, you have missed it.' },
        { image: 'clock_940.jpg', caption: 'Always arrive a few minutes early — not exactly on time.' },
      ]},
      { subSlides: [{ image: 'clinic_schedule.jpg', caption: 'If a clinic opens at 8:00 AM, you cannot be seen at 7:45 AM — it is not open yet.' }] },
      { subSlides: [
        { image: 'market_hours.jpg', caption: 'Always check opening and closing times before you go.' },
        { image: 'morning_school.jpg', caption: 'Subtract travel time from arrival time to know when to leave.' },
      ]},
      { subSlides: [{ image: 'tv_schedule.jpg', caption: 'A programme starting at 8 PM lasting 1 hour ends at 9 PM.' }] },
    ],
  },

  tier2_intermediate: {
    title: 'Planning Your Time',
    slides: [
      { subSlides: [{ image: 'schedule_day.jpg', caption: 'Planning your time means knowing what to do and when to do it.' }] },
      { subSlides: [{ image: 'daily_routine.jpg', caption: 'Sort activities into AM and PM — morning tasks before noon, afternoon tasks after.' }] },
      { subSlides: [{ image: 'schedule_errands.jpg', caption: 'When you have multiple errands, do the one that closes soonest first.' }] },
      { subSlides: [
        { image: 'clock_930.jpg', caption: 'Add task durations to find when you will finish.' },
        { image: 'clock_1030.jpg', caption: 'Meeting starts at 9:30 AM and lasts 2 hours 30 minutes — it ends at 12:00 PM.' },
      ]},
      { subSlides: [
        { image: 'sleep_schedule.jpg', caption: 'Plan your sleep by counting backwards — 8 hours before your wake-up time.' },
        { image: 'morning_school.jpg', caption: 'Prepare what you need the night before to save time in the morning.' },
      ]},
    ],
  },

  tier2_advanced: {
    title: 'Managing Your Day',
    slides: [
      { subSlides: [{ image: 'schedule_day.jpg', caption: 'Managing your day means fitting everything in without running out of time.' }] },
      { subSlides: [
        { image: 'schedule_day.jpg', caption: 'Calculate total free time first — then see what fits.' },
        { image: 'schedule_errands.jpg', caption: 'List tasks with their duration. Add them up. Compare to your free time.' },
      ]},
      { subSlides: [
        { image: 'bus_schedule.jpg', caption: 'Matatus run on a schedule. Know the times so you never miss one.' },
        { image: 'bus_schedule.jpg', caption: 'If a matatu runs every 30 minutes from 6:00 AM — times are 6:00, 6:30, 7:00, 7:30...' },
      ]},
      { subSlides: [{ image: 'phone_alarm.jpg', caption: 'Always double-check AM and PM when setting alarms — getting it wrong means missing important plans.' }] },
      { subSlides: [
        { image: 'sleep_schedule.jpg', caption: 'Need 8 hours sleep and wake at 5:30 AM? Sleep by 9:30 PM.' },
        { image: 'schedule_day.jpg', caption: 'Plan tomorrow tonight — list tasks, estimate time, assign slots, check for conflicts.' },
      ]},
    ],
  },

  tier3_easy: {
    title: 'Getting Everywhere on Time',
    slides: [
      { subSlides: [{ image: 'clinic_schedule.jpg', caption: 'To get to any appointment on time, plan backwards from the arrival time.' }] },
      { subSlides: [
        { image: 'clinic_schedule.jpg', caption: 'Appointment at 9:00 AM. Travel: 1 hour. Prep: 30 minutes. Wake up at 7:30 AM.' },
        { image: 'morning_school.jpg', caption: 'Always add extra time — unexpected delays happen.' },
      ]},
      { subSlides: [
        { image: 'work_schedule.jpg', caption: 'Calculate total working time by adding all time blocks and subtracting breaks.' },
        { image: 'clock_930.jpg', caption: '8:00 AM to 4:30 PM = 8.5 hours. Minus 30 min break = 8 working hours.' },
      ]},
      { subSlides: [
        { image: 'market_hours.jpg', caption: 'Always check if a place is open before you go — days matter too, not just hours.' },
        { image: 'phone_alarm.jpg', caption: 'When you make a commitment to someone, honour it — be on time.' },
      ]},
      { subSlides: [
        { image: 'bus_schedule.jpg', caption: 'Estimate travel time before leaving — distance divided by speed gives time.' },
        { image: 'clinic_schedule.jpg', caption: 'Know the steps: find out details → plan travel → set alarm → prepare → leave early.' },
      ]},
    ],
  },

  tier3_intermediate: {
    title: 'Planning a Full Day',
    slides: [
      { subSlides: [{ image: 'schedule_day.jpg', caption: 'Planning a full day means fitting all your tasks into your available time.' }] },
      { subSlides: [
        { image: 'schedule_day.jpg', caption: 'Add up all task durations. If the total is less than your free time, you can do everything.' },
        { image: 'schedule_errands.jpg', caption: 'Cooking 1hr + shopping 45min + homework 2hrs + laundry 30min + call 15min = 4hrs 30min.' },
      ]},
      { subSlides: [
        { image: 'daily_routine.jpg', caption: 'Sort events by time of day — early morning, morning, afternoon, evening, night.' },
        { image: 'schedule_day.jpg', caption: 'Each event belongs to a time bracket. Knowing this helps you plan your day clearly.' },
      ]},
      { subSlides: [
        { image: 'bus_schedule.jpg', caption: 'When you are late, choose the fastest option that gets you there in time.' },
        { image: 'work_schedule.jpg', caption: 'Multiply daily hours by days worked to find total hours for the week.' },
      ]},
      { subSlides: [
        { image: 'morning_school.jpg', caption: 'When managing two commitments in the morning, plan the most efficient route — do not go back home unnecessarily.' },
        { image: 'schedule_day.jpg', caption: 'Plan the week: list fixed commitments → find gaps → assign tasks → add buffer → review daily.' },
      ]},
    ],
  },

  tier3_advanced: {
    title: 'Staying in Control of Your Time',
    slides: [
      { subSlides: [{ image: 'work_schedule.jpg', caption: 'Staying in control of your time means planning carefully and adapting when things change.' }] },
      { subSlides: [
        { image: 'work_schedule.jpg', caption: 'For important events, add prep time and travel time, then count back from the start time to find your wake-up time.' },
        { image: 'clinic_schedule.jpg', caption: 'Interview at 10:00 AM. Travel 1hr15min. Prep 45min. Wake up at 8:00 AM.' },
      ]},
      { subSlides: [
        { image: 'schedule_day.jpg', caption: 'Prioritise time-sensitive and health tasks first. Non-urgent tasks can wait.' },
        { image: 'schedule_errands.jpg', caption: 'Medicine, doctor calls, and closing-time errands come before movies and rearranging furniture.' },
      ]},
      { subSlides: [
        { image: 'work_schedule.jpg', caption: 'Calculate earnings by multiplying hours worked by your hourly rate.' },
        { image: 'phone_alarm.jpg', caption: 'For recurring medicine, take a missed dose as soon as you remember — never double dose.' },
      ]},
      { subSlides: [
        { image: 'morning_school.jpg', caption: 'To build a new morning habit, wake up earlier — calculate exactly how much earlier you need.' },
        { image: 'market_hours.jpg', caption: 'Use calendars to track weekly events — count days forward to find the next occurrence.' },
        { image: 'schedule_day.jpg', caption: 'For group events: decide agenda → agree time → confirm venue → inform everyone → set reminder.' },
      ]},
    ],
  },
}
