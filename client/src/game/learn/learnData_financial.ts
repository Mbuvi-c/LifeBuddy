import type { LearnModule } from './learnData_money'

export const FINANCIAL_PLANNING_LEARN_DATA: Record<string, LearnModule> = {

  easy: {
    title: 'Income and Expenses',
    slides: [
      { subSlides: [{ image: 'income_money.jpg', caption: 'Income is money you receive — from a job, selling goods, or any other source. It is money coming in to you.' }] },
      { subSlides: [
        { image: 'income_money.jpg', caption: 'Examples of income: a monthly salary, daily casual work pay, selling vegetables at the market, or receiving money from family.' },
        { image: 'expenses.jpg', caption: 'An expense is money you spend — on rent, food, transport, airtime, or anything else.' },
      ]},
      { subSlides: [
        { image: 'expenses.jpg', caption: 'If your income is KES 5,000 and your expenses are KES 4,000, you have KES 1,000 left.' },
        { image: 'savings_jar.jpg', caption: 'Money left after paying expenses can be saved or used for wants. This is called a surplus.' },
      ]},
      { subSlides: [
        { image: 'needs_wants.jpg', caption: 'Needs are things you must have: food, shelter, medical care, transport to work, school fees.' },
        { image: 'needs_wants.jpg', caption: 'Wants are things that are nice to have but not essential: new clothes, phone upgrades, entertainment.' },
      ]},
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'A budget is a plan for your money. It shows income, needs, savings, and wants in advance.' },
        { image: 'budget_plan.jpg', caption: 'A budget helps you make decisions before you spend — so you stay in control of your money.' },
      ]},
    ],
  },

  intermediate: {
    title: 'Building a Budget',
    slides: [
      { subSlides: [{ image: 'budget_plan.jpg', caption: 'A good budget puts needs first, then savings, then wants. Always in that order.' }] },
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'Step 1: Write down your total monthly income from all sources.' },
        { image: 'expenses.jpg', caption: 'Step 2: List every expense — rent, food, transport, airtime, school fees, and more.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Step 3: Set aside your savings amount before spending on wants. Pay yourself first.' },
        { image: 'needs_wants.jpg', caption: 'Step 4: Spend the remaining money on wants. If there is not enough for a want — wait.' },
      ]},
      { subSlides: [
        { image: 'expenses.jpg', caption: 'Fixed expenses stay the same each month: rent, loan repayments, NHIF. Easy to plan for.' },
        { image: 'expenses.jpg', caption: 'Variable expenses change each month: food costs, electricity, transport. Estimate and track.' },
      ]},
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'Track actual spending weekly. Compare to your plan. Adjust where you overspent.' },
        { image: 'savings_jar.jpg', caption: 'Tracking is the most important habit in budgeting. You cannot manage what you do not measure.' },
      ]},
    ],
  },

  advanced: {
    title: 'Smart Saving Strategies',
    slides: [
      { subSlides: [{ image: 'savings_jar.jpg', caption: 'Saving regularly — even small amounts — builds financial security over time.' }] },
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'To reach a savings goal: know the amount needed → set a deadline → divide by months → save that amount each month.' },
        { image: 'savings_jar.jpg', caption: 'Example: KES 12,000 goal in 6 months = KES 2,000 per month to save.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'An emergency fund covers 3 to 6 months of basic expenses. It protects you from unexpected costs.' },
        { image: 'savings_jar.jpg', caption: 'Without an emergency fund, one crisis can destroy months of careful budgeting.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Bank accounts and SACCOs are safer than cash at home. Your money is protected and may earn interest.' },
        { image: 'savings_jar.jpg', caption: 'Interest means your saved money grows slightly each year. KES 10,000 at 5% = KES 500 earned in one year.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Chamas are savings groups where members contribute and take turns receiving the pool — a useful way to build a lump sum.' },
        { image: 'budget_plan.jpg', caption: 'The habit of saving matters more than the amount. Someone who saves KES 100 consistently builds more than someone who plans to save KES 10,000 one day.' },
      ]},
    ],
  },

  tier2_easy: {
    title: 'The 50/30/20 Rule',
    slides: [
      { subSlides: [{ image: 'budget_plan.jpg', caption: 'The 50/30/20 rule is a simple budgeting guide: 50% needs, 30% wants, 20% savings.' }] },
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'On KES 10,000 income: KES 5,000 for needs, KES 3,000 for wants, KES 2,000 for savings.' },
        { image: 'budget_plan.jpg', caption: 'On KES 20,000 income: KES 10,000 needs, KES 6,000 wants, KES 4,000 savings.' },
      ]},
      { subSlides: [
        { image: 'expenses.jpg', caption: 'If rent alone takes 60% of income, adjust the rule — needs may need more than 50% at lower income levels.' },
        { image: 'budget_plan.jpg', caption: 'The 50/30/20 is a guide, not a rule. Adjust based on your real situation.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Even saving 10% is a strong start. KES 1,000 per month = KES 12,000 in a year.' },
        { image: 'savings_jar.jpg', caption: 'As your income grows, aim to increase savings percentage — not just savings amount.' },
      ]},
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'Review your budget monthly. Life changes — income, rent, and needs all shift over time.' },
        { image: 'budget_plan.jpg', caption: 'A budget that is reviewed regularly always works better than a perfect budget that is never checked.' },
      ]},
    ],
  },

  tier2_intermediate: {
    title: 'Managing Debt Wisely',
    slides: [
      { subSlides: [{ image: 'expenses.jpg', caption: 'Not all debt is bad. A loan for school fees or a business is an investment in your future.' }] },
      { subSlides: [
        { image: 'expenses.jpg', caption: 'Bad debt is borrowing for wants you cannot afford — clothes, entertainment, unnecessary items.' },
        { image: 'expenses.jpg', caption: 'Good debt helps you earn more or reduces future costs — education, a business loan, home purchase.' },
      ]},
      { subSlides: [
        { image: 'expenses.jpg', caption: 'Interest is the cost of borrowing. A KES 10,000 loan at 20% annual interest costs KES 2,000 extra per year.' },
        { image: 'savings_jar.jpg', caption: 'Paying off high-interest debt first is like earning that interest rate on your savings — guaranteed.' },
      ]},
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'Never borrow to cover regular monthly expenses — that means expenses are higher than income. Cut expenses instead.' },
        { image: 'expenses.jpg', caption: 'If you have a loan, include repayments in your budget as a fixed expense. Always pay on time.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Strategy: save KES 20,000 emergency fund first. Then use extra money to pay down debt faster.' },
        { image: 'budget_plan.jpg', caption: 'Once debt is paid, redirect those repayment amounts into savings and investments.' },
      ]},
    ],
  },

  tier2_advanced: {
    title: 'Financial Goals and Planning',
    slides: [
      { subSlides: [{ image: 'budget_plan.jpg', caption: 'Financial goals give direction to your saving and spending decisions.' }] },
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'Short-term goals (under 1 year): emergency fund, new phone, school fees.' },
        { image: 'budget_plan.jpg', caption: 'Medium-term goals (1–5 years): land purchase, business capital, car.' },
        { image: 'budget_plan.jpg', caption: 'Long-term goals (5+ years): house, retirement fund, children\'s education.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'For each goal: write the amount needed, set a deadline, calculate monthly savings required.' },
        { image: 'savings_jar.jpg', caption: 'Example: KES 100,000 for a business in 2 years = KES 4,167 per month.' },
      ]},
      { subSlides: [
        { image: 'income_money.jpg', caption: 'Increasing income accelerates every goal. Side hustles, skills development, and career growth all help.' },
        { image: 'income_money.jpg', caption: 'When income rises, resist lifestyle inflation — save the increase instead of spending it.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Diversify savings: keep emergency fund in an accessible savings account, long-term in NSSF or investment funds.' },
        { image: 'budget_plan.jpg', caption: 'Review goals every 6 months. Life changes — adjust your targets and timelines as needed.' },
      ]},
    ],
  },

  tier3_easy: {
    title: 'Financial Independence Basics',
    slides: [
      { subSlides: [{ image: 'income_money.jpg', caption: 'Financial independence means your income covers your needs and you have savings growing toward your goals.' }] },
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'First job? Create a budget before spending your first salary. Plan every shilling.' },
        { image: 'savings_jar.jpg', caption: 'Build your emergency fund first — 3 months of expenses minimum. This is your financial safety net.' },
      ]},
      { subSlides: [
        { image: 'expenses.jpg', caption: 'NHIF and NSSF are not optional extras — they are investments in your future health and retirement.' },
        { image: 'expenses.jpg', caption: 'Include NHIF and NSSF contributions in your budget as fixed needs — not wants.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Lifestyle inflation: when income rises, expenses rise too — leaving nothing extra. Resist this pattern.' },
        { image: 'savings_jar.jpg', caption: 'When income increases, bank the raise and keep your lifestyle steady for 6 months. Then review.' },
      ]},
      { subSlides: [
        { image: 'income_money.jpg', caption: 'Extra income from a side hustle should go directly to savings or debt repayment — not to lifestyle.' },
        { image: 'budget_plan.jpg', caption: 'Review your budget every month and every time your income or circumstances change.' },
      ]},
    ],
  },

  tier3_intermediate: {
    title: 'Investing for the Future',
    slides: [
      { subSlides: [{ image: 'savings_jar.jpg', caption: 'Investing means putting money to work so it grows over time — beyond what savings accounts offer.' }] },
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Compound interest: KES 10,000 at 10% annual return = KES 11,000 after year 1. Year 2: 10% of KES 11,000 = KES 12,100.' },
        { image: 'savings_jar.jpg', caption: 'The longer you invest, the more powerful compounding becomes. Start early.' },
      ]},
      { subSlides: [
        { image: 'expenses.jpg', caption: 'Beware of investment scams: promises of 50% returns in one month are almost always fraud.' },
        { image: 'savings_jar.jpg', caption: 'Legitimate investments offer 5–15% annually. Anything dramatically higher is extremely high risk.' },
      ]},
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'Only invest money you do not need for at least 3 years. Never invest your emergency fund.' },
        { image: 'savings_jar.jpg', caption: 'Diversify: do not put all savings in one place. Spread across bank, SACCO, government bonds, and property over time.' },
      ]},
      { subSlides: [
        { image: 'income_money.jpg', caption: 'Your most important investment is in yourself: skills, education, and health increase your earning power for life.' },
        { image: 'budget_plan.jpg', caption: 'Financial plan: emergency fund → clear high-interest debt → pension → medium goals → long-term investment.' },
      ]},
    ],
  },

  tier3_advanced: {
    title: 'Long-Term Financial Resilience',
    slides: [
      { subSlides: [{ image: 'budget_plan.jpg', caption: 'Long-term financial resilience means your finances can withstand setbacks — job loss, illness, or economic shifts.' }] },
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Multiple income streams reduce risk. If one stops, others continue: job + side hustle + rental income.' },
        { image: 'income_money.jpg', caption: 'Skills development is the most sustainable income growth. It increases earning potential for years.' },
      ]},
      { subSlides: [
        { image: 'expenses.jpg', caption: 'Insurance protects against catastrophic loss: NHIF for health, motor insurance for vehicles, life cover for dependants.' },
        { image: 'expenses.jpg', caption: 'Insurance is not wasted money if you do not claim. It is the cost of protection against large unpredictable losses.' },
      ]},
      { subSlides: [
        { image: 'budget_plan.jpg', caption: 'When facing financial crisis: assess → use savings → cut wants → small loan if necessary → rebuild savings.' },
        { image: 'budget_plan.jpg', caption: 'Never skip rebuilding your emergency fund after using it. Vulnerability is temporary — make it so.' },
      ]},
      { subSlides: [
        { image: 'savings_jar.jpg', caption: 'Wealth is built slowly through consistent income, controlled expenses, regular saving, and patient investing.' },
        { image: 'budget_plan.jpg', caption: 'Review your full financial picture every 6 months: budget, savings, debts, goals. Adjust and keep moving forward.' },
      ]},
    ],
  },
}
