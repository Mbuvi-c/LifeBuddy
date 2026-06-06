import type { LearnModule } from './learnData_money'

export const MOBILE_MONEY_LEARN_DATA: Record<string, LearnModule> = {

  easy: {
    title: 'Getting Started with M-Pesa',
    slides: [
      { subSlides: [{ image: 'mpesa_logo.jpg', caption: 'M-Pesa is a mobile money service by Safaricom that lets you send, receive, save, and pay using your phone.' }] },
      { subSlides: [
        { image: 'mpesa_phone.jpg', caption: 'M-Pesa works on any phone — including basic feature phones. Dial *334# to access it.' },
        { image: 'mpesa_pin.jpg', caption: 'Your M-Pesa PIN is 4 digits. Never share it with anyone — not even Safaricom agents.' },
      ]},
      { subSlides: [
        { image: 'mpesa_send.jpg', caption: 'To send money, you need the recipient\'s phone number and your PIN.' },
        { image: 'mpesa_sms.jpg', caption: 'Every transaction sends an SMS confirmation. Always check your messages after sending or receiving.' },
      ]},
      { subSlides: [
        { image: 'mpesa_agent.jpg', caption: 'M-Pesa agents are found at shops and kiosks across Kenya. Use them to deposit or withdraw cash.' },
        { image: 'mpesa_agent.jpg', caption: 'Depositing cash at an agent is free. Withdrawals have a small charge.' },
      ]},
      { subSlides: [
        { image: 'mpesa_charges.jpg', caption: 'Receiving money is free. Sending, withdrawing, and paying via Paybill have small charges.' },
        { image: 'mpesa_phone.jpg', caption: 'Check your balance anytime: *334# → My Account → Balance. Enter your PIN to see the amount.' },
      ]},
    ],
  },

  intermediate: {
    title: 'Sending and Receiving M-Pesa',
    slides: [
      { subSlides: [{ image: 'mpesa_send.jpg', caption: 'Sending and receiving M-Pesa is fast and instant — money arrives within seconds.' }] },
      { subSlides: [
        { image: 'mpesa_send.jpg', caption: 'Send money: *334# → Send Money → enter number → enter amount → enter PIN → check SMS.' },
        { image: 'mpesa_sms.jpg', caption: 'Always verify the recipient\'s number before confirming. Wrong numbers are difficult to reverse.' },
      ]},
      { subSlides: [
        { image: 'mpesa_agent.jpg', caption: 'Withdrawal steps: tell agent amount → receive prompt on phone → enter PIN privately → get SMS → count cash.' },
        { image: 'mpesa_agent.jpg', caption: 'Never hand your phone to an agent. You always enter your PIN yourself.' },
      ]},
      { subSlides: [
        { image: 'mpesa_charges.jpg', caption: 'Always account for charges when sending. If you send KES 500 with a KES 11 charge, KES 511 is deducted.' },
        { image: 'mpesa_send.jpg', caption: 'If you send to the wrong number, call Safaricom on 0722000000 immediately — quick action may allow reversal.' },
      ]},
      { subSlides: [
        { image: 'mpesa_charges.jpg', caption: 'Free: receiving money, checking balance, depositing. Charged: sending, withdrawing, paying Paybill.' },
        { image: 'mpesa_sms.jpg', caption: 'Non-M-Pesa users receive an SMS code to withdraw cash at any agent without needing M-Pesa themselves.' },
      ]},
    ],
  },

  advanced: {
    title: 'Paying with M-Pesa',
    slides: [
      { subSlides: [{ image: 'mpesa_paybill.jpg', caption: 'M-Pesa lets you pay bills, school fees, utilities, and shops without using cash.' }] },
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'Paybill: for utilities, schools, and organisations. Requires business number AND account number.' },
        { image: 'mpesa_paybill.jpg', caption: 'Buy Goods (Till Number): for shops and retail. Only requires the Till number.' },
      ]},
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'Pay Bill steps: *334# → Lipa na M-Pesa → Pay Bill → business number → account number → amount → PIN.' },
        { image: 'mpesa_paybill.jpg', caption: 'Pay Goods steps: *334# → Lipa na M-Pesa → Buy Goods → Till number → amount → PIN.' },
      ]},
      { subSlides: [
        { image: 'mpesa_pin.jpg', caption: 'Entering wrong PIN three times locks your account. Call 0722000000 to unlock.' },
        { image: 'mpesa_agent.jpg', caption: 'Agents never need your PIN. You always enter it yourself, privately, when prompted.' },
      ]},
      { subSlides: [
        { image: 'mpesa_statement.jpg', caption: 'Check your M-Pesa mini statement anytime: *334# → My Account → Statement.' },
        { image: 'mpesa_bank.jpg', caption: 'Link your bank account to M-Pesa to move money between them: *334# → My Account → Link Bank Account.' },
      ]},
    ],
  },

  tier2_easy: {
    title: 'Using M-Pesa Confidently',
    slides: [
      { subSlides: [{ image: 'mpesa_send.jpg', caption: 'Using M-Pesa confidently means understanding your balance, charges, and what to do when things go wrong.' }] },
      { subSlides: [
        { image: 'mpesa_send.jpg', caption: 'You cannot send more than your current balance. Top up at an agent if needed before sending.' },
        { image: 'mpesa_charges.jpg', caption: 'Total deducted = amount sent + transaction charge. Always factor in charges when planning.' },
      ]},
      { subSlides: [
        { image: 'mpesa_sms.jpg', caption: 'M-Pesa transactions are instant. Read your SMS carefully — it shows amount, recipient, and new balance.' },
        { image: 'mpesa_agent.jpg', caption: 'When an agent has no float, find another one nearby. Never leave items with an agent.' },
      ]},
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'Paybill needs: business number + account number. Buy Goods needs: just a Till number.' },
        { image: 'mpesa_bank.jpg', caption: 'Linking your bank to M-Pesa allows easy money movement between accounts.' },
      ]},
      { subSlides: [
        { image: 'mpesa_sms.jpg', caption: 'If you receive unexpected money, call Safaricom before sending it back — some scams use this method.' },
        { image: 'mpesa_pin.jpg', caption: 'Never share your PIN with anyone. If you suspect it is compromised, change it immediately via *334#.' },
      ]},
    ],
  },

  tier2_intermediate: {
    title: 'Advanced M-Pesa Services',
    slides: [
      { subSlides: [{ image: 'mpesa_phone.jpg', caption: 'Beyond sending and receiving, M-Pesa offers savings, credit, and business tools.' }] },
      { subSlides: [
        { image: 'mpesa_fuliza.jpg', caption: 'Fuliza is an overdraft — it lends you money when your balance is low. It charges daily interest, so repay quickly.' },
        { image: 'mpesa_bank.jpg', caption: 'M-Shwari is a savings and loan account within M-Pesa. Save money and earn interest, or take small loans.' },
      ]},
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'Wrong Paybill account number? Call Safaricom and the organisation immediately — quick action may allow correction.' },
        { image: 'mpesa_agent.jpg', caption: 'Never hand your phone to an agent during withdrawals. Initiate everything yourself and enter your PIN privately.' },
      ]},
      { subSlides: [
        { image: 'mpesa_pin.jpg', caption: 'M-Pesa safety: always check SMS, verify numbers before sending, report issues immediately.' },
        { image: 'mpesa_pin.jpg', caption: 'Never: share PIN, use same PIN as phone lock, enter PIN while someone watches.' },
      ]},
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'For business: a Buy Goods Till Number keeps business separate from personal M-Pesa and looks more professional.' },
        { image: 'mpesa_statement.jpg', caption: 'Review your M-Pesa statement regularly to catch unauthorised transactions early.' },
      ]},
    ],
  },

  tier2_advanced: {
    title: 'M-Pesa for Business',
    slides: [
      { subSlides: [{ image: 'mpesa_paybill.jpg', caption: 'M-Pesa is a powerful business tool — used correctly it improves cash flow, record-keeping, and customer trust.' }] },
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'A business Till Number: keeps personal and business funds separate, creates clear records, looks professional.' },
        { image: 'mpesa_fuliza.jpg', caption: 'Fuliza interest: 1% daily on borrowed amount. KES 1,000 borrowed for 5 days = KES 50 interest. Repay fast.' },
      ]},
      { subSlides: [
        { image: 'mpesa_sms.jpg', caption: 'Fake M-Pesa confirmation SMS are common business scams. Always verify in your own statement — never from a screenshot.' },
        { image: 'mpesa_sms.jpg', caption: 'Dial *334# to check received payments before releasing goods. Screenshots can be faked instantly.' },
      ]},
      { subSlides: [
        { image: 'mpesa_fuliza.jpg', caption: 'Regular Fuliza use means spending more than you earn. Use it only for genuine short-term gaps — not everyday expenses.' },
        { image: 'mpesa_pin.jpg', caption: 'Always: check SMS, verify numbers, report issues. Never: share PIN, hand phone to agent, send back unexpected money without Safaricom.' },
      ]},
      { subSlides: [
        { image: 'mpesa_bank.jpg', caption: 'Link bank to M-Pesa: *334# → My Account → Link Bank Account → choose bank → enter account number → PIN.' },
        { image: 'mpesa_statement.jpg', caption: 'M-Pesa statements are legal proof of payment. Request certified statements for business or legal disputes.' },
      ]},
    ],
  },

  tier3_easy: {
    title: 'Teaching M-Pesa to Others',
    slides: [
      { subSlides: [{ image: 'mpesa_pin.jpg', caption: 'When teaching M-Pesa to others, always start with PIN security — it is the foundation of safe use.' }] },
      { subSlides: [
        { image: 'mpesa_pin.jpg', caption: 'The most important rule: never share your PIN with anyone — not family, agents, or Safaricom staff.' },
        { image: 'mpesa_agent.jpg', caption: 'Registration: visit agent with national ID → agent registers → SMS confirmation → dial *334# to set PIN.' },
      ]},
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'For business: display exact payment amounts clearly so customers pay the right amount via Till Number.' },
        { image: 'mpesa_send.jpg', caption: 'M-Pesa limits: maximum KES 150,000 per transaction, KES 300,000 per day. Use bank transfers for larger amounts.' },
      ]},
      { subSlides: [
        { image: 'mpesa_pin.jpg', caption: 'Safaricom scam: never ask you to send money or share PIN to verify your account. Always hang up and call 0722000000.' },
        { image: 'mpesa_pin.jpg', caption: 'Change PIN: *334# → My Account → Change PIN. Do this regularly and immediately if you suspect compromise.' },
      ]},
      { subSlides: [
        { image: 'mpesa_send.jpg', caption: 'You cannot reverse M-Pesa transactions yourself. Contact Safaricom on 0722000000 for any wrong transaction.' },
        { image: 'mpesa_agent.jpg', caption: 'M-Pesa registration requires a valid national ID. Without it, you cannot open an account.' },
      ]},
    ],
  },

  tier3_intermediate: {
    title: 'M-Pesa for Groups and Communities',
    slides: [
      { subSlides: [{ image: 'mpesa_paybill.jpg', caption: 'M-Pesa can serve entire communities — groups, savings clubs, and small organisations can all benefit.' }] },
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'Community group: set up a group Paybill or Till Number for transparency and separation from personal funds.' },
        { image: 'mpesa_paybill.jpg', caption: 'Designate two authorised signatories for withdrawals — this prevents single-person misuse of group funds.' },
      ]},
      { subSlides: [
        { image: 'mpesa_bank.jpg', caption: 'M-Shwari Lock Savings earns interest on locked amounts. Use it for group savings goals.' },
        { image: 'mpesa_charges.jpg', caption: 'M-Pesa transaction charges are normally paid by the sender unless agreed otherwise.' },
      ]},
      { subSlides: [
        { image: 'mpesa_phone.jpg', caption: 'M-Pesa supports international transactions through Safaricom partnerships across Africa.' },
        { image: 'mpesa_phone.jpg', caption: 'Inactive M-Pesa accounts may be deactivated. Keep your account active with occasional transactions.' },
      ]},
      { subSlides: [
        { image: 'mpesa_agent.jpg', caption: 'Lost SIM recovery: call Safaricom → SIM swap with ID → account transfers to new SIM → change PIN → check statement.' },
        { image: 'mpesa_statement.jpg', caption: 'Share monthly M-Pesa statements with all group members for full financial transparency.' },
      ]},
    ],
  },

  tier3_advanced: {
    title: 'M-Pesa Mastery',
    slides: [
      { subSlides: [{ image: 'mpesa_paybill.jpg', caption: 'M-Pesa mastery means using every tool strategically — for personal, business, and community financial management.' }] },
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'Professional business setup: dedicated Till Number + separate business SIM + daily statement review.' },
        { image: 'mpesa_agent.jpg', caption: 'Verify agents: check for official Safaricom certificate. Unusually high limits or low fees may signal fraud.' },
      ]},
      { subSlides: [
        { image: 'mpesa_phone.jpg', caption: 'Handle yourself: change PIN, check balance, send money, pay bills. Call Safaricom: reversals, fraud, account recovery.' },
        { image: 'mpesa_fuliza.jpg', caption: 'Repay Fuliza within 24 hours to minimise daily interest charges. It is a tool for gaps — not regular use.' },
      ]},
      { subSlides: [
        { image: 'mpesa_statement.jpg', caption: 'M-Pesa statements are legal proof of payment — request certified copies for disputes or business records.' },
        { image: 'mpesa_pin.jpg', caption: 'Training staff: the single most important rule is PIN confidentiality. No legitimate person ever needs your PIN.' },
      ]},
      { subSlides: [
        { image: 'mpesa_paybill.jpg', caption: 'Group M-Pesa setup: register account → share details → set contribution schedule → two signatories → monthly statement review.' },
        { image: 'mpesa_phone.jpg', caption: 'M-Pesa is Kenya\'s financial backbone — mastering it gives you full control of your money, wherever you are.' },
      ]},
    ],
  },
}
