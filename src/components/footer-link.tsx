/* eslint-disable no-restricted-syntax */
"use client";
import { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";

export default function FooterLink() {
  const [isFixed, setIsFixed] = useState(true);

  useEffect(() => {
    const checkPosition = () => {
      // Get page height and viewport height
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      //const scrollPosition = window.scrollY;

      // If page is taller than viewport, make footer relative
      // Otherwise keep it fixed
      setIsFixed(pageHeight <= viewportHeight);
    };

    // Check position initially
    checkPosition();

    // Add resize listener
    window.addEventListener('resize', checkPosition);
    window.addEventListener('scroll', checkPosition);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkPosition);
      window.removeEventListener('scroll', checkPosition); 
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        py: 3,
        position: isFixed ? "fixed" : "relative", 
        bottom: isFixed ? 0 : "auto",
        left: 0,
        bgcolor: "background.default",
        borderTop: "1px solid",
        borderColor: "divider"
      }}
    >
      <MuiLink 
        href="/privacy-policy" 
        sx={{ 
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline"
          }
        }}
      >
        Privacy Policy
      </MuiLink>
    </Box>
  );
}