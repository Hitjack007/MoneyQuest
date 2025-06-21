import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";

export type Asset = {
  id: string;
  type: "car" | "house" | "device";
  name: string;
  health: number;
  tier: number;
};

export type Investment = {
  id: string;
  type: "stocks" | "bitcoin";
  amount: number;
  value: number;
};

export type Loan = {
  id: string;
  principal: number;
  balance: number;
  interestRate: number;
  dueDate: Date;
  status: "active" | "paid" | "default";
};

export type TimelineEvent = { date: Date; event: string };

export type GameEvent = {
  id: string;
  desc: string;
  choices: {
    label: string;
    apply: (state: GameState) => void;
    feedback: string;
  }[];
};

export type GameState = {
  balance: number;
  creditScore: number;
  assets: Asset[];
  loans: Loan[];
  investments: Investment[];
  owing: number;
  calendar: Date;
  timeline: TimelineEvent[];
  eventQueue: GameEvent[];
  bankrupt: boolean;
  feedback: string;
  setFeedback: (msg: string) => void;
  addTimelineEvent: (msg: string) => void;
  nextEvent: () => void;
  advanceTime: (days: number) => void;
  restart: () => void;
  triggerRandomEvent: () => void;
};

function clampCredit(score: number) {
  return Math.max(300, Math.min(1000, score));
}

function getDefaultAssets(): Asset[] {
  return [
    {
      id: nanoid(),
      type: "car",
      name: "Used Toyota",
      health: 80,
      tier: 1,
    },
  ];
}

