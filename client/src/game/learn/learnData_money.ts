// learnData_money.ts
// Money & Transactions — Tier 1 learn modules
// 3 modules: Easy, Intermediate, Advanced
// Each module has slides. Each slide can have sub-slides (swiped through inline).

export type LearnSubSlide = {
  image?: string
  image2?: string
  vertical?: boolean
  result?: string
  caption: string
}

export type LearnSlide = {
  subSlides: LearnSubSlide[]
}

export type LearnModule = {
  title: string
  slides: LearnSlide[]
}

export const MONEY_LEARN_DATA: Record<string, LearnModule> = {

  easy: {
    title: 'Kenyan Money',
    slides: [
      {
        subSlides: [
          { image: 'money_intro.png', caption: 'In Kenya, we use coins and notes to buy things.' },
        ],
      },
      {
        subSlides: [
          { image: 'coins_all.jpg', caption: 'Coins come in different values.' },
          { image: 'coin_1.jpg',  caption: 'This is 1 shilling (1 bob) — the smallest coin.' },
          { image: 'coin_5.jpg',  caption: 'This is 5 shillings (5 bob).' },
          { image: 'coin_10.jpg', caption: 'This is 10 shillings (10 bob).' },
          { image: 'coin_20.jpg', caption: 'This is 20 shillings (20 bob).' },
          { image: 'coin_40.jpg', caption: 'This is 40 shillings — the largest coin.' },
        ],
      },
      {
        subSlides: [
          { image: 'notes_intro.jpg', caption: 'Notes come in different values too.' },
          { image: 'note_50.jpg',   caption: 'This is a 50 shilling note — reddish in colour.' },
          { image: 'note_100.jpg',  caption: 'This is a 100 shilling note — purple.' },
          { image: 'note_200.jpg',  caption: 'This is a 200 shilling note — blue.' },
          { image: 'note_500.png',  caption: 'This is a 500 shilling note — green.' },
          { image: 'note_1000.jpg', caption: 'This is a 1,000 shilling note — brown. The highest value.' },
        ],
      },
      {
        subSlides: [
          { image: 'notes_all.jpg', caption: 'Every note has its own colour. Use the colour to tell them apart quickly.' },
        ],
      },
      {
        subSlides: [
          { image: 'note_compare.jpg', caption: 'A bigger number always means more money. KES 1,000 buys more than KES 50.' },
        ],
      },
    ],
  },

  intermediate: {
    title: 'Counting & Combining',
    slides: [
      {
        subSlides: [
          { image: 'counting_intro.jpg', caption: 'When you have more than one coin or note, add them together to find your total.' },
        ],
      },
      {
        subSlides: [
          { image: 'coins_spread.jpg', caption: "Let's see how coins add up." },
          { image: 'coin_5.jpg', image2: 'coin_5.jpg', vertical: true, result: '10/-', caption: '5 bob + 5 bob = 10 shillings.' },
          { image: 'coin_10.jpg', image2: 'coin_10.jpg', vertical: true, result: '20/-', caption: '10 bob + 10 bob = 20 shillings.' },
          { image: 'coin_20.jpg', image2: 'coin_10.jpg', vertical: true, result: '30/-', caption: '20 bob + 10 bob = 30 shillings.' },
          { image: 'coin_20.jpg', image2: 'coin_20.jpg', vertical: true, result: '40/-', caption: '20 bob + 20 bob = 40 shillings.' },
          { image: 'coin_20.jpg', image2: 'coin_10.jpg', vertical: true, result: '50/-', caption: '20 + 20 + 10 = 50 shillings.' },
        ],
      },
      {
        subSlides: [
          { image: 'notes_spread.jpg', caption: 'Notes add up the same way.' },
          { image: 'note_50.jpg', image2: 'note_50.jpg', vertical: true, result: 'KES 100', caption: 'KES 50 + KES 50 = KES 100. Same as one KES 100 note.' },
          { image: 'note_100.jpg', image2: 'note_100.jpg', vertical: true, result: 'KES 200', caption: 'KES 100 + KES 100 = KES 200.' },
          { image: 'note_200.jpg', image2: 'note_200.jpg', vertical: true, result: 'KES 400', caption: 'KES 200 + KES 200 = KES 400.' },
          { image: 'note_500.png', image2: 'note_500.png', vertical: true, result: 'KES 1,000', caption: 'KES 500 + KES 500 = KES 1,000.' },
        ],
      },
      {
        subSlides: [
          { image: 'price_tag_30.png',  caption: 'This item costs KES 30.' },
          { image: 'coins_25.jpg', caption: 'You have KES 25. That is not enough.' },
          { image: 'coins_30.jpg',  caption: 'You have KES 30. That is exactly enough.' },
          { image: 'coins_40.jpg',  caption: 'You have KES 40. That is more than enough — you get change back.' },
        ],
      },
      {
        subSlides: [
          { image: 'notes_small.jpg',   caption: 'KES 50 and KES 100 are for everyday small purchases — bread, milk, airtime.' },
          { image: 'notes_large.jpg', caption: 'KES 500 and KES 1,000 are for bigger purchases — groceries, transport, bills.' },
        ],
      },
    ],
  },

  advanced: {
    title: 'Paying the Right Amount',
    slides: [
      {
        subSlides: [
          { image: 'shop_counter.jpg', caption: 'When you buy something, you need to know if you have enough — and how much change to expect.' },
        ],
      },
      {
        subSlides: [
          { image: 'price_tag_55.png', caption: 'This item costs KES 55.' },
          { image: 'wallet_50_no.png', caption: 'You have KES 50. That is less than KES 55. You cannot buy it.' },
          { image: 'wallet_100_yes.png', caption: 'You have KES 100. That is more than KES 55. You can buy it.' },
        ],
      },
      {
        subSlides: [
          { image: 'coins_spread.jpg', caption: 'Sometimes you can combine coins to make the exact price.' },
          { image: 'exact_45.jpg', caption: 'KES 20 + KES 20 + KES 5 = KES 45 exactly.' },
          { image: 'exact_30.jpg', caption: 'KES 20 + KES 10 = KES 30 exactly.' },
          { image: 'coins_spread.jpg', caption: 'Paying the exact amount means no change needed — quicker and easier.' },
        ],
      },
      {
        subSlides: [
          { image: 'overpay_intro.png', caption: 'It is fine to pay more than the price.' },
          { image: 'note_100.jpg', image2: 'price_tag_55.png', vertical: true, result: 'KES 45 change', caption: 'Item costs KES 55. You give KES 100.' },
          { image: 'change_45.jpg', caption: 'The shopkeeper gives you KES 45 back. That is your change.' },
          { image: 'note_compare.jpg', caption: 'Change = what you paid minus the price. 100 − 55 = 45.' },
        ],
      },
      {
        subSlides: [
          { image: 'shopping_list.png', caption: 'If you are buying more than one thing, add the prices before you pay.' },
          { image: 'items_three.png', caption: 'Bread KES 50. Milk KES 70. Sugar KES 80.' },
          { image: 'total_200.png', caption: '50 + 70 + 80 = KES 200 total.' },
          { image: 'wallet_200_yes.png', caption: 'You have KES 200. You can buy all three.' },
          { image: 'wallet_150_no.png', caption: 'You have KES 150. That is not enough. You need to put something back.' },
        ],
      },
      {
        subSlides: [
          { image: 'counting_intro.jpg', caption: 'Before you go to the shop, count all your coins and notes.' },
          { image: 'total_known.jpg', caption: 'Knowing your total helps you decide what you can buy.' },
        ],
      },
    ],
  },

  tier2_easy: {
    title: 'Paying & Getting Change',
    slides: [
      {
        subSlides: [
          { image: 'shop_counter.jpg', caption: 'When you buy something, you usually pay with a note. The shopkeeper gives you the difference back. That is called change.' },
        ],
      },
      {
        subSlides: [
          { image: 'note_100.jpg', image2: 'note_50.jpg', vertical: true, result: 'KES 50 change', caption: 'You give KES 100. The item costs KES 50.' },
          { image: 'change_45.jpg', caption: 'The shopkeeper gives you the difference back. That is your change.' },
          { image: 'note_compare.jpg', caption: 'Change = what you gave minus the price. 100 − 50 = 50.' },
        ],
      },
      {
        subSlides: [
          { image: 'counting_intro.jpg', caption: 'Before you leave the shop, always count your change.' },
          { image: 'coins_spread.jpg', caption: 'Check the amount matches what you expected.' },
          { image: 'overpay_intro.png', caption: "If it is wrong, politely say: 'I think my change is short.'" },
        ],
      },
      {
        subSlides: [
          { image: 'shopping_list.png', caption: 'Use the note closest to the price — not too small, not too big.' },
          { image: 'wallet_50_no.png', caption: 'Item costs KES 55. KES 50 is not enough.' },
          { image: 'wallet_100_yes.png', caption: 'KES 100 works. You get KES 45 change.' },
          { image: 'wallet_200_yes.png', caption: 'KES 500 also works but gives too much change to manage.' },
        ],
      },
    ],
  },

  tier2_intermediate: {
    title: 'Shopping Smart',
    slides: [
      {
        subSlides: [
          { image: 'items_three.png', caption: 'When buying more than one thing, add all the prices first before you pay.' },
        ],
      },
      {
        subSlides: [
          { image: 'items_three.png', caption: 'Milk KES 75. Sugar KES 120. That is two items.' },
          { image: 'note_200.jpg', image2: 'note_50.jpg', vertical: true, result: 'KES 195', caption: '75 + 120 = KES 195 total.' },
          { image: 'change_45.jpg', caption: 'You pay KES 200. Change = 200 − 195 = KES 5.' },
        ],
      },
      {
        subSlides: [
          { image: 'wallet_200_yes.png', caption: 'Before you shop, know exactly how much money you have.' },
          { image: 'shopping_list.png', caption: 'Add up your list. If it is under your budget, you are fine.' },
          { image: 'total_200.png', caption: 'If it goes over, put something back.' },
        ],
      },
      {
        subSlides: [
          { image: 'shop_counter.jpg', caption: 'Always buy the most important things first.' },
          { image: 'items_three.png', caption: 'Food, transport money, and medicine come first.' },
          { image: 'shopping_list.png', caption: 'Snacks, drinks, and extras come after essentials are covered.' },
        ],
      },
      {
        subSlides: [
          { image: 'counting_intro.jpg', caption: 'After buying several things, calculate what change you expect before the shopkeeper gives it to you.' },
          { image: 'coins_spread.jpg', caption: 'Add your items. Subtract from what you paid. That is what you should receive.' },
        ],
      },
    ],
  },

  tier2_advanced: {
    title: 'Money Safety & Budgeting',
    slides: [
      {
        subSlides: [
          { image: 'shop_counter.jpg', caption: 'Having money is not enough — you need to know how to protect it and make it last.' },
        ],
      },
      {
        subSlides: [
          { image: 'shopping_list.png', caption: 'A budget is a plan for your money before you spend it.' },
          { image: 'wallet_200_yes.png', caption: 'You have KES 500 for the week. List what you need to spend it on.' },
          { image: 'total_200.png', caption: 'Food, transport, airtime. Add them up. What is left is yours to use freely.' },
          { image: 'wallet_150_no.png', caption: 'If your expenses are more than your budget — something must go.' },
        ],
      },
      {
        subSlides: [
          { image: 'items_three.png', caption: 'Impulse buying means spending on something you did not plan for.' },
          { image: 'shopping_list.png', caption: 'You went to buy bread. You also bought biscuits, a soda, and sweets.' },
          { image: 'wallet_150_no.png', caption: 'Now your budget is gone and you cannot afford something important.' },
          { image: 'total_known.jpg', caption: 'Ask yourself: did I plan for this? Do I need it today? If no — leave it.' },
        ],
      },
      {
        subSlides: [
          { image: 'overpay_intro.png', caption: 'Never count large amounts of cash in public.' },
          { image: 'shop_counter.jpg', caption: 'Counting money at a market stall or bus stage draws attention.' },
          { image: 'counting_intro.jpg', caption: 'Count your money at home or in a private place.' },
          { image: 'wallet_200_yes.png', caption: 'Keep cash in an inner pocket or zipped bag. Never leave it on a table or give it to strangers to hold.' },
        ],
      },
    ],
  },

  tier3_easy: {
    title: 'Shopping on Your Own',
    slides: [
      {
        subSlides: [
          { image: 'shop_counter.jpg', caption: 'Shopping on your own means following the right steps every time — from checking the price to counting your change before you leave.' },
        ],
      },
      {
        subSlides: [
          { image: 'total_known.jpg', caption: 'Every time you buy something, follow these steps.' },
          { image: 'price_tag_55.png', caption: 'Step 1: Check the price before you pick it up.' },
          { image: 'wallet_100_yes.png', caption: 'Step 2: Check you have enough money.' },
          { image: 'overpay_intro.png', caption: 'Step 3: Hand over your money.' },
          { image: 'counting_intro.jpg', caption: 'Step 4: Count your change before you leave.' },
        ],
      },
      {
        subSlides: [
          { image: 'shop_counter.jpg', caption: 'When you are in a busy place — like a matatu stage or market — be careful with your money.' },
          { image: 'wallet_200_yes.png', caption: 'Prepare your fare before you leave home. Keep it separate so you do not need to open your wallet in public.' },
          { image: 'wallet_100_yes.png', caption: 'Keep your money in an inner pocket or zipped bag.' },
          { image: 'overpay_intro.png', caption: 'Never let a stranger hold your money — even for a moment.' },
        ],
      },
      {
        subSlides: [
          { image: 'coins_spread.jpg', caption: 'If your change is wrong, stay calm and polite.' },
          { image: 'change_45.jpg', caption: 'Calculate what you should have received. Then tell the shopkeeper clearly and calmly.' },
          { image: 'shop_counter.jpg', caption: "Say: 'Excuse me, I think my change should be KES ___.' Most shopkeepers will correct it." },
        ],
      },
    ],
  },

  tier3_intermediate: {
    title: 'Planning Your Week',
    slides: [
      {
        subSlides: [
          { image: 'shopping_list.png', caption: 'Planning your money for the week means you always have enough for what matters most.' },
        ],
      },
      {
        subSlides: [
          { image: 'wallet_200_yes.png', caption: 'Start by writing down how much money you have for the whole week.' },
          { image: 'shopping_list.png', caption: 'List your essentials: lunch KES 300, bus fare KES 200, airtime KES 100. Total: KES 600.' },
          { image: 'total_200.png', caption: '800 − 600 = KES 200 left. Decide how much to save first, then spend the rest.' },
          { image: 'wallet_150_no.png', caption: 'If you have KES 200 left and save KES 50, you have KES 150 for other spending.' },
        ],
      },
      {
        subSlides: [
          { image: 'items_three.png', caption: 'Essentials are things you must have to function every day.' },
          { image: 'shopping_list.png', caption: 'Food, transport, school materials, medicine — these are essentials.' },
          { image: 'total_known.jpg', caption: 'New clothes, eating out, phone cases — these can wait.' },
          { image: 'wallet_200_yes.png', caption: 'Always cover essentials first. Then decide what to do with what is left.' },
        ],
      },
      {
        subSlides: [
          { image: 'counting_intro.jpg', caption: 'Saving means keeping some money aside before you spend on wants.' },
          { image: 'wallet_200_yes.png', caption: 'Put your savings aside first — even KES 50 a week adds up.' },
          { image: 'wallet_150_no.png', caption: 'If you wait until the end of the week to save, there is usually nothing left.' },
        ],
      },
    ],
  },

  tier3_advanced: {
    title: 'Staying in Control',
    slides: [
      {
        subSlides: [
          { image: 'shop_counter.jpg', caption: 'When you handle larger amounts of money, small mistakes become bigger problems. Always verify, always plan.' },
        ],
      },
      {
        subSlides: [
          { image: 'items_three.png', caption: 'When you buy many items, always add them up yourself before paying.' },
          { image: 'total_200.png', caption: 'The shopkeeper says your total is KES 1,500. You add it yourself: KES 1,400.' },
          { image: 'shop_counter.jpg', caption: "Politely say: 'I counted KES 1,400 — can we check together?' Most mistakes are honest ones." },
          { image: 'wallet_150_no.png', caption: 'Never pay an amount you have not verified yourself.' },
        ],
      },
      {
        subSlides: [
          { image: 'shopping_list.png', caption: 'A monthly budget works the same as a weekly one — just bigger.' },
          { image: 'wallet_200_yes.png', caption: 'You earn KES 2,500 this month. List all your expenses first.' },
          { image: 'total_200.png', caption: 'Food KES 800, transport KES 400, airtime KES 300, savings KES 200. Total: KES 1,700.' },
          { image: 'total_known.jpg', caption: '2,500 − 1,700 = KES 800 left for other spending.' },
        ],
      },
      {
        subSlides: [
          { image: 'overpay_intro.png', caption: 'If you receive a large amount of cash — like from selling something — follow these rules.' },
          { image: 'counting_intro.jpg', caption: 'Count it privately, not in public.' },
          { image: 'wallet_200_yes.png', caption: 'Put it directly in a secure inner pocket or zipped bag.' },
          { image: 'shop_counter.jpg', caption: 'Do not tell anyone how much you are carrying. Go straight home or to a safe place.' },
        ],
      },
    ],
  },
}
