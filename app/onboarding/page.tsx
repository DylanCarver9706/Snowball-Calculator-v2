"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { Debt } from "@/lib/types";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

function getDefaultDebt(): Debt {
  return {
    name: "",
    interestRate: 0,
    amount: 0,
    balance: 0,
  };
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

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [debts, setDebts] = useState<Debt[]>([getDefaultDebt()]);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const totalSteps = 2;

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in?redirect_url=/onboarding");
    } else if (isLoaded && user) {
      setIsLoading(false);
    }
  }, [isLoaded, user, router]);

  const handleDebtChange = (
    index: number,
    field: keyof Debt,
    value: string | number
  ) => {
    setDebts((prev) => {
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

  const handleAddDebt = () => {
    setDebts((prev) => [...prev, getDefaultDebt()]);
  };

  const handleDeleteDebt = (index: number) => {
    if (debts.length > 1) {
      setDebts((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };

  const saveDebts = async () => {
    setIsSaving(true);
    try {
      // Normalize and filter out empty debts
      const normalizedDebts = debts
        .map(normalizeDebt)
        .filter((debt) => debt.name.trim() !== "" && debt.balance > 0);

      // Ensure at least one debt
      if (normalizedDebts.length === 0) {
        alert("Please add at least one debt with a name and balance.");
        setIsSaving(false);
        return;
      }

      const res = await fetch("/api/update-user-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: {
            monthlyContribution: monthlyContribution || 0,
            debts: normalizedDebts,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to save data");

      // Ensure Clerk metadata is refreshed before navigating
      await user?.reload();

      router.push("/calculator");
    } catch (err) {
      console.error("Error saving debts:", err);
      alert("Failed to save your debts. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      saveDebts();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Progress Indicator */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Step {currentStep + 1} of {totalSteps}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mt: 1,
            }}
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor:
                    index <= currentStep ? "primary.main" : "grey.300",
                  transition: "background-color 0.3s",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Carousel Content */}
        <Card
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 3,
            minHeight: 500,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#e8e8e8",
          }}
        >
          {/* Welcome Step */}
          {currentStep === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flexGrow: 1,
                justifyContent: "center",
                py: 6,
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "#1e293b",
                  mb: 3,
                  maxWidth: 900,
                }}
              >
                Welcome to My Debt Snowball!
              </Typography>

              {/* Snowball App Icon */}
              <Box sx={{ mb: 3 }}>
                <img
                  src="/icon.PNG"
                  alt="My Debt Snowball"
                  width={100}
                  height={100}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: "#64748b",
                  maxWidth: 600,
                  mb: 5,
                  lineHeight: 1.7,
                }}
              >
                You've taken the first step toward financial freedom. We're here
                to help you create a personalized debt payoff plan using the
                proven Debt Snowball Method.
              </Typography>

              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#1e293b",
                  mb: 3,
                  maxWidth: 700,
                }}
              >
                Let's get started by adding your debts.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  maxWidth: 600,
                  lineHeight: 1.7,
                  fontSize: "1.1rem",
                }}
              >
                <strong>Don't worry, you can always update this later.</strong>
              </Typography>
            </Box>
          )}

          {/* Debts Input Step */}
          {currentStep === 1 && (
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1e293b", mb: 3 }}
              >
                Add Your Debts
              </Typography>

              {/* Instructions */}
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: "#f0f4ff",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InfoIcon
                      sx={{ color: "#667eea", mr: 1.5, fontSize: 28 }}
                    />
                    <AlertTitle
                      sx={{
                        fontWeight: 600,
                        color: "#1e293b",
                        mb: 0,
                        fontSize: "1.1rem",
                      }}
                    >
                      How to find your debt information:
                    </AlertTitle>
                  </Box>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ color: "#475569", mb: 3 }}
                  >
                    <strong style={{ color: "#1e293b" }}>Where to look:</strong>{" "}
                    Check your credit card statements, loan documents, or online
                    accounts.
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ color: "#475569" }}
                        >
                          <strong
                            style={{
                              display: "block",
                              marginBottom: 8,
                              color: "#1e293b",
                            }}
                          >
                            Include things that can be paid off:
                          </strong>
                          <ul
                            style={{
                              marginTop: 0,
                              marginBottom: 0,
                              paddingLeft: 20,
                              color: "#475569",
                              listStyleType: "disc",
                            }}
                          >
                            <li>Credit Cards</li>
                            <li>Mortgage</li>
                            <li>Student Loans</li>
                            <li>Car Loans</li>
                            <li>Medical Bills</li>
                          </ul>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ color: "#475569" }}
                        >
                          <strong
                            style={{
                              display: "block",
                              marginBottom: 8,
                              color: "#1e293b",
                            }}
                          >
                            Exclude things that can't be paid off:
                          </strong>
                          <ul
                            style={{
                              marginTop: 0,
                              marginBottom: 0,
                              paddingLeft: 20,
                              color: "#475569",
                              listStyleType: "disc",
                            }}
                          >
                            <li>Utility Bills</li>
                            <li>Subscriptions</li>
                            <li>Rent</li>
                            <li>Insurance</li>
                            <li>Other Personal Expenses</li>
                          </ul>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>

              {/* Monthly Extra Contribution */}
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(102, 126, 234, 0.15)",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      mb: 1,
                    }}
                  >
                    Monthly Extra Contribution
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      mb: 2,
                    }}
                  >
                    This is the extra amount you are willing to pay toward your
                    debts each month beyond your minimum payments.
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    label="Monthly Extra Contribution"
                    value={monthlyContribution || ""}
                    onChange={(e) =>
                      setMonthlyContribution(Number(e.target.value) || 0)
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="0.00"
                    fullWidth
                    sx={{
                      maxWidth: { xs: "100%", sm: 400 },
                    }}
                  />
                </Box>
              </Card>

              {/* Debt Input Box */}
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(102, 126, 234, 0.15)",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                      mb: 3,
                    }}
                  >
                    Your Debts
                  </Typography>

                  {/* Mobile Debt Input */}
                  <Stack
                    spacing={2}
                    sx={{ display: { xs: "block", sm: "none" } }}
                  >
                    {debts.map((debt, idx) => (
                      <Paper
                        key={idx}
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                          color: "white",
                          mb: 2,
                        }}
                      >
                        <Stack spacing={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                              width: "100%",
                            }}
                          >
                            <TextField
                              size="small"
                              label="Debt Name"
                              value={debt.name}
                              onChange={(e) =>
                                handleDebtChange(idx, "name", e.target.value)
                              }
                              placeholder="Credit Card"
                              sx={{
                                flexGrow: 1,
                                "& .MuiInputBase-input": { color: "white" },
                                "& .MuiInputLabel-root": { color: "white" },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "white",
                                },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor: "rgba(255,255,255,0.5)",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "rgba(255,255,255,0.7)",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "white",
                                  },
                                },
                              }}
                            />
                            <IconButton
                              onClick={() => handleDeleteDebt(idx)}
                              disabled={debts.length === 1}
                              sx={{
                                color: "white",
                                opacity: debts.length === 1 ? 0.3 : 1,
                                flexShrink: 0,
                                mt: 0.5,
                                "&:hover": {
                                  backgroundColor: "rgba(255,255,255,0.1)",
                                },
                                "&.Mui-disabled": {
                                  color: "rgba(255,255,255,0.3)",
                                },
                              }}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <TextField
                            type="number"
                            size="small"
                            label="Current Balance"
                            value={debt.balance || ""}
                            onChange={(e) =>
                              handleDebtChange(idx, "balance", e.target.value)
                            }
                            inputProps={{ min: 0, step: 0.01 }}
                            placeholder="0.00"
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "white",
                              },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "rgba(255,255,255,0.5)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgba(255,255,255,0.7)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "white",
                                },
                              },
                            }}
                          />
                          <TextField
                            type="number"
                            size="small"
                            label="Interest Rate (%)"
                            value={debt.interestRate || ""}
                            onChange={(e) =>
                              handleDebtChange(
                                idx,
                                "interestRate",
                                e.target.value
                              )
                            }
                            inputProps={{ min: 0, step: 0.01 }}
                            placeholder="0.00"
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "white",
                              },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "rgba(255,255,255,0.5)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgba(255,255,255,0.7)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "white",
                                },
                              },
                            }}
                          />
                          <TextField
                            type="number"
                            size="small"
                            label="Minimum Monthly Payment"
                            value={debt.amount || ""}
                            onChange={(e) =>
                              handleDebtChange(idx, "amount", e.target.value)
                            }
                            inputProps={{ min: 0, step: 0.01 }}
                            placeholder="0.00"
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "white",
                              },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "rgba(255,255,255,0.5)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgba(255,255,255,0.7)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "white",
                                },
                              },
                            }}
                          />
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>

                  {/* Desktop Debt Input */}
                  <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
                    <Table
                      size="small"
                      sx={{ "& .MuiTableCell-root": { padding: "8px 12px" } }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: "#1e293b",
                              width: "40%",
                            }}
                          >
                            Debt Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: "#1e293b",
                              width: "18%",
                            }}
                          >
                            Current Balance
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: "#1e293b",
                              width: "15%",
                            }}
                          >
                            Interest Rate (%)
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: "#1e293b",
                              width: "18%",
                            }}
                          >
                            Min. Monthly Payment
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 600,
                              color: "#1e293b",
                              width: "9%",
                            }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debts.map((debt, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ width: "40%" }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={debt.name}
                                onChange={(e) =>
                                  handleDebtChange(idx, "name", e.target.value)
                                }
                                placeholder="Credit Card"
                              />
                            </TableCell>
                            <TableCell sx={{ width: "18%" }}>
                              <TextField
                                type="number"
                                size="small"
                                value={debt.balance || ""}
                                onChange={(e) =>
                                  handleDebtChange(
                                    idx,
                                    "balance",
                                    e.target.value
                                  )
                                }
                                inputProps={{ min: 0, step: 0.01 }}
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell sx={{ width: "15%" }}>
                              <TextField
                                type="number"
                                size="small"
                                value={debt.interestRate || ""}
                                onChange={(e) =>
                                  handleDebtChange(
                                    idx,
                                    "interestRate",
                                    e.target.value
                                  )
                                }
                                inputProps={{ min: 0, step: 0.01 }}
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell sx={{ width: "18%" }}>
                              <TextField
                                type="number"
                                size="small"
                                value={debt.amount || ""}
                                onChange={(e) =>
                                  handleDebtChange(
                                    idx,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                inputProps={{ min: 0, step: 0.01 }}
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell align="center" sx={{ width: "9%" }}>
                              <IconButton
                                onClick={() => handleDeleteDebt(idx)}
                                disabled={debts.length === 1}
                                color="error"
                                size="small"
                                sx={{
                                  "&.Mui-disabled": {
                                    opacity: 0.3,
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Card>

              {/* Add Debt Button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDebt}
                fullWidth
                sx={{
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                  color: "white",
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                    opacity: 0.9,
                  },
                }}
              >
                Add Another Debt
              </Button>
            </Box>
          )}
        </Card>

        {/* Navigation Buttons */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ px: { xs: 0, sm: 2 } }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            disabled={currentStep === 0 || isSaving}
            sx={{ minWidth: 120 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            endIcon={
              currentStep === totalSteps - 1 ? (
                isSaving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              ) : (
                <ArrowForwardIcon />
              )
            }
            onClick={handleNext}
            disabled={isSaving}
            sx={{
              minWidth: 200,
              background:
                "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                opacity: 0.9,
              },
            }}
          >
            {isSaving
              ? "Saving..."
              : currentStep === totalSteps - 1
              ? "Calculate Your Debt Snowball"
              : "Next"}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
