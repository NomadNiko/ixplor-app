"use client";

import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";

export default function FooterLink() {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "10px",
        width: "100%",
        textAlign: "center",
        mt: "30px",
      }}
    >
      <MuiLink href="/privacy-policy" sx={{ textDecoration: "none" }}>
        Privacy Policy
      </MuiLink>
    </Box>
  );
}