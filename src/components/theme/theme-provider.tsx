"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark', // Keep dark mode for both themes for proper contrast
          primary: {
            main: "rgb(69, 42, 87)",
            dark: "rgb(20, 17, 27)",
            light: "rgb(189, 77, 233)",
          },
          secondary: {
            main: "rgb(2, 95, 172)",
            dark: "rgb(9, 10, 110)",
            light: "rgb(105, 201, 233)",
          },
          error: {
            main: "rgb(255, 0, 0)",
            light: "rgb(229, 166, 166)",
          },
          success: {
            main: "rgb(0, 150, 136)",
            light: "rgb(0, 255, 64)",
          },
          background: {
            // These values will be used in dark mode
            default: "rgb(20, 17, 27)",  // Black theme background
            paper: "rgb(30, 27, 37)",    // Slightly lighter black for cards
          },
          text: {
            primary: "rgb(255, 255, 255)",
            secondary: "rgb(255, 255, 255)",
            disabled: "rgb(178, 178, 178)",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ':root[data-theme="light"]': {
                // Your "light" mode which is actually dark purple
                '--background-default': "rgb(43, 19, 70)",    // Dark purple background
                '--background-paper': "rgb(69, 42, 87)",      // Slightly lighter purple for cards
                '--border-color': "rgb(89, 62, 107)",        // Purple-tinted borders
              },
              ':root[data-theme="dark"]': {
                // Your "dark" mode which is black/grey
                '--background-default': "rgb(20, 17, 27)",    // Very dark background
                '--background-paper': "rgb(30, 27, 37)",      // Slightly lighter for cards
                '--border-color': "rgb(40, 40, 40)",         // Dark borders
              },
              body: {
                backgroundColor: "var(--background-default)",
                scrollbarWidth: "auto",
                scrollbarColor: "rgb(43, 19, 70) var(--background-default)",
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "var(--background-default)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgb(43, 19, 70)",
                  border: `3px solid var(--background-default)`,
                  borderRadius: "20px",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "rgb(59, 25, 96)",
                    border: `2px solid var(--background-default)`,
                  },
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: "var(--background-paper)",
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: "var(--background-paper)",
              },
            },
          },
          // Tables stay black in both modes
          MuiTableContainer: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgb(0, 0, 0)',
              },
            },
          },
          // ... rest of your components remain the same
        },
      }),
    []
  );

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export default ThemeProvider;