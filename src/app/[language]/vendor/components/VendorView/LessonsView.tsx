"use client";

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LessonProduct } from '@/types/vendor-types';
import { StatusChip, StatCard } from './styled/vendor-view-styled';

interface LessonsViewProps {
  lessons: LessonProduct[];
}

export default function LessonsView({ lessons }: LessonsViewProps) {
  return (
    <Grid container spacing={3}>
      {/* Stats Overview */}
      <Grid size={{ xs: 12 }} container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <GroupIcon color="primary" />
                <Typography variant="h6">
                  {lessons.filter((lesson) => lesson.status === "booked").length}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Booked Lessons
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6">
                  {lessons.filter((lesson) => lesson.status === "requested").length}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Pending Requests
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Lessons List */}
      {lessons.map((lesson) => (
        <Grid key={lesson.id} size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {lesson.name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography variant="body2">
                  Instructor: {lesson.instructor}
                </Typography>
                <Typography variant="body2">
                  Duration: {lesson.duration}
                </Typography>
                <Typography variant="body2" color="primary">
                  ${lesson.price}
                </Typography>
              </Stack>

              <Box display="flex" alignItems="center" gap={2}>
                <StatusChip 
                  label={lesson.status}
                  status={lesson.status as "available" | "booked" | "cancelled"}
                  size="small"
                />
                {lesson.scheduledDate && (
                  <Typography variant="body2" color="textSecondary">
                    Scheduled: {lesson.scheduledDate}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}