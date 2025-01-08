"use client";

import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        colorSchemes: {
          // Dark mode configuration
          dark: {
            palette: {
              mode: 'dark',
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
                default: "rgb(20, 17, 27)",
                paper: "rgb(30, 27, 37)",
              },
              text: {
                primary: "rgb(255, 255, 255)",
                secondary: "rgb(255, 255, 255)",
                disabled: "rgb(178, 178, 178)",
              },
            },
          },
          light: {
            palette: {
              mode: 'light',
              primary: {
                main: "rgb(43, 19, 70)",
                light: "rgb(69, 42, 87)",
                dark: "rgb(20, 17, 27)",
                contrastText: "#ffffff",
              },
              secondary: {
                main: "rgb(2, 95, 172)",
                dark: "rgb(9, 10, 110)",
                light: "rgb(105, 201, 233)",
                contrastText: "#ffffff",
              },
              background: {
                default: "rgb(18, 0, 39)",
                paper: "rgb(60, 35, 90)",
              },
              text: {
                primary: "rgb(229, 206, 255)",
                secondary: "rgb(197, 145, 231)",
                disabled: "rgb(194, 105, 105)",
              },
            },
          },
        },
        typography: {
          // Apply 75% scaling to all typography variants
          htmlFontSize: 12, // Default is 16
          fontSize: 12, // Default is 14
          h1: {
            fontSize: '1.875rem',  // 75% of 2.5rem
            fontWeight: 600,
          },
          h2: {
            fontSize: '1.5rem',    // 75% of 2rem
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.31rem',   // 75% of 1.75rem
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.125rem',  // 75% of 1.5rem
            fontWeight: 500,
          },
          h5: {
            fontSize: '0.94rem',   // 75% of 1.25rem
            fontWeight: 500,
          },
          h6: {
            fontSize: '0.75rem',   // 75% of 1rem
            fontWeight: 500,
          },
          body1: {
            fontSize: '0.75rem',   // 75% of 1rem
            lineHeight: 1.5,
          },
          body2: {
            fontSize: '0.66rem',   // 75% of 0.875rem
            lineHeight: 1.43,
          },
        },
        components: {
          MuiLink: {
            styleOverrides: {
              root: {
                color: "rgb(105, 201, 233)",
                "&:hover": {
                  color: "rgb(130, 99, 240)",
                },
                textDecoration: 'none',
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(21, 0, 71)' : 'rgb(53, 0, 0)',
              }),
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(9, 0, 49)' ,
                '& .MuiTableCell-head': {
                  color: theme.palette.mode === 'dark' ? 'rgb(193, 202, 255)' : 'rgb(255, 188, 188)',
                  fontWeight: 600,
                },
              }),
            },
          },
          MuiTableBody: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : "rgb(20, 17, 27)",
                '& .MuiTableRow-root': {
                  '& .MuiTableCell-body': {
                    color: theme.palette.mode === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(231, 215, 250)',
                  },
                  '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(20, 20, 20)' :'rgb(0, 0, 0)',
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(40, 40, 40)' : 'rgb(8, 0, 46)',
                  },
                },
              }),
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: '8px',
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? 
                      'rgba(255, 255, 255, 0.23)' : 'rgba(96, 72, 122, 0.42)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? 
                      'rgba(255, 255, 255, 0.4)' : 'rgba(63, 46, 83, 0.69)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "rgb(105, 201, 233)",
                  },
                },
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 
                  "rgb(30, 27, 37)" : "rgb(20, 17, 27)",
                borderRadius: '12px',
              }),
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 
                  "rgb(30, 27, 37)" : "rgb(20, 17, 27)",
                borderRadius: '12px',
              }),
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 
                  "rgb(20, 17, 27)" : "rgb(0, 8, 77)" ,
                color: theme.palette.mode === 'dark' ? 
                  "rgb(255, 191, 191)" : "rgb(157, 162, 184)",
                scrollbarWidth: "auto",
                scrollbarColor: theme.palette.mode === 'dark' ?
                  "rgb(43, 19, 70) rgb(20, 17, 27)" : "rgb(43, 19, 70) rgb(20, 17, 27)",
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background: theme.palette.mode === 'dark' ? 
                    "rgb(20, 17, 27)" : "rgb(20, 17, 27)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgb(43, 19, 70)",
                  border: theme.palette.mode === 'dark' ?
                    "3px solid rgb(47, 39, 65)" : "3px solid rgb(143, 77, 77)",
                  borderRadius: "20px",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "rgb(53, 36, 71)",
                    border: theme.palette.mode === 'dark' ?
                      "2px solid rgb(50, 42, 68)" : "2px solid rgb(173, 73, 73)",
                  },
                },
              }),
            },
          },
        },
      }),
    []
  );

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export default ThemeProvider;