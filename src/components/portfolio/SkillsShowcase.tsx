import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";

type Skill = {
  name: string;
  level: number;
  category: string;
};

export default function SkillsShowcase() {
  const skills: Skill[] = [
    { name: "Linux Server Administration", level: 90, category: "Infrastructure" },
    { name: "Technical Support & Troubleshooting", level: 90, category: "Support" },
    { name: "Virtualization (VMware)", level: 92, category: "Infrastructure" },
    { name: "DevOps & Configuration Management", level: 74, category: "Infrastructure" },
    { name: "CI/CD Pipelines", level: 82, category: "Infrastructure" },
    { name: "Cloud Services (AWS, Azure)", level: 75, category: "Infrastructure" },
    { name: "PowerShell/Windows Scripting", level: 70, category: "Scripting" },
    { name: "Bash/Linux scripting", level: 82, category: "Scripting" },
    { name: "Python Scripting", level: 60, category: "Scripting" },
    { name: "Git & Source Control", level: 85, category: "Version Control" },
    { name: "System Monitoring (Nagios, New Relic)", level: 80, category: "Operations" },
    { name: "Database Administration", level: 65, category: "Database" },
    { name: "Jenkins & Deployment Automation", level: 80, category: "DevOps" },
    { name: "Puppet & Ansible", level: 58, category: "Automation" },
    { name: "Java Application Management", level: 65, category: "Application" }
    
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
                {skill.category}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}