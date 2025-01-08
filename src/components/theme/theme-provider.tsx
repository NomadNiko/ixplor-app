"use client";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#1976d2', // Medium blue
          },
        },
        typography: {
          htmlFontSize: 12,
          fontSize: 12,
          h1: { fontSize: "1.875rem", fontWeight: 600, color: "inherit" },
          h2: { fontSize: "1.5rem", fontWeight: 600, color: "inherit" },
          h3: { fontSize: "1.31rem", fontWeight: 600, color: "inherit" },
          h4: { fontSize: "1.125rem", fontWeight: 500, color: "inherit" },
          h5: { fontSize: "0.94rem", fontWeight: 500, color: "inherit" },
          h6: { fontSize: "0.75rem", fontWeight: 500, color: "inherit" },
          body1: { fontSize: "0.75rem", lineHeight: 1.5, color: "inherit" },
          body2: { fontSize: "0.66rem", lineHeight: 1.43, color: "inherit" },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
      }),
    []
  );
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export default ThemeProvider;