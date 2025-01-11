import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge'

import { Package, Calendar, BarChart3, Edit, Trash2, Plus } from 'lucide-react';
import { VendorProfileDetails } from '@/types/vendor-types';

interface RentalEditSectionProps {
  vendor: VendorProfileDetails;
  onEditClick: () => void; 
}

export function RentalEditSection({ vendor, onEditClick }: RentalEditSectionProps) {
  const [activeTab, setActiveTab] = useState('inventory');

  if (vendor.type !== 'rentals' || !vendor.rentals) return null;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Rental Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          onClick={() => onEditClick()} 
        >
          Add New Item
        </Button>
      </Box>

      <Tabs 
        value={activeTab}
        onChange={(_e, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        <Tab 
          icon={<Package className="w-4 h-4" />}
          label="Inventory"
          value="inventory"
        />
        <Tab 
          icon={<Calendar className="w-4 h-4" />}
          label="Calendar"
          value="calendar"
        />
        <Tab 
          icon={<BarChart3 className="w-4 h-4" />}
          label="Analytics"
          value="analytics"
        />
      </Tabs>

      {activeTab === 'inventory' && (
        <Grid container spacing={3}>
          {vendor.rentals.map(item => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card>
                <Box sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <div>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.category}
                      </Typography>
                    </div>
                    <Box>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small">
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  {item.sizes && (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Size</TableCell>
                          <TableCell align="center">Available</TableCell>
                          <TableCell align="right">Price/Day</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.sizes.map(size => (
                          <TableRow key={size.id}>
                            <TableCell>{size.label}</TableCell>
                            <TableCell align="center">
                              <Badge
                                color={size.available < 2 ? 'error' : 'success'}
                                badgeContent={size.available}
                              >
                                <Box component="span">/{size.total}</Box>
                              </Badge>
                            </TableCell>
                            <TableCell align="right">
                              ${size.pricePerDay}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 'calendar' && (
        <Card>
          <Box sx={{ p: 3 }}>
            <Typography>Calendar view coming soon...</Typography>
          </Box>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <Card>
          <Box sx={{ p: 3 }}>
            <Typography>Analytics view coming soon...</Typography>
          </Box>
        </Card>
      )}
    </Box>
  );
}