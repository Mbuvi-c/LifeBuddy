import type { LearnModule } from './learnData_money'

export const DAILY_ROUTINE_LEARN_DATA: Record<string, LearnModule> = {

  easy: {
    title: 'Starting Your Day',
    slides: [
      { subSlides: [{ image: 'morning_wake.jpg', caption: 'Every day starts the same way — waking up and beginning your morning routine.' }] },
      { subSlides: [
        { image: 'morning_wake.jpg', caption: 'The first thing to do is get out of bed at a consistent time every day.' },
        { image: 'brushing_teeth.jpg', caption: 'Next, brush your teeth and wash your face.' },
        { image: 'breakfast.jpg', caption: 'Eat breakfast to give your body energy for the day.' },
      ]},
      { subSlides: [
        { image: 'breakfast.jpg', caption: 'Breakfast is the morning meal. It gives you energy after a night of sleep.' },
        { image: 'healthy_snack.jpg', caption: 'A good breakfast includes something filling — uji, bread, eggs, or fruit.' },
      ]},
      { subSlides: [
        { image: 'bedtime.jpg', caption: 'Going to bed at the same time every night helps your body build a natural rhythm.' },
        { image: 'brushing_teeth.jpg', caption: 'Before bed, brush your teeth and wash your face.' },
        { image: 'bedtime.jpg', caption: 'A school-age person needs 8 to 10 hours of sleep per night.' },
      ]},
      { subSlides: [
        { image: 'clean_clothes.jpg', caption: 'Wear clean clothes every day. Wash clothes regularly after wearing them.' },
        { image: 'morning_routine.jpg', caption: 'A consistent daily routine saves time and reduces stress.' },
      ]},
    ],
  },

  intermediate: {
    title: 'Building Your Routine',
    slides: [
      { subSlides: [{ image: 'morning_routine.jpg', caption: 'A good morning routine follows the same steps every day in the same order.' }] },
      { subSlides: [
        { image: 'morning_routine.jpg', caption: 'Morning order: wake → toilet → hygiene → dress → eat → leave.' },
        { image: 'morning_rush.jpg', caption: 'When you are late, prioritise hygiene and getting dressed over a full breakfast.' },
      ]},
      { subSlides: [
        { image: 'meal_times.jpg', caption: 'The three main meals are breakfast, lunch, and dinner.' },
        { image: 'healthy_snack.jpg', caption: 'If hungry between meals, choose a small healthy snack — fruit or groundnuts.' },
      ]},
      { subSlides: [
        { image: 'handwashing.jpg', caption: 'Always wash hands with soap and water before eating and after using the toilet.' },
        { image: 'bathing.jpg', caption: 'Bathe or shower every day or at least every other day.' },
        { image: 'tidy_room.jpg', caption: 'Keep your bedroom tidy — it reduces stress and helps you sleep better.' },
      ]},
      { subSlides: [
        { image: 'bedtime_routine.jpg', caption: 'A good bedtime routine: finish tasks → prepare for tomorrow → hygiene → sleep.' },
        { image: 'school_bag.jpg', caption: 'Pack your bag and prepare your clothes the night before to save morning time.' },
      ]},
    ],
  },

  advanced: {
    title: 'Mastering Your Routine',
    slides: [
      { subSlides: [{ image: 'morning_routine.jpg', caption: 'A strong routine handles the unexpected — late starts, missing items, and rushed mornings.' }] },
      { subSlides: [
        { image: 'clean_clothes.jpg', caption: 'Notice problems the night before — dirty uniform, empty bag, missing items.' },
        { image: 'bedtime_routine.jpg', caption: 'Fix them at night so your morning is smooth.' },
      ]},
      { subSlides: [
        { image: 'handwashing.jpg', caption: 'Proper handwashing: wet hands → soap → scrub 20 seconds → rinse → dry.' },
        { image: 'handwashing.jpg', caption: 'Always wash hands after toilet, before food, after animals, and after raw meat.' },
      ]},
      { subSlides: [
        { image: 'breakfast.jpg', caption: 'Never skip breakfast — if time is short, grab something small like a banana or bread.' },
        { image: 'healthy_snack.jpg', caption: 'Your brain needs fuel. A skipped breakfast leads to poor concentration.' },
      ]},
      { subSlides: [
        { image: 'bedtime.jpg', caption: 'Consistent sleep and wake times train your body clock for natural, restful sleep.' },
        { image: 'morning_routine.jpg', caption: 'Routine is not rigid — it adapts when needed, but the core stays consistent.' },
      ]},
    ],
  },

  tier2_easy: {
    title: 'Routine Under Pressure',
    slides: [
      { subSlides: [{ image: 'morning_routine.jpg', caption: 'A good routine helps you stay consistent even on difficult or busy days.' }] },
      { subSlides: [
        { image: 'morning_wake.jpg', caption: 'Even when tired, getting up at your regular time helps your body clock stay on track.' },
        { image: 'morning_routine.jpg', caption: 'Movement and water in the first few minutes help your body wake up faster.' },
      ]},
      { subSlides: [
        { image: 'handwashing.jpg', caption: 'Always wash hands after the toilet — even if hands look clean, germs are invisible.' },
        { image: 'handwashing.jpg', caption: 'If there is no soap, use water — it is still better than nothing.' },
      ]},
      { subSlides: [
        { image: 'healthy_snack.jpg', caption: 'Between meals, choose fruit or light snacks — not heavy fried foods.' },
        { image: 'bedtime.jpg', caption: 'If homework runs late, finish what you can then sleep. A tired mind learns poorly.' },
      ]},
      { subSlides: [
        { image: 'bedtime_routine.jpg', caption: 'Prepare clothes and bag the night before — this saves time and prevents morning panic.' },
        { image: 'morning_routine.jpg', caption: 'A consistent routine is automatic — you do not have to think, you just do.' },
      ]},
    ],
  },

  tier2_intermediate: {
    title: 'Efficient Daily Habits',
    slides: [
      { subSlides: [{ image: 'morning_rush.jpg', caption: 'Efficiency means doing the right things in the right order to save time and energy.' }] },
      { subSlides: [
        { image: 'morning_rush.jpg', caption: 'Multi-task in the morning — start water or food cooking before you bathe.' },
        { image: 'morning_routine.jpg', caption: 'While food cooks, bathe and dress. Then eat and leave. This saves 15 to 20 minutes.' },
      ]},
      { subSlides: [
        { image: 'handwashing.jpg', caption: 'Sort handwashing situations: always wash after toilet, animals, raw meat, and before food.' },
        { image: 'handwashing.jpg', caption: 'Reading, watching TV, or using your phone does not require handwashing.' },
      ]},
      { subSlides: [
        { image: 'bedtime.jpg', caption: 'Screens before bed delay sleep — the blue light tricks your brain into staying awake.' },
        { image: 'bedtime_routine.jpg', caption: 'Put the phone away 30 minutes before bed. Read, pray, or breathe slowly instead.' },
      ]},
      { subSlides: [
        { image: 'bathing.jpg', caption: 'Drink about 8 glasses of water per day — more in hot weather or when exercising.' },
        { image: 'healthy_snack.jpg', caption: 'Regular water intake prevents headaches, tiredness, and poor concentration.' },
      ]},
    ],
  },

  tier2_advanced: {
    title: 'Sustaining Good Habits',
    slides: [
      { subSlides: [{ image: 'morning_routine.jpg', caption: 'Sustaining a routine means keeping it working even when life gets busy or changes.' }] },
      { subSlides: [
        { image: 'morning_routine.jpg', caption: 'To add a new habit like exercise, wake up earlier — do not cut existing essential tasks.' },
        { image: 'morning_rush.jpg', caption: '30 minutes of exercise needs 30 minutes earlier wake-up. No shortcuts.' },
      ]},
      { subSlides: [
        { image: 'healthy_snack.jpg', caption: 'Choose daily foods that give energy: sukuma wiki, eggs, githeri, fruit, groundnuts.' },
        { image: 'healthy_snack.jpg', caption: 'Soda, crisps, and mandazi every day are treats — not daily staples.' },
      ]},
      { subSlides: [
        { image: 'morning_routine.jpg', caption: 'Disrupting your routine on weekends confuses your body clock — Monday becomes harder.' },
        { image: 'bedtime.jpg', caption: 'Adults need 7 to 9 hours of sleep. Children need 9 to 11 hours.' },
      ]},
      { subSlides: [
        { image: 'clean_clothes.jpg', caption: 'Laundry order: sort → wash with soap → scrub → rinse until clear → hang in sun.' },
        { image: 'healthy_snack.jpg', caption: 'Dehydration causes headaches — drink water regularly, not just when very thirsty.' },
      ]},
    ],
  },

  tier3_easy: {
    title: 'Independent Living Basics',
    slides: [
      { subSlides: [{ image: 'morning_routine.jpg', caption: 'When you manage your own routine, consistency in sleep and wake time is the foundation.' }] },
      { subSlides: [
        { image: 'morning_wake.jpg', caption: 'Set a consistent wake time — even on weekends. Your body clock needs regularity.' },
        { image: 'bedtime.jpg', caption: 'Go to bed at the same time each night. If you cannot sleep, keep lying quietly.' },
      ]},
      { subSlides: [
        { image: 'bathing.jpg', caption: 'Personal hygiene matters at home too — bacteria builds up regardless of whether you go out.' },
        { image: 'tidy_room.jpg', caption: 'Remove rubbish and dirty dishes first — these are the main causes of bad smells.' },
      ]},
      { subSlides: [
        { image: 'healthy_snack.jpg', caption: 'Living alone means planning your own meals. Simple nutritious options: eggs, githeri, rice and beans.' },
        { image: 'bedtime.jpg', caption: 'Do not eat a large heavy meal right before sleep — eat at least 2 hours before bed.' },
      ]},
      { subSlides: [
        { image: 'morning_wake.jpg', caption: 'If you cannot wake up on time consistently, go to bed earlier — that is the root fix.' },
        { image: 'tidy_room.jpg', caption: 'House cleaning priority: rubbish → dishes → floor → surfaces → organise.' },
      ]},
    ],
  },

  tier3_intermediate: {
    title: 'Managing Routines for Others',
    slides: [
      { subSlides: [{ image: 'morning_rush.jpg', caption: 'When you are responsible for others, your routine must account for their needs too.' }] },
      { subSlides: [
        { image: 'morning_rush.jpg', caption: 'Caring for a sibling in the morning? Wake 30 minutes earlier to have time for both.' },
        { image: 'morning_routine.jpg', caption: 'Do your hygiene first, then help the sibling while your breakfast cooks — multi-task.' },
      ]},
      { subSlides: [
        { image: 'healthy_snack.jpg', caption: 'With a limited budget, choose foods that fill and nourish — eggs, githeri, groundnuts, fruit.' },
        { image: 'healthy_snack.jpg', caption: 'Soda and crisps are expensive for the nutrition they give. Choose wisely.' },
      ]},
      { subSlides: [
        { image: 'bathing.jpg', caption: 'Limited water? Store clean water during supply hours for use throughout the day.' },
        { image: 'handwashing.jpg', caption: 'When a family member is sick: wash hands before and after contact, keep their space clean.' },
      ]},
      { subSlides: [
        { image: 'morning_rush.jpg', caption: 'Efficient morning cooking: start stove first → bathe while cooking → dress → eat → leave.' },
        { image: 'healthy_snack.jpg', caption: 'A balanced meal: protein + vegetables + carbohydrates. Eggs or beans + sukuma + ugali.' },
      ]},
    ],
  },

  tier3_advanced: {
    title: 'Long-Term Routine Mastery',
    slides: [
      { subSlides: [{ image: 'morning_routine.jpg', caption: 'Long-term routine mastery means adapting your routine as life changes — and getting back up when it breaks.' }] },
      { subSlides: [
        { image: 'morning_routine.jpg', caption: 'New job at 6 AM? Shift your entire routine 3 hours earlier — sleep, wake, and meals all move.' },
        { image: 'morning_routine.jpg', caption: 'Your body clock adjusts within 1 to 2 weeks if you are consistent.' },
      ]},
      { subSlides: [
        { image: 'tidy_room.jpg', caption: 'Shared home hygiene: personal hygiene is your own. Common spaces are shared responsibility.' },
        { image: 'tidy_room.jpg', caption: 'Agree on a shared cleaning schedule — toilet, living area, and rubbish are everyone\'s responsibility.' },
      ]},
      { subSlides: [
        { image: 'healthy_snack.jpg', caption: 'Batch cooking — cooking multiple portions at once — saves time and ensures proper meals always.' },
        { image: 'healthy_snack.jpg', caption: 'Chronic sleep deprivation causes serious health problems: weak immunity, poor memory, and heart risk.' },
      ]},
      { subSlides: [
        { image: 'morning_routine.jpg', caption: 'If stress breaks your routine for weeks, restart immediately — even imperfectly.' },
        { image: 'morning_routine.jpg', caption: 'Two weeks off does not erase months of habit. Be kind to yourself and rebuild gradually.' },
      ]},
    ],
  },
}
