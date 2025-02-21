"use client";
import { useState } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ResumeSection from "@/components/portfolio/ResumeSection";
import SkillsShowcase from "@/components/portfolio/SkillsShowcase";
import ProjectGallery from "@/components/portfolio/ProjectGallery";
import Button from '@mui/material/Button';

export default function PortfolioPageContent() {
  const [selectedSection, setSelectedSection] = useState<string>('resume');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom>
        Niko Halley - Portfolio
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              About Me
            </Typography>
            <Typography paragraph>
              I am a versatile IT professional with extensive experience in DevOps, cloud engineering, 
              and system administration. My career spans roles in Site Operations, Cloud Engineering, 
              and technical support, with a strong focus on infrastructure automation, 
              performance optimization, and streamlining complex technical environments.
            </Typography>
          </Box>

          {selectedSection === 'resume' && <ResumeSection />}
          {selectedSection === 'skills' && <SkillsShowcase />}
          {selectedSection === 'projects' && <ProjectGallery />}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ 
            position: 'sticky',
            top: 24,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['resume', 'skills', 'projects'].map((section) => (
                <Button
                  key={section}
                  variant={selectedSection === section ? "contained" : "outlined"}
                  onClick={() => setSelectedSection(section)}
                  fullWidth
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}