"use client";

import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        colorSchemes: {
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
                default: 'rgb(184, 189, 255)',
                paper: 'rgb(212, 214, 235)',
              },
            },
          },
        },
        typography: {
          fontFamily: '"Exo", "Roboto", "Helvetica", "Arial", sans-serif',
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
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : '#f5f5f5',
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
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 0, 0)' : '#ffffff',
                '& .MuiTableRow-root': {
                  '& .MuiTableCell-body': {
                    color: theme.palette.mode === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(43, 19, 70)',
                  },
                  '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(20, 20, 20)' : '#f5f5f5',
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgb(40, 40, 40)' : '#e0e0e0',
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
                      'rgba(255, 255, 255, 0.23)' : 'rgba(43, 19, 70, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? 
                      'rgba(255, 255, 255, 0.4)' : 'rgba(43, 19, 70, 0.4)',
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
                  "rgb(30, 27, 37)" : "rgb(195, 187, 214)",
                borderRadius: '12px',
              }),
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 
                  "rgb(30, 27, 37)" : "rgb(177, 176, 223)",
                borderRadius: '12px',
              }),
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 
                  "rgb(20, 17, 27)" : "rgb(102, 0, 0)",
                color: theme.palette.mode === 'dark' ? 
                  "rgb(255, 191, 191)" : "rgb(121, 133, 201)",
                scrollbarWidth: "auto",
                scrollbarColor: theme.palette.mode === 'dark' ?
                  "rgb(43, 19, 70) rgb(20, 17, 27)" : "rgb(43, 19, 70) rgb(20, 17, 27)",
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background: theme.palette.mode === 'dark' ? 
                    "rgb(20, 17, 27)" : "#ffffff",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgb(43, 19, 70)",
                  border: theme.palette.mode === 'dark' ?
                    "3px solid rgb(20, 17, 27)" : "3px solid rgb(82, 0, 0)",
                  borderRadius: "20px",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "rgb(59, 25, 96)",
                    border: theme.palette.mode === 'dark' ?
                      "2px solid rgb(20, 17, 27)" : "2px solid rgb(105, 0, 0)",
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