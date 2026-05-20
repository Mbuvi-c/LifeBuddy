from typing import List, Dict, Any

SIMULATION_TASKS: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "money_transactions": {
        "1": [
            {
                "id": "mt_t1_1",
                "type": "tap_identify",
                "instruction": "Tap the KES 20 coin",
                "audio": "Tap the twenty shilling coin",
                "options": ["KES 5", "KES 20", "KES 50"],
                "correct": "KES 20",
                "hint": "The KES 20 coin is gold coloured and larger than the five shilling coin"
            },
            {
                "id": "mt_t1_2",
                "type": "tap_identify",
                "instruction": "Tap the KES 100 note",
                "audio": "Tap the one hundred shilling note",
                "options": ["KES 50", "KES 100", "KES 200"],
                "correct": "KES 100",
                "hint": "The KES 100 note is purple coloured"
            },
            {
                "id": "mt_t1_3",
                "type": "yes_no",
                "instruction": "You want to buy a sweet that costs KES 5. You have KES 10. Do you have enough?",
                "audio": "You want to buy a sweet for five shillings. You have ten shillings. Do you have enough money?",
                "correct": "yes",
                "hint": "Ten is more than five, so you have enough"
            }
        ],
        "2": [
            {
                "id": "mt_t2_1",
                "type": "calculate_change",
                "instruction": "You buy a soda for KES 50. You give KES 100. Tap the correct change.",
                "audio": "You are buying a soda for fifty shillings. You give one hundred shillings. What change should you receive?",
                "options": ["KES 30", "KES 50", "KES 60"],
                "correct": "KES 50",
                "hint": "Subtract the price from what you gave: 100 minus 50"
            },
            {
                "id": "mt_t2_2",
                "type": "calculate_change",
                "instruction": "Bread costs KES 60. You give KES 100. What is your change?",
                "audio": "Bread costs sixty shillings. You give one hundred shillings. What change do you get?",
                "options": ["KES 20", "KES 40", "KES 50"],
                "correct": "KES 40",
                "hint": "100 minus 60 equals 40"
            }
        ],
        "3": [
            {
                "id": "mt_t3_1",
                "type": "budget_challenge",
                "instruction": "You have KES 500. Buy milk (KES 60), bread (KES 45), and sugar (KES 120). How much do you have left?",
                "audio": "You have five hundred shillings. You buy milk for sixty, bread for forty five, and sugar for one hundred and twenty shillings. How much is left?",
                "options": ["KES 255", "KES 275", "KES 295"],
                "correct": "KES 275",
                "hint": "Add up what you spent first: 60 plus 45 plus 120. Then subtract from 500."
            }
        ]
    },

    "time_planning": {
        "1": [
            {
                "id": "tp_t1_1",
                "type": "clock_read",
                "instruction": "What time does this clock show?",
                "audio": "Look at the clock. What time is it?",
                "clock_time": "3:00",
                "options": ["2:00", "3:00", "4:00"],
                "correct": "3:00",
                "hint": "The short hand points to the hour. The long hand at 12 means exactly on the hour."
            },
            {
                "id": "tp_t1_2",
                "type": "clock_read",
                "instruction": "What time does this clock show?",
                "audio": "Look at the clock. What time is it?",
                "clock_time": "6:30",
                "options": ["6:30", "7:30", "6:00"],
                "correct": "6:30",
                "hint": "The long hand pointing to 6 means 30 minutes past the hour."
            }
        ],
        "2": [
            {
                "id": "tp_t2_1",
                "type": "time_difference",
                "instruction": "Your bus leaves at 4:00. It is 3:00 now. How long do you have?",
                "audio": "Your bus leaves at four oclock. It is three oclock now. How long do you have to get ready?",
                "options": ["30 minutes", "1 hour", "2 hours"],
                "correct": "1 hour",
                "hint": "Count from 3 to 4 — that is one hour."
            }
        ],
        "3": [
            {
                "id": "tp_t3_1",
                "type": "schedule_plan",
                "instruction": "You need to be at school by 7:30 AM. Getting dressed takes 20 minutes, breakfast takes 15 minutes, and walking takes 10 minutes. What time should you wake up?",
                "audio": "You must be at school by seven thirty. Getting dressed takes twenty minutes, breakfast fifteen minutes, walking ten minutes. What time should you wake up?",
                "options": ["6:30 AM", "6:45 AM", "7:00 AM"],
                "correct": "6:45 AM",
                "hint": "Add up all the time you need: 20 plus 15 plus 10 equals 45 minutes. Count back 45 minutes from 7:30."
            }
        ]
    },

    "digital_safety": {
        "1": [
            {
                "id": "ds_t1_1",
                "type": "safe_unsafe",
                "instruction": "Read this message: 'You have won KES 5,000! Send your PIN to claim.' Is this message safe or dangerous?",
                "audio": "A message says: You have won five thousand shillings. Send your PIN to claim. Is this message safe or dangerous?",
                "options": ["Safe", "Dangerous"],
                "correct": "Dangerous",
                "hint": "No real company ever asks for your PIN. This is a scam."
            },
            {
                "id": "ds_t1_2",
                "type": "safe_unsafe",
                "instruction": "A stranger online asks: 'What school do you go to?' Should you tell them?",
                "audio": "A stranger online asks what school you go to. Should you tell them?",
                "options": ["Yes", "No"],
                "correct": "No",
                "hint": "Never share personal information with strangers online."
            }
        ],
        "2": [
            {
                "id": "ds_t2_1",
                "type": "choose_action",
                "instruction": "You receive a WhatsApp from an unknown number saying your M-Pesa account is blocked. What do you do?",
                "audio": "An unknown number on WhatsApp says your M-Pesa account is blocked. What should you do?",
                "options": ["Reply with your details", "Call Safaricom directly on 0722 000 100", "Ignore and delete"],
                "correct": "Call Safaricom directly on 0722 000 100",
                "hint": "Always contact the official company number directly — never reply to unknown messages."
            }
        ],
        "3": [
            {
                "id": "ds_t3_1",
                "type": "choose_action",
                "instruction": "Someone online says they are your friend's cousin and asks to borrow money via M-Pesa. What do you do?",
                "audio": "Someone online claims to be your friend's cousin and asks to borrow money through M-Pesa. What do you do?",
                "options": ["Send the money", "Call your friend directly to verify", "Block and report the number"],
                "correct": "Call your friend directly to verify",
                "hint": "Always verify through a trusted contact before sending money to anyone online."
            }
        ]
    },

    "mobile_money": {
        "1": [
            {
                "id": "mm_t1_1",
                "type": "tap_identify",
                "instruction": "On the M-Pesa menu, where do you check your balance?",
                "audio": "On the M-Pesa menu, which option shows you how much money you have?",
                "options": ["Send Money", "My Account", "Buy Goods"],
                "correct": "My Account",
                "hint": "Your balance is found under My Account on the M-Pesa menu."
            },
            {
                "id": "mm_t1_2",
                "type": "yes_no",
                "instruction": "Should you share your M-Pesa PIN with anyone?",
                "audio": "Should you ever share your M-Pesa PIN with another person?",
                "correct": "no",
                "hint": "Your PIN is private. Never share it — not even with family or Safaricom agents."
            }
        ],
        "2": [
            {
                "id": "mm_t2_1",
                "type": "step_sequence",
                "instruction": "Put these M-Pesa steps in the correct order to send money",
                "audio": "Arrange these steps in the correct order to send money on M-Pesa",
                "steps": ["Enter PIN", "Select Send Money", "Enter amount", "Enter recipient number", "Confirm"],
                "correct": ["Select Send Money", "Enter recipient number", "Enter amount", "Confirm", "Enter PIN"],
                "hint": "You choose what to do first, then who to send to, then how much, then confirm, then enter your PIN last."
            }
        ],
        "3": [
            {
                "id": "mm_t3_1",
                "type": "safe_unsafe",
                "instruction": "You receive: 'MPESA ALERT: KES 2000 sent to 0712345678. If not you, call 0800 111 222 NOW.' Is this message real or fake?",
                "audio": "You receive an M-Pesa alert saying two thousand shillings was sent. It asks you to call a number if it was not you. Is this message real or fake?",
                "options": ["Real", "Fake — it is a scam"],
                "correct": "Fake — it is a scam",
                "hint": "Real M-Pesa messages come from MPESA. Check the sender name carefully."
            }
        ]
    },

    "communication_advocacy": {
        "1": [
            {
                "id": "ca_t1_1",
                "type": "choose_action",
                "instruction": "You feel unwell at school. What do you say to your teacher?",
                "audio": "You are feeling unwell at school. What should you say to your teacher?",
                "options": ["Nothing — stay quiet", "Teacher, I am not feeling well, can I rest?", "Go home without telling anyone"],
                "correct": "Teacher, I am not feeling well, can I rest?",
                "hint": "Always speak up when you need help. Your teacher cannot help if they do not know."
            }
        ],
        "2": [
            {
                "id": "ca_t2_1",
                "type": "choose_action",
                "instruction": "A shopkeeper gives you the wrong change. What do you do?",
                "audio": "A shopkeeper gives you the wrong change. What should you do?",
                "options": ["Say nothing and leave", "Politely say: Excuse me, I think my change is wrong", "Get angry and demand your money"],
                "correct": "Politely say: Excuse me, I think my change is wrong",
                "hint": "You have the right to correct change. Be calm and polite when you speak up."
            }
        ],
        "3": [
            {
                "id": "ca_t3_1",
                "type": "choose_action",
                "instruction": "Your employer asks you to work on your day off without extra pay. What do you do?",
                "audio": "Your employer asks you to work on your day off without paying you extra. What should you do?",
                "options": ["Work without saying anything", "Politely explain you are entitled to rest days or extra pay", "Refuse and quit immediately"],
                "correct": "Politely explain you are entitled to rest days or extra pay",
                "hint": "You have workplace rights. You can advocate for yourself calmly and professionally."
            }
        ]
    },

    "financial_planning": {
        "1": [
            {
                "id": "fp_t1_1",
                "type": "yes_no",
                "instruction": "You earn KES 500 a week. You spend KES 200 on food. Do you have money left over?",
                "audio": "You earn five hundred shillings a week and spend two hundred on food. Do you have money left over?",
                "correct": "yes",
                "hint": "500 minus 200 equals 300. You have three hundred shillings left."
            },
            {
                "id": "fp_t1_2",
                "type": "choose_action",
                "instruction": "Which is a NEED and which is a WANT? Food or a new phone?",
                "audio": "Which of these is a need and which is a want — food or a new phone?",
                "options": ["Food is a need, phone is a want", "Phone is a need, food is a want", "Both are needs"],
                "correct": "Food is a need, phone is a want",
                "hint": "Needs are things you must have to survive. Wants are things you would like but do not need."
            }
        ],
        "2": [
            {
                "id": "fp_t2_1",
                "type": "budget_challenge",
                "instruction": "You earn KES 2000 this week. Rent is KES 800, food is KES 500. How much can you save?",
                "audio": "You earn two thousand shillings. Rent costs eight hundred and food costs five hundred. How much can you save?",
                "options": ["KES 500", "KES 700", "KES 800"],
                "correct": "KES 700",
                "hint": "Add your expenses: 800 plus 500 equals 1300. Subtract from 2000: 2000 minus 1300 equals 700."
            }
        ],
        "3": [
            {
                "id": "fp_t3_1",
                "type": "choose_action",
                "instruction": "You want to buy a phone for KES 8000. You save KES 500 per week. How many weeks will it take?",
                "audio": "You want to buy a phone that costs eight thousand shillings. You save five hundred shillings per week. How many weeks will it take?",
                "options": ["12 weeks", "16 weeks", "20 weeks"],
                "correct": "16 weeks",
                "hint": "Divide the total cost by your weekly saving: 8000 divided by 500 equals 16."
            }
        ]
    },

    "community_safety": {
        "1": [
            {
                "id": "cs_t1_1",
                "type": "choose_action",
                "instruction": "You have a high fever and headache. Where should you go?",
                "audio": "You have a high fever and a headache. Where should you go for help?",
                "options": ["Supermarket", "Hospital or clinic", "Matatu stop"],
                "correct": "Hospital or clinic",
                "hint": "When you are sick, the right place to go is a hospital or clinic."
            }
        ],
        "2": [
            {
                "id": "cs_t2_1",
                "type": "choose_action",
                "instruction": "A doctor gives you a prescription. What does it tell you?",
                "audio": "A doctor gives you a prescription after your appointment. What does the prescription tell you?",
                "options": ["What food to eat", "What medicine to take and how often", "How much the appointment costs"],
                "correct": "What medicine to take and how often",
                "hint": "A prescription tells you the name of the medicine, how much to take, and how often to take it."
            }
        ],
        "3": [
            {
                "id": "cs_t3_1",
                "type": "choose_action",
                "instruction": "You see someone collapse on the street. What is the first thing you do?",
                "audio": "You see someone collapse on the street. What is the first thing you should do?",
                "options": ["Walk away", "Call 999 or 0800 720 999 for emergency services", "Take a photo and post it"],
                "correct": "Call 999 or 0800 720 999 for emergency services",
                "hint": "In an emergency always call for help first. Kenya emergency number is 999."
            }
        ]
    },

    "workplace_readiness": {
        "1": [
            {
                "id": "wr_t1_1",
                "type": "clock_read",
                "instruction": "Your work schedule says you start at 8:00 AM on Monday. What time should you arrive?",
                "audio": "Your work schedule says you start at eight in the morning on Monday. What time should you arrive?",
                "options": ["8:30 AM", "8:00 AM or earlier", "9:00 AM"],
                "correct": "8:00 AM or earlier",
                "hint": "Always arrive on time or a few minutes early. Being late is not professional."
            }
        ],
        "2": [
            {
                "id": "wr_t2_1",
                "type": "choose_action",
                "instruction": "Your supervisor says your work was not good enough today. What do you do?",
                "audio": "Your supervisor tells you that your work was not good enough today. What should you do?",
                "options": ["Get upset and argue", "Listen, say thank you, and ask how to improve", "Ignore them and do the same thing tomorrow"],
                "correct": "Listen, say thank you, and ask how to improve",
                "hint": "Feedback at work is meant to help you grow. Listen calmly and ask how to do better."
            }
        ],
        "3": [
            {
                "id": "wr_t3_1",
                "type": "choose_action",
                "instruction": "Your payslip shows Basic Pay: KES 12,000, NHIF: KES 500, NSSF: KES 200, Net Pay: KES 11,300. What is your take-home pay?",
                "audio": "Your payslip shows basic pay of twelve thousand shillings, deductions of seven hundred shillings total. What is your take home pay?",
                "options": ["KES 12,000", "KES 11,300", "KES 700"],
                "correct": "KES 11,300",
                "hint": "Take-home pay is the net pay — after all deductions have been subtracted."
            }
        ]
    }
}


def get_tasks(skill: str, tier: int) -> list:
    skill_tasks = SIMULATION_TASKS.get(skill, {})
    tier_tasks = skill_tasks.get(str(tier), [])
    return tier_tasks


def get_all_skills() -> list:
    return list(SIMULATION_TASKS.keys())