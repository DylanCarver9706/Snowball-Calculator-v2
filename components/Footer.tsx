"use client";

import { Box, Container, Button, Typography, Stack } from "@mui/material";
import Link from "next/link";
import { useTheme, useMediaQuery } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "white",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h6"
            component="h3"
            color="text.primary"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Quick Links
          </Typography>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 1 : 3}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              component={Link}
              href="/terms-of-service"
              color="inherit"
              sx={{
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                },
              }}
            >
              Terms of Service
            </Button>
            <Button
              component={Link}
              href="/privacy-policy"
              color="inherit"
              sx={{
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                },
              }}
            >
              Privacy Policy
            </Button>
            <Button
              component={Link}
              href="/feedback"
              color="inherit"
              sx={{
                textTransform: "none",
                color: "text.secondary",
              }}
            >
              Feedback
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

