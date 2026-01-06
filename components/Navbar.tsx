"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
  Feedback as FeedbackIcon,
} from "@mui/icons-material";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isSignedIn } = useUser();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      text: "Snowball Calculator",
      href: "/calculator",
      icon: <CalculateIcon />,
    },
    { text: "How It Works", href: "/how-it-works", icon: <InfoIcon /> },
    { text: "Feedback", href: "/feedback", icon: <FeedbackIcon /> },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "left",
        background: "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
        height: "100%",
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2, px: 2 }}>
        <Image
          src="/icon.PNG"
          alt="My Debt Snowball"
          width={24}
          height={24}
          style={{ borderRadius: "4px" }}
        />
        <Typography variant="h6" sx={{ color: "white" }}>
          My Debt Snowball
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.href}
            sx={{
              color: "white",
              boxSizing: "border-box",
              width: "100%",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ color: "white" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "white", color: "text.primary" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Image
              src="/icon.PNG"
              alt="My Debt Snowball"
              width={32}
              height={32}
              style={{ borderRadius: "4px" }}
            />
            My Debt Snowball
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  href={item.href}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{ textTransform: "none" }}
                >
                  {item.text}
                </Button>
              ))}

              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/calculator"
                  signUpForceRedirectUrl="/onboarding"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: "none",
                      background:
                        "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                    }}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            background:
              "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
