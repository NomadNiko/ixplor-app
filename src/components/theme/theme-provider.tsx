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
            main: "#2b1346",    // Double quotes instead of single
            dark: "#14111b",
            light: "#bd4de9",
          },
          secondary: {
            main: "#2196f3",
            dark: "#090a6e",
            light: "rgb(105, 201, 233)",
          },
          error: {
            main: "#ff0000",
            light: "#e5a6a6",
          },
          success: {
            main: "#009688",
            light: "#00ff40",
          },
        },
        typography: {
          fontFamily: '"Exo 2", sans-serif',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "#14111b",
                scrollbarWidth: "auto",
                scrollbarColor: "#2b1346 #14111b",
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#14111b",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#2b1346",
                  border: "3px solid #14111b",
                  borderRadius: "20px",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "#3b1960",
                    border: "2px solid #14111b",
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