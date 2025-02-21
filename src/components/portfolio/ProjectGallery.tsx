import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

export default function ProjectGallery() {
  const projects = [
    {
      title: "iXplor Booking Platform",
      description: "Full-stack booking and marketplace platform for local experiences and activities",
      technologies: "React, Next.js, TypeScript, Node.js, MongoDB, Stripe",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Unity Game Project",
      description: "3D adventure game with procedural generation and exploration mechanics",
      technologies: "Unity, C#, Procedural Generation, 3D Modeling",
      image: "/api/placeholder/400/200"
    },
    {
      title: "DevOps Infrastructure Automation",
      description: "Comprehensive infrastructure-as-code solution with multi-cloud deployment",
      technologies: "Terraform, Docker, Kubernetes, AWS, Azure, CI/CD Pipelines",
      image: "/api/placeholder/400/200"
    }
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
              <Typography variant="body2" color="text.secondary" paragraph>
                {project.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Technologies: {project.technologies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}