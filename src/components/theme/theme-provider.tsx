"use client";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        colorSchemes: {
          dark: {
            palette: {
              mode: "dark",
              primary: {
                main: "rgb(89, 62, 107)",
                dark: "rgb(40, 27, 47)",
                light: "rgb(209, 97, 253)",
                contrastText: "rgb(255, 255, 255)",
              },
              secondary: {
                main: "rgb(22, 115, 192)",
                dark: "rgb(29, 30, 130)",
                light: "rgb(125, 221, 253)",
                contrastText: "rgb(255, 255, 255)",
              },
              error: {
                main: "rgb(255, 50, 50)",
                light: "rgb(249, 186, 186)",
                contrastText: "rgb(255, 255, 255)",
              },
              success: {
                main: "rgb(20, 170, 156)",
                light: "rgb(50, 255, 84)",
                contrastText: "rgb(255, 255, 255)",
              },
              background: {
                default: "rgb(30, 27, 37)",
                paper: "rgb(40, 37, 47)",
              },
              text: {
                primary: "rgb(240, 240, 240)",
                secondary: "rgb(200, 200, 200)",
                disabled: "rgb(120, 120, 120)",
              },
            },
          },
          light: {
            palette: {
              mode: "light",
              primary: {
                main: "rgb(63, 39, 90)",
                light: "rgb(89, 62, 107)",
                dark: "rgb(30, 27, 37)",
                contrastText: "#ffffff",
              },
              secondary: {
                main: "rgb(22, 115, 192)",
                dark: "rgb(29, 30, 130)",
                light: "rgb(125, 221, 253)",
                contrastText: "#ffffff",
              },
              background: {
                default: "rgb(28, 10, 49)",
                paper: "rgb(70, 45, 90)",
              },
              text: {
                primary: "rgb(240, 240, 240)",
                secondary: "rgb(200, 200, 200)",
                disabled: "rgb(120, 120, 120)",
              },
            },
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
          MuiLink: {
            styleOverrides: {
              root: {
                color: "rgb(125, 221, 253)",
                "&:hover": {
                  color: "rgb(130, 99, 240)",
                },
                textDecoration: "none",
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(21, 0, 71)"
                    : "rgb(53, 0, 0)",
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(0, 0, 0)"
                    : "rgb(9, 0, 49)",
                "& .MuiTableCell-head": {
                  color:
                    theme.palette.mode === "dark"
                      ? "rgb(240, 240, 240)"
                      : "rgb(255, 188, 188)",
                  fontWeight: 600,
                },
              }),
            },
          },
          MuiTableBody: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(0, 0, 0)"
                    : "rgb(20, 17, 27)",
                "& .MuiTableRow-root": {
                  "& .MuiTableCell-body": {
                    color:
                      theme.palette.mode === "dark"
                        ? "rgb(230, 230, 230)"
                        : "rgb(231, 215, 250)",
                  },
                  "&:nth-of-type(odd)": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgb(20, 20, 20)"
                        : "rgb(0, 0, 0)",
                  },
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgb(40, 40, 40)"
                        : "rgb(8, 0, 46)",
                  },
                },
              }),
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: "8px",
                color: "rgb(240, 240, 240)",
              },
              contained: {
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                "& label": {
                  color: theme.palette.text.secondary,
                },
                "& .MuiOutlinedInput-root": {
                  color: theme.palette.text.primary,
                  "& fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.23)"
                        : "rgba(96, 72, 122, 0.42)",
                  },
                  "&:hover fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.4)"
                        : "rgba(63, 46, 83, 0.69)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgb(105, 201, 233)",
                  },
                },
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(30, 27, 37)"
                    : "rgb(20, 17, 27)",
                borderRadius: "12px",
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: ({ theme }: { theme: Theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(30, 27, 37)"
                    : "rgb(20, 17, 27)",
                borderRadius: "12px",
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: ({ theme }: { theme: Theme }) => ({
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgb(20, 17, 27)"
                    : "rgb(0, 8, 77)",
                color: theme.palette.text.primary,
                scrollbarWidth: "auto",
                scrollbarColor:
                  theme.palette.mode === "dark"
                    ? "rgb(43, 19, 70) rgb(20, 17, 27)"
                    : "rgb(43, 19, 70) rgb(20, 17, 27)",
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  background:
                    theme.palette.mode === "dark"
                      ? "rgb(20, 17, 27)"
                      : "rgb(20, 17, 27)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgb(43, 19, 70)",
                  border:
                    theme.palette.mode === "dark"
                      ? "3px solid rgb(47, 39, 65)"
                      : "3px solid rgb(143, 77, 77)",
                  borderRadius: "20px",
                  backgroundClip: "padding-box",
                  "&:hover": {
                    backgroundColor: "rgb(53, 36, 71)",
                    border:
                      theme.palette.mode === "dark"
                        ? "2px solid rgb(50, 42, 68)"
                        : "2px solid rgb(173, 73, 73)",
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
