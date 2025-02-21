import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { useTranslation } from "@/services/i18n/client";

type Skill = {
  name: string;
  level: number;
  category: string;
};

export default function SkillsShowcase() {
  const { t } = useTranslation("portfolio");
  
  const skills: Skill[] = [
    { name: "Linux/DevOps", level: 95, category: "infrastructure" },
    { name: "C#/Unity", level: 85, category: "programming" },
    { name: "React/TypeScript", level: 80, category: "frontend" },
    { name: "Node.js", level: 75, category: "backend" },
    // Add more skills
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {skills.map((skill) => (
          <Grid item xs={12} sm={6} key={skill.name}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {skill.name}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={skill.level}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" sx={{ mt: 1 }}>
                {t(`skills.categories.${skill.category}`)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}