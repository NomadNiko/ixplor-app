/* eslint-disable no-restricted-syntax */
"use client";
import { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Typography from "@mui/material/Typography";

export default function Footer() {
  const [isFixed, setIsFixed] = useState(true);

  useEffect(() => {
    const checkPosition = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      setIsFixed(pageHeight <= viewportHeight);
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    window.addEventListener('scroll', checkPosition);

    return () => {
      window.removeEventListener('resize', checkPosition);
      window.removeEventListener('scroll', checkPosition); 
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        py: 4,
        mt: 6,
        position: isFixed ? "fixed" : "relative", 
        bottom: isFixed ? 0 : "auto",
        left: 0,
        bgcolor: "background.default",
        borderTop: "1px solid",
        borderColor: "divider",
        ...(isFixed && {
          "&:before": {
            content: '""',
            display: "block",
            height: "120px",
            width: "100%"
          }
        })
      }}
    >
      {/* Social Icons */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4,
          mb: 2 
        }}
      >
        <MuiLink 
          href="https://facebook.com" 
          target="_blank"
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Facebook size={24} />
        </MuiLink>
        <MuiLink 
          href="https://twitter.com" 
          target="_blank"
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Twitter size={24} />
        </MuiLink>
        <MuiLink 
          href="https://instagram.com" 
          target="_blank"
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Instagram size={24} />
        </MuiLink>
      </Box>

      {/* Copyright and Links */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          © {currentYear} iXplor Inc.
          <Box component="span" sx={{ mx: 1 }}>•</Box>
          <MuiLink
            href="/privacy-policy"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            Privacy Policy
          </MuiLink>
          <Box component="span" sx={{ mx: 1 }}>•</Box>
          <MuiLink
            href="/terms"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            Terms
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}