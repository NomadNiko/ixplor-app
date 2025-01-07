"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: "rgb(43, 19, 70)",
            dark: "rgb(20, 17, 27)",
            light: "rgb(189, 77, 233)",
          },
          secondary: {
            main: "rgb(33, 150, 243)",
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
          text: {
            primary: "rgb(255, 255, 255)",
            secondary: "rgb(255, 255, 255)",
            disabled: "rgb(178, 178, 178)",
          },
        },
        typography: {
          fontFamily: '"Exo 2", sans-serif',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "rgb(20, 17, 27)",
                scrollbarWidth: "auto",
                scrollbarColor: "rgb(43, 19, 70) rgb(20, 17, 27)",
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "rgb(20, 17, 27)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgb(43, 19, 70)",
                  border: "3px solid rgb(20, 17, 27)",
                  borderRadius: "20px",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "rgb(59, 25, 96)",
                    border: "2px solid rgb(20, 17, 27)",
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
