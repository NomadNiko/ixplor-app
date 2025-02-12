import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Edit, Filter, Clock, User, LifeBuoy, Calendar, ExternalLink } from "lucide-react";
import { format } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { SupportTicket } from '../../types/support-ticket';
import AssignUser from './AssignUser';
import ChangeStatus from './ChangeStatus';
import EditTicketForm from './EditTicketForm';
import UpdateTicketForm from './UpdateTicketForm';

interface Filters {
  status: string;
  user: string;
  dateRange: string;
  searchTerm: string;
}

interface SortConfig {
  field: 'createDate' | 'lastUpdate' | 'status';
  direction: 'asc' | 'desc';
}

export default function ServiceAdminPage() {
  const { t } = useTranslation("service-admin");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    user: '',
    dateRange: '',
    searchTerm: ''
  });
  const [sort, setSort] = useState<SortConfig>({
    field: 'createDate',
    direction: 'desc'
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const queryParams = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.user && { userId: filters.user }),
        ...(filters.dateRange && { dateRange: filters.dateRange }),
        ...(filters.searchTerm && { search: filters.searchTerm }),
        sortField: sort.field,
        sortDirection: sort.direction,
        admin: 'true' // Add this parameter to get all tickets
      });

      const response = await fetch(`${API_URL}/support-tickets/admin/all?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data.tickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filters, sort]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSortChange = (field: SortConfig['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPENED': return 'warning';
      case 'ASSIGNED': return 'info';
      case 'HOLD': return 'secondary';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <LifeBuoy size={32} />
          <Typography variant="h4">
            {t('title')}
          </Typography>
        </Box>
        <Typography color="text.secondary" paragraph>
          {t('subtitle')}
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label={t('filters.search')}
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('filters.status')}</InputLabel>
                <Select
                  value={filters.status}
                  label={t('filters.status')}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">{t('filters.all')}</MenuItem>
                  <MenuItem value="OPENED">{t('status.opened')}</MenuItem>
                  <MenuItem value="ASSIGNED">{t('status.assigned')}</MenuItem>
                  <MenuItem value="HOLD">{t('status.hold')}</MenuItem>
                  <MenuItem value="RESOLVED">{t('status.resolved')}</MenuItem>
                  <MenuItem value="CLOSED">{t('status.closed')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('filters.dateRange')}</InputLabel>
                <Select
                  value={filters.dateRange}
                  label={t('filters.dateRange')}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <MenuItem value="">{t('filters.allTime')}</MenuItem>
                  <MenuItem value="today">{t('filters.today')}</MenuItem>
                  <MenuItem value="week">{t('filters.thisWeek')}</MenuItem>
                  <MenuItem value="month">{t('filters.thisMonth')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<Filter />}
                onClick={() => setFilters({ status: '', user: '', dateRange: '', searchTerm: '' })}
                fullWidth
              >
                {t('filters.clear')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Sort Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant={sort.field === 'createDate' ? 'contained' : 'outlined'}
          startIcon={<Calendar />}
          onClick={() => handleSortChange('createDate')}
        >
          {t('sort.created')} {sort.field === 'createDate' && (sort.direction === 'asc' ? '↑' : '↓')}
        </Button>
        <Button
          variant={sort.field === 'lastUpdate' ? 'contained' : 'outlined'}
          startIcon={<Clock />}
          onClick={() => handleSortChange('lastUpdate')}
        >
          {t('sort.lastUpdate')} {sort.field === 'lastUpdate' && (sort.direction === 'asc' ? '↑' : '↓')}
        </Button>
        <Button
          variant={sort.field === 'status' ? 'contained' : 'outlined'}
          startIcon={<Filter />}
          onClick={() => handleSortChange('status')}
        >
          {t('sort.status')} {sort.field === 'status' && (sort.direction === 'asc' ? '↑' : '↓')}
        </Button>
      </Box>

      {/* Tickets Grid */}
      <Grid container spacing={3}>
        {tickets.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              {t('noTickets')}
            </Typography>
          </Grid>
        ) : (
          tickets.map((ticket) => (
            <Grid item xs={12} key={ticket._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">
                        {ticket.ticketTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.ticketDescription}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={ticket.ticketCategory}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={t(`status.${ticket.status.toLowerCase()}`)}
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Calendar size={16} />
                      {format(new Date(ticket.createDate), 'PPp')}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <User size={16} />
                      {t('ticket')} #{ticket.ticketId}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ExternalLink size={16} />}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowFullView(true);
                      }}
                    >
                      {t('actions.viewDetails')}
                    </Button>
                    <AssignUser
                      ticketId={ticket._id}
                      currentStatus={ticket.status}
                      onAssignSuccess={loadTickets}
                    />
                    <ChangeStatus
                      ticketId={ticket._id}
                      currentStatus={ticket.status}
                      onStatusChange={loadTickets}
                    />
                    <IconButton
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={20} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Full View Dialog */}
      <Dialog
        open={showFullView}
        onClose={() => {
          setShowFullView(false);
          setSelectedTicket(null);
        }}
        maxWidth="md"
        fullWidth
      >
        {selectedTicket && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedTicket.ticketTitle}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1">
                  {selectedTicket.ticketDescription}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  label={selectedTicket.ticketCategory}
                  variant="outlined"
                />
                <Chip
                  label={t(`status.${selectedTicket.status.toLowerCase()}`)}
                  color={getStatusColor(selectedTicket.status)}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                {t('updates')}
              </Typography>

              {selectedTicket.updates.map((update, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body1">
                    {update.updateText}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {format(new Date(update.timestamp), 'PPp')}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ mt: 3 }}>
                <UpdateTicketForm
                  ticket={selectedTicket}
                  onSuccess={() => {
                    loadTickets();
                    setShowFullView(false);
                    setSelectedTicket(null);
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedTicket && (
          <EditTicketForm
            ticket={selectedTicket}
            onSuccess={() => {
              loadTickets();
              setIsEditDialogOpen(false);
              setSelectedTicket(null);
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        )}
      </Dialog>
    </Container>
  );
}