"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography, Box } from "@mui/material";
import type { DebtBalanceDataPoint } from "@/lib/snowball-calculator";

interface DebtBalanceGraphProps {
  data: DebtBalanceDataPoint[];
}

export default function DebtBalanceGraph({
  data: chartData,
}: DebtBalanceGraphProps) {
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

  if (!chartData || chartData.length === 0) {
    return null;
  }

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
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "text.primary",
          fontWeight: 600,
        }}
      >
        Total Debt Balance Over Time
      </Typography>
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
                value: "Total Debt Balance",
                angle: -90,
                position: "insideLeft",
                offset: -15,
                style: { textAnchor: "middle", fontWeight: "bold" },
              }}
              stroke="#666"
            />
            <Tooltip
              formatter={(value: number | undefined) =>
                formatTooltipValue(value ?? 0)
              }
              labelFormatter={(label) => {
                if (label === 0) return "Current";
                return ` Month ${label}`;
              }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Line
              type="monotone"
              dataKey="totalBalance"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: "#667eea", r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Debt Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
