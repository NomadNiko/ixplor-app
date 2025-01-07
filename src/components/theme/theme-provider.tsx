"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

// Define your theme colors
const themeColors = {
  purple: {
    background: "rgb(43, 19, 70)",
    paper: "rgb(69, 42, 87)",
    primary: "rgb(69, 42, 87)",
    secondary: "rgb(2, 95, 172)"
  },
  darker: {
    background: "rgb(20, 17, 27)",
    paper: "rgb(30, 27, 37)",
    primary: "rgb(43, 19, 70)",
    secondary: "rgb(2, 95, 172)"
  }
};

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        // Always use dark mode for proper contrasts
        palette: {
          mode: 'dark',
          primary: {
            main: "var(--primary-color)",
          },
          secondary: {
            main: "var(--secondary-color)",
          },
          background: {
            default: "var(--background-color)",
            paper: "var(--paper-color)",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              ':root[data-theme="purple"]': {
                '--background-color': themeColors.purple.background,
                '--paper-color': themeColors.purple.paper,
                '--primary-color': themeColors.purple.primary,
                '--secondary-color': themeColors.purple.secondary,
              },
              ':root[data-theme="darker"]': {
                '--background-color': themeColors.darker.background,
                '--paper-color': themeColors.darker.paper,
                '--primary-color': themeColors.darker.primary,
                '--secondary-color': themeColors.darker.secondary,
              },
              body: {
                backgroundColor: "var(--background-color)",
                transition: "background-color 0.2s ease",
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: "var(--paper-color)",
              }
            }
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: "var(--paper-color)",
              }
            }
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: "var(--paper-color)",
              }
            }
          }
        }
      }),
    []
  );

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export default ThemeProvider;