function getDefaultLoans(): Loan[] {
  return [
    {
      id: nanoid(),
      principal: 3000,
      balance: 3000,
      interestRate: 8,
      dueDate: new Date(2025, 0, 30),
      status: "active",
    },
  ];
}

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    balance: 1000,
    creditScore: 650,
    assets: getDefaultAssets(),
    loans: getDefaultLoans(),
    investments: [],
    owing: 3000,
    calendar: new Date(2025, 0, 1),
    timeline: [],
    eventQueue: [],
    bankrupt: false,
    feedback: "",
    setFeedback: (msg) => set((s) => { s.feedback = msg; }),
    addTimelineEvent: (msg: string) =>
      set((s) => {
        s.timeline.push({ date: new Date(s.calendar), event: msg });
      }),
    nextEvent: () => {
      set((s) => {
        if (s.eventQueue.length > 0) {
          s.eventQueue.shift();
        }
      });
    },
    advanceTime: (days: number) => {
      set((s) => {
        s.calendar.setDate(s.calendar.getDate() + days);

        // Monthly salary
        if (s.calendar.getDate() === 1) {
          s.balance += 2000;
          s.addTimelineEvent("Received monthly salary (+$2000)");
          s.creditScore = clampCredit(s.creditScore + 5);
        }

        // Interest and loan due
        for (const loan of s.loans) {
          if (
            s.calendar >= loan.dueDate &&
            loan.status === "active"
          ) {
            if (s.balance >= 400) {
              s.balance -= 400;
              loan.balance -= 400;
              s.creditScore = clampCredit(s.creditScore + 15);
              s.addTimelineEvent("Paid $400 loan installment.");
              if (loan.balance <= 0) {
                loan.status = "paid";
                s.addTimelineEvent("Loan fully paid off!");
              }
            } else {
              loan.balance += 50; // Late fee
              s.creditScore = clampCredit(s.creditScore - 20);
              s.addTimelineEvent("Missed loan payment! Late fee +$50.");
            }
          }
        }

        // Investments fluctuation
        for (const inv of s.investments) {
          let change =
            inv.type === "bitcoin"
              ? Math.random() * 0.2 - 0.1
              : Math.random() * 0.1 - 0.05;
          inv.value = Math.max(0, inv.value + inv.amount * change);
        }

        // Asset depreciation
        for (const asset of s.assets) {
          asset.health = Math.max(0, asset.health - 2);
        }

        // Bankruptcy check
        if (s.balance < 0) {
          s.bankrupt = true;
        }
      });

      // Random event chance
      if (Math.random() < 0.4) {
        get().triggerRandomEvent();
      }
    },
    restart: () => {
      set((s) => {
        s.balance = 1000;
        s.creditScore = 650;
        s.assets = getDefaultAssets();
        s.loans = getDefaultLoans();
        s.investments = [];
        s.owing = 3000;
        s.calendar = new Date(2025, 0, 1);
        s.timeline = [];
        s.eventQueue = [];
        s.bankrupt = false;
        s.feedback = "";
      });
    },
    triggerRandomEvent: () => {
      const carEvent: GameEvent = {
        id: nanoid(),
        desc: "Your car broke down! What do you want to do?",
        choices: [
          {
            label: "Pay $500 to repair now",
            feedback: "-$500, credit score +10",
            apply: (s) => {
              s.balance -= 500;
              s.creditScore = clampCredit(s.creditScore + 10);
              s.assets[0].health = 80;
              s.addTimelineEvent("Car repaired for $500");
              s.setFeedback("Car repaired! Credit score improved.");
            },
          },
          {
            label: "Delay repair",
            feedback: "Car health worsens",
            apply: (s) => {
              if (s.assets[0]) {
                s.assets[0].health -= 30;
                s.addTimelineEvent("Car repair delayed.");
                s.setFeedback("Car health worsened!");
              }
            },
          },
          {
            label: "Sell & buy cheaper car next turn",
            feedback: "-$300 next turn, credit -10",
            apply: (s) => {
              s.creditScore = clampCredit(s.creditScore - 10);
              s.assets[0].name = "Old Beater";
              s.assets[0].tier = 0;
              s.assets[0].health = 50;
              s.balance -= 300;
              s.addTimelineEvent("Bought a cheaper car.");
              s.setFeedback("You downgraded your car. Credit score dropped.");
            },
          },
        ],
      };

      const loanEvent: GameEvent = {
        id: nanoid(),
        desc: "Loan payment due!",
        choices: [
          {
            label: "Pay full $400",
            feedback: "-$400, credit +15",
            apply: (s) => {
              s.balance -= 400;
              s.creditScore = clampCredit(s.creditScore + 15);
              s.addTimelineEvent("Paid full loan payment.");
              s.setFeedback("Loan paid on time. Credit improved.");
            },
          },
          {
            label: "Pay partial $200",
            feedback: "-$200, credit -5",
            apply: (s) => {
              s.balance -= 200;
              s.creditScore = clampCredit(s.creditScore - 5);
              s.addTimelineEvent("Partial loan payment.");
              s.setFeedback("Partial payment. Credit dropped slightly.");
            },
          },
          {
            label: "Miss payment",
            feedback: "Late fee, credit -20",
            apply: (s) => {
              s.creditScore = clampCredit(s.creditScore - 20);
              s.loans.forEach((l) => (l.balance += 50));
              s.addTimelineEvent("Missed loan payment. Late fee applied.");
              s.setFeedback("Missed payment! Credit dropped.");
            },
          },
        ],
      };

      const medEvent: GameEvent = {
        id: nanoid(),
        desc: "You received a $700 medical bill.",
        choices: [
          {
            label: "Pay full $700",
            feedback: "-$700, credit +10",
            apply: (s) => {
              s.balance -= 700;
              s.creditScore = clampCredit(s.creditScore + 10);
              s.addTimelineEvent("Paid medical bill in full.");
              s.setFeedback("Paid in full. Credit improved.");
            },
          },
          {
            label: "Negotiate payment plan ($200 now)",
            feedback: "-$200, credit 0",
            apply: (s) => {
              s.balance -= 200;
              s.addTimelineEvent("Started medical bill payment plan.");
              s.setFeedback("Partial payment plan started. No credit change.");
            },
          },
          {
            label: "Ignore bill",
            feedback: "credit -15",
            apply: (s) => {
              s.creditScore = clampCredit(s.creditScore - 15);
              s.addTimelineEvent("Ignored medical bill.");
              s.setFeedback("You ignored the bill. Credit dropped!");
            },
          },
        ],
      };

      const investEvent: GameEvent = {
        id: nanoid(),
        desc: "Investment opportunity! How do you want to invest?",
        choices: [
          {
            label: "Invest $500 in stocks",
            feedback: "-$500, gain/loss next month",
            apply: (s) => {
              s.balance -= 500;
              s.investments.push({
                id: nanoid(),
                type: "stocks",
                amount: 500,
                value: 500,
              });
              s.addTimelineEvent("Invested $500 in stocks.");
              s.setFeedback("Stock investment made!");
            },
          },
          {
            label: "Invest $500 in Bitcoin",
            feedback: "-$500, higher risk/return",
            apply: (s) => {
              s.balance -= 500;
              s.investments.push({
                id: nanoid(),
                type: "bitcoin",
                amount: 500,
                value: 500,
              });
              s.addTimelineEvent("Invested $500 in Bitcoin.");
              s.setFeedback("Bitcoin investment made!");
            },
          },
          {
            label: "Skip investment",
            feedback: "No change",
            apply: (s) => {
              s.setFeedback("Skipped investment opportunity.");
              s.addTimelineEvent("Skipped investment opportunity.");
            },
          },
        ],
      };

      // Pick one at random
      const events = [carEvent, loanEvent, medEvent, investEvent];
      const ev = events[Math.floor(Math.random() * events.length)];
      set((s) => {
        s.eventQueue.push(ev);
      });
    },
  }))
);
