import type { LearnModule } from './learnData_money'

export const DIGITAL_SAFETY_LEARN_DATA: Record<string, LearnModule> = {

  easy: {
    title: 'Staying Safe Online',
    slides: [
      { subSlides: [{ image: 'phone_screen.jpg', caption: 'Your phone and the internet connect you to the world — but they also connect scammers to you.' }] },
      { subSlides: [
        { image: 'password_screen.jpg', caption: 'A password is a secret key to your account. Never share it with anyone — not even friends.' },
        { image: 'password_screen.jpg', caption: 'A strong password uses letters, numbers, and symbols. Avoid your name, birthday, or the word "password".' },
      ]},
      { subSlides: [
        { image: 'scam_message.jpg', caption: 'A scam is when someone tries to trick you into giving them money or personal information.' },
        { image: 'scam_message.jpg', caption: 'If a message says you won money but must pay to claim it — it is a scam. Real prizes are free to collect.' },
      ]},
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'Your ID number, home address, and PIN are private. Never share them online or with strangers.' },
        { image: 'phone_call.jpg', caption: 'Banks and Safaricom never call to ask for your PIN. Hang up on anyone who does.' },
      ]},
      { subSlides: [
        { image: 'public_wifi.jpg', caption: 'Public WiFi is not secure. Avoid checking M-Pesa or banking on public WiFi.' },
        { image: 'phone_screen.jpg', caption: 'Never click links from unknown senders — they can steal your information or damage your phone.' },
      ]},
    ],
  },

  intermediate: {
    title: 'Recognising Scams',
    slides: [
      { subSlides: [{ image: 'scam_message.jpg', caption: 'Scammers are skilled at looking real. Learning to recognise their methods protects you.' }] },
      { subSlides: [
        { image: 'scam_message.jpg', caption: 'Phishing is when fake messages or websites pretend to be real organisations to steal your details.' },
        { image: 'scam_message.jpg', caption: 'A real M-Pesa message confirms transactions. A fake one asks you to click a link or enter your PIN.' },
      ]},
      { subSlides: [
        { image: 'password_screen.jpg', caption: 'Safe password habits: use different passwords for each account, change them regularly, never write them near your phone.' },
        { image: 'password_screen.jpg', caption: 'Two-factor authentication (2FA) adds a second step — even if someone steals your password, they cannot get in.' },
      ]},
      { subSlides: [
        { image: 'phone_screen.jpg', caption: 'Only install apps from official stores — Google Play or Apple App Store.' },
        { image: 'phone_screen.jpg', caption: 'A calculator app needs no access to your contacts or location. Deny unnecessary permissions.' },
      ]},
      { subSlides: [
        { image: 'public_wifi.jpg', caption: 'Websites starting with https:// are more secure than http://. Always look for the "s" before entering passwords.' },
        { image: 'phone_screen.jpg', caption: 'Keep your phone updated — security updates fix weaknesses that hackers use to attack devices.' },
      ]},
    ],
  },

  advanced: {
    title: 'Protecting Your Information',
    slides: [
      { subSlides: [{ image: 'personal_info.jpg', caption: 'Your personal information is valuable. Protecting it protects your money, identity, and safety.' }] },
      { subSlides: [
        { image: 'phone_call.jpg', caption: 'If a friend\'s WhatsApp sends an urgent money request — call them directly first. Their account may be hacked.' },
        { image: 'scam_message.jpg', caption: 'Romance scammers build trust over weeks before creating an emergency that requires money.' },
      ]},
      { subSlides: [
        { image: 'phone_screen.jpg', caption: 'If your phone is stolen: call your bank, contact Safaricom, change all passwords, and report to police — fast.' },
        { image: 'password_screen.jpg', caption: 'Before selling your phone, do a factory reset — deleting apps and photos is not enough.' },
      ]},
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'Safe to share online: your first name, general area, business phone. Private: ID number, PIN, home address, bank details.' },
        { image: 'phone_screen.jpg', caption: 'Signs of malware: phone runs slow, gets hot, uses data when idle. Run a security scan and remove suspicious apps.' },
      ]},
      { subSlides: [
        { image: 'password_screen.jpg', caption: 'Enable remote tracking on your phone so you can locate or wipe it if stolen.' },
        { image: 'personal_info.jpg', caption: 'Posting your location, house, and travel plans publicly helps burglars know when you are away.' },
      ]},
    ],
  },

  tier2_easy: {
    title: 'Everyday Digital Decisions',
    slides: [
      { subSlides: [{ image: 'phone_screen.jpg', caption: 'Every day you make digital decisions — what to click, what to share, who to trust. These choices matter.' }] },
      { subSlides: [
        { image: 'phone_call.jpg', caption: 'Safaricom never calls asking for your PIN. Any such call is a scam — hang up immediately.' },
        { image: 'scam_message.jpg', caption: 'Job adverts that ask for your PIN or bank account to "process your application" are scams.' },
      ]},
      { subSlides: [
        { image: 'public_wifi.jpg', caption: 'Use your own mobile data for banking. Public WiFi, shared computers, and friends\' phones are risky.' },
        { image: 'personal_info.jpg', caption: 'Posting photos of your house and location on social media can help criminals target you.' },
      ]},
      { subSlides: [
        { image: 'password_screen.jpg', caption: 'Use the official Forgot Password feature to recover accounts — never third-party tools.' },
        { image: 'phone_screen.jpg', caption: 'Even clicking a scam link without entering information can install malware — close the browser immediately.' },
      ]},
      { subSlides: [
        { image: 'scam_message.jpg', caption: 'If you are scammed: call Safaricom immediately — quick action may reverse the transaction.' },
        { image: 'phone_call.jpg', caption: 'Then report to police, warn friends and family, and change all your passwords.' },
      ]},
    ],
  },

  tier2_intermediate: {
    title: 'Digital Safety at Home and Work',
    slides: [
      { subSlides: [{ image: 'personal_info.jpg', caption: 'Digital safety is not just about your phone — it applies to every device and every account you use.' }] },
      { subSlides: [
        { image: 'scam_message.jpg', caption: 'Sort messages carefully: transaction confirmations and billing notices are usually real. Urgent demands and prize claims are usually scams.' },
        { image: 'phone_call.jpg', caption: 'Professional-looking emails can be faked perfectly. Always go directly to the website — never through email links.' },
      ]},
      { subSlides: [
        { image: 'phone_screen.jpg', caption: 'On a shared family phone, always log out of financial apps completely after each use.' },
        { image: 'phone_screen.jpg', caption: 'Set parental controls for children using your phone — restrict app downloads and inappropriate content.' },
      ]},
      { subSlides: [
        { image: 'password_screen.jpg', caption: 'A reputable password manager stores all your different passwords securely. Use an established one with strong encryption.' },
        { image: 'public_wifi.jpg', caption: 'A VPN encrypts your internet traffic — especially useful on public WiFi to prevent others seeing your data.' },
      ]},
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'If someone posts your photo without permission: screenshot it, report it to the platform, contact police if threatening.' },
        { image: 'phone_call.jpg', caption: 'In Kenya, cybercrime is illegal under the Computer Misuse and Cybercrimes Act 2018. Report to DCI.' },
      ]},
    ],
  },

  tier2_advanced: {
    title: 'Advanced Digital Protection',
    slides: [
      { subSlides: [{ image: 'password_screen.jpg', caption: 'Advanced digital protection means thinking beyond your own device to your business, family, and community.' }] },
      { subSlides: [
        { image: 'phone_screen.jpg', caption: 'New phone security checklist: strong PIN → encryption → official apps only → auto updates → remote tracking.' },
        { image: 'password_screen.jpg', caption: 'Always lock your screen when stepping away from your device — even for a moment.' },
      ]},
      { subSlides: [
        { image: 'scam_message.jpg', caption: 'Good habits: fingerprint lock, regular backups, remote tracking enabled. Bad habits: always-on Bluetooth, same PIN everywhere.' },
        { image: 'personal_info.jpg', caption: 'Romance scammers invest weeks or months building trust before creating a money emergency.' },
      ]},
      { subSlides: [
        { image: 'phone_call.jpg', caption: 'Official Safaricom M-Pesa customer care: 0722 000 000. Know this number to report fraud quickly.' },
        { image: 'scam_message.jpg', caption: 'Investment schemes promising guaranteed high returns in days are pyramid or Ponzi schemes — not real investments.' },
      ]},
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'For business social media: share business name, phone, M-Pesa number, hours. Keep home address and personal ID private.' },
        { image: 'public_wifi.jpg', caption: 'Change router default passwords and use WPA2 encryption for office WiFi — default settings are known to hackers.' },
      ]},
    ],
  },

  tier3_easy: {
    title: 'Protecting Your Community',
    slides: [
      { subSlides: [{ image: 'phone_call.jpg', caption: 'As someone who understands digital safety, you can protect not just yourself but your family and community.' }] },
      { subSlides: [
        { image: 'phone_call.jpg', caption: 'The grandchild scam: someone calls pretending to be a family member in trouble. Always verify by calling the person directly.' },
        { image: 'scam_message.jpg', caption: 'Teach family members: hang up and call the real person. Create a family code word for genuine emergencies.' },
      ]},
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'Search your own name online regularly to see what others can find about you.' },
        { image: 'password_screen.jpg', caption: 'Enable 2FA on your email — even with a stolen password, hackers cannot access the account without your phone.' },
      ]},
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'If a friend tags you somewhere private online, politely ask them to remove the tag or post.' },
        { image: 'phone_call.jpg', caption: 'Teaching digital safety: explain scam methods → show examples → teach the hang-up-and-call-back rule → refresh regularly.' },
      ]},
      { subSlides: [
        { image: 'phone_screen.jpg', caption: 'For business websites: give developers only the permissions they need — not full access to everything.' },
        { image: 'password_screen.jpg', caption: 'Know official numbers: Safaricom M-Pesa 0722 000 000. Use them to verify suspicious communications.' },
      ]},
    ],
  },

  tier3_intermediate: {
    title: 'Digital Safety for Business',
    slides: [
      { subSlides: [{ image: 'scam_message.jpg', caption: 'Running a business online brings new digital safety responsibilities — for your customers and your money.' }] },
      { subSlides: [
        { image: 'scam_message.jpg', caption: 'Fake M-Pesa confirmation SMS are a common business scam. Always verify payment in your actual M-Pesa inbox — never from a screenshot.' },
        { image: 'phone_screen.jpg', caption: 'Dial *334# to check received M-Pesa payments. A screenshot can be faked in seconds.' },
      ]},
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'Business social media: share business name, phone, M-Pesa number, hours. Keep personal ID and home address private.' },
        { image: 'personal_info.jpg', caption: 'Customer data on your work computer should only be accessible to authorised people. Lock your screen when you step away.' },
      ]},
      { subSlides: [
        { image: 'scam_message.jpg', caption: 'Investment schemes promising 100% returns in days are Ponzi schemes. Early members appear paid from new recruits\' money.' },
        { image: 'phone_call.jpg', caption: 'Kenya\'s Computer Misuse and Cybercrimes Act 2018 makes cybercrime criminal. You have legal protection — use it.' },
      ]},
      { subSlides: [
        { image: 'password_screen.jpg', caption: 'Hacked social media account recovery: official recovery → change password + 2FA → revoke app access → warn contacts → address damage.' },
        { image: 'password_screen.jpg', caption: 'Always lock screen automatically after 30 seconds or 1 minute of inactivity on all devices.' },
      ]},
    ],
  },

  tier3_advanced: {
    title: 'Leading Digital Safety',
    slides: [
      { subSlides: [{ image: 'personal_info.jpg', caption: 'At the highest level, digital safety means creating systems that protect groups, organisations, and communities — not just individuals.' }] },
      { subSlides: [
        { image: 'personal_info.jpg', caption: 'Community group finances: require two people to authorise any significant transaction. No single person should have full unchecked access.' },
        { image: 'scam_message.jpg', caption: 'Classify digital threats correctly: phishing steals credentials. Malware damages or spies. Financial scams steal money through deception.' },
      ]},
      { subSlides: [
        { image: 'password_screen.jpg', caption: 'Data breach response: change passwords everywhere the compromised email-password was used — immediately. Hackers try stolen credentials across all sites.' },
        { image: 'phone_call.jpg', caption: 'Even after sending money to a scammer, report immediately — Safaricom can sometimes reverse transactions if contacted fast enough.' },
      ]},
      { subSlides: [
        { image: 'public_wifi.jpg', caption: 'Office WiFi security: change default router password, use WPA2 encryption, hide the network name.' },
        { image: 'personal_info.jpg', caption: 'Kenya\'s Data Protection Act 2019 requires your consent before organisations collect or share your data. Know your rights.' },
      ]},
      { subSlides: [
        { image: 'phone_call.jpg', caption: 'Digital safety policy for groups: identify tools → set access controls → manage passwords → create incident response → train everyone → review annually.' },
        { image: 'personal_info.jpg', caption: 'You now have the knowledge to protect yourself, your family, your business, and your community online.' },
      ]},
    ],
  },
}
