"use client";
import { useState } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import ResumeSection from "@/components/portfolio/ResumeSection";
import SkillsShowcase from "@/components/portfolio/SkillsShowcase";
import ProjectGallery from "@/components/portfolio/ProjectGallery";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function PortfolioPageContent() {
  const [selectedSection, setSelectedSection] = useState<string>('resume');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom sx={{ 
        fontSize: { xs: '2rem', md: '3rem' },
        textAlign: { xs: 'center', md: 'left' }
      }}>
        Niko Halley - Portfolio
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5} lg={4} order={{ xs: 2, md: 1 }}>
          <Box sx={{ mb: 4 }}>
            <Paper elevation={2} sx={{ 
              p: 3,
              borderRadius: 2,
              position: { md: 'sticky' },
              top: { md: 24 },
            }}>
              <Typography variant="h5" gutterBottom>
                About Me
              </Typography>
              <Typography paragraph>
                I am a versatile IT professional with extensive experience in DevOps, cloud engineering, 
                and system administration. My career spans roles in Site Operations, Cloud Engineering, 
                and technical support, with a strong focus on infrastructure automation, 
                performance optimization, and streamlining complex technical environments.
              </Typography>
            </Paper>
          </Box>
          
          <Paper elevation={2} sx={{ 
            p: 3,
            borderRadius: 2,
            position: { md: 'sticky' },
            top: { md: 230 },
          }}>
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'row' : 'column', 
              gap: 2,
              flexWrap: isMobile ? 'wrap' : 'nowrap'
            }}>
              {['resume', 'skills', 'projects'].map((section) => (
                <Button
                  key={section}
                  variant={selectedSection === section ? "contained" : "outlined"}
                  onClick={() => setSelectedSection(section)}
                  fullWidth={!isMobile}
                  sx={{ flex: isMobile ? '1 0 calc(50% - 8px)' : '1' }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7} lg={8} order={{ xs: 1, md: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </Typography>
          </Box>
          
          {selectedSection === 'resume' && <ResumeSection />}
          {selectedSection === 'skills' && <SkillsShowcase />}
          {selectedSection === 'projects' && <ProjectGallery />}
        </Grid>
      </Grid>
    </Container>
  );
}