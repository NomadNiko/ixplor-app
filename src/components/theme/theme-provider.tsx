"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#10104c',
            dark: 'rgb(20, 17, 27)',
            light: '#10104c',
          },
          secondary: {
            main: '#311b92',
            dark: 'rgb(9, 10, 110)',
            light: '#311b92',
          },
          error: {
            main: 'rgb(255, 0, 0)',
            light: 'rgb(229, 166, 166)',
          },
          success: {
            main: 'rgb(0, 150, 136)',
            light: 'rgb(0, 255, 64)',
          },
          background: {
            default: '#90caf9',
            paper: '#e1f5fe',
          },
        },
        typography: {
          fontFamily: 'Love Ya Like A Sister',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 500,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
          },
        },
        shape: {
          borderRadius: 8,
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