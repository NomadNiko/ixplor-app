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
        components: {
          // Links
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
          // Tables
          MuiTableContainer: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgb(0, 0, 0)',
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgb(0, 0, 0)',
                '& .MuiTableCell-head': {
                  color: 'rgb(0, 0, 0)',
                  fontWeight: 600,
                },
              },
            },
          },
          MuiTableBody: {
            styleOverrides: {
              root: {
                backgroundColor: 'rgb(0, 0, 0)',
                '& .MuiTableRow-root': {
                  '& .MuiTableCell-body': {
                    color: 'rgb(255, 255, 255)',
                  },
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgb(20, 20, 20)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgb(40, 40, 40)',
                  },
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: '1px solid rgb(40, 40, 40)',
              },
            },
          },
          // Buttons
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
          // Input Fields
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "rgb(105, 201, 233)",
                  },
                },
              },
            },
          },
          // Cards
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: "rgb(30, 27, 37)",
                borderRadius: '12px',
              },
            },
          },
          // Dialogs
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: "rgb(30, 27, 37)",
                borderRadius: '12px',
              },
            },
          },
          // Select Dropdowns
          MuiSelect: {
            styleOverrides: {
              root: {
                '&.MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "rgb(105, 201, 233)",
                  },
                },
              },
            },
          },
          // Checkboxes
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: "rgba(255, 255, 255, 0.7)",
              },
            },
          },
          // Base CSS
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "rgb(20, 17, 27)",
                color: "rgb(255, 255, 255)",
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