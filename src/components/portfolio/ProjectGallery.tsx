import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
//import { useTranslation } from "@/services/i18n/client";

export default function ProjectGallery() {
  //const { t } = useTranslation("portfolio");

  const projects = [
    {
      title: "Booking System",
      description: "React/TypeScript booking management system",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Unity Game",
      description: "3D adventure game built with Unity/C#",
      image: "/api/placeholder/400/200"
    },
    // Add more projects
  ];

  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} key={project.title}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={project.image}
              alt={project.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}