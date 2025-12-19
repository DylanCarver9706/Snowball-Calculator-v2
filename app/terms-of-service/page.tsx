import { Container, Typography, Box, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readFileSync } from "fs";
import { join } from "path";

export default function TermsOfServicePage() {
  // Read the markdown file from the public folder
  const markdownPath = join(process.cwd(), "public", "TermsOfService.md");
  const markdownContent = readFileSync(markdownPath, "utf-8");

  return (
    <Box sx={{ py: 8, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              "& h1": {
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: "bold",
                mb: 3,
                color: "text.primary",
              },
              "& h2": {
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                fontWeight: "bold",
                mt: 4,
                mb: 2,
                color: "text.primary",
              },
              "& h3": {
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: "bold",
                mt: 3,
                mb: 1.5,
                color: "text.primary",
              },
              "& p": {
                mb: 2,
                lineHeight: 1.7,
                color: "text.secondary",
              },
              "& ul, & ol": {
                mb: 2,
                pl: 3,
              },
              "& li": {
                mb: 1,
                lineHeight: 1.7,
                color: "text.secondary",
              },
              "& strong": {
                fontWeight: "bold",
                color: "text.primary",
              },
              "& hr": {
                my: 4,
                borderColor: "divider",
              },
              "& a": {
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

