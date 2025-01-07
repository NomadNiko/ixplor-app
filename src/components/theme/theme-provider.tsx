"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: "rgb(43, 19, 70)",    // #2b1346
            dark: "rgb(20, 17, 27)",     // #14111b
            light: "rgb(189, 77, 233)",  // #bd4de9
          },
          secondary: {
            main: "rgb(33, 150, 243)",   // #2196f3
            dark: "rgb(9, 10, 110)",     // #090a6e
            light: "rgb(105, 201, 233)", // already in RGB
          },
          error: {
            main: "rgb(255, 0, 0)",      // #ff0000
            light: "rgb(229, 166, 166)", // #e5a6a6
          },
          success: {
            main: "rgb(0, 150, 136)",    // #009688
            light: "rgb(0, 255, 64)",    // #00ff40
          },
          text: {
            primary: "rgb(255, 255, 255)",     // Always white
            secondary: "rgb(255, 255, 255)",   // Also white for secondary text
            disabled: "rgb(165, 165, 165)",    // Slightly dimmed for disabled text
          },
        },
        typography: {
          fontFamily: '"Exo 2", sans-serif',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "rgb(20, 17, 27)",    // #14111b
                scrollbarWidth: "auto",
                scrollbarColor: "rgb(43, 19, 70) rgb(20, 17, 27)", // #2b1346 #14111b
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgb(20, 17, 27)",      // #14111b
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgb(43, 19, 70)", // #2b1346
                  border: "3px solid rgb(20, 17, 27)", // #14111b
                  borderRadius: "20px",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "rgb(59, 25, 96)", // #3b1960
                    border: "2px solid rgb(20, 17, 27)", // #14111b
                  },
                },
              },
            },
          },
        },
        cssVariables: {
          colorSchemeSelector: "class",
        },
        colorSchemes: { light: true, dark: true },
      }),
    []
  );

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export default ThemeProvider;