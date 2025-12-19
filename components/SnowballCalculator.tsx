"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import type { Debt } from "@/lib/types";
import {
  calculateSnowball,
  type DebtWithSchedule,
} from "@/lib/snowball-calculator";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import confetti from "canvas-confetti";

function getDefaultDebt(): Debt {
  return {
    name: "New Debt",
    interestRate: 10,
    amount: 50,
    balance: 10000,
  };
}

// Format number to always show 2 decimal places (for display)
function formatNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === "") return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";
  return num.toFixed(2);
}

// Normalize a debt's numeric values to ensure 2 decimal precision
function normalizeDebt(debt: Debt): Debt {
  return {
    ...debt,
    interestRate: parseFloat((debt.interestRate || 0).toFixed(2)),
    amount: parseFloat((debt.amount || 0).toFixed(2)),
    balance: parseFloat((debt.balance || 0).toFixed(2)),
  };
}

export function SnowballCalculator() {
  const { user, isLoaded } = useUser();
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [editDebts, setEditDebts] = useState<Debt[] | null>(null);
  const [editMonthlyContribution, setEditMonthlyContribution] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const { openSignIn } = useClerk();

  // Load data from Clerk metadata on component mount
  useEffect(() => {
    if (isLoaded && user) {
      const metadata = user.publicMetadata as any;
      if (parseInt(metadata?.monthlyContribution) >= 0 && metadata?.debts) {
        setMonthlyContribution(parseInt(metadata.monthlyContribution));
        // Normalize debts to ensure 2 decimal precision
        const normalizedDebts = (metadata.debts as Debt[]).map(normalizeDebt);
        setDebts(normalizedDebts);
      } else {
        // Seed with sample debts
        setDebts([
          {
            name: "Store Card",
            interestRate: 15,
            amount: 45,
            balance: 1200,
          },
          {
            name: "Medical Debt",
            interestRate: 0,
            amount: 150,
            balance: 3500,
          },
          {
            name: "Credit Card",
            interestRate: 26,
            amount: 250,
            balance: 20000,
          },
          {
            name: "Personal Loan",
            interestRate: 8,
            amount: 500,
            balance: 10000,
          },
          {
            name: "Car Loan",
            interestRate: 6,
            amount: 650,
            balance: 30000,
          },
        ]);
      }
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  // If not signed in, open Clerk sign-in modal on load (browser only)
  useEffect(() => {
    if (isLoaded && !user) {
      openSignIn();
    }
  }, [isLoaded, user, openSignIn]);

  // Save data to Clerk metadata
  const saveToMetadata = async (
    newDebts: Debt[],
    newMonthlyContribution: number
  ) => {
    if (!user) return;
    try {
      const res = await fetch("/api/update-user-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: {
            monthlyContribution: newMonthlyContribution,
            debts: newDebts,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save data");
    } catch (err) {
      console.error("Error saving to metadata:", err);
    }
  };

  // Derived and calculated data
  const sortedDebts = useMemo(() => {
    return [...debts].sort((a, b) => a.balance - b.balance);
  }, [debts]);

  const calculation: DebtWithSchedule[] = useMemo(() => {
    if (sortedDebts.length === 0) return [] as DebtWithSchedule[];
    let snowballedResult = calculateSnowball(sortedDebts, monthlyContribution);
    // console.log("snowballedResult", snowballedResult);
    return snowballedResult;
  }, [sortedDebts, monthlyContribution]);

  const maxMonths = useMemo(() => {
    if (calculation.length === 0) return 0;
    return Math.max(...calculation.map((d) => d.months.length));
  }, [calculation]);

  // Editing handlers
  const startEdit = () => {
    // Sort debts: debts with balance > 0 first, then debts with balance 0 at bottom
    const sortedDebts = [...debts].sort((a, b) => {
      if (a.balance === 0 && b.balance !== 0) return 1;
      if (a.balance !== 0 && b.balance === 0) return -1;
      return a.balance - b.balance;
    });
    // Normalize debts to ensure 2 decimal precision
    const normalizedDebts = sortedDebts.map(normalizeDebt);
    setEditDebts(JSON.parse(JSON.stringify(normalizedDebts)));
    setEditMonthlyContribution(monthlyContribution);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditDebts(null);
    setEditMonthlyContribution(null);
    setEditing(false);
  };

  const saveEdit = async () => {
    if (editDebts && editMonthlyContribution !== null) {
      // Normalize debts to ensure 2 decimal precision
      const normalizedDebts = editDebts.map(normalizeDebt);
      // Sort debts: debts with balance > 0 first, then debts with balance 0 at bottom
      const sorted = [...normalizedDebts].sort((a, b) => {
        if (a.balance === 0 && b.balance !== 0) return 1;
        if (a.balance !== 0 && b.balance === 0) return -1;
        return a.balance - b.balance;
      });
      setDebts(sorted);
      setMonthlyContribution(editMonthlyContribution);
      await saveToMetadata(sorted, editMonthlyContribution);
    }
    setEditDebts(null);
    setEditMonthlyContribution(null);
    setEditing(false);
  };

  const handleEditDebtChange = (
    index: number,
    field: keyof Debt,
    value: string | number
  ) => {
    setEditDebts((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      const parsed =
        typeof value === "string" &&
        (field === "interestRate" || field === "amount" || field === "balance")
          ? Number(value)
          : value;
      updated[index] = { ...updated[index], [field]: parsed } as Debt;

      return updated;
    });
  };

  const handleEditAddDebt = () =>
    setEditDebts((prev) => (prev ? [...prev, getDefaultDebt()] : prev));

  const handleEditDeleteDebt = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDebt = () => {
    if (deleteIndex !== null) {
      setEditDebts((prev) => {
        if (!prev) return prev;
        const updated = [...prev];
        updated.splice(deleteIndex, 1);
        return updated;
      });
    }
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const cancelDeleteDebt = () => {
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleMarkPaidOff = (index: number) => {
    setEditDebts((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], balance: 0 };

      // Reorder: debts with balance > 0 first, then debts with balance 0 at bottom
      const reordered = updated.sort((a, b) => {
        if (a.balance === 0 && b.balance !== 0) return 1;
        if (a.balance !== 0 && b.balance === 0) return -1;
        return a.balance - b.balance;
      });

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe"],
      });

      return reordered;
    });
  };

  if (user && isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          p: { xs: 2, sm: 3 },
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          color: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: "center", sm: "center" }}
              justifyContent={{ xs: "center", sm: "flex-start" }}
              flexWrap="nowrap"
              sx={{ width: "100%", overflow: "hidden" }}
            >
              <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                Monthly Extra Payment:
              </Typography>
              {editing ? (
                <TextField
                  type="number"
                  size="medium"
                  value={editMonthlyContribution ?? monthlyContribution}
                  onChange={(e) =>
                    setEditMonthlyContribution(
                      Math.max(0, Math.floor(Number(e.target.value)))
                    )
                  }
                  inputProps={{ min: 0 }}
                  sx={{
                    minWidth: { xs: 70, sm: 140 },
                    maxWidth: { xs: 70, sm: 200 },
                    "& .MuiInputBase-input": { color: "white", fontSize: 18 },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  ${monthlyContribution}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ flexGrow: { xs: 0, sm: 1 } }} />
          {editing ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              flexWrap="wrap"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                onClick={saveEdit}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                onClick={cancelEdit}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              onClick={startEdit}
              sx={{
                backgroundColor: "white",
                color: "black",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                whiteSpace: "nowrap",
                height: 40,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Edit Table / Extra Payment
            </Button>
          )}
        </Stack>
      </Card>

      {/* Summary Section */}
      <Card
        sx={{
          mt: 3,
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
          {/* Total Debt */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Total Debt
            </Typography>
            <Typography variant="h6" color="primary">
              $
              {debts
                .reduce((sum, b) => sum + Number(b.balance), 0)
                .toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
          </Box>

          {/* Extra Monthly Income Freed */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Monthly Debts
            </Typography>
            <Typography variant="h6" color="primary">
              $
              {debts
                .reduce((sum, b) => sum + Number(b.amount), 0)
                .toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              / month
            </Typography>
          </Box>

          {/* Total Monthly Income Saved (current debts with 0 balance)*/}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Monthly Debts Saved
            </Typography>
            <Typography variant="h6" color="primary">
              $
              {debts
                .filter((b) => b.balance === 0)
                .reduce((sum, b) => sum + Number(b.amount), 0)
                .toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {" / month"}
            </Typography>
          </Box>

          {/* Months to Debt Free */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Time Until Debt Free
            </Typography>
            <Typography variant="h6" color="primary">
              {calculation.length === 0
                ? 0
                : Math.max(
                    ...calculation.map(
                      (d) =>
                        d.months.findIndex(
                          (m, i) =>
                            m.remainingBalance === 0 &&
                            (i === 0 || d.months[i - 1].remainingBalance > 0)
                        ) + 1
                    )
                  )}
              {" months"}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {editing ? (
        <Card
          sx={{
            mt: 3,
            p: { xs: 2, sm: 3 },
            border: "1px solid rgba(37,99,235,0.15)",
          }}
        >
          {/* Mobile-friendly editor */}
          <Stack spacing={2} sx={{ display: { xs: "block", sm: "none" } }}>
            {editDebts?.map((debt, idx) => (
              <Box
                key={idx}
                sx={{
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  gap: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                  color: "white",
                  overflow: "hidden",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    width: "100%",
                    overflow: "visible",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label="Debt Name"
                    value={debt.name}
                    onChange={(e) =>
                      handleEditDebtChange(idx, "name", e.target.value)
                    }
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-input": {
                        color: "white",
                        fontSize: 18,
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                    }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Interest Rate (%)"
                    value={debt.interestRate}
                    onChange={(e) =>
                      handleEditDebtChange(idx, "interestRate", e.target.value)
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        color: "white",
                        fontSize: 18,
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                    }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Monthly Minimum Payment"
                    value={debt.amount}
                    onChange={(e) =>
                      handleEditDebtChange(idx, "amount", e.target.value)
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        color: "white",
                        fontSize: 18,
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                    }}
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Balance"
                    value={debt.balance}
                    onChange={(e) =>
                      handleEditDebtChange(idx, "balance", e.target.value)
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                    sx={{
                      mt: 1,
                      "& .MuiInputBase-input": {
                        color: "white",
                        fontSize: 18,
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                    }}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, width: "100%", overflow: "visible" }}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleMarkPaidOff(idx)}
                      disabled={debt.balance === 0}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        flexShrink: 1,
                        minWidth: 0,
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.3)",
                        },
                        "&:disabled": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.5)",
                        },
                      }}
                    >
                      Mark Paid Off
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleEditDeleteDebt(idx)}
                      size="small"
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Add Debt Button - Mobile */}
          <Box
            sx={{ display: { xs: "block", sm: "none" }, mt: 2, width: "100%" }}
          >
            <Button
              variant="contained"
              onClick={handleEditAddDebt}
              fullWidth
              sx={{
                background:
                  "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                  opacity: 0.9,
                },
              }}
            >
              Add Debt +
            </Button>
          </Box>

          {/* Desktop/tablet editor */}
          <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: { sm: 320, md: 360 } }}>
                    Debt Name
                  </TableCell>
                  <TableCell sx={{ width: { sm: 120, md: 150 } }}>
                    Interest Rate (%)
                  </TableCell>
                  <TableCell sx={{ width: { sm: 100, md: 130 } }}>
                    Min. Monthly Payment
                  </TableCell>
                  <TableCell sx={{ width: { sm: 120, md: 140 } }}>
                    Current Balance
                  </TableCell>
                  <TableCell align="left" sx={{ width: { sm: 120, md: 200 } }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editDebts?.map((debt, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ width: { sm: 360, md: 420 } }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={debt.name}
                        onChange={(e) =>
                          handleEditDebtChange(idx, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ width: { sm: 120, md: 140 } }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          type="number"
                          size="small"
                          value={debt.interestRate}
                          onChange={(e) =>
                            handleEditDebtChange(
                              idx,
                              "interestRate",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{
                            maxWidth: 90,
                            "& .MuiInputBase-input": { fontSize: 13 },
                          }}
                        />
                        {/* <Typography variant="body2" sx={{ ml: 1 }}>
                          %
                        </Typography> */}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: { sm: 100, md: 130 } }}>
                      <TextField
                        type="number"
                        size="small"
                        value={debt.amount}
                        onChange={(e) =>
                          handleEditDebtChange(idx, "amount", e.target.value)
                        }
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          maxWidth: { sm: 100, md: 130 },
                          "& .MuiInputBase-input": { fontSize: 13 },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: { sm: 120, md: 100 } }}>
                      <TextField
                        type="number"
                        size="small"
                        value={debt.balance}
                        onChange={(e) =>
                          handleEditDebtChange(idx, "balance", e.target.value)
                        }
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          maxWidth: { sm: 120, md: 100 },
                          "& .MuiInputBase-input": { fontSize: 13 },
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-start"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleMarkPaidOff(idx)}
                          disabled={debt.balance === 0}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.75rem",
                          }}
                        >
                          Mark Paid Off
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => handleEditDeleteDebt(idx)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Debt Button - Desktop */}
          <Box
            sx={{ display: { xs: "none", sm: "block" }, mt: 2, width: "100%" }}
          >
            <Button
              variant="contained"
              onClick={handleEditAddDebt}
              fullWidth
              sx={{
                background:
                  "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                  opacity: 0.9,
                },
              }}
            >
              Add Debt +
            </Button>
          </Box>
        </Card>
      ) : (
        <Card
          sx={{
            mt: 3,
            p: { xs: 2, sm: 3 },
            backgroundColor: "white",
            border: "1px solid rgba(37,99,235,0.15)",
            boxShadow: "none",
          }}
        >
          <Box sx={{ overflow: "auto", maxHeight: 800 }}>
            <Table
              size="small"
              stickyHeader
              sx={{
                minWidth: { xs: 600, sm: 800 },
                "& .MuiTableCell-root": {
                  padding: { xs: "4px 6px", sm: "8px 16px" },
                  fontSize: { xs: 12, sm: "inherit" },
                },
                "& .MuiTypography-body2": {
                  fontSize: { xs: 12, sm: 14 },
                },
                "& .MuiTypography-caption": {
                  fontSize: { xs: 10, sm: 12 },
                },
                "& .MuiTypography-subtitle2": {
                  fontSize: { xs: 12, sm: 14 },
                },
              }}
            >
              <TableHead
                sx={{
                  "& .MuiTableCell-head": {
                    background:
                      "linear-gradient(135deg, rgba(102,126,234) 0%, rgba(71,94,194) 100%)",
                    color: "#ffffff",
                    borderBottom: "1px solid rgba(37,99,235,0.3)",
                  },
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      background:
                        "linear-gradient(135deg, rgb(102,126,234) 0%, rgb(71,94,194) 100%)",
                      zIndex: 2,
                      minWidth: { xs: 80, sm: 100 },
                      fontSize: { xs: 12 },
                      color: "#ffffff",

                      align: "center",
                      textAlign: "center",
                    }}
                  >
                    Month
                  </TableCell>
                  {sortedDebts.map((b, idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{ textAlign: "center" }}
                    >
                      <Typography variant="subtitle2" align="center">
                        {b.name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={{ xs: 0.5, sm: 1 }}
                        justifyContent="center"
                      >
                        <Typography variant="caption">
                          Rate: {formatNumber(b.interestRate)}%
                        </Typography>
                        <Typography variant="caption">
                          Payment: ${formatNumber(b.amount)}/mo
                        </Typography>
                        <Typography variant="caption">
                          Balance: ${formatNumber(b.balance)}
                        </Typography>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: maxMonths }, (_, m) => (
                  <TableRow key={m} hover>
                    <TableCell
                      sx={{
                        position: "sticky",
                        left: 0,
                        background: "#eef2ff",
                        zIndex: 1,
                        minWidth: { xs: 80, sm: 100 },
                        fontSize: { xs: 12 },
                        color: "#1e293b",
                        textAlign: "center",
                        align: "center",
                      }}
                    >
                      Month {m + 1}
                    </TableCell>
                    {calculation.map((debt, idx) => {
                      const monthData = debt.months[m];
                      const payoffIdx = debt.months.findIndex(
                        (mm, i) =>
                          mm.remainingBalance === 0 &&
                          (i === 0 || debt.months[i - 1].remainingBalance > 0)
                      );
                      const isSnowballed = payoffIdx !== -1 && m > payoffIdx;
                      return (
                        <TableCell
                          key={idx}
                          align="center"
                          sx={{
                            backgroundColor: isSnowballed
                              ? "#e8f5e9"
                              : undefined,
                          }}
                        >
                          {isSnowballed ? (
                            <Typography
                              variant="body2"
                              color="black"
                              fontWeight={600}
                            >
                              Snowballed
                            </Typography>
                          ) : monthData ? (
                            <Box>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Typography variant="body2">
                                  Pay: ${monthData.payment.toFixed(2)}
                                </Typography>
                                <Tooltip
                                  title={monthData.info}
                                  placement="top"
                                  enterTouchDelay={0}
                                  leaveTouchDelay={2000}
                                  arrow
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "text-gray-400",
                                      cursor: "default",
                                    }}
                                  >
                                    ℹ️
                                  </Typography>
                                </Tooltip>
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={{ xs: 0.5, sm: 1 }}
                                justifyContent="center"
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Principal: $
                                  {monthData.principalPaid.toFixed(2)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Interest: ${monthData.interestPaid.toFixed(2)}
                                </Typography>
                              </Stack>
                              <Typography variant="caption">
                                Remaining Balance: $
                                {monthData.remainingBalance.toFixed(2)}
                              </Typography>
                              {monthData.rollover > 0 && (
                                <Typography
                                  variant="caption"
                                  color="warning.main"
                                  fontWeight={600}
                                >
                                  <br></br>Rollover: $
                                  {monthData.rollover.toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteDebt}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Debt</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {deleteIndex !== null && editDebts && editDebts[deleteIndex] ? (
              <>
                Are you sure you want to delete{" "}
                <strong>{editDebts[deleteIndex].name}</strong>? This action
                cannot be undone.
              </>
            ) : (
              "Are you sure you want to delete this debt? This action cannot be undone."
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteDebt} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteDebt}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
