"use client";
import { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import { Facebook, Instagram, MailPlusIcon, Twitter } from "lucide-react";
import Typography from "@mui/material/Typography";

export default function Footer() {
    const [isFixed, setIsFixed] = useState(true);
  
    useEffect(() => {
      const checkPosition = () => {
        const pageHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        setIsFixed(pageHeight <= viewportHeight + 40); // Adjusted to account for smaller footer
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
          height: isFixed ? "40px" : "auto",
          position: isFixed ? "fixed" : "relative",
          bottom: isFixed ? 0 : "auto",
          left: 0,
          bgcolor: "background.default",
          borderTop: "1px solid",
          borderColor: "divider",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4
        }}
      >
        {/* Social Icons */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <MuiLink 
            href="https://www.facebook.com/real.ixplor/" 
            target="_blank"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              lineHeight: 0 // Removes extra space around icons
            }}
          >
            <Facebook size={20} />
          </MuiLink>
          <MuiLink 
            href="https://x.com/real_iXplor" 
            target="_blank"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              lineHeight: 0
            }}
          >
            <Twitter size={20} />
          </MuiLink>
          <MuiLink 
            href="https://instagram.com" 
            target="_blank"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              lineHeight: 0
            }}
          >
            <Instagram size={20} />
          </MuiLink>
          <MuiLink 
            href="mailto:aloha@ixplor.app" 
            target="_blank"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              lineHeight: 0
            }}
          >
            <MailPlusIcon size={20} />
          </MuiLink>
        </Box>

        {/* Copyright and Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: '0.75rem'
            }}
          >
            © {currentYear} iXplor Inc.
            <Box component="span" sx={{ mx: 0.5 }}>•</Box>
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
            <Box component="span" sx={{ mx: 0.5 }}>•</Box>
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