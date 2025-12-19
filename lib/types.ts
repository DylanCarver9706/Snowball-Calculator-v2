export interface Debt {
  name: string;
  interestRate: number;
  amount: number;
  balance: number;
}

export interface SnowballMonth {
  month: number;
  debts: {
    [debtId: string]: {
      payment: number;
      remainingBalance: number;
      interestPaid: number;
      principalPaid: number;
    };
  };
  totalPaid: number;
  snowballAmount: number;
}

export interface SnowballCalculation {
  monthlyContribution: number;
  debts: Debt[];
  months: SnowballMonth[];
}
