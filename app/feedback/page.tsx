"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useUser } from "@clerk/nextjs";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: "bug" | "feature" | "general";
}

export default function FeedbackPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    name: user?.fullName || user?.firstName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    subject: "",
    message: "",
    type: "general",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSuccess(true);
      // Reset form
      setFormData({
        name: user?.fullName || user?.firstName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        subject: "",
        message: "",
        type: "general",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Send Us Feedback
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ opacity: 0.9 }}>
            We'd love to hear from you! Share your thoughts, report bugs, or
            suggest new features.
          </Typography>
        </Container>
      </Box>

      {/* Form Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Thank you for your feedback! We'll review it and get back to you
              if needed.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Feedback Type"
                name="type"
                select
                value={formData.type}
                onChange={handleChange}
                required
                fullWidth
              >
                <MenuItem value="general">General Feedback</MenuItem>
                <MenuItem value="bug">Bug Report</MenuItem>
                <MenuItem value="feature">Feature Request</MenuItem>
              </TextField>

              <TextField
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                disabled={!!user}
              />

              <TextField
                label="Your Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                disabled={!!user}
              />

              <TextField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                fullWidth
                placeholder="Brief description of your feedback"
              />

              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={6}
                placeholder="Tell us more about your feedback, bug report, or feature request..."
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                  textTransform: "none",
                  py: 1.5,
                  mt: 2,
                }}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
