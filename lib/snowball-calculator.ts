import { Debt } from "./types";

// Type for each month's data for a debt
export interface DebtMonth {
  payment: number;
  remainingBalance: number;
  principalPaid: number;
  interestPaid: number;
  usedSnowball: boolean;
  rollover: number;
  info: string;
}

// Type for the output structure
export interface DebtWithSchedule extends Debt {
  months: DebtMonth[];
}

// Chart data types
export interface DebtBalanceDataPoint {
  month: number;
  totalBalance: number;
}

export interface FreedMinimumsDataPoint {
  month: number;
  freedMinimums: number;
}

// Return type for calculateSnowball
export interface SnowballCalculationResult {
  debtSchedules: DebtWithSchedule[];
  totalDebt: number;
  monthlyDebts: number;
  currentDebtsSaved: number;
  debtFreeMonths: number;
  debtBalanceData: DebtBalanceDataPoint[];
  freedMinimumsData: FreedMinimumsDataPoint[];
}

// Main snowball calculation
export function calculateSnowball(
  debts: Debt[],
  monthlyExtra: number
): SnowballCalculationResult {
  // No sorting here; process debts in the order provided
  const debtSchedules: DebtWithSchedule[] = debts.map((debt) => ({
    ...debt,
    months: [],
  }));

  // 3. Track freed minimums - initialize with debts that start at 0 balance
  let freedMinimums = 0;
  const paidOffDebtsByMonth = new Map<number, number[]>(); // month -> array of debt indices paid off
  debtSchedules.forEach((debt, idx) => {
    if (debt.balance <= 0) {
      freedMinimums += debt.amount;
      // Track debts that start at 0 balance as paid off at month 0
      if (!paidOffDebtsByMonth.has(0)) {
        paidOffDebtsByMonth.set(0, []);
      }
      paidOffDebtsByMonth.get(0)!.push(idx);
    }
  });
  let month = 0;
  let allPaidOff = false;

  // 4. Track payoff month for each debt
  const payoffMonth: number[] = Array(debtSchedules.length).fill(Infinity);

  // 5. Track current balances
  let balances = debtSchedules.map((d) => d.balance);

  // 6. Loop until all debts are paid off or safety cap
  while (!allPaidOff && month < 1000) {
    let snowballUsed = false;
    let localFreed = freedMinimums;
    let available = 0;
    let i = 0;
    // Find the first unpaid debt
    while (i < debtSchedules.length && balances[i] <= 0) i++;
    // For the first unpaid debt, available = min + freed + snowball
    if (i < debtSchedules.length) {
      available = debtSchedules[i].amount + localFreed + monthlyExtra;
      snowballUsed = true;
    } else {
      // All debts are paid off, but we still need to create month entries
      for (let j = 0; j < debtSchedules.length; j++) {
        const debt = debtSchedules[j];
        debt.months.push({
          payment: 0,
          remainingBalance: 0,
          principalPaid: 0,
          interestPaid: 0,
          usedSnowball: false,
          rollover: debt.amount,
          info: "This debt is paid off. Monthly payment rolls over to next debt.",
        });
      }
      allPaidOff = true;
      month++;
      continue;
    }
    // For each debt in order (process ALL debts, including those with 0 balance)
    for (let j = 0; j < debtSchedules.length; j++) {
      const debt = debtSchedules[j];
      // If already paid off (including those that started at 0), push snowballed cell
      if (balances[j] <= 0) {
        // For debts with 0 balance, their monthly payment should rollover to the next debt
        // If this debt comes before the first unpaid debt, its payment should be added to available
        if (j < i) {
          // This debt's monthly payment should be available for the first unpaid debt
          // It's already included in freedMinimums for future months, but for this month
          // we need to make sure it's available as rollover
          if (j === i - 1) {
            // This is the debt just before the first unpaid debt
            // Its payment is already in freedMinimums, so we don't double-count
            // But we should show it as rollover
            debt.months.push({
              payment: 0,
              remainingBalance: 0,
              principalPaid: 0,
              interestPaid: 0,
              usedSnowball: false,
              rollover: debt.amount,
              info: "This debt is already paid off. Monthly payment rolls over to next debt.",
            });
          } else {
            // This debt's payment is already in freedMinimums and will be used
            debt.months.push({
              payment: 0,
              remainingBalance: 0,
              principalPaid: 0,
              interestPaid: 0,
              usedSnowball: false,
              rollover: debt.amount,
              info: "This debt is already paid off. Monthly payment rolls over to next debt.",
            });
          }
        } else {
          // This debt was paid off during calculation, not at start
          debt.months.push({
            payment: 0,
            remainingBalance: 0,
            principalPaid: 0,
            interestPaid: 0,
            usedSnowball: false,
            rollover: 0,
            info: "This debt is already paid off.",
          });
        }
        continue;
      }
      let infoParts: string[] = [];
      let minPart = `Min payment: $${debt.amount.toFixed(2)}`;
      let freedPart = "";
      let snowballPart = "";
      let rolloverPart = "";
      let usedSnowball = snowballUsed;
      // For the first unpaid debt, add freedMinimums and snowball
      if (snowballUsed) {
        if (localFreed > 0)
          freedPart = ` + Freed minimums: $${localFreed.toFixed(2)}`;
        snowballPart = ` + Monthly Extra Payment: $${monthlyExtra.toFixed(2)}`;
        snowballUsed = false;
      } else {
        // For subsequent debts, only use min + rollover
        available = debt.amount + available;
        if (available > debt.amount) {
          rolloverPart = ` + Rollover: $${(available - debt.amount).toFixed(
            2
          )}`;
        }
      }
      // Calculate interest
      const interest = (balances[j] * (debt.interestRate / 100)) / 12;
      // Calculate payment (cannot pay more than balance + interest)
      let payment = Math.min(available, balances[j] + interest);
      const interestPaid = Math.min(interest, payment);
      const principalPaid = payment - interestPaid;
      let newBalance = balances[j] - principalPaid;
      let thisRollover = 0;
      if (payment < available) {
        thisRollover = available - payment;
      }
      // Build info string
      infoParts.push(minPart, freedPart, rolloverPart, snowballPart);
      infoParts = infoParts.filter(Boolean);
      let info = `Pay = ${infoParts.join("")}`;
      if (thisRollover > 0) {
        info += `. Rollover $${thisRollover.toFixed(
          2
        )} applied to next debt in this month.`;
      }
      // Save this month's data
      debt.months.push({
        payment,
        remainingBalance: newBalance < 0 ? 0 : newBalance,
        principalPaid,
        interestPaid,
        usedSnowball,
        rollover: thisRollover,
        info,
      });
      // If paid off, add min payment to freedMinimums for future months
      if (
        (newBalance < 0 ? 0 : newBalance) === 0 &&
        payoffMonth[j] === Infinity
      ) {
        localFreed += debt.amount;
        payoffMonth[j] = month;
        // Track this debt as paid off in the current month (month + 1 for next month's data point)
        const payoffMonthForData = month + 1;
        if (!paidOffDebtsByMonth.has(payoffMonthForData)) {
          paidOffDebtsByMonth.set(payoffMonthForData, []);
        }
        paidOffDebtsByMonth.get(payoffMonthForData)!.push(j);
      }
      // Rollover is only for the next debt in the same month
      available = thisRollover;
      balances[j] = newBalance < 0 ? 0 : newBalance;
    }
    freedMinimums = localFreed;
    // Check if all debts are paid off
    allPaidOff = balances.every((b) => b <= 0);
    month++;
  }

  // Calculate summary data
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.balance || 0), 0);
  const monthlyDebts = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0);
  const currentDebtsSaved = debts
    .filter((debt) => debt.balance === 0)
    .reduce((sum, debt) => sum + (debt.amount || 0), 0);
  const debtFreeMonths = Math.max(...debtSchedules.map((d) => d.months.length));

  // Calculate debt balance data
  const debtBalanceData: DebtBalanceDataPoint[] = [
    {
      month: 0,
      totalBalance: Math.round(totalDebt * 100) / 100,
    },
  ];

  for (let month = 0; month < debtFreeMonths; month++) {
    const totalBalance = debtSchedules.reduce((sum, debt) => {
      const monthData = debt.months[month];
      return sum + (monthData?.remainingBalance || 0);
    }, 0);
    debtBalanceData.push({
      month: month + 1,
      totalBalance: Math.round(totalBalance * 100) / 100,
    });
  }

  // Calculate freed minimums data using the tracked paidOffDebtsByMonth
  let freedMinimumsTotal = 0;
  const paidOffDebts = new Set<number>();

  // Start with month 0 (Current) - count debts that start at 0 balance using tracked data
  const month0PaidOff = paidOffDebtsByMonth.get(0) || [];
  month0PaidOff.forEach((debtIdx) => {
    freedMinimumsTotal += debtSchedules[debtIdx].amount;
    paidOffDebts.add(debtIdx);
  });

  const freedMinimumsData: FreedMinimumsDataPoint[] = [
    {
      month: 0,
      freedMinimums: Math.round(freedMinimumsTotal * 100) / 100,
    },
  ];

  // For each month, calculate the cumulative freed minimums using tracked data
  for (let month = 0; month < debtFreeMonths; month++) {
    const monthPaidOff = paidOffDebtsByMonth.get(month + 1) || [];
    monthPaidOff.forEach((debtIdx) => {
      if (!paidOffDebts.has(debtIdx)) {
        freedMinimumsTotal += debtSchedules[debtIdx].amount;
        paidOffDebts.add(debtIdx);
      }
    });

    freedMinimumsData.push({
      month: month + 1,
      freedMinimums: Math.round(freedMinimumsTotal * 100) / 100,
    });
  }

  return {
    debtSchedules,
    totalDebt,
    monthlyDebts,
    currentDebtsSaved,
    debtFreeMonths,
    debtBalanceData,
    freedMinimumsData,
  };
}
