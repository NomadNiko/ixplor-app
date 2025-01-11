import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Calendar, Users, Award, Book, DollarSign, Star, Plus } from 'lucide-react';
import { LessonProduct } from '@/types/vendor-types';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

interface LessonsViewProps {
  lessons: LessonProduct[];
  onEditClick?: () => void;
}

export default function LessonsView({ lessons, onEditClick }: LessonsViewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculate stats
  const totalBookings = lessons.reduce((sum, lesson) => 
    lesson.status === 'booked' ? sum + 1 : sum, 0);
  const averagePrice = lessons.reduce((sum, lesson) => 
    sum + lesson.price, 0) / lessons.length;
  const totalRevenue = lessons.reduce((sum, lesson) => 
    lesson.status === 'booked' ? sum + lesson.price : sum, 0);
  const bookedLessons = lessons.filter(l => l.status === 'booked').length;

  // Chart data
  const lessonsByType = [
    { name: 'Private', value: lessons.filter(l => l.maxStudents === 1).length },
    { name: 'Small Group', value: lessons.filter(l => l.maxStudents > 1 && l.maxStudents <= 4).length },
    { name: 'Group', value: lessons.filter(l => l.maxStudents > 4).length }
  ];

  // Generate sample booking data
  const bookingData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    bookings: Math.floor(Math.random() * 10),
  })).reverse();

  return (
    <Box>
      {/* Quick Stats Section */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Book className="text-primary" size={20} />
                <Typography variant="h4">{totalBookings}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Award className="text-success" size={20} />
                <Typography variant="h4">{bookedLessons}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Booked Lessons
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DollarSign className="text-warning" size={20} />
                <Typography variant="h4">${averagePrice.toFixed(0)}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Average Lesson Price
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Star className="text-info" size={20} />
                <Typography variant="h4">${totalRevenue.toLocaleString()}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs 
            value={activeTab} 
            onChange={(_e, v) => setActiveTab(v)}
          >
            <Tab 
              value="dashboard" 
              label="Dashboard" 
              icon={<Award className="w-4 h-4" />}
              iconPosition="start"
            />
            <Tab 
              value="schedule" 
              label="Schedule" 
              icon={<Calendar className="w-4 h-4" />}
              iconPosition="start"
            />
            <Tab 
              value="instructors" 
              label="Instructors" 
              icon={<Users className="w-4 h-4" />}
              iconPosition="start"
            />
          </Tabs>
          <Button 
            variant="contained" 
            startIcon={<Plus size={20} />}
            onClick={onEditClick}
          >
            Add New Lesson
          </Button>
        </Box>

        {activeTab === 'dashboard' && (
          <Grid container spacing={3}>
            {/* Lesson Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <Box p={3}>
                  <Typography variant="h6" gutterBottom>
                    Lesson Type Distribution
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={lessonsByType}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {lessonsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Booking Timeline Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <Box p={3}>
                  <Typography variant="h6" gutterBottom>
                    Recent Booking Activity
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bookingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="bookings" stroke="#3B82F6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 'schedule' && (
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lesson</TableCell>
                    <TableCell>Instructor</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Students</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>{lesson.name}</TableCell>
                      <TableCell>{lesson.instructor}</TableCell>
                      <TableCell>
                        {lesson.scheduledDate || 'Flexible'}
                      </TableCell>
                      <TableCell>{lesson.duration}</TableCell>
                      <TableCell>
                        {lesson.maxStudents === 1 ? 'Private' : `Up to ${lesson.maxStudents}`}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={lesson.status}
                          color={
                            lesson.status === 'available' ? 'success' :
                            lesson.status === 'booked' ? 'primary' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        ${lesson.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'instructors' && (
          <Grid container spacing={2}>
            {lessons.reduce((acc, lesson) => {
              const existingInstructor = acc.find(i => i.name === lesson.instructor);
              if (!existingInstructor) {
                acc.push({
                  name: lesson.instructor,
                  expertise: lesson.expertise,
                  languages: lesson.languages,
                  totalLessons: 1,
                  rating: 4.5 + Math.random() * 0.5, // Sample rating
                });
              } else {
                existingInstructor.totalLessons++;
              }
              return acc;
            }, [] as Array<{
              name: string;
              expertise: string;
              languages: string[];
              totalLessons: number;
              rating: number;
            }>).map((instructor, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {instructor.name}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Expertise: {instructor.expertise}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Languages: {instructor.languages.join(', ')}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Star className="text-warning" size={16} />
                        <Typography variant="body2">
                          {instructor.rating.toFixed(1)} Rating
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {instructor.totalLessons} Lessons
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}