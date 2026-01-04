"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import type { DebtWithSchedule } from "@/lib/snowball-calculator";

interface PerDebtPayoffGraphProps {
  debtSchedules: DebtWithSchedule[];
}

export default function PerDebtPayoffGraph({
  debtSchedules,
}: PerDebtPayoffGraphProps) {
  // Filter out debts with balance 0
  const activeDebts = debtSchedules.filter((debt) => debt.balance > 0);
  const activeDebtIndices = debtSchedules
    .map((debt, idx) => (debt.balance > 0 ? idx : -1))
    .filter((idx) => idx !== -1);

  const [selectedDebtIndex, setSelectedDebtIndex] = useState<number>(
    activeDebtIndices[0] ?? 0
  );

  if (
    !debtSchedules ||
    debtSchedules.length === 0 ||
    activeDebts.length === 0
  ) {
    return null;
  }

  const selectedDebt = debtSchedules[selectedDebtIndex];
  if (!selectedDebt || selectedDebt.balance === 0) {
    return null;
  }

  // Transform debt schedule data into chart data
  // Include months where the debt is not paid off (remainingBalance > 0)
  // Also include the first month after it's paid off (remainingBalance = 0) to show completion
  const chartData = [
    {
      month: 0,
      monthLabel: "Current",
      remainingBalance: Math.round(selectedDebt.balance * 100) / 100,
      payment: 0,
      principalPaid: 0,
      interestPaid: 0,
      rollover: 0,
      info: "",
    },
  ];

  let foundFirstPaidOffMonth = false;
  for (let month = 0; month < selectedDebt.months.length; month++) {
    const monthData = selectedDebt.months[month];
    // Add months where the debt is not paid off
    if (monthData.remainingBalance > 0) {
      chartData.push({
        month: month + 1,
        monthLabel: `Month ${month + 1}`,
        remainingBalance: Math.round(monthData.remainingBalance * 100) / 100,
        payment: Math.round(monthData.payment * 100) / 100,
        principalPaid: Math.round(monthData.principalPaid * 100) / 100,
        interestPaid: Math.round(monthData.interestPaid * 100) / 100,
        rollover: Math.round(monthData.rollover * 100) / 100,
        info: monthData.info,
      });
    } else if (!foundFirstPaidOffMonth) {
      // Include the first month where balance reaches 0 to show completion
      foundFirstPaidOffMonth = true;
      chartData.push({
        month: month + 1,
        monthLabel: `Month ${month + 1}`,
        remainingBalance: 0,
        payment: Math.round(monthData.payment * 100) / 100,
        principalPaid: Math.round(monthData.principalPaid * 100) / 100,
        interestPaid: Math.round(monthData.interestPaid * 100) / 100,
        rollover: Math.round(monthData.rollover * 100) / 100,
        info: monthData.info,
      });
    }
  }

  const handleDebtChange = (event: SelectChangeEvent<number>) => {
    const newIndex = Number(event.target.value);
    // Ensure the selected debt has a balance > 0
    if (debtSchedules[newIndex] && debtSchedules[newIndex].balance > 0) {
      setSelectedDebtIndex(newIndex);
    } else {
      // Fallback to first active debt if selection is invalid
      setSelectedDebtIndex(activeDebtIndices[0] ?? 0);
    }
  };

  // Custom tooltip formatter
  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Custom Y-axis formatter
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #ccc",
            borderRadius: "4px",
            p: 1.5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {label === 0 ? "Current" : `Month ${label}`}
          </Typography>
          <Stack spacing={0.5}>
            {data.payment > 0 && (
              <>
                <Typography variant="body2">
                  <strong>Payment:</strong> {formatTooltipValue(data.payment)}
                </Typography>
                <Typography variant="body2" sx={{ pl: 1, fontSize: "0.75rem" }}>
                  Principal: {formatTooltipValue(data.principalPaid)}
                </Typography>
                <Typography variant="body2" sx={{ pl: 1, fontSize: "0.75rem" }}>
                  Interest: {formatTooltipValue(data.interestPaid)}
                </Typography>
              </>
            )}
            <Typography variant="body2">
              <strong>Remaining Balance:</strong>{" "}
              {formatTooltipValue(data.remainingBalance)}
            </Typography>
            {data.rollover > 0 && (
              <Typography variant="body2" sx={{ color: "warning.main" }}>
                <strong>Rollover:</strong> {formatTooltipValue(data.rollover)}
              </Typography>
            )}
            {data.info && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  pt: 0.5,
                  borderTop: "1px solid #e0e0e0",
                  fontStyle: "italic",
                }}
              >
                {data.info}
              </Typography>
            )}
          </Stack>
        </Box>
      );
    }
    return null;
  };

  // Calculate months to pay off for the selected debt
  const monthsToPayOff =
    selectedDebt.months.findIndex(
      (month, idx) =>
        month.remainingBalance === 0 &&
        (idx === 0 || selectedDebt.months[idx - 1].remainingBalance > 0)
    ) + 1; // +1 because findIndex is 0-based, but we want month number

  return (
    <Card
      sx={{
        mt: 3,
        mb: 2,
        p: { xs: 2, sm: 3 },
        backgroundColor: "white",
        border: "1px solid rgba(37,99,235,0.15)",
        boxShadow: "none",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          Per Debt Payoff Schedule
        </Typography>
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <Select
            value={selectedDebtIndex}
            onChange={handleDebtChange}
            displayEmpty
            sx={{
              backgroundColor: "white",
            }}
          >
            {activeDebtIndices.map((debtIdx) => (
              <MenuItem key={debtIdx} value={debtIdx}>
                {debtSchedules[debtIdx].name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Summary Data for Selected Debt */}
      <Card
        sx={{
          mb: 2,
          backgroundColor: "#f5f7ff",
          border: "1px solid rgba(37,99,235,0.1)",
          boxShadow: "none",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 3 }}
          sx={{
            alignItems: { sm: "center" },
            p: { xs: 2, sm: 3 },
            justifyContent: { sm: "space-between" },
          }}
        >
          {/* Current Balance */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Current Balance
            </Typography>
            <Typography variant="h6" color="primary">
              $
              {selectedDebt.balance.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>

          {/* Monthly Payment */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Monthly Payment
            </Typography>
            <Typography variant="h6" color="primary">
              $
              {selectedDebt.amount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              {" / month"}
            </Typography>
          </Box>

          {/* Interest Rate */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Interest Rate
            </Typography>
            <Typography variant="h6" color="primary">
              {selectedDebt.interestRate.toFixed(2)}%
            </Typography>
          </Box>

          {/* Months to Pay Off */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Months to Pay Off
            </Typography>
            <Typography variant="h6" color="primary">
              {monthsToPayOff > 0 ? monthsToPayOff : "N/A"} months
            </Typography>
          </Box>
        </Stack>
      </Card>
      <Box sx={{ width: "100%", height: { xs: 300, sm: 400 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 25,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                if (value === 0) return "Current";
                return `${value}`;
              }}
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -15,
                style: { textAnchor: "middle", fontWeight: "bold" },
              }}
              stroke="#666"
            />
            <YAxis
              tickFormatter={(value) => {
                if (value === 0) return "";
                return formatYAxis(value);
              }}
              label={{
                value: "Remaining Balance",
                angle: -90,
                position: "insideLeft",
                offset: -15,
                style: { textAnchor: "middle", fontWeight: "bold" },
              }}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="remainingBalance"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: "#667eea", r: 4 }}
              activeDot={{ r: 6 }}
              name="Remaining Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
